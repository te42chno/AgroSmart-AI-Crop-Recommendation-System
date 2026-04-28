/**
 * API service layer — handles all HTTP requests to the backend.
 * Automatically attaches JWT token and handles errors.
 */

const API_BASE = '/api';

// Get stored auth token
const getToken = (): string | null => localStorage.getItem('agrosmart_token');

// Generic fetch wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  // Handle CSV downloads
  if (res.headers.get('content-type')?.includes('text/csv')) {
    return (await res.text()) as unknown as T;
  }

  return res.json();
}

// ── Auth API ──────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    request<{ token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => request<{ user: any }>('/auth/me'),
};

// ── Prediction API ────────────────────────────────────
export const predictionAPI = {
  predict: (data: { N: number; P: number; K: number; temperature: number; humidity: number; ph: number; rainfall: number }) =>
    request<{ prediction: any }>('/predict', { method: 'POST', body: JSON.stringify(data) }),

  getHistory: (page = 1, search = '') =>
    request<{ predictions: any[]; total: number; page: number; pages: number }>(`/history?page=${page}&search=${search}`),
};

// ── Admin API ─────────────────────────────────────────
export const adminAPI = {
  getStats: () => request<any>('/admin/stats'),

  getUsers: (page = 1, search = '', role = '') =>
    request<{ users: any[]; total: number; page: number; pages: number }>(`/admin/users?page=${page}&search=${search}&role=${role}`),

  deleteUser: (id: string) =>
    request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' }),

  getAllPredictions: (page = 1) =>
    request<{ predictions: any[]; total: number; page: number; pages: number }>(`/admin/predictions?page=${page}`),

  exportCSV: () => request<string>('/admin/reports/csv'),
};
