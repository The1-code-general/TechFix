// ============================================================
// TECHFIX — api.js
// Backend Integration Layer
//
// HOW TO USE:
//   1. Set API_BASE to your backend's root URL
//   2. Each function maps to one backend endpoint
//   3. Replace the mock implementations in main.js
//      by calling the corresponding api.xxx() function
//
// AUTH HEADER:
//   All protected routes automatically attach the JWT token
//   stored in localStorage under 'tfToken'.
// ============================================================

const API_BASE = 'https://api.yourdomain.com/api'; // TODO: update to production URL

// ---- Helpers ----

function authHeader() {
  const token = localStorage.getItem('tfToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
        ...(options.headers || {}),
      },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ============================================================
// AUTH  →  /api/auth/*
// ============================================================
const api = {

  // POST /api/auth/login
  // Body: { email, password }
  // Returns: { token, user: { id, firstName, lastName, email, phone } }
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // POST /api/auth/register
  // Body: { firstName, lastName, email, phone, password }
  // Returns: { token, user }
  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // POST /api/auth/forgot-password
  // Body: { email }
  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // GET /api/auth/me  [protected]
  // Returns: { user }
  getMe: () => request('/auth/me'),


  // ============================================================
  // PRODUCTS  →  /api/products/*
  // ============================================================

  // GET /api/products?category=&brand=&minPrice=&maxPrice=&sort=&search=
  // Returns: { products: [...] }
  getProducts: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/products${params ? '?' + params : ''}`);
  },

  // GET /api/products/:id
  // Returns: { product }
  getProduct: (id) => request(`/products/${id}`),


  // ============================================================
  // ORDERS  →  /api/orders/*
  // ============================================================

  // POST /api/orders  [protected]
  // Body: { items: [{productId, qty}], delivery: { firstName, lastName, email, phone, address, state }, paymentMethod }
  // Returns: { order, paystackAuthorizationUrl }
  createOrder: (orderData) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // GET /api/orders  [protected]
  // Returns: { orders: [...] }
  getMyOrders: () => request('/orders'),

  // GET /api/orders/:id  [protected]
  // Returns: { order }
  getOrder: (id) => request(`/orders/${id}`),

  // POST /api/orders/verify-payment  (Paystack webhook/callback)
  // Body: { reference }
  verifyPayment: (reference) =>
    request('/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify({ reference }),
    }),


  // ============================================================
  // REPAIRS  →  /api/repairs/*
  // ============================================================

  // POST /api/repairs
  // Body: { device, brand, model, issueType, issueDesc, firstName, lastName, email, phone, method, address }
  // Returns: { ticket: { id, status, ... } }
  bookRepair: (repairData) =>
    request('/repairs', {
      method: 'POST',
      body: JSON.stringify(repairData),
    }),

  // GET /api/repairs/:ticketId  (public — no auth required)
  // Returns: { ticket }
  trackRepair: (ticketId) => request(`/repairs/${ticketId}`),

  // GET /api/repairs  [protected]
  // Returns: { repairs: [...] }
  getMyRepairs: () => request('/repairs/mine'),


  // ============================================================
  // USER  →  /api/users/*
  // ============================================================

  // PUT /api/users/profile  [protected]
  // Body: { firstName, lastName, email, phone, address }
  updateProfile: (profileData) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // PUT /api/users/password  [protected]
  // Body: { currentPassword, newPassword }
  changePassword: (data) =>
    request('/users/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // GET /api/users/wishlist  [protected]
  // Returns: { wishlist: [productId, ...] }
  getWishlist: () => request('/users/wishlist'),

  // POST /api/users/wishlist/:productId  [protected]
  addToWishlist: (productId) =>
    request(`/users/wishlist/${productId}`, { method: 'POST' }),

  // DELETE /api/users/wishlist/:productId  [protected]
  removeFromWishlist: (productId) =>
    request(`/users/wishlist/${productId}`, { method: 'DELETE' }),


  // ============================================================
  // CONTACT & NEWSLETTER  →  /api/contact, /api/newsletter
  // ============================================================

  // POST /api/contact
  // Body: { firstName, lastName, email, phone, subject, message }
  sendMessage: (data) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // POST /api/newsletter
  // Body: { email }
  subscribe: (email) =>
    request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ============================================================
// IMAGE UPLOAD HELPER
// ============================================================
// Use this for repair booking image uploads when backend is ready.
// POST /api/uploads   (multipart/form-data)
// Returns: { urls: ['https://...', ...] }
async function uploadImages(files) {
  const formData = new FormData();
  files.forEach(f => formData.append('images', f));
  try {
    const res = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers: authHeader(),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
