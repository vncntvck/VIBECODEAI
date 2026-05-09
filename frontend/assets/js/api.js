/**
 * Fintjam API Client
 * Menggantikan storage.js — semua data sekarang dari backend
 */

const API_BASE = window.FINTJAM_API_URL || 'http://localhost:3000';

const Api = {
  async request(method, path, body = null) {
    const opts = {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${path}`, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  },

  // ── Auth ──────────────────────────────────────────────────
  auth: {
    async login(username, password) {
      return Api.request('POST', '/api/auth/login', { username, password });
    },
    async register(username, password) {
      return Api.request('POST', '/api/auth/register', { username, password });
    },
    async logout() {
      return Api.request('POST', '/api/auth/logout');
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

// Utils (sama seperti sebelumnya)
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
