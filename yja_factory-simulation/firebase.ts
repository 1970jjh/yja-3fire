// Firebase 설정 파일
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, push, remove, update } from "firebase/database";
import { SessionConfig } from "./types";

// Firebase 설정값
const firebaseConfig = {
  apiKey: "AIzaSyA8QuxBtbEjZCoSUw4SAOjxbZ74WAzh6Wg",
  authDomain: "yja-3fire.firebaseapp.com",
  databaseURL: "https://yja-3fire-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yja-3fire",
  storageBucket: "yja-3fire.firebasestorage.app",
  messagingSenderId: "60060618032",
  appId: "1:60060618032:web:136fb5166d8af7b5d1ccf5"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ============ 세션 관련 함수들 ============

// 새 세션 생성
export const createSession = async (session: SessionConfig): Promise<void> => {
  const sessionRef = ref(database, `sessions/${session.id}`);
  await set(sessionRef, session);
};

// 모든 세션 가져오기 (1회성)
export const getAllSessions = async (): Promise<SessionConfig[]> => {
  const sessionsRef = ref(database, 'sessions');
  const snapshot = await get(sessionsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data) as SessionConfig[];
  }
  return [];
};

// 세션 실시간 구독 (관리자/학습자 모두 사용)
export const subscribeToSessions = (callback: (sessions: SessionConfig[]) => void): (() => void) => {
  const sessionsRef = ref(database, 'sessions');
  const unsubscribe = onValue(sessionsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const sessions = Object.values(data) as SessionConfig[];
      callback(sessions);
    } else {
      callback([]);
    }
  });
  return unsubscribe;
};

// 특정 세션 실시간 구독
export const subscribeToSession = (sessionId: string, callback: (session: SessionConfig | null) => void): (() => void) => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as SessionConfig);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
};

// 세션 삭제
export const deleteSession = async (sessionId: string): Promise<void> => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  await remove(sessionRef);
};

// 세션 업데이트 (보고서 활성화 등)
export const updateSession = async (sessionId: string, updates: Partial<SessionConfig>): Promise<void> => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  await update(sessionRef, updates);
};

// 보고서 제출 활성화/비활성화
export const toggleReportEnabled = async (sessionId: string, enabled: boolean): Promise<void> => {
  await updateSession(sessionId, { isReportEnabled: enabled });
};

export { database };
