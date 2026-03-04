// ============================================================
// TECHFIX — main.js
// Application logic: routing, products, cart, auth,
// repair booking, tracking, FAQ, checkout, toasts, etc.
//
// BACKEND INTEGRATION:
//   Replace localStorage mock calls with api.xxx() functions
//   from api.js once the backend is ready. Each section is
//   marked with a "// TODO (backend):" comment.
// ============================================================

// ===== PRODUCT DATA =====
// Loaded from the backend API on page init via loadProducts().
// If the API is offline, skeleton placeholder cards are shown instead.
// window.PRODUCTS is kept in sync so the search overlay always has data.

// 8 empty skeleton objects — same shape as real products, no content.
// The frontend renders these as grey placeholder cards while loading
// or when the backend connection is unavailable.
const SKELETON_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  id:       `skeleton-${i}`,
  slug:     '',
  name:     '',
  category: '',
  brand:    '',
  price:    0,
  oldPrice: null,
  rating:   null,
  reviews:  0,
  image:    '',
  images:   [],
  badge:    null,
  inStock:  false,
  desc:     '',
  specs:    {},
  sku:      '',
  skeleton: true, // flag so productCardHTML can render a skeleton style
}));

let products = [];
window.PRODUCTS = products;

// ===== FAQ DATA =====
// TODO (backend): Replace with api.getFaqs() if you add a CMS for FAQs.
const faqs = [
  { q: 'How do I place an order?', a: 'Browse our shop, add items to cart, and proceed to checkout. Payment is processed securely via Paystack.', cat: 'orders' },
  { q: 'What are your delivery options?', a: 'We offer same-day delivery within Lagos (orders before 12pm), and nationwide delivery in 3–5 business days via courier.', cat: 'orders' },
  { q: 'Can I track my order?', a: "Yes! Once shipped, you'll receive a tracking number via email and SMS. You can also check your dashboard under 'My Orders'.", cat: 'orders' },
  { q: 'How do I book a repair?', a: "Click 'Book Repair' from the menu, fill in your device details and issue, then submit. We'll contact you within 2 hours.", cat: 'repairs' },
  { q: 'How long does a repair take?', a: 'Most repairs are completed within 24 hours. Complex jobs may take 2–3 business days. You\'ll be updated at every stage.', cat: 'repairs' },
  { q: 'Do you offer a repair warranty?', a: 'Yes! All repair work carries a 30-day warranty. If the same issue occurs within 30 days, we fix it at no additional charge.', cat: 'repairs' },
  { q: 'Which payment methods do you accept?', a: 'We accept debit/credit cards, bank transfers, USSD, and bank account payments — all processed securely by Paystack.', cat: 'payments' },
  { q: 'Is my payment information safe?', a: 'Absolutely. All transactions are encrypted using SSL and processed by Paystack, which is PCI-DSS compliant. We never store card details.', cat: 'payments' },
  { q: 'Can I pay on delivery?', a: 'At the moment, we do not offer cash on delivery. All orders must be paid for online before dispatch.', cat: 'payments' },
  { q: 'What is your return policy?', a: 'You can return unused items in original packaging within 7 days of delivery for a full refund or exchange.', cat: 'returns' },
  { q: 'How long do refunds take?', a: 'Refunds are processed within 5–10 business days to the original payment method after we receive and inspect the returned item.', cat: 'returns' },
  { q: 'Do your products come with warranty?', a: "Yes, all products carry the manufacturer's warranty. Duration varies by product — typically 1 year for most electronics.", cat: 'returns' },
];

// ===== DEMO REPAIR TICKETS =====
// TODO (backend): Replace trackRepair() with api.trackRepair(ticketId)
const demoTickets = [
  { id: 'TF-20260001', device: 'Smartphone', brand: 'Samsung', model: 'Galaxy S23', issue: 'Screen Repair', name: 'John Doe', date: 'Feb 14, 2026', status: 'in-progress' },
  { id: 'TF-20260002', device: 'Laptop', brand: 'HP', model: 'Pavilion 15', issue: 'Battery Replacement', name: 'Ada Smith', date: 'Feb 12, 2026', status: 'completed' },
];

// ===== APP STATE =====
let cart = JSON.parse(localStorage.getItem('tfCart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('tfWishlist') || '[]');
let currentUser = JSON.parse(localStorage.getItem('tfUser') || 'null');
let tickets = JSON.parse(localStorage.getItem('tfTickets') || '[]');
let selectedDevice = 'Smartphone';
let selectedPayment = 'card';
let currentFaqCat = 'all';
let selectedCategory = 'All';

// ===== DERIVED DATA =====
let categories = ["All"];
let brands = [];


// ============================================================
// PAGE ROUTING  (multi-page)
// ============================================================
function showPage(id) {
  if (window.PAGES && window.PAGES[id]) window.location.href = window.PAGES[id];
}


// ============================================================
// PRODUCT RENDERING
// ============================================================
function productCardHTML(p) {
  // Skeleton card — shown when backend is offline or loading
  if (p.skeleton) {
    return `
      <div class="product-card product-card-skeleton" style="pointer-events:none;">
        <div class="product-img" style="background:var(--bg2);">
          <div style="width:120px;height:120px;background:var(--border);border-radius:8px;animation:skeletonPulse 1.5s ease-in-out infinite;"></div>
        </div>
        <div class="product-body">
          <div style="height:12px;width:50%;background:var(--border);border-radius:4px;margin-bottom:10px;animation:skeletonPulse 1.5s ease-in-out infinite;"></div>
          <div style="height:16px;width:85%;background:var(--border);border-radius:4px;margin-bottom:8px;animation:skeletonPulse 1.5s ease-in-out infinite;"></div>
          <div style="height:12px;width:60%;background:var(--border);border-radius:4px;margin-bottom:16px;animation:skeletonPulse 1.5s ease-in-out infinite;"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="height:20px;width:40%;background:var(--border);border-radius:4px;animation:skeletonPulse 1.5s ease-in-out infinite;"></div>
            <div style="width:36px;height:36px;background:var(--border);border-radius:50%;animation:skeletonPulse 1.5s ease-in-out infinite;"></div>
          </div>
        </div>
      </div>`;
  }

  // Real product card
  const inWishlist = wishlist.includes(p.id);
  return `
    <div class="product-card" onclick="openProduct('${p.slug || p.id}')">
      <div class="product-img">
        <div class="product-img-bg"></div>
        <img src="${p.image}" alt="${p.name}" style="width:120px;height:120px;object-fit:contain;position:relative;" onerror="this.src='https://placehold.co/120x120/0f1117/0ea5e9?text=TechFix'"/>
        ${p.badge ? `<div class="product-badge"><span class="badge badge-blue">${p.badge}</span></div>` : ''}
        <div class="product-wishlist ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlist('${p.id}',this)">
          <i class="fas fa-heart"></i>
        </div>
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          ${p.rating
            ? `<div class="star-rating">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</div>
               <span class="product-rating-count">(${p.reviews})</span>`
            : `<span style="font-size:12px;color:var(--text3);">No reviews yet</span>`
          }
        </div>
        <div class="product-footer">
          <div class="product-price-wrap">
            <span class="price">₦${p.price.toLocaleString()}</span>
            ${p.oldPrice ? `<span class="price-old">₦${p.oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="product-add" onclick="event.stopPropagation();addToCart('${p.id}')">
            <i class="fas fa-plus"></i>
          </div>
        </div>
      </div>
    </div>`;
}

function renderFeaturedProducts() {
  const grid = document.getElementById('homeFeaturedProducts');
  if (!grid) return;
  grid.innerHTML = products.slice(0, 8).map(productCardHTML).join('');
}


// ============================================================
// SHOP FILTERS
// ============================================================
function renderCategoryTabs() {
  const el = document.getElementById('categoryTabs');
  if (!el) return;
  el.innerHTML = categories.map(c =>
    `<div class="cat-tab ${c === selectedCategory ? 'active' : ''}" onclick="setCategory('${c}')">${c}</div>`
  ).join('');
}

function renderBrandFilters() {
  const el = document.getElementById('brandFilters');
  if (!el) return;
  el.innerHTML = brands.map(b =>
    `<label class="filter-option"><input type="checkbox" checked onchange="filterProducts()"> ${b}</label>`
  ).join('');
}

function setCategory(cat) {
  selectedCategory = cat;
  renderCategoryTabs();
  filterProducts();
}

function filterProducts() {
  const grid  = document.getElementById('shopProductGrid');
  const count = document.getElementById('shopCount');

  // If products are still skeletons (backend loading), show them as-is
  if (products.length > 0 && products[0].skeleton) {
    if (grid)  grid.innerHTML = products.map(productCardHTML).join('');
    if (count) count.textContent = 'Loading products...';
    return;
  }

  const search = (document.getElementById('shopSearch')?.value || '').toLowerCase();
  const maxPrice = parseInt(document.getElementById('priceRange')?.value || 2000000);
  const sort = document.getElementById('sortSelect')?.value || 'default';
  const checkedBrands = [...document.querySelectorAll('#brandFilters input:checked')].map(i => i.parentElement.textContent.trim());

  let filtered = products.filter(p => {
    const catMatch   = selectedCategory === 'All' || p.category === selectedCategory;
    const searchMatch = p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search);
    const priceMatch  = p.price <= maxPrice;
    const brandMatch  = checkedBrands.length === 0 || checkedBrands.includes(p.brand);
    return catMatch && searchMatch && priceMatch && brandMatch;
  });

  if (sort === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'name')   filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  if (grid) grid.innerHTML = filtered.length
    ? filtered.map(productCardHTML).join('')
    : '<p style="color:var(--text2);grid-column:1/-1;text-align:center;padding:40px;">No products found matching your filters.</p>';
  if (count) count.textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
}

function updatePrice(val) {
  document.getElementById('priceVal').textContent = parseInt(val).toLocaleString();
  filterProducts();
}

function clearFilters() {
  document.getElementById('shopSearch').value = '';
  document.getElementById('priceRange').value = 2000000;
  document.getElementById('priceVal').textContent = '1,000,000';
  document.getElementById('sortSelect').value = 'default';
  selectedCategory = 'All';
  document.querySelectorAll('#brandFilters input').forEach(i => i.checked = true);
  renderCategoryTabs();
  filterProducts();
}


// ============================================================
// PRODUCT DETAIL MODAL
// ============================================================
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('productDetailContent').innerHTML = `
    <div>
      <div class="product-detail-img" style="display:flex;align-items:center;justify-content:center;background:var(--bg2);border-radius:16px;padding:24px;">
        <img src="${p.image}" alt="${p.name}" style="width:220px;height:220px;object-fit:contain;"/>
      </div>
      <div class="product-thumbnails">
        ${[0,1,2,3].map((i) =>
          `<div class="thumb ${i === 0 ? 'active' : ''}" style="display:flex;align-items:center;justify-content:center;background:var(--bg2);">
            <img src="${p.image}" alt="" style="width:36px;height:36px;object-fit:contain;opacity:${i===0?1:0.4};"/>
          </div>`
        ).join('')}
      </div>
    </div>
    <div>
      <div class="product-category" style="margin-bottom:8px;">${p.category} • ${p.brand}</div>
      <div class="product-detail-name">${p.name}</div>
      <div class="product-rating" style="margin-bottom:14px;">
        <div class="star-rating">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</div>
        <span style="font-size:13px;color:var(--text2);">${p.rating} (${p.reviews} reviews)</span>
      </div>
      <div class="product-detail-price">
        ₦${p.price.toLocaleString()}
        ${p.oldPrice ? `<s style="color:var(--text3);font-size:15px;margin-left:8px;">₦${p.oldPrice.toLocaleString()}</s>` : ''}
      </div>
      <p style="color:var(--text2);font-size:14px;margin-bottom:20px;line-height:1.7;">${p.desc}</p>
      <div style="margin-bottom:20px;">
        ${Object.entries(p.specs).map(([k, v]) =>
          `<div class="product-spec"><span class="product-spec-label">${k}</span><span style="font-weight:600;">${v}</span></div>`
        ).join('')}
      </div>
      <span class="badge badge-green" style="margin-bottom:16px;"><i class="fas fa-check" style="margin-right:4px;"></i> In Stock</span>
      <div style="display:flex;gap:12px;margin-top:16px;">
        <button class="btn btn-primary" style="flex:2;justify-content:center;" onclick="addToCart(${p.id});closeModal('productModal')">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
        <button class="btn btn-outline" onclick="toggleWishlistById(${p.id})"><i class="fas fa-heart"></i></button>
      </div>
    </div>`;
  openModal('productModal');
}


// ============================================================
// CART
// ============================================================
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  renderCart();
  showToast(`${p.name} added to cart!`, 'success');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(id); return; }
  }
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('tfCart', JSON.stringify(cart));
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const count = document.getElementById('cartItemCount');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  if (count) count.textContent = `(${itemCount} item${itemCount !== 1 ? 's' : ''})`;
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  if (subtotalEl) subtotalEl.textContent = `₦${total.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}`;

  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
        <button class="btn btn-outline btn-sm" style="margin-top:16px;" onclick="closeCart();window.location.href=window.PAGES ? window.PAGES.shop : '/frontend/public/shop.html'">Start Shopping</button>
      </div>`;
    return;
  }

  body.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-img" style="display:flex;align-items:center;justify-content:center;background:var(--bg2);">
        <img src="${i.image}" alt="${i.name}" style="width:44px;height:44px;object-fit:contain;"/>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">₦${i.price.toLocaleString()}</div>
        <div class="cart-qty">
          <div class="qty-btn" onclick="updateQty(${i.id},-1)">−</div>
          <div class="qty-num">${i.qty}</div>
          <div class="qty-btn" onclick="updateQty(${i.id},1)">+</div>
        </div>
      </div>
      <i class="fas fa-trash cart-remove" onclick="removeFromCart(${i.id})"></i>
    </div>`).join('');
}

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
}


// ============================================================
// WISHLIST
// ============================================================
function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
    btn.classList.remove('active');
    showToast('Removed from wishlist', 'info');
  } else {
    wishlist.push(id);
    btn.classList.add('active');
    showToast('Added to wishlist!', 'success');
  }
  localStorage.setItem('tfWishlist', JSON.stringify(wishlist));
}

function toggleWishlistById(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
    showToast('Removed from wishlist', 'info');
  } else {
    wishlist.push(id);
    showToast('Added to wishlist!', 'success');
  }
  localStorage.setItem('tfWishlist', JSON.stringify(wishlist));
}


// ============================================================
// CHECKOUT
// ============================================================
function openCheckout() {
  if (!cart.length) { showToast('Your cart is empty', 'error'); return; }
  closeCart();
  openModal('checkoutModal');
  document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
  document.getElementById('chkStep1').classList.add('active');
}

function checkoutNext(step) {
  if (step === 2) {
    const first = document.getElementById('chkFirst').value;
    const email = document.getElementById('chkEmail').value;
    const address = document.getElementById('chkAddress').value;
    if (!first || !email || !address) { showToast('Please fill in all required fields', 'error'); return; }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('checkoutSummary').innerHTML =
      cart.map(i => `<div class="order-row"><span>${i.name} x${i.qty}</span><span>₦${(i.price * i.qty).toLocaleString()}</span></div>`).join('') +
      `<div class="order-row total"><span>Total</span><span>₦${total.toLocaleString()}</span></div>`;
  }
  document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`chkStep${step}`).classList.add('active');
}

function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
  document.getElementById(`pm-${method}`).classList.add('selected');
  document.getElementById('cardFields').style.display = method === 'card' ? 'block' : 'none';
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

async function processPayment() {
  if (!cart.length) return;
  showToast('Processing payment...', 'info');
  const first   = document.getElementById('chkFirst')?.value;
  const last    = document.getElementById('chkLast')?.value;
  const email   = document.getElementById('chkEmail')?.value;
  const phone   = document.getElementById('chkPhone')?.value;
  const address = document.getElementById('chkAddress')?.value;
  const state   = document.getElementById('chkState')?.value;

  const orderPayload = {
    items: cart.map(i => ({ productId: i.id, quantity: i.qty })),
    shippingAddress: { firstName: first, lastName: last, email, phone, address, state },
  };

  // createOrder already initializes Paystack and returns paymentUrl
  const orderRes = await api.createOrder(orderPayload);
  if (!orderRes.ok) { showToast(orderRes.error || 'Failed to place order', 'error'); return; }

  if (orderRes.data.paymentUrl) {
    window.location.href = orderRes.data.paymentUrl;
  } else {
    cart = [];
    saveCart();
    renderCart();
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    const step3 = document.getElementById('chkStep3');
    if (step3) step3.classList.add('active');
    showToast('Order placed successfully!', 'success');
  }
}


// ============================================================
// AUTHENTICATION
// ============================================================
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function switchAuthTab(tab) {
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('loginTabBtn').classList.toggle('active', tab === 'login');
  document.getElementById('registerTabBtn').classList.toggle('active', tab === 'register');
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass  = document.getElementById('loginPassword').value;
  if (!email || !pass) { showToast('Please enter email and password', 'error'); return; }

  const res = await api.login(email, pass);
  if (!res.ok) { showToast(res.error, 'error'); return; }

  localStorage.setItem('tfToken', res.data.token);
  currentUser = res.data.user;
  localStorage.setItem('tfUser', JSON.stringify(currentUser));
  closeModal('authModal');
  showToast(`Welcome back, ${currentUser.firstName}!`, 'success');
  updateNavUser();
}

async function handleRegister() {
  const first   = document.getElementById('regFirst').value;
  const last    = document.getElementById('regLast').value;
  const email   = document.getElementById('regEmail').value;
  const phone   = document.getElementById('regPhone').value;
  const pass    = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  if (!first || !last || !email || !pass) { showToast('Please fill in all fields', 'error'); return; }
  if (pass !== confirm) { showToast('Passwords do not match', 'error'); return; }
  if (pass.length < 8)  { showToast('Password must be at least 8 characters', 'error'); return; }

  const res = await api.register({ firstName: first, lastName: last, email, phone, password: pass });
  if (!res.ok) { showToast(res.error, 'error'); return; }

  localStorage.setItem('tfToken', res.data.token);
  currentUser = res.data.user;
  localStorage.setItem('tfUser', JSON.stringify(currentUser));
  closeModal('authModal');
  showToast(`Welcome, ${first}! Account created successfully.`, 'success');
  updateNavUser();
}

function handleUserNav() {
  if (currentUser) window.location.href = window.PAGES ? window.PAGES.dashboard : '/frontend/public/dashboard.html';
  else openModal('authModal');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('tfUser');
  localStorage.removeItem('tfToken');
  window.location.href = window.PAGES ? window.PAGES.home : '/frontend/index.html';
}

async function showForgotPassword() {
  const email = document.getElementById('loginEmail').value;
  if (!email) { showToast('Enter your email first', 'error'); return; }
  await api.forgotPassword(email);
  showToast('Password reset link sent to your email!', 'success');
}

function updateNavUser() {
  const btn = document.getElementById('userNavBtn');
  if (!btn) return;
  btn.innerHTML = currentUser
    ? '<i class="fas fa-user-check" style="color:var(--accent);"></i>'
    : '<i class="fas fa-user"></i>';
}


// ============================================================
// USER DASHBOARD
// ============================================================
async function updateDashboard() {
  if (!currentUser) return;

  const uname    = document.getElementById('dashUsername');
  const fullName = document.getElementById('dashFullName');
  const dEmail   = document.getElementById('dashEmail');
  const avatar   = document.getElementById('dashAvatar');
  if (uname)    uname.textContent    = currentUser.firstName || currentUser.name;
  if (fullName) fullName.textContent = currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`;
  if (dEmail)   dEmail.textContent   = currentUser.email;
  if (avatar)   avatar.textContent   = (currentUser.firstName?.[0] || 'U') + (currentUser.lastName?.[0] || 'U');

  const pFirst = document.getElementById('profileFirst');
  const pLast  = document.getElementById('profileLast');
  const pEmail = document.getElementById('profileEmail');
  if (pFirst) pFirst.value = currentUser.firstName || '';
  if (pLast)  pLast.value  = currentUser.lastName  || '';
  if (pEmail) pEmail.value = currentUser.email     || '';

  // Load real orders
  const ordersEl = document.getElementById('ordersList');
  if (ordersEl) {
    const ordRes = await api.getMyOrders();
    if (ordRes.ok && ordRes.data.length) {
      ordersEl.innerHTML = ordRes.data.map(o => `
        <div class="order-card" style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-weight:700;">${o.orderRef}</div>
              <div style="font-size:13px;color:var(--text2);">${new Date(o.createdAt).toLocaleDateString('en-NG')}</div>
            </div>
            <span class="badge ${o.status === 'delivered' ? 'badge-green' : o.status === 'cancelled' ? 'badge-red' : 'badge-blue'}">${o.status}</span>
          </div>
          <div style="font-size:14px;margin-top:8px;font-weight:600;">₦${parseFloat(o.totalAmount).toLocaleString()}</div>
        </div>`).join('');
    } else {
      ordersEl.innerHTML = '<p style="color:var(--text2);text-align:center;padding:24px;">No orders yet.</p>';
    }
  }

  // Load real repairs
  const repairsEl = document.getElementById('repairsList');
  if (repairsEl) {
    const repRes = await api.getMyRepairs();
    if (repRes.ok && repRes.data.length) {
      repairsEl.innerHTML = repRes.data.map(r => `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-weight:700;">${r.ticketRef}</div>
              <div style="font-size:13px;color:var(--text2);">${r.brand} ${r.model} — ${r.issue}</div>
            </div>
            <span class="badge ${r.status === 'completed' ? 'badge-green' : 'badge-orange'}">${r.status.replace('_', ' ')}</span>
          </div>
        </div>`).join('');
    } else {
      repairsEl.innerHTML = '<p style="color:var(--text2);text-align:center;padding:24px;">No repair bookings yet.</p>';
    }
  }

  // Wishlist
  if (products.length === 0) await loadProducts();
  const wishGrid = document.getElementById('wishlistGrid');
  if (wishGrid) {
    const wishProducts = products.filter(p => wishlist.includes(p.id));
    wishGrid.innerHTML = wishProducts.length
      ? wishProducts.map(productCardHTML).join('')
      : `<p style="color:var(--text2);grid-column:1/-1;text-align:center;padding:40px;">Your wishlist is empty. <a href="/frontend/public/shop.html" style="color:var(--accent);">Browse products →</a></p>`;
  }
}

function showDash(section) {
  document.querySelectorAll('.dashboard-main').forEach(d => d.classList.remove('active'));
  document.querySelectorAll('.dash-nav-item').forEach(d => d.classList.remove('active'));
  const target = document.getElementById(`dash-${section}`);
  if (target) target.classList.add('active');
  document.querySelectorAll('.dash-nav-item').forEach(d => {
    if (d.getAttribute('onclick')?.includes(section)) d.classList.add('active');
  });
}

async function saveProfile() {
  if (!currentUser) return;
  const payload = {
    firstName: document.getElementById('profileFirst').value,
    lastName:  document.getElementById('profileLast').value,
    email:     document.getElementById('profileEmail').value,
  };
  const res = await api.updateProfile(payload);
  if (!res.ok) { showToast('Failed to update profile', 'error'); return; }
  currentUser = { ...currentUser, ...payload, name: `${payload.firstName} ${payload.lastName}` };
  localStorage.setItem('tfUser', JSON.stringify(currentUser));
  showToast('Profile updated successfully!', 'success');
  updateDashboard();
}


// ============================================================
// REPAIR BOOKING
// ============================================================
function selectDevice(el, device) {
  selectedDevice = device;
  document.querySelectorAll('.device-option').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
}

function bookingNext(step) {
  if (step === 2) {
    const brand = document.getElementById('deviceBrand').value;
    const model = document.getElementById('deviceModel').value;
    if (!brand || !model) { showToast('Please select brand and enter model', 'error'); return; }
  }
  if (step === 3) {
    const issue = document.getElementById('issueType').value;
    if (!issue) { showToast('Please select the issue type', 'error'); return; }
  }
  [1, 2, 3].forEach(s => {
    document.getElementById(`bookStep${s}`).style.display = s === step ? 'block' : 'none';
    const stepEl = document.getElementById(`bStep${s}`);
    if (stepEl) {
      stepEl.classList.remove('active', 'done');
      if (s < step) stepEl.classList.add('done');
      else if (s === step) stepEl.classList.add('active');
    }
    const lineEl = document.getElementById(`bLine${s}`);
    if (lineEl) lineEl.classList.toggle('active', s < step);
  });
  window.scrollTo(0, 0);
}

async function submitRepairBooking() {
  const first = document.getElementById('repairFirstName').value;
  const email = document.getElementById('repairEmail').value;
  const phone = document.getElementById('repairPhone').value;
  if (!first || !email || !phone) { showToast('Please fill in all required fields', 'error'); return; }

  const payload = {
    customerName:     first + ' ' + document.getElementById('repairLastName').value,
    customerEmail:    email,
    customerPhone:    phone,
    deviceType:       selectedDevice,
    deviceBrand:      document.getElementById('deviceBrand').value,
    deviceModel:      document.getElementById('deviceModel').value,
    issueType:        document.getElementById('issueType').value,
    issueDescription: document.getElementById('issueDesc').value,
  };

  const res = await api.bookRepair(payload);
  if (!res.ok) { showToast(res.error || 'Failed to submit booking', 'error'); return; }

  document.getElementById('ticketIdDisplay').textContent = res.data.ticketRef;
  [1, 2, 3].forEach(s => document.getElementById(`bookStep${s}`).style.display = 'none');
  document.getElementById('bookingSuccess').style.display = 'block';
  showToast('Repair booking submitted!', 'success');
}

function handleImageUpload(input) {
  const container = document.getElementById('uploadedImages');
  container.innerHTML = '';
  [...input.files].forEach(f => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.style.cssText = 'width:60px;height:60px;border-radius:8px;overflow:hidden;border:2px solid var(--accent);';
      div.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;"/>`;
      container.appendChild(div);
    };
    reader.readAsDataURL(f);
  });
}


// ============================================================
// REPAIR TRACKING
// ============================================================
async function trackRepair() {
  const input  = document.getElementById('trackInput').value.trim().toUpperCase();
  const result = document.getElementById('trackResult');
  const empty  = document.getElementById('trackEmpty');
  if (!input) { showToast('Please enter a ticket ID', 'error'); return; }

  if (empty) empty.style.display = 'none';
  result.style.display = 'block';
  result.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text2);"><i class="fas fa-spinner fa-spin" style="font-size:28px;"></i></div>';

  const res = await api.trackRepair(input);

  if (!res.ok || !res.data) {
    result.innerHTML = `
      <div style="text-align:center;padding:32px;color:var(--text2);">
        <i class="fas fa-search" style="font-size:36px;color:var(--text3);display:block;margin-bottom:12px;"></i>
        <p>No repair found with ticket ID "<strong>${input}</strong>". Please check and try again.</p>
      </div>`;
    return;
  }

  const found = res.data;
  const steps = ['Received', 'Diagnosed', 'Repair In Progress', 'Quality Check', 'Ready for Collection'];
  const statusMap = { completed: ['done','done','done','done','done'], in_progress: ['done','done','active','',''], pending: ['active','','','',''] };
  const statuses = statusMap[found.status] || ['active','','','',''];
  const badgeClass = found.status === 'completed' ? 'badge-green' : found.status === 'in_progress' ? 'badge-orange' : 'badge-blue';
  const badgeLabel = found.status === 'in_progress' ? 'In Progress' : found.status.charAt(0).toUpperCase() + found.status.slice(1);

  result.innerHTML = `
    <div class="ticket-card">
      <div class="ticket-header">
        <div>
          <div class="ticket-id">${found.ticketRef}</div>
          <div style="font-size:13px;color:var(--text2);">${found.brand} ${found.model} — ${found.issue}</div>
          <div style="font-size:12px;color:var(--text3);">Submitted: ${found.date} | Customer: ${found.name}</div>
        </div>
        <span class="badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <div class="progress-track">
        <div class="progress-line"></div>
        ${steps.map((s, i) => `
          <div class="progress-step ${statuses[i]}">
            <div class="progress-dot"></div>
            <div class="progress-step-title">${s}</div>
          </div>`).join('')}
      </div>
    </div>`;
}


// ============================================================
// FAQ
// ============================================================
function renderFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;
  const filtered = currentFaqCat === 'all' ? faqs : faqs.filter(f => f.cat === currentFaqCat);
  list.innerHTML = filtered.map((f, i) => `
    <div class="faq-item">
      <button class="faq-question" onclick="toggleFaq(${i})">
        ${f.q} <i class="fas fa-chevron-down faq-icon" id="faqIcon${i}"></i>
      </button>
      <div class="faq-answer" id="faqAnswer${i}">
        <div class="faq-answer-inner">${f.a}</div>
      </div>
    </div>`).join('');
}

function toggleFaq(i) {
  const ans  = document.getElementById(`faqAnswer${i}`);
  const icon = document.getElementById(`faqIcon${i}`);
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(ic => ic.style.transform = '');
  if (!isOpen) { ans.classList.add('open'); icon.style.transform = 'rotate(180deg)'; }
}

function setFaqCat(el, cat) {
  currentFaqCat = cat;
  document.querySelectorAll('.faq-categories .cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderFaq();
}


// ============================================================
// CONTACT FORM
// ============================================================
async function submitContact() {
  const first = document.getElementById('cFirstName').value;
  const email = document.getElementById('cEmail').value;
  const msg   = document.getElementById('cMessage').value;
  if (!first || !email || !msg) { showToast('Please fill in all required fields', 'error'); return; }
  await api.sendMessage({ firstName: first, lastName: document.getElementById('cLastName').value, email, phone: document.getElementById('cPhone').value, subject: document.getElementById('cSubject').value, message: msg });
  showToast("Message sent! We'll get back to you shortly.", 'success');
  ['cFirstName','cLastName','cEmail','cPhone','cMessage'].forEach(id => document.getElementById(id).value = '');
}


// ============================================================
// NEWSLETTER
// ============================================================
async function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value;
  if (!email || !email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
  await api.subscribe(email);
  showToast('Subscribed! Welcome to the TechFix family 🎉', 'success');
  document.getElementById('newsletterEmail').value = '';
}


// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}


// ============================================================
// LOAD PRODUCTS FROM API
// ============================================================
async function loadProducts() {
  // Show skeletons immediately while fetching
  products = [...SKELETON_PRODUCTS];
  window.PRODUCTS = products;
  filterProducts();

  const res = await api.getProducts();
  if (res.ok && res.data.length > 0) {
    products = res.data;
    console.log(`✅ Loaded ${products.length} products from API`);
  } else {
    // Keep skeletons visible — backend offline
    console.warn('⚠️ API unavailable — showing skeleton cards');
  }
  window.PRODUCTS = products;
  categories = ['All', ...new Set(products.filter(p => !p.skeleton).map(p => p.category))];
  brands     = [...new Set(products.filter(p => !p.skeleton).map(p => p.brand))];
  // Re-render with real data (or keep skeletons if offline)
  renderCategoryTabs();
  renderBrandFilters();
  filterProducts();
}

async function loadFeaturedProducts() {
  // Show skeletons immediately while fetching
  products = [...SKELETON_PRODUCTS];
  window.PRODUCTS = products;
  renderFeaturedProducts();

  const res = await api.getFeaturedProducts();
  if (res.ok && res.data.length > 0) {
    products = res.data;
    console.log(`✅ Loaded ${products.length} featured products from API`);
    window.PRODUCTS = products;
    renderFeaturedProducts();
  } else {
    console.warn('⚠️ API unavailable — showing skeleton cards');
  }
}


// ============================================================
// PAGE AUTO-INIT
// ============================================================
(async function initPage() {
  const page = document.body.dataset.page || 'home';

  saveCart();
  if (currentUser) updateNavUser();

  if (page === 'home') {
    await loadFeaturedProducts();
  }

  if (page === 'shop') {
    await loadProducts();
    renderCategoryTabs();
    renderBrandFilters();
    filterProducts();
  }

  if (page === 'faq') renderFaq();

  if (page === 'dashboard') {
    if (!currentUser) { window.location.href = window.PAGES ? window.PAGES.home : '/frontend/index.html'; return; }
    await updateDashboard();
    showDash('overview');
  }
})();