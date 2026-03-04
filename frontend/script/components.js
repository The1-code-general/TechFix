// ============================================================
// TECHFIX — components.js
// Injects shared Topbar, Navbar, Footer, and Modals into
// every page. Runs at end of <body> so DOM is already built.
// ============================================================

(function () {

  // ─── Skeleton pulse animation (injected once into <head>) ─────────────────
  if (!document.getElementById('tf-skeleton-style')) {
    const style = document.createElement('style');
    style.id = 'tf-skeleton-style';
    style.textContent = `
      @keyframes skeletonPulse {
        0%   { opacity: 1; }
        50%  { opacity: 0.4; }
        100% { opacity: 1; }
      }
      .product-card-skeleton { cursor: default !important; }
      .product-card-skeleton:hover { transform: none !important; box-shadow: none !important; }
    `;
    document.head.appendChild(style);
  }

  // ---- Helpers ----
  function mount(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function currentPage() {
    return document.body.dataset.page || 'home';
  }

  function navActive(page) {
    return currentPage() === page ? 'active' : '';
  }

  // Pages are defined in config.js which auto-detects the correct base path.
  // Falls back to /frontend/ paths if config.js hasn't loaded yet.
  function go(page) {
    const pages = window.PAGES || {
      home:      '/frontend/index.html',
      shop:      '/frontend/public/shop.html',
      repair:    '/frontend/public/repair.html',
      services:  '/frontend/public/services.html',
      about:     '/frontend/public/about.html',
      contact:   '/frontend/public/contact.html',
      track:     '/frontend/public/track.html',
      faq:       '/frontend/public/faq.html',
      terms:     '/frontend/public/terms.html',
      dashboard: '/frontend/public/dashboard.html',
    };
    window.location.href = pages[page] || '/frontend/index.html';
  }

  // Expose go() globally so main.js and inline HTML can call it
  window.go = go;


  // ============================================================
  // TOPBAR
  // ============================================================
  mount('topbar-mount', `
    <div class="topbar">
      📦 Free delivery on orders above ₦50,000 &nbsp;|&nbsp;
      📞 <a href="tel:+2348001234567">+234 800 123 4567</a> &nbsp;|&nbsp;
      ⚡ Same-day repairs available
    </div>
  `);


  // ============================================================
  // NAVBAR
  // ============================================================
  mount('navbar-mount', `
    <nav class="navbar">
      <div class="container nav-inner">
        <div class="nav-logo" onclick="go('home')" style="cursor:pointer;">
          <div class="logo-icon">⚡</div>
          <div class="logo-text">Tech<span>Fix</span></div>
        </div>
        <div class="nav-links">
          <div class="nav-link ${navActive('home')}"     onclick="go('home')">Home</div>
          <div class="nav-link ${navActive('shop')}"     onclick="go('shop')">Shop</div>
          <div class="nav-link ${navActive('repair')}"   onclick="go('repair')">Book Repair</div>
          <div class="nav-link ${navActive('services')}" onclick="go('services')">Services</div>
          <div class="nav-link ${navActive('about')}"    onclick="go('about')">About</div>
          <div class="nav-link ${navActive('contact')}"  onclick="go('contact')">Contact</div>
        </div>
        <div class="nav-actions">
          <div class="nav-btn" onclick="toggleSearch()" title="Search">
            <i class="fas fa-search"></i>
          </div>
          <div class="nav-btn" onclick="openCart()" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span class="count" id="cartCount">0</span>
          </div>
          <div class="nav-btn" id="userNavBtn" onclick="handleUserNav()" title="Account">
            <i class="fas fa-user"></i>
          </div>
          <div class="nav-cta" onclick="go('repair')" style="cursor:pointer;">Book Repair</div>
        </div>
      </div>
    </nav>
  `);


  // ============================================================
  // FOOTER
  // ============================================================
  mount('footer-mount', `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand"><div class="logo-icon">⚡</div>TechFix</div>
            <p class="footer-desc">Nigeria's most trusted electronics sales and repair company. Genuine products, expert repairs, fast delivery.</p>
            <div class="footer-social">
              <div class="social-btn"><i class="fab fa-facebook-f"></i></div>
              <div class="social-btn"><i class="fab fa-instagram"></i></div>
              <div class="social-btn"><i class="fab fa-twitter"></i></div>
              <div class="social-btn"><i class="fab fa-youtube"></i></div>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Quick Links</div>
            <div class="footer-link" onclick="go('home')">Home</div>
            <div class="footer-link" onclick="go('shop')">Shop</div>
            <div class="footer-link" onclick="go('repair')">Book Repair</div>
            <div class="footer-link" onclick="go('track')">Track Repair</div>
            <div class="footer-link" onclick="go('about')">About Us</div>
          </div>
          <div>
            <div class="footer-col-title">Support</div>
            <div class="footer-link" onclick="go('faq')">FAQ</div>
            <div class="footer-link" onclick="go('contact')">Contact Us</div>
            <div class="footer-link" onclick="go('terms')">Terms of Service</div>
            <div class="footer-link" onclick="go('terms')">Privacy Policy</div>
          </div>
          <div>
            <div class="footer-col-title">Contact</div>
            <p style="font-size:14px;color:var(--text2);margin-bottom:8px;">📍 123 Tech Lane, Ikeja, Lagos</p>
            <p style="font-size:14px;color:var(--text2);margin-bottom:8px;">📞 +234 800 123 4567</p>
            <p style="font-size:14px;color:var(--text2);margin-bottom:16px;">✉️ hello@techfix.ng</p>
            <div class="footer-badges"><div class="footer-badge"><i class="fas fa-lock" style="color:var(--green);"></i>SSL Secured</div></div>
            <div class="footer-badges" style="margin-top:8px;"><div class="footer-badge">🔒 Paystack</div></div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 TechFix by CST Innovative. All rights reserved.</span>
          <div style="display:flex;gap:16px;">
            <span class="footer-link" onclick="go('terms')">Privacy</span>
            <span class="footer-link" onclick="go('terms')">Terms</span>
            <span class="footer-link" onclick="go('faq')">FAQ</span>
          </div>
        </div>
      </div>
    </footer>
  `);


  // ============================================================
  // MODALS & CART
  // ============================================================
  mount('modals-mount', `

    <!-- Auth Modal -->
    <div class="modal-overlay" id="authModal">
      <div class="modal">
        <div class="modal-close" onclick="closeModal('authModal')"><i class="fas fa-times"></i></div>
        <div class="modal-title">Welcome to TechFix</div>
        <div class="modal-subtitle">Sign in to your account or create one</div>
        <div class="auth-tab">
          <button class="auth-tab-btn active" id="loginTabBtn" onclick="switchAuthTab('login')">Sign In</button>
          <button class="auth-tab-btn" id="registerTabBtn" onclick="switchAuthTab('register')">Create Account</button>
        </div>
        <div id="loginForm">
          <div class="form-group input-icon"><i class="fas fa-envelope"></i><input type="email" class="form-control" placeholder="Email address" id="loginEmail"/></div>
          <div class="form-group input-icon"><i class="fas fa-lock"></i><input type="password" class="form-control" placeholder="Password" id="loginPassword"/></div>
          <div style="text-align:right;margin-bottom:20px;"><span style="font-size:13px;color:var(--accent);cursor:pointer;" onclick="showForgotPassword()">Forgot password?</span></div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px;" onclick="handleLogin()">Sign In</button>
          <div class="auth-divider">or continue with</div>
          <button class="btn btn-outline" style="width:100%;justify-content:center;" onclick="showToast('Google sign-in coming soon!','info')">
            <img src="https://www.google.com/favicon.ico" style="width:16px;" alt="G"/> Google
          </button>
        </div>
        <div id="registerForm" style="display:none;">
          <div class="grid-2">
            <div class="form-group"><label>First Name</label><input type="text" class="form-control" placeholder="John" id="regFirst"/></div>
            <div class="form-group"><label>Last Name</label><input type="text" class="form-control" placeholder="Doe" id="regLast"/></div>
          </div>
          <div class="form-group"><label>Email</label><input type="email" class="form-control" placeholder="john@example.com" id="regEmail"/></div>
          <div class="form-group"><label>Phone</label><input type="tel" class="form-control" placeholder="+234..." id="regPhone"/></div>
          <div class="form-group"><label>Password</label><input type="password" class="form-control" placeholder="Min 8 characters" id="regPassword"/></div>
          <div class="form-group"><label>Confirm Password</label><input type="password" class="form-control" placeholder="Repeat password" id="regConfirm"/></div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px;" onclick="handleRegister()">Create Account</button>
          <p style="font-size:12px;color:var(--text3);text-align:center;margin-top:16px;">By creating an account you agree to our <span style="color:var(--accent);cursor:pointer;" onclick="go('terms')">Terms & Privacy Policy</span></p>
        </div>
      </div>
    </div>

    <!-- Cart Overlay & Drawer -->
    <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
    <div class="cart-drawer" id="cartDrawer">
      <div class="cart-header">
        <div class="cart-title">Shopping Cart <span style="color:var(--text2);font-size:16px;" id="cartItemCount">(0 items)</span></div>
        <div class="modal-close" onclick="closeCart()"><i class="fas fa-times"></i></div>
      </div>
      <div class="cart-body" id="cartBody"></div>
      <div class="cart-footer">
        <div class="cart-total-row"><span>Subtotal</span><span id="cartSubtotal">₦0</span></div>
        <div class="cart-total-row"><span>Delivery</span><span style="color:var(--green);">Calculated at checkout</span></div>
        <div class="cart-total-row grand"><span>Total</span><span id="cartTotal">₦0</span></div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px;font-size:15px;" onclick="openCheckout()"><i class="fas fa-credit-card"></i> Proceed to Checkout</button>
        <button class="btn btn-outline btn-sm" style="width:100%;justify-content:center;margin-top:8px;" onclick="closeCart()">Continue Shopping</button>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div class="modal-overlay" id="checkoutModal">
      <div class="modal checkout-modal" style="max-width:560px;max-height:90vh;overflow-y:auto;">
        <div class="modal-close" onclick="closeModal('checkoutModal')"><i class="fas fa-times"></i></div>
        <div class="checkout-step active" id="chkStep1">
          <div class="modal-title">Delivery Details</div>
          <div class="modal-subtitle">Where should we deliver your order?</div>
          <div class="grid-2">
            <div class="form-group"><label>First Name</label><input type="text" class="form-control" id="chkFirst" placeholder="John"/></div>
            <div class="form-group"><label>Last Name</label><input type="text" class="form-control" id="chkLast" placeholder="Doe"/></div>
          </div>
          <div class="form-group"><label>Email</label><input type="email" class="form-control" id="chkEmail" placeholder="john@email.com"/></div>
          <div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="chkPhone" placeholder="+234..."/></div>
          <div class="form-group"><label>Delivery Address</label><textarea class="form-control" rows="2" id="chkAddress" placeholder="Full address..."></textarea></div>
          <div class="form-group"><label>State</label><select class="form-control" id="chkState"><option>Lagos</option><option>Abuja</option><option>Kano</option><option>Ibadan</option><option>Rivers</option><option>Ogun</option><option>Other</option></select></div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="checkoutNext(2)">Continue to Payment <i class="fas fa-arrow-right"></i></button>
        </div>
        <div class="checkout-step" id="chkStep2">
          <div class="modal-title">Payment</div>
          <div class="modal-subtitle">Choose your preferred payment method</div>
          <div class="order-summary" id="checkoutSummary"></div>
          <div class="payment-methods">
            <div class="pay-method selected" id="pm-card" onclick="selectPayment('card')"><i class="fas fa-credit-card"></i><span>Debit/Credit Card</span></div>
            <div class="pay-method" id="pm-bank" onclick="selectPayment('bank')"><i class="fas fa-university"></i><span>Bank Transfer</span></div>
            <div class="pay-method" id="pm-ussd" onclick="selectPayment('ussd')"><i class="fas fa-mobile-alt"></i><span>USSD</span></div>
            <div class="pay-method" id="pm-wallet" onclick="selectPayment('wallet')"><i class="fas fa-wallet"></i><span>Bank Account</span></div>
          </div>
          <div id="cardFields">
            <div class="form-group"><label>Card Number</label><input type="text" class="form-control" placeholder="0000 0000 0000 0000" maxlength="19" oninput="formatCard(this)"/></div>
            <div class="grid-2">
              <div class="form-group"><label>Expiry</label><input type="text" class="form-control" placeholder="MM/YY" maxlength="5"/></div>
              <div class="form-group"><label>CVV</label><input type="text" class="form-control" placeholder="123" maxlength="3"/></div>
            </div>
          </div>
          <div style="display:flex;gap:12px;">
            <button class="btn btn-outline" style="flex:1;" onclick="checkoutNext(1)"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="btn btn-primary" style="flex:2;justify-content:center;" onclick="processPayment()"><i class="fas fa-lock"></i> Pay Securely</button>
          </div>
          <p style="font-size:11px;color:var(--text3);text-align:center;margin-top:12px;"><i class="fas fa-shield-alt"></i> Secured by Paystack. Your payment info is encrypted.</p>
        </div>
        <div class="checkout-step" id="chkStep3">
          <div class="success-state">
            <div class="success-icon"><i class="fas fa-check"></i></div>
            <div class="success-title">Order Placed!</div>
            <div class="success-desc">Thank you for your purchase. A confirmation email has been sent to your inbox.</div>
            <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="closeModal('checkoutModal');closeCart();go('dashboard')">View My Orders</button>
              <button class="btn btn-outline" onclick="closeModal('checkoutModal');closeCart();">Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div class="modal-overlay" id="productModal">
      <div class="modal product-detail-modal">
        <div class="modal-close" onclick="closeModal('productModal')"><i class="fas fa-times"></i></div>
        <div class="product-detail-grid" id="productDetailContent"></div>
      </div>
    </div>

    <!-- Toast Container -->
    <div id="toastContainer"></div>

    <!-- Search Overlay -->
    <div class="modal-overlay" id="searchOverlay" onclick="if(event.target===this)toggleSearch()">
      <div style="background:var(--bg);border-radius:20px;padding:0;width:100%;max-width:640px;margin:72px auto 0;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.5);">
        
        <!-- Search Input Bar -->
        <div style="display:flex;align-items:center;gap:14px;padding:20px 24px;border-bottom:1px solid var(--border);">
          <i class="fas fa-search" style="color:var(--accent);font-size:18px;flex-shrink:0;"></i>
          <input
            type="text"
            id="searchInput"
            class="form-control"
            placeholder="Search products, brands, categories..."
            style="border:none;font-size:17px;background:transparent;outline:none;flex:1;padding:0;color:var(--text);"
            oninput="runSearch(this.value)"
            onkeydown="if(event.key==='Escape')toggleSearch();if(event.key==='Enter')runSearchEnter(this.value)"
            autocomplete="off"
          />
          <div onclick="toggleSearch()" style="cursor:pointer;width:30px;height:30px;border-radius:8px;background:var(--bg2);display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:13px;flex-shrink:0;border:1px solid var(--border);">✕</div>
        </div>

        <!-- Results / Default State -->
        <div id="searchResults" style="max-height:480px;overflow-y:auto;">

          <!-- Default state shown before typing -->
          <div id="searchDefault" style="padding:20px 24px;">
            <div style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Popular Searches</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
              ${['iPhone', 'Samsung', 'MacBook', 'AirPods', 'Laptop', 'Tablet'].map(t =>
                `<div onclick="document.getElementById('searchInput').value='${t}';runSearch('${t}')"
                  style="background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:6px 14px;font-size:13px;color:var(--text2);cursor:pointer;transition:all .15s;"
                  onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'"
                  onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">${t}</div>`
              ).join('')}
            </div>
            <div style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Browse Categories</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              ${[
                {icon:'📱',name:'Smartphones'},{icon:'💻',name:'Laptops'},
                {icon:'🎧',name:'Accessories'},{icon:'📟',name:'Tablets'}
              ].map(c =>
                `<div onclick="window.location.href=window.PAGES?window.PAGES.shop:'/frontend/public/shop.html'"
                  style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;cursor:pointer;transition:all .15s;"
                  onmouseover="this.style.borderColor='var(--accent)'"
                  onmouseout="this.style.borderColor='var(--border)'">
                  <span style="font-size:22px;">${c.icon}</span>
                  <span style="font-size:14px;font-weight:600;color:var(--text);">${c.name}</span>
                </div>`
              ).join('')}
            </div>
          </div>

          <!-- Live results injected here by runSearch() -->
          <div id="searchLiveResults"></div>

        </div>

        <!-- Footer -->
        <div style="padding:14px 24px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:12px;color:var(--text3);">Press <kbd style="background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:1px 6px;font-size:11px;">ESC</kbd> to close</span>
          <a id="searchViewAll" href="/frontend/public/shop.html" style="font-size:13px;color:var(--accent);font-weight:600;display:none;">View all results in Shop →</a>
        </div>

      </div>
    </div>
  `);


  // ============================================================
  // CLOSE MODALS ON OVERLAY CLICK
  // ============================================================
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) this.classList.remove('open');
    });
  });


  // ============================================================
  // SEARCH
  // ============================================================
  window.toggleSearch = function () {
    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    const isOpen = overlay.classList.toggle('open');
    if (isOpen) {
      const input = document.getElementById('searchInput');
      input.value = '';
      document.getElementById('searchLiveResults').innerHTML = '';
      document.getElementById('searchDefault').style.display = 'block';
      document.getElementById('searchViewAll').style.display = 'none';
      setTimeout(() => input.focus(), 50);
    }
  };

  window.runSearch = function (query) {
    const liveEl = document.getElementById('searchLiveResults');
    const defaultEl = document.getElementById('searchDefault');
    const viewAll = document.getElementById('searchViewAll');

    if (!query.trim()) {
      liveEl.innerHTML = '';
      defaultEl.style.display = 'block';
      viewAll.style.display = 'none';
      return;
    }

    defaultEl.style.display = 'none';
    viewAll.style.display = 'block';
    viewAll.href = '/frontend/public/shop.html';

    const products = window.PRODUCTS || [];
    const q = query.toLowerCase();
    const matches = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q)
    );

    if (!matches.length) {
      liveEl.innerHTML = '<div style="padding:32px 24px;text-align:center;color:var(--text2);">' +
        '<i class="fas fa-search" style="font-size:28px;color:var(--text3);display:block;margin-bottom:12px;"></i>' +
        'No results for "<strong>' + query + '</strong>"</div>';
      return;
    }

    const count = matches.length;
    viewAll.textContent = 'View all ' + count + ' result' + (count !== 1 ? 's' : '') + ' in Shop →';

    liveEl.innerHTML = '<div style="padding:8px 24px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:1px;text-transform:uppercase;">Products</div>' +
      matches.slice(0, 6).map(function(p) {
        const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
        return '<div onclick="toggleSearch();if(window.openProduct)openProduct(' + p.id + ');"' +
          ' style="display:flex;align-items:center;gap:16px;padding:12px 24px;cursor:pointer;transition:background .15s;border-radius:0;"' +
          ' onmouseover="this.style.background=\'var(--bg2)\'" onmouseout="this.style.background=\'transparent\'">' +
          '<div style="width:52px;height:52px;border-radius:10px;background:var(--bg2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">' +
          '<img src="' + p.image + '" alt="' + p.name + '" style="width:40px;height:40px;object-fit:contain;" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'📦\'"/>' +
          '</div>' +
          '<div style="flex:1;min-width:0;">' +
          '<div style="font-weight:600;font-size:14px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.name + '</div>' +
          '<div style="font-size:12px;color:var(--text3);margin-top:2px;">' + p.category + ' • ' + p.brand + '</div>' +
          '</div>' +
          '<div style="text-align:right;flex-shrink:0;">' +
          '<div style="font-weight:700;font-size:14px;color:var(--accent);">₦' + p.price.toLocaleString() + '</div>' +
          (discount > 0 ? '<div style="font-size:11px;color:var(--green);font-weight:600;">-' + discount + '%</div>' : '') +
          '</div>' +
          '<button onclick="event.stopPropagation();if(window.addToCart)addToCart(' + p.id + ');"' +
          ' style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;flex-shrink:0;white-space:nowrap;">' +
          '<i class="fas fa-plus"></i> Cart</button>' +
          '</div>';
      }).join('');
  };

  window.runSearchEnter = function(query) {
    if (query.trim()) {
      window.location.href = window.PAGES ? window.PAGES.shop : '/frontend/public/shop.html';
    }
  };

})();