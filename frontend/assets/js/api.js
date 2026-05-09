/**
 * Fintjam API Client — JWT based
 */

const API_BASE = window.FINTJAM_API_URL || 'http://localhost:3000';

const Api = {
  // ── Token helpers ─────────────────────────────────────────
  getToken() {
    return localStorage.getItem('fintjam_token');
  },
  setToken(token) {
    localStorage.setItem('fintjam_token', token);
  },
  clearToken() {
    localStorage.removeItem('fintjam_token');
  },

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${path}`, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  },

  // ── Auth ──────────────────────────────────────────────────
  auth: {
    async login(username, password) {
      const data = await Api.request('POST', '/api/auth/login', { username, password });
      if (data.token) Api.setToken(data.token);
      return data;
    },
    async register(username, password) {
      const data = await Api.request('POST', '/api/auth/register', { username, password });
      if (data.token) Api.setToken(data.token);
      return data;
    },
    async logout() {
      Api.clearToken();
      return { ok: true };
    },
    async me() {
      return Api.request('GET', '/api/auth/me');
    },
  },

  // ── User ──────────────────────────────────────────────────
  user: {
    async updateProfile(data) {
      return Api.request('PUT', '/api/user/profile', data);
    },
  },

  // ── Transactions ──────────────────────────────────────────
  transactions: {
    async getAll() {
      return Api.request('GET', '/api/transactions');
    },
    async create(data) {
      return Api.request('POST', '/api/transactions', data);
    },
    async delete(id) {
      return Api.request('DELETE', `/api/transactions/${id}`);
    },
  },

  // ── Gmail ─────────────────────────────────────────────────
  gmail: {
    async getConnectUrl() {
      return Api.request('GET', '/api/gmail/connect');
    },
    async getStatus() {
      return Api.request('GET', '/api/gmail/status');
    },
    async sync() {
      return Api.request('POST', '/api/gmail/sync');
    },
    async disconnect() {
      return Api.request('DELETE', '/api/gmail/disconnect');
    },
  },
};

// Utils
const Utils = {
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  },
  formatRibuan(n) {
    const num = parseInt(String(n).replace(/\D/g, ''), 10);
    if (isNaN(num) || num === 0) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },
};
