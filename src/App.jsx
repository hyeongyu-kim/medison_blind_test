import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Circle,
  ClipboardList,
  ExternalLink,
  Layers3,
  LockKeyhole,
  PanelLeft,
  RotateCcw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react";
import "./style.css";
import {
  completeParticipant,
  createParticipant,
  deleteParticipant,
  listenAllParticipants,
  saveAnswer,
} from "./surveyDb";

const CURRENT_VERSION = "firebase-three-choice-answer-key-v2";
const ADMIN_PASSWORD = "carloskim";

const phaseConfig = [
  { id: "A", label: "Phase A", shortLabel: "A", count: 15, subtitle: "1차 후보 비교", tone: "phase-a" },
  { id: "B", label: "Phase B", shortLabel: "B", count: 14, subtitle: "2차 후보 비교", tone: "phase-b" },
  { id: "C", label: "Phase C", shortLabel: "C", count: 11, subtitle: "최종 후보 비교", tone: "phase-c" },
];

const choices = [
  { id: "candidate_1", label: "후보 1", short: "1", gradient: "linear-gradient(135deg, #4f46e5, #06b6d4)" },
  { id: "candidate_2", label: "후보 2", short: "2", gradient: "linear-gradient(135deg, #db2777, #f97316)" },
  { id: "candidate_3", label: "후보 3", short: "3", gradient: "linear-gradient(135deg, #059669, #14b8a6)" },
];

const methods = [
  { id: "score", label: "score", short: "S", gradient: "linear-gradient(135deg, #4f46e5, #06b6d4)" },
  { id: "ddib", label: "ddib", short: "D", gradient: "linear-gradient(135deg, #db2777, #f97316)" },
  { id: "flow_matching", label: "flow_matching", short: "F", gradient: "linear-gradient(135deg, #059669, #14b8a6)" },
];

const answerKey = {
  "A-01": { inputFile: "0_250_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "A-02": { inputFile: "0_260_slice.png", candidate_1: "ddib", candidate_2: "flow_matching", candidate_3: "score" },
  "A-03": { inputFile: "0_270_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
  "A-04": { inputFile: "0_280_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
  "A-05": { inputFile: "1_250_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
  "A-06": { inputFile: "1_260_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "A-07": { inputFile: "1_270_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
  "A-08": { inputFile: "1_280_slice.png", candidate_1: "score", candidate_2: "flow_matching", candidate_3: "ddib" },
  "A-09": { inputFile: "22_250_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "A-10": { inputFile: "22_260_slice.png", candidate_1: "score", candidate_2: "flow_matching", candidate_3: "ddib" },
  "A-11": { inputFile: "22_270_slice.png", candidate_1: "flow_matching", candidate_2: "ddib", candidate_3: "score" },
  "A-12": { inputFile: "3_240_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
  "A-13": { inputFile: "3_250_slice.png", candidate_1: "score", candidate_2: "flow_matching", candidate_3: "ddib" },
  "A-14": { inputFile: "3_260_slice.png", candidate_1: "ddib", candidate_2: "flow_matching", candidate_3: "score" },
  "A-15": { inputFile: "3_270_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },

  "B-01": { inputFile: "0_240_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "B-02": { inputFile: "0_250_slice.png", candidate_1: "ddib", candidate_2: "score", candidate_3: "flow_matching" },
  "B-03": { inputFile: "0_260_slice.png", candidate_1: "score", candidate_2: "flow_matching", candidate_3: "ddib" },
  "B-04": { inputFile: "0_270_slice.png", candidate_1: "ddib", candidate_2: "score", candidate_3: "flow_matching" },
  "B-05": { inputFile: "3_240_slice.png", candidate_1: "ddib", candidate_2: "score", candidate_3: "flow_matching" },
  "B-06": { inputFile: "3_250_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
  "B-07": { inputFile: "3_260_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "B-08": { inputFile: "3_270_slice.png", candidate_1: "ddib", candidate_2: "score", candidate_3: "flow_matching" },
  "B-09": { inputFile: "56_295_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
  "B-10": { inputFile: "56_305_slice.png", candidate_1: "flow_matching", candidate_2: "ddib", candidate_3: "score" },
  "B-11": { inputFile: "56_315_slice.png", candidate_1: "score", candidate_2: "flow_matching", candidate_3: "ddib" },
  "B-12": { inputFile: "61_240_slice.png", candidate_1: "ddib", candidate_2: "flow_matching", candidate_3: "score" },
  "B-13": { inputFile: "61_250_slice.png", candidate_1: "ddib", candidate_2: "flow_matching", candidate_3: "score" },
  "B-14": { inputFile: "61_260_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },

  "C-01": { inputFile: "0_240_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "C-02": { inputFile: "0_250_slice.png", candidate_1: "score", candidate_2: "flow_matching", candidate_3: "ddib" },
  "C-03": { inputFile: "0_260_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "C-04": { inputFile: "1_220_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "C-05": { inputFile: "1_230_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "C-06": { inputFile: "1_240_slice.png", candidate_1: "score", candidate_2: "flow_matching", candidate_3: "ddib" },
  "C-07": { inputFile: "1_250_slice.png", candidate_1: "score", candidate_2: "ddib", candidate_3: "flow_matching" },
  "C-08": { inputFile: "22_200_slice.png", candidate_1: "score", candidate_2: "flow_matching", candidate_3: "ddib" },
  "C-09": { inputFile: "22_210_slice.png", candidate_1: "ddib", candidate_2: "score", candidate_3: "flow_matching" },
  "C-10": { inputFile: "22_220_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
  "C-11": { inputFile: "22_230_slice.png", candidate_1: "flow_matching", candidate_2: "score", candidate_3: "ddib" },
};

const questions = phaseConfig.flatMap((phase) =>
  Array.from({ length: phase.count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const id = `${phase.id}-${number}`;
    return {
      id,
      phase: phase.id,
      number: index + 1,
      title: `${phase.label} · ${number}`,
      prompt: `${phase.shortLabel}-${number} 케이스에서 가장 선호하는 후보를 선택하세요.`,
      inputFile: answerKey[id]?.inputFile || "",
    };
  })
);

function cx(...tokens) {
  return tokens.filter(Boolean).join(" ");
}

function getPhase(id) {
  return phaseConfig.find((phase) => phase.id === id) || phaseConfig[0];
}

function getQuestionIndexById(id) {
  return questions.findIndex((question) => question.id === id);
}

function normalizeParticipant(raw) {
  if (!raw) return null;
  return {
    evaluatorId: raw.evaluatorId,
    answers: raw.answers || {},
    completedAt: raw.completedAt || null,
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
  };
}

function calcProgress(answers) {
  const answered = questions.filter((question) => answers?.[question.id]).length;
  return {
    answered,
    total: questions.length,
    percent: Math.round((answered / questions.length) * 100),
  };
}

function candidateToMethod(questionId, candidateId) {
  return answerKey[questionId]?.[candidateId] || "unknown";
}

function createEmptyMethodStats() {
  return {
    score: 0,
    ddib: 0,
    flow_matching: 0,
    unknown: 0,
    missing: 0,
    total: 0,
  };
}

function getMethodTotal(stats) {
  return methods.reduce((sum, method) => sum + (stats?.[method.id] || 0), 0);
}

function computeStats(participants, options = {}) {
  const completed = participants.filter((participant) => participant.completedAt);
  const source = options.includeIncomplete ? participants : completed;

  const byQuestion = Object.fromEntries(questions.map((question) => [question.id, createEmptyMethodStats()]));
  const byPhase = Object.fromEntries(
    phaseConfig.map((phase) => [phase.id, { ...createEmptyMethodStats(), questionCount: phase.count }])
  );
  const overall = createEmptyMethodStats();

  for (const participant of source) {
    for (const question of questions) {
      const selectedCandidate = participant.answers?.[question.id];
      const questionStats = byQuestion[question.id];
      const phaseStats = byPhase[question.phase];

      if (choices.some((choice) => choice.id === selectedCandidate)) {
        const method = candidateToMethod(question.id, selectedCandidate);
        const key = methods.some((item) => item.id === method) ? method : "unknown";
        questionStats[key] += 1;
        phaseStats[key] += 1;
        overall[key] += 1;
      } else {
        questionStats.missing += 1;
        phaseStats.missing += 1;
        overall.missing += 1;
      }

      questionStats.total += 1;
      phaseStats.total += 1;
      overall.total += 1;
    }
  }

  return { completed, byQuestion, byPhase, overall };
}

function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  return (
    <button className={cx("btn", `btn-${variant}`, `btn-${size}`, className)} {...props}>
      {children}
    </button>
  );
}

function Shell({ children, theme = "light" }) {
  return <main className={cx("app-shell", theme === "dark" && "app-shell-dark")}>{children}</main>;
}

function DbStatus({ status, error }) {
  const ok = status === "connected";
  const loading = status === "connecting";

  return (
    <div className={cx("db-status", ok && "db-ok", loading && "db-loading", !ok && !loading && "db-error")} title={error || ""}>
      {ok ? <Wifi size={15} /> : <WifiOff size={15} />}
      {ok ? "DB connected" : loading ? "DB connecting" : "DB error"}
    </div>
  );
}

function StartScreen({ participants, dbStatus, dbError, onStart, onShowResults }) {
  const [evaluatorId, setEvaluatorId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onStart(evaluatorId);
    } catch (err) {
      setError(err?.message || "평가자 등록 중 문제가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Shell theme="dark">
      <section className="hero-grid">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="hero-copy">
          <div className="eyebrow"><Sparkles size={16} /> Medison Blind Test</div>
          <h1 className="landing-title">Fetal Ultrasound Blind Test</h1>
          <p className="hero-description">
            각 케이스에서 가장 선호하는 후보를 빠르게 선택하세요. 결과는 method 기준으로 자동 집계됩니다.
          </p>

          <div className="hero-stats">
            <div className="hero-stat-card"><strong>40</strong><span>총 문항</span></div>
            <div className="hero-stat-card"><strong>3</strong><span>방법 수</span><small>score · ddib · flow_matching</small></div>
            <div className="hero-stat-card"><strong>{participants.length}</strong><span>등록 ID</span></div>
          </div>

          <div className="phase-strip">
            {phaseConfig.map((phase) => (
              <div key={phase.id} className={cx("phase-pill", phase.tone)}>
                <span>{phase.label}</span>
                <strong>{phase.count}문항</strong>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: 0.06 }} className="login-card" onSubmit={submit}>
          <div className="login-card-top">
            <div className="login-icon"><UserRound size={26} /></div>
            <DbStatus status={dbStatus} error={dbError} />
          </div>
          <h2>평가자 등록</h2>
          <p>평가자 ID는 한글, 영문, 숫자, 공백, 특수문자를 대부분 사용할 수 있습니다. 같은 ID는 중복 등록되지 않습니다.</p>

          <label className="input-label" htmlFor="evaluator-id">Evaluator ID</label>
          <input
            id="evaluator-id"
            value={evaluatorId}
            onChange={(event) => {
              setEvaluatorId(event.target.value);
              setError("");
            }}
            placeholder="예: 홍길동 1차, rater 001, 김OO"
            autoComplete="off"
            disabled={submitting}
          />

          {error && <div className="error-box">{error}</div>}
          {dbError && <div className="error-box">DB 연결 오류: {dbError}</div>}

          <Button size="lg" className="full-width" type="submit" disabled={submitting || dbStatus === "error"}>
            {submitting ? "등록 중" : "평가 시작"}
            <ArrowRight size={18} />
          </Button>

          <button type="button" className="ghost-link" onClick={onShowResults}>
            기존 결과 보기 <ExternalLink size={15} />
          </button>

          <div className="note-box">
            <LockKeyhole size={16} />
            현재 버전은 Firebase Firestore에 저장합니다. 보안 규칙은 배포 전에 반드시 제한해야 합니다.
          </div>
        </motion.form>
      </section>
    </Shell>
  );
}

function TopBar({ participant, answers, saveState, onStats, onRestart }) {
  const progress = calcProgress(answers);

  return (
    <header className="topbar">
      <div className="brand-mark">
        <div className="brand-logo"><ClipboardList size={20} /></div>
        <div>
          <strong>Blind Survey</strong>
          <span>ID · {participant.evaluatorId}</span>
        </div>
      </div>

      <div className="top-actions">
        <Button variant="soft" onClick={onStats}><BarChart3 size={17} /> 결과</Button>
        <Button variant="ghost" onClick={onRestart}><RotateCcw size={17} /></Button>
      </div>

      <div className="top-progress">
        <div className="top-progress-label">
          <span>{progress.answered}/{progress.total} answered · {saveState}</span>
          <strong>{progress.percent}%</strong>
        </div>
        <div className="progress-track"><div style={{ width: `${progress.percent}%` }} /></div>
      </div>
    </header>
  );
}

function PhaseProgressCard({ phase, answers, currentIndex, onJump }) {
  const phaseQuestions = questions.filter((question) => question.phase === phase.id);
  const answered = phaseQuestions.filter((question) => answers[question.id]).length;
  const percent = Math.round((answered / phaseQuestions.length) * 100);

  return (
    <div className="phase-card">
      <div className="phase-card-head">
        <div><span className={cx("phase-dot", phase.tone)} /><strong>{phase.label}</strong></div>
        <em>{answered}/{phaseQuestions.length}</em>
      </div>
      <div className="mini-track"><div className={phase.tone} style={{ width: `${percent}%` }} /></div>
      <div className="question-grid">
        {phaseQuestions.map((question) => {
          const index = getQuestionIndexById(question.id);
          const active = index === currentIndex;
          const done = Boolean(answers[question.id]);
          return (
            <button key={question.id} className={cx("q-dot", active && "active", done && "done")} onClick={() => onJump(index)} title={question.id}>
              {question.number}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Navigator({ answers, currentIndex, onJump }) {
  return (
    <aside className="navigator">
      <div className="navigator-title"><PanelLeft size={17} /> 빠른 이동</div>
      {phaseConfig.map((phase) => (
        <PhaseProgressCard key={phase.id} phase={phase} answers={answers} currentIndex={currentIndex} onJump={onJump} />
      ))}
    </aside>
  );
}

function ChoiceButton({ choice, selected, disabled, onClick }) {
  return (
    <button className={cx("choice-button", selected && "selected")} onClick={onClick} disabled={disabled}>
      <div className="choice-number">{choice.short}</div>
      <div className="choice-copy"><strong>{choice.label}</strong></div>
      <div className="choice-check">{selected ? <Check size={22} /> : <Circle size={22} />}</div>
    </button>
  );
}

function SurveyScreen({ participant, setParticipant, onShowStats, onRestart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [warning, setWarning] = useState("");
  const [saveState, setSaveState] = useState("ready");
  const question = questions[currentIndex];
  const phase = getPhase(question.phase);
  const answers = participant.answers || {};
  const progress = calcProgress(answers);
  const selectedChoice = answers[question.id];

  async function choose(choiceId) {
    setWarning("");
    const previous = participant;
    const nextParticipant = {
      ...participant,
      answers: {
        ...answers,
        [question.id]: choiceId,
      },
    };

    setParticipant(nextParticipant);
    setSaveState("saving...");

    try {
      await saveAnswer(participant.evaluatorId, question.id, choiceId);
      setSaveState("saved");
      if (currentIndex < questions.length - 1) {
        setTimeout(() => setCurrentIndex((value) => Math.min(value + 1, questions.length - 1)), 120);
      }
    } catch (err) {
      setParticipant(previous);
      setSaveState("save failed");
      setWarning(err?.message || "응답 저장에 실패했습니다.");
    }
  }

  function goNext() {
    setCurrentIndex((value) => Math.min(value + 1, questions.length - 1));
  }

  function goPrevious() {
    setCurrentIndex((value) => Math.max(value - 1, 0));
  }

  async function finish() {
    const missing = questions.filter((item) => !answers[item.id]);
    if (missing.length > 0) {
      const firstMissingIndex = getQuestionIndexById(missing[0].id);
      setCurrentIndex(firstMissingIndex);
      setWarning(`미응답 ${missing.length}개가 남았습니다. ${missing[0].id}로 이동했습니다.`);
      return;
    }

    setSaveState("completing...");
    try {
      await completeParticipant(participant.evaluatorId);
      setParticipant({ ...participant, completedAt: new Date().toISOString() });
      setSaveState("completed");
      onShowStats();
    } catch (err) {
      setSaveState("complete failed");
      setWarning(err?.message || "완료 처리에 실패했습니다.");
    }
  }

  return (
    <Shell>
      <TopBar participant={participant} answers={answers} saveState={saveState} onStats={onShowStats} onRestart={onRestart} />

      <div className="survey-layout">
        <Navigator answers={answers} currentIndex={currentIndex} onJump={setCurrentIndex} />

        <section className="survey-main">
          <div className="mobile-phase-nav">
            {phaseConfig.map((item) => (
              <button key={item.id} className={cx(item.id === phase.id && "active")} onClick={() => setCurrentIndex(getQuestionIndexById(`${item.id}-01`))}>
                {item.id}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={question.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.2 }} className="question-panel">
              <div className="question-head">
                <div>
                  <div className={cx("phase-badge", phase.tone)}>{phase.label}</div>
                  <h2>{question.id}</h2>
                  <p>{question.prompt}</p>
                  {question.inputFile && <p className="input-file-line">Input file: {question.inputFile}</p>}
                </div>
                <div className="case-counter"><span>Case</span><strong>{currentIndex + 1}</strong><em>/ {questions.length}</em></div>
              </div>

              <div className="image-placeholder-card">
                <Layers3 size={28} />
                <div>
                  <strong>외부 화면에서 확인</strong>
                  <span>선택 시 자동 이동</span>
                </div>
              </div>

              <div className="choice-grid">
                {choices.map((choice) => (
                  <ChoiceButton key={choice.id} choice={choice} selected={selectedChoice === choice.id} disabled={saveState === "saving..."} onClick={() => choose(choice.id)} />
                ))}
              </div>

              {warning && <div className="warning-box"><SearchCheck size={17} /> {warning}</div>}

              <div className="survey-footer">
                <Button variant="outline" size="lg" className="footer-nav-btn footer-nav-left" onClick={goPrevious} disabled={currentIndex === 0}>
                  <ArrowLeft size={18} /> 뒤로
                </Button>

                <div className="footer-progress-pill">
                  <span>진행률</span>
                  <strong>{progress.answered}<em> / {progress.total}</em></strong>
                </div>

                {currentIndex === questions.length - 1 ? (
                  <Button size="lg" className="footer-nav-btn footer-nav-right" onClick={finish}>완료 <CheckCircle2 size={18} /></Button>
                ) : (
                  <Button variant="outline" size="lg" className="footer-nav-btn footer-nav-right" onClick={goNext}>다음 <ArrowRight size={18} /></Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </Shell>
  );
}

function BarPlot({ stats, compact = false }) {
  const answeredTotal = getMethodTotal(stats);
  const rows = methods.map((method) => {
    const value = stats?.[method.id] || 0;
    const percent = answeredTotal ? Math.round((value / answeredTotal) * 100) : 0;
    return { ...method, value, percent };
  });
  const maxValue = Math.max(1, ...rows.map((row) => row.value));

  return (
    <div className="barplot" style={{ gap: compact ? 8 : 12 }}>
      {rows.map((row) => (
        <div key={row.id} className={cx("barplot-row", compact && "barplot-row-compact")}>
          <div className="barplot-label"><span style={{ background: row.gradient }} />{row.label}</div>
          <div className="barplot-track">
            <motion.div initial={{ width: 0 }} animate={{ width: row.value ? `${Math.max(3, (row.value / maxValue) * 100)}%` : "0%" }} transition={{ duration: 0.45 }} style={{ background: row.gradient }} />
            {!compact && row.value > 0 && <em>{row.value} votes</em>}
          </div>
          <div className="barplot-percent">{row.percent}%</div>
        </div>
      ))}
      {!compact && <div className="barplot-note">총 응답 선택 수 {answeredTotal}{stats?.missing ? ` · 미응답 ${stats.missing}` : ""}{stats?.unknown ? ` · 매핑 실패 ${stats.unknown}` : ""}</div>}
    </div>
  );
}

function DataManager({ participants }) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [filter, setFilter] = useState("");

  const visibleParticipants = useMemo(() => {
    const keyword = filter.trim().toLowerCase();
    if (!keyword) return participants;
    return participants.filter((item) => String(item.evaluatorId).toLowerCase().includes(keyword));
  }, [participants, filter]);

  function tryUnlock(event) {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setStatus("관리자 패널 잠금 해제됨");
      return;
    }
    setStatus("비밀번호가 맞지 않습니다.");
  }

  async function removeParticipant(evaluatorId) {
    const ok = window.confirm(`${evaluatorId} 평가자 데이터 전체를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`);
    if (!ok) return;
    setDeletingId(evaluatorId);
    setStatus("삭제 중...");
    try {
      await deleteParticipant(evaluatorId);
      setStatus(`${evaluatorId} 삭제 완료`);
    } catch (err) {
      setStatus(err?.message || "삭제 실패");
    } finally {
      setDeletingId("");
    }
  }

  async function removeVisibleParticipants() {
    if (visibleParticipants.length === 0) {
      setStatus("삭제할 데이터가 없습니다.");
      return;
    }
    const typed = window.prompt(`현재 목록 ${visibleParticipants.length}명을 삭제합니다. 진행하려면 DELETE를 입력하세요.`);
    if (typed !== "DELETE") {
      setStatus("일괄 삭제 취소됨");
      return;
    }
    setDeletingId("__bulk__");
    setStatus("일괄 삭제 중...");
    try {
      for (const item of visibleParticipants) await deleteParticipant(item.evaluatorId);
      setStatus(`${visibleParticipants.length}명 삭제 완료`);
    } catch (err) {
      setStatus(err?.message || "일괄 삭제 실패");
    } finally {
      setDeletingId("");
    }
  }

  async function removeIncompleteParticipants() {
    const incomplete = participants.filter((item) => !item.completedAt);
    if (incomplete.length === 0) {
      setStatus("진행 중 데이터가 없습니다.");
      return;
    }
    const typed = window.prompt(`진행 중 데이터 ${incomplete.length}개를 삭제합니다. 진행하려면 DELETE를 입력하세요.`);
    if (typed !== "DELETE") {
      setStatus("진행 중 데이터 삭제 취소됨");
      return;
    }
    setDeletingId("__incomplete__");
    setStatus("진행 중 데이터 삭제 중...");
    try {
      for (const item of incomplete) await deleteParticipant(item.evaluatorId);
      setStatus(`진행 중 데이터 ${incomplete.length}개 삭제 완료`);
    } catch (err) {
      setStatus(err?.message || "진행 중 데이터 삭제 실패");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="results-card wide admin-card">
      <div className="card-title"><strong>데이터 관리자</strong><span>평가자 데이터 삭제</span></div>
      {!unlocked ? (
        <form onSubmit={tryUnlock} className="admin-unlock-form">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="관리자 비밀번호" />
          <Button type="submit" variant="secondary">잠금 해제</Button>
          <div className="admin-compact-note">관리자 비밀번호를 입력하면 삭제 기능이 열립니다.</div>
          {status && <div className="admin-status">{status}</div>}
        </form>
      ) : (
        <div className="admin-panel">
          <div className="admin-toolbar">
            <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="평가자 ID 검색" />
            <Button variant="outline" onClick={removeIncompleteParticipants} disabled={Boolean(deletingId)}>진행 중 삭제</Button>
            <Button variant="outline" onClick={removeVisibleParticipants} disabled={Boolean(deletingId)}>현재 목록 삭제</Button>
          </div>
          {status && <div className="admin-status">{status}</div>}
          <div className="admin-list">
            {visibleParticipants.map((item) => {
              const progress = calcProgress(item.answers || {});
              return (
                <div key={item.evaluatorId} className="admin-row">
                  <div><strong>{item.evaluatorId}</strong><span>{item.completedAt ? "완료" : "진행 중"}</span></div>
                  <div>{progress.answered}/{questions.length}</div>
                  <div>{progress.percent}%</div>
                  <Button variant="outline" size="sm" onClick={() => removeParticipant(item.evaluatorId)} disabled={Boolean(deletingId)}>
                    {deletingId === item.evaluatorId ? "삭제 중" : "삭제"}
                  </Button>
                </div>
              );
            })}
            {visibleParticipants.length === 0 && <div className="admin-empty">표시할 평가자 데이터가 없습니다.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsScreen({ participants, dbStatus, dbError, participant, onBack, onNewEvaluator }) {
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState("__all__");
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const participantOptions = useMemo(
    () => [...participants].sort((a, b) => String(a.evaluatorId).localeCompare(String(b.evaluatorId), "ko")),
    [participants]
  );

  useEffect(() => {
    if (selectedEvaluatorId === "__all__") return;
    if (!participants.some((item) => item.evaluatorId === selectedEvaluatorId)) setSelectedEvaluatorId("__all__");
  }, [participants, selectedEvaluatorId]);

  const selectedParticipant = participants.find((item) => item.evaluatorId === selectedEvaluatorId) || null;
  const isIndividualView = selectedEvaluatorId !== "__all__";
  const statsParticipants = isIndividualView && selectedParticipant ? [selectedParticipant] : participants;
  const stats = useMemo(() => computeStats(statsParticipants, { includeIncomplete: isIndividualView }), [statsParticipants, isIndividualView]);
  const individualProgress = selectedParticipant ? calcProgress(selectedParticipant.answers || {}) : null;
  const answerCount = getMethodTotal(stats.overall);

  return (
    <Shell theme="dark">
      <section className="results-page">
        <div className="results-head">
          <div>
            <div className="eyebrow"><BarChart3 size={16} /> Result Dashboard</div>
            <h1>평가 결과</h1>
            <p className="results-subtitle">{isIndividualView ? "선택한 평가자 기준 통계" : "전체 완료 평가자 기준 통계"}</p>
          </div>
          <div className="results-actions">
            <DbStatus status={dbStatus} error={dbError} />
            <Button variant="secondary" onClick={onBack}>설문으로</Button>
            <Button onClick={onNewEvaluator}>새 평가자</Button>
            <Button variant="ghost" onClick={() => setShowAdminPanel((value) => !value)}>
              {showAdminPanel ? "관리자 닫기" : "관리자"}
            </Button>
          </div>
        </div>

        {showAdminPanel && <DataManager participants={participants} />}
        {dbError && <div className="error-box">DB 연결 오류: {dbError}</div>}

        <div className="results-card wide">
          <div className="card-title"><strong>보기 방식</strong><span>{isIndividualView ? "평가자 ID별 보기" : "전체 완료 평가자 보기"}</span></div>
          <div className="result-view-controls">
            <select value={selectedEvaluatorId} onChange={(event) => setSelectedEvaluatorId(event.target.value)}>
              <option value="__all__">전체 통계</option>
              {participantOptions.map((item) => (
                <option key={item.evaluatorId} value={item.evaluatorId}>{item.evaluatorId}{item.completedAt ? " · 완료" : " · 진행 중"}</option>
              ))}
            </select>
            <div>
              {isIndividualView && selectedParticipant
                ? `${selectedParticipant.evaluatorId}: ${individualProgress?.answered || 0}/${questions.length}문항 응답${selectedParticipant.completedAt ? " · 완료" : " · 진행 중"}`
                : `완료 평가자 ${stats.completed.length}명 기준으로 집계`}
            </div>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-card"><ShieldCheck size={24} /><span>{isIndividualView ? "선택 평가자" : "완료 평가자"}</span><strong>{isIndividualView ? selectedParticipant?.evaluatorId || "-" : stats.completed.length}</strong></div>
          <div className="summary-card"><ClipboardList size={24} /><span>총 문항</span><strong>{questions.length}</strong></div>
          <div className="summary-card"><UserRound size={24} /><span>{isIndividualView ? "응답 문항" : "등록 ID"}</span><strong>{isIndividualView ? individualProgress?.answered || 0 : participants.length}</strong></div>
          <div className="summary-card"><CheckCircle2 size={24} /><span>선택 수</span><strong>{answerCount}</strong></div>
        </div>

        <div className="results-card wide">
          <div className="card-title"><strong>{isIndividualView ? "개별 전체 통계" : "전체 통계"}</strong><span>{isIndividualView ? selectedParticipant?.evaluatorId : "모든 Phase 합산"}</span></div>
          <BarPlot stats={stats.overall} />
        </div>

        <div className="phase-results-grid">
          {phaseConfig.map((phase) => (
            <div key={phase.id} className="results-card">
              <div className="card-title"><strong>{phase.label}</strong><span>{phase.count}문항 · {phase.subtitle}</span></div>
              <BarPlot stats={stats.byPhase[phase.id]} />
            </div>
          ))}
        </div>

        <div className="results-card wide">
          <div className="card-title"><strong>문항별 통계</strong><span>각 케이스의 method별 분포</span></div>
          <div className="question-results-list">
            {questions.map((question) => (
              <div key={question.id} className="question-result-row">
                <div><strong>{question.id}</strong><span>{getPhase(question.phase).label}</span></div>
                <BarPlot stats={stats.byQuestion[question.id]} compact />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

export default function App() {
  const [participants, setParticipants] = useState([]);
  const [participant, setParticipant] = useState(null);
  const [screen, setScreen] = useState("start");
  const [dbStatus, setDbStatus] = useState("connecting");
  const [dbError, setDbError] = useState("");

  useEffect(() => {
    setDbStatus("connecting");
    const unsubscribe = listenAllParticipants(
      (items) => {
        const normalized = items.map(normalizeParticipant).filter(Boolean);
        setParticipants(normalized);
        setDbStatus("connected");
        setDbError("");
        setParticipant((current) => {
          if (!current?.evaluatorId) return current;
          const latest = normalized.find((item) => item.evaluatorId === current.evaluatorId);
          return latest ? { ...current, ...latest, answers: latest.answers || current.answers || {} } : current;
        });
      },
      (error) => {
        setDbStatus("error");
        setDbError(error?.message || "Firestore 연결에 실패했습니다.");
      }
    );

    return () => unsubscribe?.();
  }, []);

  async function start(evaluatorId) {
    const nextParticipant = await createParticipant(evaluatorId);
    const normalized = normalizeParticipant(nextParticipant);
    setParticipant(normalized);
    setScreen("survey");
    return normalized;
  }

  function newEvaluator() {
    setParticipant(null);
    setScreen("start");
  }

  async function restartCurrent() {
    if (!participant) {
      newEvaluator();
      return;
    }
    const confirmDelete = window.confirm("현재 평가자 ID와 응답을 삭제하고 처음으로 돌아갈까요?");
    if (!confirmDelete) return;
    try {
      await deleteParticipant(participant.evaluatorId);
    } catch (err) {
      alert(err?.message || "평가자 삭제에 실패했습니다.");
      return;
    }
    setParticipant(null);
    setScreen("start");
  }

  if (screen === "stats") {
    return <ResultsScreen participants={participants} dbStatus={dbStatus} dbError={dbError} participant={participant} onBack={() => setScreen(participant ? "survey" : "start")} onNewEvaluator={newEvaluator} />;
  }

  if (screen === "survey" && participant) {
    return <SurveyScreen participant={participant} setParticipant={setParticipant} onShowStats={() => setScreen("stats")} onRestart={restartCurrent} />;
  }

  return <StartScreen participants={participants} dbStatus={dbStatus} dbError={dbError} onStart={start} onShowResults={() => setScreen("stats")} />;
}
