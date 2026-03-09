import { z } from 'zod';
import { PlanTypeSchema, PurchasePlatformSchema, PurchaseStatusValueSchema } from '../enums';

// ── Purchase Verify Request ─────────────────────────────────────────────────

export const PurchaseVerifyRequestSchema = z.object({
  platform: PurchasePlatformSchema,
  receiptToken: z.string(),
  productId: z.string(),
});
export type PurchaseVerifyRequest = z.infer<typeof PurchaseVerifyRequestSchema>;

// ── Purchase Status ─────────────────────────────────────────────────────────

export const PurchaseStatusSchema = z.object({
  status: PurchaseStatusValueSchema,
  planType: PlanTypeSchema.optional(),
  expiresAt: z.string().datetime().optional(),
});
export type PurchaseStatus = z.infer<typeof PurchaseStatusSchema>;
