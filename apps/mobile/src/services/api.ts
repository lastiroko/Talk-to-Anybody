import {
  getToken,
  getRefreshToken,
  setAuthTokens,
  clearAuth,
} from '../storage/auth';

const API_BASE =
  (process.env.EXPO_PUBLIC_API_BASE as string | undefined) ??
  'https://talk-to-anybody-api.fly.dev/api/v1';

type AuthExpiredHandler = () => void;
let onAuthExpired: AuthExpiredHandler | null = null;

/** Registered by App.tsx so a 401 with no valid refresh can bounce the user back to /auth. */
export function setAuthExpiredHandler(handler: AuthExpiredHandler | null) {
  onAuthExpired = handler;
}

async function buildHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

/**
 * Shared promise so multiple concurrent 401s only fire ONE refresh roundtrip.
 * Resolves to true on success, false if the refresh failed (caller should sign out).
 */
let inflightRefresh: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { accessToken: string; refreshToken: string };
      await setAuthTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      inflightRefresh = null;
    }
  })();

  return inflightRefresh;
}

async function rawFetch(method: string, path: string, body?: unknown) {
  return fetch(`${API_BASE}${path}`, {
    method,
    headers: await buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res = await rawFetch(method, path, body);

  // Auth endpoints handle their own 401s (e.g. wrong password) — don't try to refresh.
  const isAuthEndpoint = path.startsWith('/auth/');
  if (res.status === 401 && !isAuthEndpoint) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await rawFetch(method, path, body);
    } else {
      await clearAuth();
      onAuthExpired?.();
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
    (err as any).status = res.status;
    throw err;
  }
  return res.json();
}

// ─── Auth ───

export async function apiSignup(email: string, password: string) {
  return request<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; createdAt: string };
  }>('POST', '/auth/signup', { email, password });
}

export async function apiLogin(email: string, password: string) {
  return request<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; createdAt: string };
  }>('POST', '/auth/login', { email, password });
}

export async function apiLogout(refreshToken: string): Promise<void> {
  // Fire-and-forget — server failure shouldn't block local sign-out.
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // swallow — local clearAuth still runs
  }
}

/** Probe: returns true if the stored refresh token can mint a new access token. */
export async function apiBootstrapSession(): Promise<boolean> {
  return refreshAccessToken();
}

// ─── Sessions ───

export async function createSession(mode: string, planDayId?: number) {
  return request<{ id: string; status: string }>(
    'POST', '/sessions', { mode, planDayId },
  );
}

export async function getUploadUrl(sessionId: string) {
  return request<{ uploadUrl: string; audioKey: string }>(
    'POST', `/sessions/${sessionId}/upload-url`,
  );
}

export async function uploadRecording(uploadUrl: string, fileUri: string) {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'audio/m4a' },
    body: blob,
  });

  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.status}`);
  }

  return { success: true };
}

export async function submitSession(sessionId: string) {
  return request<{ status: string }>(
    'POST', `/sessions/${sessionId}/submit`,
  );
}

export async function getSessionStatus(sessionId: string) {
  return request<{ id: string; status: string }>(
    'GET', `/sessions/${sessionId}`,
  );
}

export async function getAnalysis(sessionId: string) {
  return request<{
    scores: { overall: number; delivery: number; clarity: number; story: number };
    metrics: { wpm: number; fillerPerMin: number; avgPauseSec: number; pitchRangeHz: number };
    wins: string[];
    fixes: Array<{ title: string; drillId: string }>;
    coachingText: string;
    reward: { format: string; content: unknown };
  }>('GET', `/sessions/${sessionId}/analysis`);
}

// ─── Plan ───

export async function getPlan() {
  return request<Array<{
    dayNumber: number;
    title: string;
    status: 'locked' | 'unlocked' | 'completed';
    estimatedMinutes: number;
  }>>('GET', '/plan');
}

export async function getPlanDay(dayNumber: number) {
  return request<{
    dayNumber: number;
    title: string;
    description: string;
    exercises: unknown[];
    lessonText: string;
    estimatedMinutes: number;
  }>('GET', `/plan/day/${dayNumber}`);
}

export async function completeDay(dayNumber: number) {
  return request<{ success: boolean }>(
    'POST', `/plan/day/${dayNumber}/complete`,
  );
}

// ─── Progress ───

export async function getProgressSummary() {
  return request<{
    streak: number;
    totalSessions: number;
    avgScore: number;
    daysCompleted: number[];
  }>('GET', '/progress/summary');
}

// ─── Game Scores ───

export async function syncGameScore(gameName: string, score: number, maxScore: number) {
  try {
    return await request<{ recorded: boolean }>(
      'POST',
      '/game-scores',
      { gameName, score, maxScore },
    );
  } catch (err: any) {
    console.warn('[syncGameScore] Failed to sync score to backend:', err?.message);
    return null;
  }
}

// ─── Anxiety ───

export async function submitAnxietyRating(
  sessionId: string,
  timing: 'pre' | 'post',
  rating: number,
) {
  try {
    return await request<{ recorded: boolean }>(
      'POST',
      `/sessions/${sessionId}/anxiety`,
      { timing, rating },
    );
  } catch (err: any) {
    // If the backend hasn't implemented this endpoint yet (501), fall back silently
    if (err?.status === 501) {
      return { recorded: true };
    }
    throw err;
  }
}
