import {
  PurchaseVerifyRequestSchema,
  PurchaseStatusSchema,
} from '../../src/schemas/purchase';

const validVerify = {
  platform: 'ios' as const,
  receiptToken: 'token123',
  productId: 'com.app.monthly',
};

const validStatus = {
  status: 'free' as const,
};

describe('PurchaseVerifyRequestSchema', () => {
  it('accepts valid data', () => {
    expect(PurchaseVerifyRequestSchema.safeParse(validVerify).success).toBe(true);
  });

  it('accepts both platforms', () => {
    expect(PurchaseVerifyRequestSchema.safeParse({ ...validVerify, platform: 'ios' }).success).toBe(true);
    expect(PurchaseVerifyRequestSchema.safeParse({ ...validVerify, platform: 'android' }).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { platform, ...noPlatform } = validVerify;
    expect(PurchaseVerifyRequestSchema.safeParse(noPlatform).success).toBe(false);

    const { receiptToken, ...noToken } = validVerify;
    expect(PurchaseVerifyRequestSchema.safeParse(noToken).success).toBe(false);

    const { productId, ...noProduct } = validVerify;
    expect(PurchaseVerifyRequestSchema.safeParse(noProduct).success).toBe(false);
  });

  it('rejects invalid platform', () => {
    expect(PurchaseVerifyRequestSchema.safeParse({ ...validVerify, platform: 'web' }).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(PurchaseVerifyRequestSchema.safeParse({ ...validVerify, receiptToken: 123 }).success).toBe(false);
  });
});

describe('PurchaseStatusSchema', () => {
  it('accepts free status', () => {
    expect(PurchaseStatusSchema.safeParse({ status: 'free' }).success).toBe(true);
  });

  it('accepts paid status with optional fields', () => {
    const paid = {
      status: 'paid',
      planType: 'monthly',
      expiresAt: '2025-12-31T23:59:59Z',
    };
    expect(PurchaseStatusSchema.safeParse(paid).success).toBe(true);
  });

  it('accepts lifetime planType', () => {
    expect(PurchaseStatusSchema.safeParse({ status: 'paid', planType: 'lifetime' }).success).toBe(true);
  });

  it('rejects missing required status', () => {
    expect(PurchaseStatusSchema.safeParse({}).success).toBe(false);
  });

  it('rejects invalid status', () => {
    expect(PurchaseStatusSchema.safeParse({ status: 'trial' }).success).toBe(false);
  });

  it('rejects invalid planType', () => {
    expect(PurchaseStatusSchema.safeParse({ status: 'paid', planType: 'yearly' }).success).toBe(false);
  });

  it('rejects invalid expiresAt datetime', () => {
    expect(PurchaseStatusSchema.safeParse({ status: 'paid', expiresAt: 'not-a-date' }).success).toBe(false);
  });

  it('allows optional fields to be undefined', () => {
    const result = PurchaseStatusSchema.safeParse(validStatus);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.planType).toBeUndefined();
      expect(result.data.expiresAt).toBeUndefined();
    }
  });
});
