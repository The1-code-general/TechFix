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
// TODO (backend): Replace with api.getProducts() on page load.
const products = [
  {
    id: 1, name: 'iPhone 15 Pro', category: 'Smartphones', brand: 'Apple',
    price: 850000, oldPrice: 900000, rating: 4.9, reviews: 234,
    image: 'https://placehold.co/400x400/0f1117/0ea5e9?text=iPhone+15+Pro',
    badge: 'Hot', inStock: true,
    desc: '6.1" Super Retina XDR display, A17 Pro chip, 48MP camera system, USB-C connectivity.',
    specs: { Display: '6.1" OLED', Processor: 'A17 Pro', RAM: '8GB', Storage: '256GB', Battery: '3274mAh', OS: 'iOS 17' }
  },
  {
    id: 2, name: 'Samsung Galaxy S24', category: 'Smartphones', brand: 'Samsung',
    price: 720000, oldPrice: null, rating: 4.8, reviews: 189,
    image: 'https://placehold.co/400x400/0f1117/0ea5e9?text=Galaxy+S24',
    badge: 'New', inStock: true,
    desc: '6.2" Dynamic AMOLED 2X, Snapdragon 8 Gen 3, 50MP camera, 25W fast charging.',
    specs: { Display: '6.2" AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '8GB', Storage: '256GB', Battery: '4000mAh', OS: 'Android 14' }
  },
  {
    id: 3, name: 'MacBook Air M3', category: 'Laptops', brand: 'Apple',
    price: 1250000, oldPrice: 1350000, rating: 4.9, reviews: 112,
    image: 'https://placehold.co/400x400/0f1117/0ea5e9?text=MacBook+Air+M3',
    badge: 'Sale', inStock: true,
    desc: '13.6" Liquid Retina display, M3 chip, up to 18hr battery, fanless design.',
    specs: { Display: '13.6" Liquid Retina', Processor: 'Apple M3', RAM: '8GB', Storage: '256GB SSD', Battery: '18 hours', OS: 'macOS Sonoma' }
  },
  {
    id: 4, name: 'AirPods Pro 2nd Gen', category: 'Accessories', brand: 'Apple',
    price: 120000, oldPrice: null, rating: 4.8, reviews: 308,
    image: 'https://placehold.co/400x400/0f1117/0ea5e9?text=AirPods+Pro',
    badge: null, inStock: true,
    desc: 'Active Noise Cancellation, Transparency mode, Adaptive Audio, MagSafe charging.',
    specs: { Type: 'In-Ear ANC', Battery: '6hrs + 30hrs case', Water: 'IPX4', Chip: 'H2', Connectivity: 'Bluetooth 5.3', Case: 'MagSafe' }
  },
  {
    id: 5, name: 'Samsung Galaxy Tab S9', category: 'Tablets', brand: 'Samsung',
    price: 380000, oldPrice: 420000, rating: 4.7, reviews: 76,
    image: 'https://placehold.co/400x400/0f1117/0ea5e9?text=Galaxy+Tab+S9',
    badge: 'Sale', inStock: true,
    desc: '11" Dynamic AMOLED, Snapdragon 8 Gen 2, 256GB storage, S-Pen included.',
    specs: { Display: '11" AMOLED', Processor: 'Snapdragon 8 Gen 2', RAM: '8GB', Storage: '256GB', Battery: '8400mAh', OS: 'Android 13' }
  },
  {
    id: 6, name: 'HP Pavilion 15', category: 'Laptops', brand: 'HP',
    price: 480000, oldPrice: null, rating: 4.5, reviews: 93,
    image: 'https://placehold.co/400x400/0f1117/0ea5e9?text=HP+Pavilion+15',
    badge: 'New', inStock: true,
    desc: 'Intel Core i5 13th Gen, 8GB RAM, 512GB SSD, Full HD IPS display.',
    specs: { Display: '15.6" FHD IPS', Processor: 'Intel i5-1335U', RAM: '8GB DDR4', Storage: '512GB SSD', Battery: '41Wh', OS: 'Windows 11' }
  },
  {
    id: 7, name: 'Tecno Camon 30', category: 'Smartphones', brand: 'Tecno',
    price: 185000, oldPrice: null, rating: 4.4, reviews: 142,
    image: 'https://placehold.co/400x400/0f1117/0ea5e9?text=Tecno+Camon+30',
    badge: null, inStock: true,
    desc: '6.78" AMOLED, 50MP OIS camera, Dimensity 8050, 5000mAh battery, 33W charging.',
    specs: { Display: '6.78" AMOLED', Processor: 'Dimensity 8050', RAM: '8GB', Storage: '256GB', Battery: '5000mAh', OS: 'Android 14' }
  },
  {
    id: 8, name: 'Anker PowerCore 26800', category: 'Accessories', brand: 'Anker',
    price: 42000, oldPrice: null, rating: 4.6, reviews: 201,
    image: 'https://placehold.co/400x400/0f1117/0ea5e9?text=Anker+PowerCore',
    badge: null, inStock: true,
    desc: '26800mAh power bank, 65W PD, charges up to 3 devices simultaneously.',
    specs: { Capacity: '26800mAh', Output: '65W PD', Ports: '2x USB-A, 1x USB-C', Weight: '620g', Warranty: '18 months', Certified: 'FCC, CE' }
  },
];

// Expose products globally so components.js search overlay can access them
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
const categories = ['All', ...new Set(products.map(p => p.category))];
const brands = [...new Set(products.map(p => p.brand))];


// ============================================================
// PAGE ROUTING  (multi-page)
// ============================================================
function showPage(id) {
  const pageMap = {
    home:      '/index.html',
    shop:      '/public/shop.html',
    repair:    '/public/repair.html',
    track:     '/public/track.html',
    services:  '/public/services.html',
    about:     '/public/about.html',
    contact:   '/public/contact.html',
    faq:       '/public/faq.html',
    terms:     '/public/terms.html',
    dashboard: '/public/dashboard.html',
  };
  if (pageMap[id]) window.location.href = pageMap[id];
}


// ============================================================
// PRODUCT RENDERING
// ============================================================
function productCardHTML(p) {
  const inWishlist = wishlist.includes(p.id);
  return `
    <div class="product-card" onclick="openProduct(${p.id})">
      <div class="product-img">
        <div class="product-img-bg"></div>
        <img src="${p.image}" alt="${p.name}" style="width:120px;height:120px;object-fit:contain;position:relative;"/>
        ${p.badge ? `<div class="product-badge"><span class="badge badge-blue">${p.badge}</span></div>` : ''}
        <div class="product-wishlist ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlist(${p.id},this)">
          <i class="fas fa-heart"></i>
        </div>
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <div class="star-rating">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</div>
          <span class="product-rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price-wrap">
            <span class="price">₦${p.price.toLocaleString()}</span>
            ${p.oldPrice ? `<span class="price-old">₦${p.oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="product-add" onclick="event.stopPropagation();addToCart(${p.id})">
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
  const search = (document.getElementById('shopSearch')?.value || '').toLowerCase();
  const maxPrice = parseInt(document.getElementById('priceRange')?.value || 2000000);
  const sort = document.getElementById('sortSelect')?.value || 'default';
  const checkedBrands = [...document.querySelectorAll('#brandFilters input:checked')].map(i => i.parentElement.textContent.trim());

  let filtered = products.filter(p => {
    const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const searchMatch = p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search);
    const priceMatch = p.price <= maxPrice;
    const brandMatch = checkedBrands.includes(p.brand);
    return catMatch && searchMatch && priceMatch && brandMatch;
  });

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const grid = document.getElementById('shopProductGrid');
  const count = document.getElementById('shopCount');
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
        <button class="btn btn-outline btn-sm" style="margin-top:16px;" onclick="closeCart();window.location.href='/public/shop.html'">Start Shopping</button>
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

function processPayment() {
  // TODO (backend): Call api.createOrder() here, then redirect to Paystack
  showToast('Processing payment...', 'info');
  setTimeout(() => {
    cart = [];
    saveCart();
    renderCart();
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.getElementById('chkStep3').classList.add('active');
  }, 2000);
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

function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;
  if (!email || !pass) { showToast('Please enter email and password', 'error'); return; }

  // TODO (backend): Replace below with:
  // const res = await api.login(email, pass);
  currentUser = { email, name: email.split('@')[0], firstName: email.split('@')[0], lastName: 'User' };
  localStorage.setItem('tfUser', JSON.stringify(currentUser));
  closeModal('authModal');
  showToast("Welcome back! You're signed in.", 'success');
  updateNavUser();
}

function handleRegister() {
  const first = document.getElementById('regFirst').value;
  const last = document.getElementById('regLast').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  if (!first || !last || !email || !pass) { showToast('Please fill in all fields', 'error'); return; }
  if (pass !== confirm) { showToast('Passwords do not match', 'error'); return; }
  if (pass.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }

  // TODO (backend): Replace below with:
  // const res = await api.register({ firstName: first, lastName: last, email, password: pass });
  currentUser = { email, name: `${first} ${last}`, firstName: first, lastName: last };
  localStorage.setItem('tfUser', JSON.stringify(currentUser));
  closeModal('authModal');
  showToast(`Welcome, ${first}! Account created successfully.`, 'success');
  updateNavUser();
}

function handleUserNav() {
  if (currentUser) window.location.href = '/public/dashboard.html';
  else openModal('authModal');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('tfUser');
  localStorage.removeItem('tfToken');
  window.location.href = '/index.html';
}

function showForgotPassword() {
  // TODO (backend): Call api.forgotPassword(email)
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
function updateDashboard() {
  if (!currentUser) return;
  // TODO (backend): Fetch real orders with api.getMyOrders() and repairs with api.getMyRepairs()
  const uname = document.getElementById('dashUsername');
  const fullName = document.getElementById('dashFullName');
  const dEmail = document.getElementById('dashEmail');
  const avatar = document.getElementById('dashAvatar');
  if (uname) uname.textContent = currentUser.firstName || currentUser.name;
  if (fullName) fullName.textContent = currentUser.name;
  if (dEmail) dEmail.textContent = currentUser.email;
  if (avatar) avatar.textContent = (currentUser.firstName?.[0] || 'U') + (currentUser.lastName?.[0] || 'U');

  const pFirst = document.getElementById('profileFirst');
  const pLast = document.getElementById('profileLast');
  const pEmail = document.getElementById('profileEmail');
  if (pFirst) pFirst.value = currentUser.firstName || '';
  if (pLast) pLast.value = currentUser.lastName || '';
  if (pEmail) pEmail.value = currentUser.email || '';

  const wishGrid = document.getElementById('wishlistGrid');
  if (wishGrid) {
    const wishProducts = products.filter(p => wishlist.includes(p.id));
    wishGrid.innerHTML = wishProducts.length
      ? wishProducts.map(productCardHTML).join('')
      : `<p style="color:var(--text2);grid-column:1/-1;text-align:center;padding:40px;">Your wishlist is empty. <a href="/public/shop.html" style="color:var(--accent);">Browse products →</a></p>`;
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

function saveProfile() {
  if (!currentUser) return;
  currentUser.firstName = document.getElementById('profileFirst').value;
  currentUser.lastName = document.getElementById('profileLast').value;
  currentUser.name = `${currentUser.firstName} ${currentUser.lastName}`;
  currentUser.email = document.getElementById('profileEmail').value;
  localStorage.setItem('tfUser', JSON.stringify(currentUser));
  // TODO (backend): await api.updateProfile(currentUser)
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

function submitRepairBooking() {
  const first = document.getElementById('repairFirstName').value;
  const email = document.getElementById('repairEmail').value;
  const phone = document.getElementById('repairPhone').value;
  if (!first || !email || !phone) { showToast('Please fill in all required fields', 'error'); return; }

  const ticketId = 'TF-' + new Date().getFullYear() + String(Math.floor(Math.random() * 9000) + 1000);
  const ticket = {
    id: ticketId,
    device: selectedDevice,
    brand: document.getElementById('deviceBrand').value,
    model: document.getElementById('deviceModel').value,
    issue: document.getElementById('issueType').value,
    desc: document.getElementById('issueDesc').value,
    name: first + ' ' + document.getElementById('repairLastName').value,
    email, phone,
    date: new Date().toLocaleDateString(),
    status: 'pending'
  };

  // TODO (backend): Replace below with:
  // const res = await api.bookRepair(ticket);
  tickets.push(ticket);
  localStorage.setItem('tfTickets', JSON.stringify(tickets));
  document.getElementById('ticketIdDisplay').textContent = ticketId;
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
function trackRepair() {
  const input = document.getElementById('trackInput').value.trim().toUpperCase();
  const result = document.getElementById('trackResult');
  const empty = document.getElementById('trackEmpty');

  // TODO (backend): Replace below with:
  // const res = await api.trackRepair(input);
  const allTickets = [...demoTickets, ...tickets];
  const found = allTickets.find(t => t.id.toUpperCase() === input);

  if (empty) empty.style.display = 'none';

  if (!found) {
    result.style.display = 'block';
    result.innerHTML = `
      <div style="text-align:center;padding:32px;color:var(--text2);">
        <i class="fas fa-search" style="font-size:36px;color:var(--text3);display:block;margin-bottom:12px;"></i>
        <p>No repair found with ticket ID "<strong>${input}</strong>". Please check and try again.</p>
      </div>`;
    return;
  }

  const steps = ['Received', 'Diagnosed', 'Repair In Progress', 'Quality Check', 'Ready for Collection'];
  const statuses = found.status === 'completed'
    ? steps.map(() => 'done')
    : found.status === 'in-progress'
      ? ['done', 'done', 'active', '', '']
      : ['active', '', '', '', ''];

  result.style.display = 'block';
  result.innerHTML = `
    <div class="ticket-card">
      <div class="ticket-header">
        <div>
          <div class="ticket-id">${found.id}</div>
          <div style="font-size:13px;color:var(--text2);">${found.brand} ${found.model} — ${found.issue}</div>
          <div style="font-size:12px;color:var(--text3);">Submitted: ${found.date} | Customer: ${found.name}</div>
        </div>
        <span class="badge ${found.status === 'completed' ? 'badge-green' : found.status === 'in-progress' ? 'badge-orange' : 'badge-blue'}">
          ${found.status === 'in-progress' ? 'In Progress' : found.status.charAt(0).toUpperCase() + found.status.slice(1)}
        </span>
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
  const ans = document.getElementById(`faqAnswer${i}`);
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
function submitContact() {
  const first = document.getElementById('cFirstName').value;
  const email = document.getElementById('cEmail').value;
  const msg = document.getElementById('cMessage').value;
  if (!first || !email || !msg) { showToast('Please fill in all required fields', 'error'); return; }
  // TODO (backend): await api.sendMessage({ firstName: first, email, message: msg, ... })
  showToast("Message sent! We'll get back to you shortly.", 'success');
  ['cFirstName', 'cLastName', 'cEmail', 'cPhone', 'cMessage'].forEach(id => document.getElementById(id).value = '');
}


// ============================================================
// NEWSLETTER
// ============================================================
function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value;
  if (!email || !email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
  // TODO (backend): await api.subscribe(email)
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
// PAGE AUTO-INIT
// ============================================================
(function initPage() {
  const page = document.body.dataset.page || 'home';

  saveCart();
  if (currentUser) updateNavUser();

  if (page === 'home')      renderFeaturedProducts();
  if (page === 'shop')      { renderCategoryTabs(); renderBrandFilters(); filterProducts(); }
  if (page === 'faq')       renderFaq();
  if (page === 'dashboard') {
    if (!currentUser) { window.location.href = '/index.html'; return; }
    updateDashboard();
    showDash('overview');
  }
})();