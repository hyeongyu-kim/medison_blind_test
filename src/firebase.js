import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHJbnpdddGNwgX5s22CdMnXxxuiSNgAqw",
  authDomain: "yonsei-medison-blind-test.firebaseapp.com",
  projectId: "yonsei-medison-blind-test",
  storageBucket: "yonsei-medison-blind-test.firebasestorage.app",
  messagingSenderId: "1012605780299",
  appId: "1:1012605780299:web:7d0fc60ad6564f8aa568ce",
  measurementId: "G-VQC792CRZG"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);