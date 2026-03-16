import {
  UserSchema,
  SignupRequestSchema,
  LoginRequestSchema,
  AuthResponseSchema,
} from '../../src/schemas/auth';

const validUser = {
  id: 'user1',
  email: 'test@example.com',
  createdAt: '2025-01-01T00:00:00Z',
};

const validSignup = {
  email: 'test@example.com',
  password: 'securepass',
};

const validLogin = {
  email: 'test@example.com',
  password: 'any',
};

describe('UserSchema', () => {
  it('accepts valid data', () => {
    expect(UserSchema.safeParse(validUser).success).toBe(true);
  });

  it('accepts with optional fields', () => {
    const full = { ...validUser, goal: 'Be confident', dailyMinutesTarget: 10, timezone: 'UTC' };
    expect(UserSchema.safeParse(full).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { id, ...noId } = validUser;
    expect(UserSchema.safeParse(noId).success).toBe(false);

    const { email, ...noEmail } = validUser;
    expect(UserSchema.safeParse(noEmail).success).toBe(false);

    const { createdAt, ...noCreated } = validUser;
    expect(UserSchema.safeParse(noCreated).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(UserSchema.safeParse({ ...validUser, email: 'not-email' }).success).toBe(false);
  });

  it('rejects invalid datetime', () => {
    expect(UserSchema.safeParse({ ...validUser, createdAt: 'not-date' }).success).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(UserSchema.safeParse({ ...validUser, id: 123 }).success).toBe(false);
  });

  it('allows optional fields to be undefined', () => {
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.goal).toBeUndefined();
      expect(result.data.dailyMinutesTarget).toBeUndefined();
      expect(result.data.timezone).toBeUndefined();
    }
  });
});

describe('SignupRequestSchema', () => {
  it('accepts valid data', () => {
    expect(SignupRequestSchema.safeParse(validSignup).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    expect(SignupRequestSchema.safeParse({ email: 'a@b.com' }).success).toBe(false);
    expect(SignupRequestSchema.safeParse({ password: 'longpassword' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(SignupRequestSchema.safeParse({ email: 'bad', password: 'longpassword' }).success).toBe(false);
  });

  it('rejects password shorter than 8 chars', () => {
    expect(SignupRequestSchema.safeParse({ email: 'a@b.com', password: 'short' }).success).toBe(false);
    expect(SignupRequestSchema.safeParse({ email: 'a@b.com', password: '1234567' }).success).toBe(false);
  });

  it('accepts password of exactly 8 chars', () => {
    expect(SignupRequestSchema.safeParse({ email: 'a@b.com', password: '12345678' }).success).toBe(true);
  });

  it('rejects invalid types', () => {
    expect(SignupRequestSchema.safeParse({ email: 123, password: 'longpassword' }).success).toBe(false);
  });
});

describe('LoginRequestSchema', () => {
  it('accepts valid data', () => {
    expect(LoginRequestSchema.safeParse(validLogin).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    expect(LoginRequestSchema.safeParse({ email: 'a@b.com' }).success).toBe(false);
    expect(LoginRequestSchema.safeParse({ password: 'x' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(LoginRequestSchema.safeParse({ email: 'bad', password: 'x' }).success).toBe(false);
  });

  it('accepts any length password (no min constraint)', () => {
    expect(LoginRequestSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
  });
});

describe('AuthResponseSchema', () => {
  const validAuth = {
    accessToken: 'tok1',
    refreshToken: 'tok2',
    user: validUser,
  };

  it('accepts valid data', () => {
    expect(AuthResponseSchema.safeParse(validAuth).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const { accessToken, ...noAccess } = validAuth;
    expect(AuthResponseSchema.safeParse(noAccess).success).toBe(false);

    const { user, ...noUser } = validAuth;
    expect(AuthResponseSchema.safeParse(noUser).success).toBe(false);
  });

  it('rejects invalid nested user', () => {
    expect(
      AuthResponseSchema.safeParse({ ...validAuth, user: { id: 'x', email: 'bad' } }).success,
    ).toBe(false);
  });

  it('rejects invalid types', () => {
    expect(AuthResponseSchema.safeParse({ ...validAuth, accessToken: 123 }).success).toBe(false);
  });
});
