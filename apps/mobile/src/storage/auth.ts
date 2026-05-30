import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'speakcoach_auth_token';
const REFRESH_KEY = 'speakcoach_refresh_token';
const USER_KEY = 'speakcoach_auth_user';

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;

export async function getToken(): Promise<string | null> {
  if (cachedAccessToken) return cachedAccessToken;
  try {
    cachedAccessToken = await AsyncStorage.getItem(TOKEN_KEY);
    return cachedAccessToken;
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  cachedAccessToken = token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getRefreshToken(): Promise<string | null> {
  if (cachedRefreshToken) return cachedRefreshToken;
  try {
    cachedRefreshToken = await AsyncStorage.getItem(REFRESH_KEY);
    return cachedRefreshToken;
  } catch {
    return null;
  }
}

export async function setRefreshToken(token: string): Promise<void> {
  cachedRefreshToken = token;
  await AsyncStorage.setItem(REFRESH_KEY, token);
}

export async function setAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([setToken(accessToken), setRefreshToken(refreshToken)]);
}

export async function getUser(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setUser(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuth(): Promise<void> {
  cachedAccessToken = null;
  cachedRefreshToken = null;
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
}
