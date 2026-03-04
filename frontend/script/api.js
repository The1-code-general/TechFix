// ============================================================
// TECHFIX — api.js
// All backend API calls live here.
// Response shapes match the exact backend controllers.
// API_BASE is set by config.js — load config.js BEFORE this file.
// ============================================================

const API_BASE = window.API_BASE || 'http://localhost:5000/api';

// ─── Helper ───────────────────────────────────────────────────────────────────
async function request(method, endpoint, body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('tfToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.warn(`API [${method} ${endpoint}] failed:`, err.message);
    return { ok: false, status: 0, data: { message: 'Network error — is the backend running?' } };
  }
}

// ─── Product Mapper ───────────────────────────────────────────────────────────
// Maps backend Product shape → frontend card shape
function mapProduct(p) {
  const images = Array.isArray(p.images) ? p.images : [];
  return {
    id:        p.id,
    slug:      p.slug,
    name:      p.name,
    category:  p.category?.name || 'Uncategorised',
    brand:     p.brand || '',
    price:     parseFloat(p.price) || 0,
    oldPrice:  p.oldPrice ? parseFloat(p.oldPrice) : null,
    rating:    p.rating   || null,
    reviews:   p.reviewCount || 0,
    image:     images[0] || `https://placehold.co/400x400/0f1117/0ea5e9?text=${encodeURIComponent(p.name)}`,
    images:    images,
    badge:     p.isFeatured ? 'Featured' : null,
    inStock:   (p.stock || 0) > 0,
    desc:      p.description || '',
    specs:     p.specifications || {},
    sku:       p.sku || '',
  };
}

// ─── Repair Mapper ────────────────────────────────────────────────────────────
// Maps backend RepairBooking shape → frontend tracking shape
function mapRepair(r) {
  return {
    id:            r.id        || '',
    ticketRef:     r.ticketRef || '',
    name:          r.customerName  || '',
    email:         r.customerEmail || '',
    phone:         r.customerPhone || '',
    device:        r.deviceType  || '',
    brand:         r.deviceBrand || '',
    model:         r.deviceModel || '',
    issue:         r.issueType   || '',
    desc:          r.issueDescription || '',
    status:        r.status      || 'pending',
    notes:         r.technicianNotes  || '',
    estimatedCost: r.estimatedCost ? parseFloat(r.estimatedCost) : null,
    finalCost:     r.finalCost    ? parseFloat(r.finalCost)    : null,
    estimatedCompletion: r.estimatedCompletion || null,
    completedAt:   r.completedAt || null,
    date:          r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
      : '',
  };
}


// ============================================================
const api = {

  // ─── PRODUCTS ───────────────────────────────────────────────
  // GET /api/products
  // Response: { success, data: { products: [...], pagination: {...} } }
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res   = await request('GET', `/products${query ? '?' + query : ''}`);
    if (!res.ok) return { ok: false, data: [] };
    const raw = res.data?.data?.products || [];
    return { ok: true, data: raw.map(mapProduct) };
  },

  // GET /api/products/featured
  // Response: { success, data: { products: [...] } }
  async getFeaturedProducts() {
    const res = await request('GET', '/products/featured');
    if (!res.ok) return { ok: false, data: [] };
    const raw = res.data?.data?.products || [];
    return { ok: true, data: raw.map(mapProduct) };
  },

  // GET /api/products/:slug
  // Response: { success, data: { product: {...} } }
  async getProduct(slug) {
    const res = await request('GET', `/products/${slug}`);
    if (!res.ok) return { ok: false, data: null };
    const raw = res.data?.data?.product;
    return { ok: true, data: raw ? mapProduct(raw) : null };
  },


  // ─── AUTH ────────────────────────────────────────────────────
  // POST /api/auth/login
  // Response: { success, data: { user, token } }
  async login(email, password) {
    const res = await request('POST', '/auth/login', { email, password });
    if (!res.ok) return { ok: false, error: res.data?.message || 'Login failed' };
    return {
      ok:   true,
      data: {
        user:  res.data.data.user,
        token: res.data.data.token,
      },
    };
  },

  // POST /api/auth/register
  // Response: { success, message, data: { user, token } }
  async register(payload) {
    const res = await request('POST', '/auth/register', payload);
    if (!res.ok) return { ok: false, error: res.data?.message || 'Registration failed' };
    return {
      ok:   true,
      data: {
        user:  res.data.data.user,
        token: res.data.data.token,
      },
    };
  },

  // GET /api/auth/me
  // Response: { success, data: { user } }
  async getMe() {
    const res = await request('GET', '/auth/me', null, true);
    if (!res.ok) return { ok: false, data: null };
    return { ok: true, data: res.data?.data?.user || null };
  },

  // PATCH /api/auth/update-profile
  // Response: { success, message, data: { user } }
  async updateProfile(payload) {
    const res = await request('PATCH', '/auth/update-profile', payload, true);
    if (!res.ok) return { ok: false, error: res.data?.message || 'Update failed' };
    return { ok: true, data: res.data?.data?.user };
  },

  // PATCH /api/auth/change-password
  async changePassword(currentPassword, newPassword) {
    const res = await request('PATCH', '/auth/change-password', { currentPassword, newPassword }, true);
    return { ok: res.ok, error: res.data?.message };
  },

  // POST /api/auth/forgot-password
  async forgotPassword(email) {
    const res = await request('POST', '/auth/forgot-password', { email });
    return { ok: res.ok };
  },


  // ─── CATEGORIES ──────────────────────────────────────────────
  // GET /api/categories
  // Response: { success, data: { categories: [...] } }
  async getCategories() {
    const res = await request('GET', '/categories');
    if (!res.ok) return { ok: false, data: [] };
    return { ok: true, data: res.data?.data?.categories || [] };
  },


  // ─── ORDERS ──────────────────────────────────────────────────
  // POST /api/orders
  // Response: { success, data: { order, paymentUrl, reference } }
  async createOrder(payload) {
    const res = await request('POST', '/orders', payload, true);
    if (!res.ok) return { ok: false, error: res.data?.message || 'Failed to place order' };
    return {
      ok:   true,
      data: {
        order:      res.data.data.order,
        paymentUrl: res.data.data.paymentUrl,
        reference:  res.data.data.reference,
      },
    };
  },

  // GET /api/orders/my
  // Response: { success, data: { orders: [...] } }
  async getMyOrders() {
    const res = await request('GET', '/orders/my', null, true);
    if (!res.ok) return { ok: false, data: [] };
    return { ok: true, data: res.data?.data?.orders || [] };
  },

  // GET /api/orders/:id
  // Response: { success, data: { order } }
  async getOrder(id) {
    const res = await request('GET', `/orders/${id}`, null, true);
    if (!res.ok) return { ok: false, data: null };
    return { ok: true, data: res.data?.data?.order || null };
  },


  // ─── REPAIRS ─────────────────────────────────────────────────
  // POST /api/repairs
  // Response: { success, message, data: { booking } }
  async bookRepair(payload) {
    const res = await request('POST', '/repairs', payload);
    if (!res.ok) return { ok: false, error: res.data?.message || 'Failed to submit repair' };
    const booking = res.data?.data?.booking;
    return { ok: true, data: mapRepair(booking) };
  },

  // GET /api/repairs/track/:ticketRef (public)
  // Response: { success, data: { ticketRef, status, deviceType, issueType, ... } }
  async trackRepair(ticketRef) {
    const res = await request('GET', `/repairs/track/${ticketRef}`);
    if (!res.ok) return { ok: false, data: null };
    const raw = res.data?.data;
    if (!raw) return { ok: false, data: null };
    // Track endpoint returns a limited subset for privacy
    return {
      ok: true,
      data: {
        ticketRef:           raw.ticketRef,
        status:              raw.status,
        device:              raw.deviceType,
        issue:               raw.issueType,
        notes:               raw.technicianNotes || '',
        estimatedCost:       raw.estimatedCost ? parseFloat(raw.estimatedCost) : null,
        estimatedCompletion: raw.estimatedCompletion || null,
        completedAt:         raw.completedAt || null,
        date: raw.createdAt
          ? new Date(raw.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
          : '',
      },
    };
  },

  // GET /api/repairs/my
  // Response: { success, data: { bookings: [...] } }
  async getMyRepairs() {
    const res = await request('GET', '/repairs/my', null, true);
    if (!res.ok) return { ok: false, data: [] };
    const raw = res.data?.data?.bookings || [];
    return { ok: true, data: raw.map(mapRepair) };
  },


  // ─── PAYMENTS ────────────────────────────────────────────────
  // GET /api/payments/verify/:reference
  // Response: { success, data: { ...paystackData } }
  async verifyPayment(reference) {
    const res = await request('GET', `/payments/verify/${reference}`, null, true);
    if (!res.ok) return { ok: false, error: res.data?.message };
    return { ok: true, data: res.data?.data };
  },

};

window.api = api;