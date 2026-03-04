// ============================================================
// TECHFIX — config.js
// Auto-detects base path. Controls mock vs real backend.
// Load this FIRST before any other script on every HTML page.
// ============================================================

(function () {
  // Auto-detects if Live Server is rooted at TechFix/ or frontend/
  const atRoot = window.location.pathname.startsWith('/frontend');
  window.BASE = atRoot ? '/frontend' : '';

  // ─── Toggle this when switching between mock and real backend ───
  const USE_MOCK = false; // ← set to false when real backend is running
  // ────────────────────────────────────────────────────────────────

  window.API_BASE = USE_MOCK
    ? 'http://localhost:3001/api'   // JSON Server (mock)
    : 'http://192.168.x.x:5000/api'

  // Page map — uses correct base automatically
  window.PAGES = {
    home:      window.BASE + '/index.html',
    shop:      window.BASE + '/public/shop.html',
    repair:    window.BASE + '/public/repair.html',
    services:  window.BASE + '/public/services.html',
    about:     window.BASE + '/public/about.html',
    contact:   window.BASE + '/public/contact.html',
    track:     window.BASE + '/public/track.html',
    faq:       window.BASE + '/public/faq.html',
    terms:     window.BASE + '/public/terms.html',
    dashboard: window.BASE + '/public/dashboard.html',
  };

  console.log('TechFix config:', {
    base: window.BASE || '(root)',
    api:  window.API_BASE,
    mode: USE_MOCK ? 'MOCK (JSON Server)' : 'REAL BACKEND'
  });
})();