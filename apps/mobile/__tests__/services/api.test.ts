import {
  createSession,
  uploadRecording,
  submitAnxietyRating,
  apiSignup,
  apiLogin,
} from '../../src/services/api';

// Mock fetch globally
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

// Mock auth storage
jest.mock('../../src/storage/auth', () => ({
  getToken: jest.fn().mockResolvedValue('mock-jwt-token'),
}));

beforeEach(() => {
  mockFetch.mockReset();
});

describe('API service', () => {
  it('apiSignup sends POST with email and password', async () => {
    const mockResponse = {
      accessToken: 'tok_123',
      refreshToken: '',
      user: { id: 'u1', email: 'a@b.com', createdAt: '2026-01-01' },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiSignup('a@b.com', 'pass1234');
    expect(result.accessToken).toBe('tok_123');
    expect(result.user.email).toBe('a@b.com');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/signup'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('apiLogin sends POST with credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'tok_456',
        refreshToken: '',
        user: { id: 'u2', email: 'b@c.com', createdAt: '2026-01-01' },
      }),
    });

    const result = await apiLogin('b@c.com', 'pass1234');
    expect(result.accessToken).toBe('tok_456');
  });

  it('createSession sends auth header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'sess_1', status: 'queued' }),
    });

    const result = await createSession('daily', 1);
    expect(result.id).toBe('sess_1');
    expect(result.status).toBe('queued');

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe('Bearer mock-jwt-token');
  });

  it('uploadRecording resolves with success', async () => {
    const result = await uploadRecording('https://s3.example.com/upload', 'file:///rec.m4a');
    expect(result).toEqual({ success: true });
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(apiLogin('bad@email.com', 'wrong')).rejects.toThrow('401');
  });

  it('submitAnxietyRating returns recorded', async () => {
    const result = await submitAnxietyRating('session_123', 'pre', 7);
    expect(result).toEqual({ recorded: true });
  });
});
