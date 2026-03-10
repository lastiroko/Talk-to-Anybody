import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type PlanStatus = 'free' | 'paid';

interface PurchaseContextValue {
  status: PlanStatus;
  loading: boolean;
  /** Call after RevenueCat purchase succeeds to update local state */
  setPaid: () => void;
  /** Restore purchases */
  restore: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextValue | undefined>(undefined);

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PlanStatus>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: In production, check RevenueCat entitlements on mount
    // For now, check AsyncStorage for mock purchase state
    checkPurchaseStatus();
  }, []);

  const checkPurchaseStatus = async () => {
    try {
      // Mock: check local storage
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      const stored = await AsyncStorage.getItem('purchase_status');
      if (stored === 'paid') setStatus('paid');
    } catch {}
    setLoading(false);
  };

  const setPaid = useCallback(async () => {
    setStatus('paid');
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem('purchase_status', 'paid');
    } catch {}
  }, []);

  const restore = useCallback(async () => {
    // TODO: In production, call Purchases.restorePurchases()
    // For now, just re-check
    await checkPurchaseStatus();
  }, []);

  return (
    <PurchaseContext.Provider value={{ status, loading, setPaid, restore }}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error('usePurchase must be used within PurchaseProvider');
  return ctx;
}
