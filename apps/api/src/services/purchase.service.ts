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
  platform: 'ios' | 'android',
  planType: 'monthly' | 'lifetime',
  transactionId: string,
  expiresAt: Date | null
) {
  // TODO: upsert purchase record, set status to 'active'
  // For lifetime: expiresAt is null
  // For monthly: expiresAt is the subscription expiry date
  return null;
}

/** Get user's current purchase/entitlement status */
export async function getPurchaseStatus(prisma: PrismaClient, userId: string) {
  // TODO: query purchases table for active purchase
  // Check if subscription has expired
  // Return PurchaseStatus shape: { status: 'free'|'paid', planType?, expiresAt? }
  return { status: 'free' as const };
}
