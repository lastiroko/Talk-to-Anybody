import { createContext, useContext } from 'react';

interface AuthFlowContextValue {
  signOut: () => Promise<void>;
}

const AuthFlowContext = createContext<AuthFlowContextValue | undefined>(undefined);

export const AuthFlowProvider = AuthFlowContext.Provider;

export function useAuthFlow() {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) throw new Error('useAuthFlow must be used inside AuthFlowProvider');
  return ctx;
}
