import { usePurchase } from './usePurchase';

/**
 * Returns true if the user needs to pay to access the content.
 * Free tier: Days 1-2, Freestyle mode. Everything else is paid.
 */
export function usePaywallGate() {
  const { status } = usePurchase();

  const isGated = (options?: { dayNumber?: number; mode?: string }) => {
    if (status === 'paid') return false;

    // Days 1-2 are always free
    if (options?.dayNumber && options.dayNumber <= 2) return false;

    // Freestyle mode is always free
    if (options?.mode === 'freestyle') return false;

    // Everything else requires payment
    return true;
  };

  return { isGated, isPaid: status === 'paid' };
}
