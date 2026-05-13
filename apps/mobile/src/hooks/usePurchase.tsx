import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';

type PlanStatus = 'free' | 'paid';

const ENTITLEMENT = 'premium';
const STORAGE_KEY = 'purchase_status';

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';
const PLATFORM_KEY = Platform.OS === 'ios' ? IOS_KEY : Platform.OS === 'android' ? ANDROID_KEY : '';
const REVENUECAT_AVAILABLE = !!PLATFORM_KEY && (Platform.OS === 'ios' || Platform.OS === 'android');

interface PriceLabels {
  monthly: string;
  lifetime: string;
}

interface PurchaseContextValue {
  status: PlanStatus;
  loading: boolean;
  /** Pre-formatted prices from the store, or sensible fallback labels. */
  prices: PriceLabels;
  /** True when the real RevenueCat SDK is wired (keys present + native platform). */
  realPurchases: boolean;
  /** Trigger the monthly purchase flow. Resolves true on success. */
  purchaseMonthly: () => Promise<boolean>;
  /** Trigger the lifetime purchase flow. Resolves true on success. */
  purchaseLifetime: () => Promise<boolean>;
  /** Mark the user as paid locally — used by the mock flow and after a successful purchase. */
  setPaid: () => void;
  /** Restore prior purchases (Apple-required button). */
  restore: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextValue | undefined>(undefined);

const FALLBACK_PRICES: PriceLabels = { monthly: '€5/month', lifetime: '€30 one-time' };

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PlanStatus>('free');
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<PriceLabels>(FALLBACK_PRICES);
  const packagesRef = useRef<{ monthly: any; lifetime: any }>({ monthly: null, lifetime: null });

  useEffect(() => {
    let cancelled = false;

    const initMock = async () => {
      try {
        const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && stored === 'paid') setStatus('paid');
      } catch {}
      if (!cancelled) setLoading(false);
    };

    const initReal = async () => {
      try {
        const Purchases = (await import('react-native-purchases')).default;
        Purchases.configure({ apiKey: PLATFORM_KEY });

        const [info, offerings] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings(),
        ]);
        if (cancelled) return;

        const entitled = !!info.entitlements.active[ENTITLEMENT];
        setStatus(entitled ? 'paid' : 'free');

        const current = offerings.current;
        if (current) {
          packagesRef.current = {
            monthly: current.monthly ?? current.availablePackages.find((p: any) => p.packageType === 'MONTHLY') ?? null,
            lifetime: current.lifetime ?? current.availablePackages.find((p: any) => p.packageType === 'LIFETIME') ?? null,
          };
          setPrices({
            monthly: packagesRef.current.monthly?.product?.priceString ?? FALLBACK_PRICES.monthly,
            lifetime: packagesRef.current.lifetime?.product?.priceString ?? FALLBACK_PRICES.lifetime,
          });
        }

        Purchases.addCustomerInfoUpdateListener((updated: any) => {
          const isPaid = !!updated.entitlements.active[ENTITLEMENT];
          setStatus(isPaid ? 'paid' : 'free');
        });
      } catch (err) {
        // RevenueCat unavailable (e.g. Expo Go) → fall back to local storage state
        try {
          const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (!cancelled && stored === 'paid') setStatus('paid');
        } catch {}
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (REVENUECAT_AVAILABLE) {
      initReal();
    } else {
      initMock();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const setPaid = useCallback(async () => {
    setStatus('paid');
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem(STORAGE_KEY, 'paid');
    } catch {}
  }, []);

  const purchase = useCallback(async (which: 'monthly' | 'lifetime'): Promise<boolean> => {
    if (!REVENUECAT_AVAILABLE) {
      await setPaid();
      return true;
    }
    const pkg = packagesRef.current[which];
    if (!pkg) return false;
    try {
      const Purchases = (await import('react-native-purchases')).default;
      const result = await Purchases.purchasePackage(pkg);
      const entitled = !!result.customerInfo.entitlements.active[ENTITLEMENT];
      if (entitled) setStatus('paid');
      return entitled;
    } catch (err: any) {
      if (err?.userCancelled) return false;
      throw err;
    }
  }, [setPaid]);

  const purchaseMonthly = useCallback(() => purchase('monthly'), [purchase]);
  const purchaseLifetime = useCallback(() => purchase('lifetime'), [purchase]);

  const restore = useCallback(async () => {
    if (!REVENUECAT_AVAILABLE) {
      try {
        const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setStatus(stored === 'paid' ? 'paid' : 'free');
      } catch {}
      return;
    }
    const Purchases = (await import('react-native-purchases')).default;
    const info = await Purchases.restorePurchases();
    const entitled = !!info.entitlements.active[ENTITLEMENT];
    setStatus(entitled ? 'paid' : 'free');
  }, []);

  const value = useMemo<PurchaseContextValue>(
    () => ({
      status,
      loading,
      prices,
      realPurchases: REVENUECAT_AVAILABLE,
      purchaseMonthly,
      purchaseLifetime,
      setPaid,
      restore,
    }),
    [status, loading, prices, purchaseMonthly, purchaseLifetime, setPaid, restore],
  );

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchase() {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error('usePurchase must be used within PurchaseProvider');
  return ctx;
}
