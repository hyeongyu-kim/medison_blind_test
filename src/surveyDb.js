import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const SURVEY_ID = "medison-2026-v1";

export function normalizeEvaluatorId(input) {
  return String(input || "").trim().replace(/\s+/g, " ");
}

export function validateEvaluatorId(input) {
  const id = normalizeEvaluatorId(input);

  if (!id) {
    return "평가자 ID를 입력하세요.";
  }

  if (id.length > 80) {
    return "평가자 ID는 80자 이하로 입력하세요.";
  }

  return "";
}

function evaluatorDocId(evaluatorId) {
  return encodeURIComponent(normalizeEvaluatorId(evaluatorId).toLowerCase());
}

function participantRef(evaluatorId) {
  return doc(db, "surveys", SURVEY_ID, "participants", evaluatorDocId(evaluatorId));
}


export async function createParticipant(evaluatorId) {
  const id = normalizeEvaluatorId(evaluatorId);
  const validationError = validateEvaluatorId(id);

  if (validationError) {
    throw new Error(validationError);
  }

  const ref = participantRef(id);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (snap.exists()) {
      throw new Error("이미 사용된 평가자 ID입니다. 다른 ID를 입력하세요.");
    }

    transaction.set(ref, {
      evaluatorId: id,
      evaluatorKey: evaluatorDocId(id),
      answers: {},
      completedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  return {
    evaluatorId: id,
    answers: {},
    completedAt: null,
  };
}

export async function saveAnswer(evaluatorId, questionId, choiceId) {
  await updateDoc(participantRef(evaluatorId), {
    [`answers.${questionId}`]: choiceId,
    updatedAt: serverTimestamp(),
  });
}

export async function completeParticipant(evaluatorId) {
  await updateDoc(participantRef(evaluatorId), {
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveParticipantSnapshot(participant) {
  await setDoc(
    participantRef(participant.evaluatorId),
    {
      ...participant,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteParticipant(evaluatorId) {
  await deleteDoc(participantRef(evaluatorId));
}

export async function loadAllParticipants() {
  const ref = collection(db, "surveys", SURVEY_ID, "participants");
  const snap = await getDocs(ref);
  return snap.docs.map((item) => item.data());
}

export function listenAllParticipants(callback, onError) {
  const ref = collection(db, "surveys", SURVEY_ID, "participants");

  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.docs.map((item) => item.data()));
    },
    onError
  );
}