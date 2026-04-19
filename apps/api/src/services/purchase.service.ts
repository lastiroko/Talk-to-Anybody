import type { PrismaClient } from '@prisma/client';

/** Verify an iOS App Store receipt */
export async function verifyAppleReceipt(receiptToken: string, productId: string) {
  // TODO: call Apple's verifyReceipt endpoint (production + sandbox fallback)
  // Parse response for transaction_id, expires_date, product_id
  // Return { valid: boolean, transactionId, expiresAt }
  return { valid: false, transactionId: '', expiresAt: null };
}

/** Verify an Android Google Play purchase token */
export async function verifyGoogleToken(receiptToken: string, productId: string) {
  // TODO: call Google Play Developer API to verify purchase
  // Parse response for orderId, expiryTimeMillis
  // Return { valid: boolean, transactionId, expiresAt }
  return { valid: false, transactionId: '', expiresAt: null };
}

/** Create or update a purchase record after successful verification */
export async function recordPurchase(
  prisma: PrismaClient,
  userId: string,
  planType: 'monthly' | 'lifetime',
  platform: 'ios' | 'android',
) {
  const expiresAt =
    planType === 'lifetime'
      ? null
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days for monthly

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      platform,
      type: planType,
      status: 'active',
      expiresAt,
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
