import type { PrismaClient } from '@prisma/client';

const REVENUECAT_BASE = 'https://api.revenuecat.com/v1';
const ENTITLEMENT_ID = 'premium';

export interface VerificationResult {
  valid: boolean;
  storeTransactionId: string | null;
  expiresAt: Date | null;
}

/**
 * Verify a user's entitlement by querying RevenueCat for their subscriber record.
 * Uses the authenticated userId as RevenueCat's app_user_id — mobile must call
 * Purchases.logIn(userId) after auth so the entitlement is attached server-side.
 */
export async function verifyWithRevenueCat(
  apiKey: string,
  appUserId: string,
  planType: 'monthly' | 'lifetime',
): Promise<VerificationResult> {
  const res = await fetch(`${REVENUECAT_BASE}/subscribers/${encodeURIComponent(appUserId)}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    return { valid: false, storeTransactionId: null, expiresAt: null };
  }

  const body = (await res.json()) as {
    subscriber?: {
      entitlements?: Record<string, { expires_date: string | null; product_identifier: string }>;
      non_subscriptions?: Record<string, Array<{ id: string; purchase_date: string }>>;
    };
  };

  const entitlement = body.subscriber?.entitlements?.[ENTITLEMENT_ID];
  if (!entitlement) {
    return { valid: false, storeTransactionId: null, expiresAt: null };
  }

  const expiresAt = entitlement.expires_date ? new Date(entitlement.expires_date) : null;
  if (planType === 'monthly' && (!expiresAt || expiresAt < new Date())) {
    return { valid: false, storeTransactionId: null, expiresAt: null };
  }

  const nonSub = body.subscriber?.non_subscriptions
    ? Object.values(body.subscriber.non_subscriptions).flat()[0]
    : undefined;

  return {
    valid: true,
    storeTransactionId: nonSub?.id ?? entitlement.product_identifier ?? null,
    expiresAt,
  };
}

/** Create a purchase record. Caller is responsible for verifying first. */
export async function recordPurchase(
  prisma: PrismaClient,
  userId: string,
  planType: 'monthly' | 'lifetime',
  platform: 'ios' | 'android',
  storeTransactionId: string | null = null,
  expiresAt: Date | null = null,
) {
  const resolvedExpiresAt =
    expiresAt ??
    (planType === 'lifetime' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      platform,
      type: planType,
      status: 'active',
      storeTransactionId: storeTransactionId ?? undefined,
      expiresAt: resolvedExpiresAt,
    },
  });

  return purchase;
}

/** Get user's current purchase/entitlement status */
export async function getPurchaseStatus(prisma: PrismaClient, userId: string) {
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!purchase) {
    return { status: 'free' as const, planType: null, expiresAt: null };
  }

  // Check if a monthly subscription has expired
  if (purchase.type === 'monthly' && purchase.expiresAt && purchase.expiresAt < new Date()) {
    // Mark as expired
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { status: 'expired' },
    });
    return { status: 'free' as const, planType: null, expiresAt: null };
  }

  return {
    status: 'active' as const,
    planType: purchase.type as 'monthly' | 'lifetime',
    expiresAt: purchase.expiresAt ? purchase.expiresAt.toISOString() : null,
  };
}
