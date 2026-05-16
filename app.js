// ─── T.B.S BOOKSTORE — Firebase Edition ────────────────────────
// Firebase Firestore for books, ratings, chat
// Features: search, 5-star ratings (email required), live chat
// ───────────────────────────────────────────────────────────────

// ── FIREBASE SETUP ─────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-2ktyTOUvGKTN7w6xZvx8BeRLWRcKSg0",
  authDomain: "test-mode-a6755.firebaseapp.com",
  projectId: "test-mode-a6755",
  storageBucket: "test-mode-a6755.firebasestorage.app",
  messagingSenderId: "786217141001",
  appId: "1:786217141001:web:842ad3ecda085e969309d8",
  measurementId: "G-8G7M5SGPXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── LANGUAGE ──────────────────────────────────────────────────
let currentLang = localStorage.getItem('tbs-lang') || 'ar';
const T = {
  ar: {
    loading: 'جارٍ التحميل...',
    all: 'الكل',
    buy: 'اشتري الآن',
    buy_via: 'اشتري الآن عبر قمرود',
    no_link: 'غير متاح حالياً',
    hint: 'سيتم توجيهك لصفحة الدفع الآمنة',
    checkout: 'إتمام الشراء',
    empty_title: 'لا توجد كتب بعد',
    empty_sub: 'ترقبوا الإصدارات القادمة',
    logo_sub: 'The Book Store',
    ornament: 'مكتبة راقية',
    eyebrow: 'مجموعة مختارة',
    hero_title: 'كتب مترجمة',
    hero_em: 'بعناية',
    hero_desc: 'ملفات PDF · جودة عالية · تنزيل فوري',
    footer: 'جميع الحقوق محفوظة',
    footer_sub: 'كتب مترجمة · ملفات PDF',
    admin_title: 'لوحة الإدارة',
    lbl_password: 'كلمة المرور',
    lbl_title: 'عنوان الكتاب',
    lbl_author: 'المؤلف / المترجم',
    lbl_price: 'السعر',
    lbl_currency: 'العملة',
    lbl_category: 'التصنيف',
    lbl_desc: 'وصف الكتاب',
    lbl_image: 'رابط صورة الغلاف',
    lbl_link: 'رابط الدفع (قمرود)',
    hint_link: 'الصق رابط قمرود — سيُعاد توجيه المشتري مباشرة',
    save: 'حفظ الكتاب',
    cancel: 'إلغاء',
    login_btn: 'دخول',
    wrong_pass: 'كلمة المرور غير صحيحة',
    logout: 'تسجيل الخروج',
    books_list_title: 'الكتب المنشورة',
    add_title: 'إضافة كتاب جديد',
    edit_title: 'تعديل الكتاب',
    update: 'تحديث الكتاب',
    delete_confirm: 'هل تريد حذف هذا الكتاب؟',
    fill_fields: 'يرجى ملء العنوان والمؤلف والسعر',
    saving: 'جارٍ الحفظ...',
    lang_switch: 'EN',
    lang_dir: 'rtl',
    lang_html: 'ar',
    no_link_msg: 'رابط الدفع غير متوفر لهذا الكتاب',
    search_placeholder: 'ابحث عن كتاب...',
    no_results: 'لا توجد نتائج للبحث',
    no_results_sub: 'جرب كلمة أخرى',
    rate_title: 'قيّم هذا الكتاب',
    rate_email_placeholder: 'بريدك الإلكتروني',
    rate_submit: 'إرسال التقييم',
    rate_thanks: 'شكراً! تم تسجيل تقييمك',
    rate_error: 'يرجى إدخال بريد إلكتروني صحيح',
    rate_already: 'لقد قيّمت هذا الكتاب مسبقاً',
    rate_section: 'التقييمات',
    chat_title: 'تواصل معنا',
    chat_placeholder: 'اكتب رسالتك...',
    chat_email_placeholder: 'بريدك الإلكتروني (مطلوب)',
    chat_send: 'إرسال',
    chat_email_required: 'يرجى إدخال بريد إلكتروني صحيح أولاً',
    chat_connecting: 'جارٍ الاتصال...',
    chat_you: 'أنت',
    chat_admin: 'الدعم',
    chat_start: 'ابدأ المحادثة',
    chat_input_locked: 'أدخل بريدك الإلكتروني للمحادثة',
    chat_send_error: 'تعذر إرسال الرسالة، حاول مجدداً',
    admin_chat_title: 'رسائل العملاء',
    admin_reply: 'رد',
    admin_reply_placeholder: 'اكتب ردك...',
    based_on: 'بناءً على',
    reviews: 'تقييم',
  },
  en: {
    loading: 'Loading...',
    all: 'All',
    buy: 'Buy Now',
    buy_via: 'Buy Now via Qomra',
    no_link: 'Not Available',
    hint: 'You will be redirected to a secure payment page',
    checkout: 'Complete Purchase',
    empty_title: 'No books yet',
    empty_sub: 'Stay tuned for upcoming releases',
    logo_sub: 'The Book Store',
    ornament: 'A Refined Library',
    eyebrow: 'Curated Collection',
    hero_title: 'Translated Books',
    hero_em: 'With Care',
    hero_desc: 'PDF Files · High Quality · Instant Download',
    footer: 'All Rights Reserved',
    footer_sub: 'Translated Books · PDF Files',
    admin_title: 'Admin Panel',
    lbl_password: 'Password',
    lbl_title: 'Book Title',
    lbl_author: 'Author / Translator',
    lbl_price: 'Price',
    lbl_currency: 'Currency',
    lbl_category: 'Category',
    lbl_desc: 'Book Description',
    lbl_image: 'Cover Image URL',
    lbl_link: 'Payment Link (Qomra)',
    hint_link: 'Paste your Qomra link — buyer will be redirected directly',
    save: 'Save Book',
    cancel: 'Cancel',
    login_btn: 'Login',
    wrong_pass: 'Incorrect password',
    logout: 'Logout',
    books_list_title: 'Published Books',
    add_title: 'Add New Book',
    edit_title: 'Edit Book',
    update: 'Update Book',
    delete_confirm: 'Delete this book?',
    fill_fields: 'Please fill in title, author and price',
    saving: 'Saving...',
    lang_switch: 'عربي',
    lang_dir: 'ltr',
    lang_html: 'en',
    no_link_msg: 'Payment link not available for this book',
    search_placeholder: 'Search for a book...',
    no_results: 'No results found',
    no_results_sub: 'Try a different keyword',
    rate_title: 'Rate This Book',
    rate_email_placeholder: 'Your email address',
    rate_submit: 'Submit Rating',
    rate_thanks: 'Thank you! Your rating has been saved',
    rate_error: 'Please enter a valid email address',
    rate_already: 'You have already rated this book',
    rate_section: 'Ratings',
    chat_title: 'Contact Us',
    chat_placeholder: 'Type your message...',
    chat_email_placeholder: 'Your email (required)',
    chat_send: 'Send',
    chat_email_required: 'Please enter a valid email first',
    chat_connecting: 'Connecting...',
    chat_you: 'You',
    chat_admin: 'Support',
    chat_start: 'Start Chat',
    chat_input_locked: 'Enter your email to chat',
    chat_send_error: 'Failed to send, please try again',
    admin_chat_title: 'Customer Messages',
    admin_reply: 'Reply',
    admin_reply_placeholder: 'Type your reply...',
    based_on: 'Based on',
    reviews: 'reviews',
  }
};

function t(key) { return T[currentLang][key] || key; }

function applyLang() {
  document.documentElement.lang = t('lang_html');
  document.documentElement.dir = t('lang_dir');
  document.getElementById('logo-sub-text').textContent = t('logo_sub');
  document.getElementById('header-ornament-text').textContent = t('ornament');
  document.getElementById('lang-toggle').querySelector('span').textContent = t('lang_switch');
  document.getElementById('hero-eyebrow').textContent = t('eyebrow');
  document.getElementById('hero-title').innerHTML = t('hero_title') + ' <em>' + t('hero_em') + '</em>';
  document.getElementById('hero-desc').textContent = t('hero_desc');
  document.getElementById('loading-text').textContent = t('loading');
  document.getElementById('footer-text').textContent = t('footer');
  document.getElementById('footer-sub').textContent = t('footer_sub');
  document.getElementById('admin-title').textContent = t('admin_title');
  document.getElementById('label-password').textContent = t('lbl_password');
  document.getElementById('label-title').textContent = t('lbl_title');
  document.getElementById('label-author').textContent = t('lbl_author');
  document.getElementById('label-price').textContent = t('lbl_price');
  document.getElementById('label-currency').textContent = t('lbl_currency');
  document.getElementById('label-category').textContent = t('lbl_category');
  document.getElementById('label-desc').textContent = t('lbl_desc');
  document.getElementById('label-image').textContent = t('lbl_image');
  document.getElementById('label-link').textContent = t('lbl_link');
  document.getElementById('hint-link').textContent = t('hint_link');
  document.getElementById('save-btn').textContent = t('save');
  document.getElementById('cancel-btn').textContent = t('cancel');
  document.getElementById('login-btn').textContent = t('login_btn');
  document.getElementById('logout-btn').textContent = t('logout');
  document.getElementById('books-list-title').textContent = t('books_list_title');
  document.getElementById('admin-add-title').textContent = t('add_title');
  document.getElementById('modal-hint').textContent = t('hint');
  const sp = document.getElementById('search-input');
  if (sp) sp.placeholder = t('search_placeholder');
  renderNav();
  renderBooks();
}

function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('tbs-lang', currentLang);
  applyLang();
}

// ── STATE ──────────────────────────────────────────────────────
let books = [];
let currentCategory = 'all';
let searchQuery = '';
let editingId = null;
let loggedIn = false;
let unsubscribeBooks = null;

const ADMIN_PASSWORD = 'tbs2024';

// ── FIREBASE: BOOKS ────────────────────────────────────────────
function listenBooks() {
  const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
  unsubscribeBooks = onSnapshot(q, snap => {
    books = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderNav();
    renderBooks();
    if (loggedIn) renderAdminList();
    document.getElementById('loading-state').style.display = 'none';
  }, err => {
    console.error('Firebase error:', err);
    document.getElementById('loading-text').textContent = 'خطأ في الاتصال بقاعدة البيانات';
  });
}

// ── CATEGORIES ─────────────────────────────────────────────────
function getCategories() {
  return [...new Set(books.map(b => b.category).filter(Boolean))];
}

function renderNav() {
  const nav = document.getElementById('nav');
  const cats = getCategories();
  let html = `<button class="nav-btn${currentCategory === 'all' ? ' active' : ''}" onclick="filterCat('all')">${t('all')}</button>`;
  cats.forEach(c => {
    html += `<button class="nav-btn${currentCategory === c ? ' active' : ''}" onclick="filterCat('${c.replace(/'/g, "\\'")}')">${c}</button>`;
  });
  nav.innerHTML = html;
}

function filterCat(cat) {
  currentCategory = cat;
  searchQuery = '';
  const si = document.getElementById('search-input');
  if (si) si.value = '';
  renderNav();
  renderBooks();
}

// ── SEARCH ─────────────────────────────────────────────────────
function handleSearch(val) {
  searchQuery = val.trim().toLowerCase();
  currentCategory = 'all';
  renderNav();
  renderBooks();
}

function getFilteredBooks() {
  let filtered = books;
  if (currentCategory !== 'all') {
    filtered = filtered.filter(b => b.category === currentCategory);
  }
  if (searchQuery) {
    // Split into individual words so "الجزء 2" matches books containing both
    const words = searchQuery.split(/\s+/).filter(Boolean);
    filtered = filtered.filter(b => {
      const haystack = [b.title, b.author, b.description, b.category]
        .filter(Boolean).join(' ').toLowerCase();
      return words.every(word => haystack.includes(word));
    });
  }
  return filtered;
}

// ── VISITOR COUNTER ────────────────────────────────────────────
async function trackVisit() {
  try {
    if (sessionStorage.getItem('tbs_visited')) return;
    sessionStorage.setItem('tbs_visited', '1');
    const counterRef = doc(db, 'stats', 'visitors');
    const snap = await getDoc(counterRef);
    if (snap.exists()) {
      await updateDoc(counterRef, { total: (snap.data().total || 0) + 1, lastVisit: serverTimestamp() });
    } else {
      await setDoc(counterRef, { total: 1, lastVisit: serverTimestamp() });
    }
  } catch (err) { console.error('Visit track error:', err); }
}

function listenVisitorCount() {
  onSnapshot(doc(db, 'stats', 'visitors'), snap => {
    const el = document.getElementById('admin-visitor-count');
    if (!el) return;
    el.textContent = snap.exists() ? (snap.data().total || 0).toLocaleString() : '0';
  });
}

// ── RENDER BOOKS ───────────────────────────────────────────────
function renderStars(avg, count) {
  if (!count) return '';
  const filled = Math.round(avg);
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="star-mini${i <= filled ? ' filled' : ''}">${i <= filled ? '★' : '☆'}</span>`;
  }
  return `<div class="book-stars">${stars}<span class="star-count">(${count})</span></div>`;
}

function renderBooks() {
  const grid = document.getElementById('books-grid');
  const filtered = getFilteredBooks();

  if (filtered.length === 0) {
    const isSearch = !!searchQuery;
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${isSearch ? '🔍' : '📚'}</div>
        <h3>${isSearch ? t('no_results') : t('empty_title')}</h3>
        <p>${isSearch ? t('no_results_sub') : t('empty_sub')}</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((b, i) => {
    const delay = (i % 12) * 0.05;
    const coverHtml = b.imageUrl
      ? `<div class="book-cover has-image" style="animation-delay:${delay}s"><img src="${escHtml(b.imageUrl)}" alt="${escHtml(b.title)}" loading="lazy" onerror="this.parentElement.innerHTML='📚';this.parentElement.classList.remove('has-image')"></div>`
      : `<div class="book-cover" style="animation-delay:${delay}s">📚</div>`;
    const avgRating = b.ratingSum && b.ratingCount ? (b.ratingSum / b.ratingCount).toFixed(1) : null;
    const starsHtml = avgRating ? renderStars(avgRating, b.ratingCount) : '';
    return `
      <article class="book-card" onclick="openBook('${b.id}')" style="animation-delay:${delay}s">
        ${coverHtml}
        <div class="book-info">
          ${b.category ? `<p class="book-category-tag">${escHtml(b.category)}</p>` : ''}
          <h2 class="book-title">${escHtml(b.title)}</h2>
          ${b.author ? `<p class="book-author">${escHtml(b.author)}</p>` : ''}
          ${starsHtml}
          ${b.description ? `<p class="book-desc-excerpt">${escHtml(b.description)}</p>` : ''}
          <div class="book-footer">
            <span class="book-price">${formatPrice(b.price, b.currency)}</span>
            <button class="buy-btn" onclick="event.stopPropagation();openBook('${b.id}')">${t('buy')}</button>
          </div>
        </div>
      </article>`;
  }).join('');
}

function formatPrice(price, currency) {
  if (!price && price !== 0) return '';
  const cur = currency || 'SAR';
  try {
    return new Intl.NumberFormat(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency', currency: cur, minimumFractionDigits: 2
    }).format(price);
  } catch {
    return `${price} ${cur}`;
  }
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── PRODUCT MODAL ──────────────────────────────────────────────
let currentBookId = null;
let selectedRating = 0;

function openBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  currentBookId = id;
  selectedRating = 0;

  document.getElementById('modal-title').textContent = book.title;
  const wrap = document.getElementById('modal-cover-wrap');
  if (book.imageUrl) {
    wrap.innerHTML = `<img src="${escHtml(book.imageUrl)}" alt="${escHtml(book.title)}" onerror="this.parentElement.textContent='📚'">`;
  } else {
    wrap.textContent = '📚';
  }

  document.getElementById('modal-author').textContent = book.author || '';
  document.getElementById('modal-price').textContent = formatPrice(book.price, book.currency);
  document.getElementById('modal-category').textContent = book.category || '';
  document.getElementById('modal-desc').textContent = book.description || '';
  document.getElementById('modal-divider-text').textContent = t('checkout');

  // Buy button
  const buyLink = document.getElementById('buy-link');
  const buyText = document.getElementById('buy-btn-text');
  const arrow = buyLink.querySelector('.buy-arrow');
  if (book.paymentLink) {
    buyLink.href = book.paymentLink;
    buyLink.classList.remove('no-link');
    buyLink.onclick = null;
    buyText.textContent = t('buy_via');
    if (arrow) arrow.style.display = '';
  } else {
    buyLink.href = '#';
    buyLink.classList.add('no-link');
    buyLink.onclick = (e) => { e.preventDefault(); alert(t('no_link_msg')); };
    buyText.textContent = t('no_link');
    if (arrow) arrow.style.display = 'none';
  }
  document.getElementById('modal-hint').textContent = book.paymentLink ? t('hint') : '';

  // Rating section
  renderRatingSection(book);

  showModal('product-modal');
}

// ── RATING SYSTEM ──────────────────────────────────────────────
function renderRatingSection(book) {
  const section = document.getElementById('rating-section');
  if (!section) return;

  const avg = book.ratingSum && book.ratingCount ? (book.ratingSum / book.ratingCount) : 0;
  const count = book.ratingCount || 0;

  let avgStars = '';
  if (count > 0) {
    for (let i = 1; i <= 5; i++) {
      avgStars += `<span class="star-display${i <= Math.round(avg) ? ' filled' : ''}">${i <= Math.round(avg) ? '★' : '☆'}</span>`;
    }
  }

  section.innerHTML = `
    <div class="rating-summary">
      ${count > 0 ? `
        <div class="rating-avg-row">
          <span class="rating-big-num">${avg.toFixed(1)}</span>
          <div>
            <div class="rating-stars-row">${avgStars}</div>
            <p class="rating-count-text">${t('based_on')} ${count} ${t('reviews')}</p>
          </div>
        </div>` : ''}
    </div>
    <div class="rating-input-area">
      <p class="rate-section-title">${t('rate_title')}</p>
      <div class="star-picker" id="star-picker">
        ${[1,2,3,4,5].map(n => `<span class="star-pick" data-val="${n}" onclick="pickStar(${n})">☆</span>`).join('')}
      </div>
      <input type="email" id="rate-email" class="rate-email-input" placeholder="${t('rate_email_placeholder')}">
      <button class="btn-rate-submit" onclick="submitRating()">${t('rate_submit')}</button>
      <p id="rate-msg" class="rate-msg"></p>
    </div>`;
}

function pickStar(val) {
  selectedRating = val;
  const picks = document.querySelectorAll('.star-pick');
  picks.forEach((s, i) => {
    s.textContent = i < val ? '★' : '☆';
    s.classList.toggle('selected', i < val);
  });
}

async function submitRating() {
  if (!currentBookId) return;
  const emailEl = document.getElementById('rate-email');
  const msgEl = document.getElementById('rate-msg');
  const email = emailEl.value.trim().toLowerCase();

  if (!selectedRating) { msgEl.textContent = '⭐ ' + (currentLang === 'ar' ? 'اختر عدد النجوم' : 'Please select stars'); msgEl.className = 'rate-msg error'; return; }
  if (!isValidEmail(email)) { msgEl.textContent = t('rate_error'); msgEl.className = 'rate-msg error'; return; }

  try {
    const ratingId = `${currentBookId}_${email.replace(/[^a-z0-9]/g, '_')}`;
    const ratingRef = doc(db, 'ratings', ratingId);
    const existing = await getDoc(ratingRef);

    if (existing.exists()) {
      msgEl.textContent = t('rate_already');
      msgEl.className = 'rate-msg error';
      return;
    }

    // Save rating
    await setDoc(ratingRef, {
      bookId: currentBookId,
      email,
      rating: selectedRating,
      createdAt: serverTimestamp()
    });

    // Update book aggregates
    const bookRef = doc(db, 'books', currentBookId);
    const bookSnap = await getDoc(bookRef);
    const bookData = bookSnap.data();
    const newSum = (bookData.ratingSum || 0) + selectedRating;
    const newCount = (bookData.ratingCount || 0) + 1;
    await updateDoc(bookRef, { ratingSum: newSum, ratingCount: newCount });

    msgEl.textContent = t('rate_thanks');
    msgEl.className = 'rate-msg success';
    emailEl.value = '';
    selectedRating = 0;
  } catch (err) {
    console.error(err);
    msgEl.textContent = currentLang === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Error, please try again';
    msgEl.className = 'rate-msg error';
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── MODALS ─────────────────────────────────────────────────────
function showModal(id) {
  document.getElementById('overlay').classList.add('active');
  const m = document.getElementById(id);
  m.style.display = 'block';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => m.classList.add('active'));
  });
  // iOS safe scroll lock — overflow:hidden breaks touch inside modals on iOS
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.dataset.scrollY = String(scrollY);
}

function restoreBodyScroll() {
  const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, scrollY);
}

function hideModal(id) {
  const m = document.getElementById(id);
  m.classList.remove('active');
  setTimeout(() => { m.style.display = 'none'; }, 250);
}

function closeModal() {
  hideModal('product-modal');
  document.getElementById('overlay').classList.remove('active');
  restoreBodyScroll();
}

function closeAdmin() {
  hideModal('admin-panel');
  document.getElementById('overlay').classList.remove('active');
  restoreBodyScroll();
  resetAdminForm();
}

// ── ADMIN ──────────────────────────────────────────────────────
function openAdmin() {
  if (loggedIn) {
    document.getElementById('admin-login-section').style.display = 'none';
    document.getElementById('admin-main-section').style.display = 'block';
    renderAdminList();
    loadAdminChats();
    listenVisitorCount();
  } else {
    document.getElementById('admin-login-section').style.display = 'block';
    document.getElementById('admin-main-section').style.display = 'none';
  }
  document.getElementById('admin-title').textContent = t('admin_title');
  showModal('admin-panel');
}

function adminLogin() {
  const pass = document.getElementById('admin-password').value;
  const err = document.getElementById('login-error');
  if (pass === ADMIN_PASSWORD) {
    loggedIn = true;
    document.getElementById('admin-login-section').style.display = 'none';
    document.getElementById('admin-main-section').style.display = 'block';
    document.getElementById('admin-password').value = '';
    err.style.display = 'none';
    renderAdminList();
    loadAdminChats();
    listenVisitorCount();
  } else {
    err.textContent = t('wrong_pass');
    err.style.display = 'block';
  }
}

function adminLogout() {
  loggedIn = false;
  closeAdmin();
}

function resetAdminForm() {
  editingId = null;
  ['e-title','e-author','e-price','e-cat','e-desc','e-image','e-link'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('e-currency').value = 'SAR';
  document.getElementById('img-preview-wrap').style.display = 'none';
  document.getElementById('admin-error').style.display = 'none';
  document.getElementById('admin-add-title').textContent = t('add_title');
  document.getElementById('save-btn').textContent = t('save');
}

async function saveBook() {
  const title = document.getElementById('e-title').value.trim();
  const author = document.getElementById('e-author').value.trim();
  const price = parseFloat(document.getElementById('e-price').value);
  const currency = document.getElementById('e-currency').value;
  const category = document.getElementById('e-cat').value.trim();
  const description = document.getElementById('e-desc').value.trim();
  const imageUrl = document.getElementById('e-image').value.trim();
  const paymentLink = document.getElementById('e-link').value.trim();
  const errEl = document.getElementById('admin-error');

  if (!title || !author || isNaN(price)) {
    errEl.textContent = t('fill_fields');
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';
  const btn = document.getElementById('save-btn');
  btn.textContent = t('saving');
  btn.disabled = true;

  try {
    const bookData = { title, author, price: price, currency, category, description, imageUrl, paymentLink };
    if (editingId) {
      await updateDoc(doc(db, 'books', editingId), bookData);
    } else {
      bookData.createdAt = serverTimestamp();
      bookData.ratingSum = 0;
      bookData.ratingCount = 0;
      await addDoc(collection(db, 'books'), bookData);
    }
    resetAdminForm();
  } catch (err) {
    console.error(err);
    errEl.textContent = currentLang === 'ar' ? 'خطأ في الحفظ، حاول مجدداً' : 'Save error, try again';
    errEl.style.display = 'block';
  }
  btn.disabled = false;
  btn.textContent = t('save');
}

function editBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  editingId = id;
  document.getElementById('e-title').value = book.title || '';
  document.getElementById('e-author').value = book.author || '';
  document.getElementById('e-price').value = book.price || '';
  document.getElementById('e-currency').value = book.currency || 'SAR';
  document.getElementById('e-cat').value = book.category || '';
  document.getElementById('e-desc').value = book.description || '';
  document.getElementById('e-image').value = book.imageUrl || '';
  document.getElementById('e-link').value = book.paymentLink || '';
  if (book.imageUrl) {
    document.getElementById('img-preview').src = book.imageUrl;
    document.getElementById('img-preview-wrap').style.display = 'block';
  }
  document.getElementById('admin-add-title').textContent = t('edit_title');
  document.getElementById('save-btn').textContent = t('update');
  document.getElementById('admin-main-section').scrollTop = 0;
  document.getElementById('admin-panel').scrollTop = 0;
}

async function deleteBook(id) {
  if (!confirm(t('delete_confirm'))) return;
  await deleteDoc(doc(db, 'books', id));
}

function renderAdminList() {
  const list = document.getElementById('admin-books-list');
  if (books.length === 0) {
    list.innerHTML = `<p style="font-size:11px;color:var(--text-muted);text-align:center;padding:1rem;">${t('empty_title')}</p>`;
    return;
  }
  list.innerHTML = books.map(b => `
    <div class="admin-book-item">
      ${b.imageUrl
        ? `<img class="admin-book-thumb" src="${escHtml(b.imageUrl)}" alt="" onerror="this.style.display='none'">`
        : `<div class="admin-book-thumb-placeholder">📚</div>`}
      <div class="item-info">
        <span class="item-title">${escHtml(b.title)}</span>
        <span class="item-price">${formatPrice(b.price, b.currency)}</span>
      </div>
      <div class="item-btns">
        <button class="edit-btn" onclick="editBook('${b.id}')">✏️</button>
        <button class="del-btn" onclick="deleteBook('${b.id}')">🗑</button>
      </div>
    </div>`).join('');
}

// Image preview
document.getElementById('e-image').addEventListener('input', function () {
  const val = this.value.trim();
  const wrap = document.getElementById('img-preview-wrap');
  const img = document.getElementById('img-preview');
  if (val) {
    img.src = val;
    wrap.style.display = 'block';
    img.onerror = () => { wrap.style.display = 'none'; };
  } else {
    wrap.style.display = 'none';
  }
});

// ── CHAT SYSTEM ────────────────────────────────────────────────
let chatEmail = '';
let chatSessionId = '';
let unsubscribeChat = null;

function getChatSessionId(email) {
  return 'chat_' + email.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function openChat() {
  showModal('chat-modal');
  const emailInput = document.getElementById('chat-email-input');
  const emailArea = document.getElementById('chat-email-area');
  const chatArea = document.getElementById('chat-messages-area');

  if (chatEmail) {
    emailArea.style.display = 'none';
    chatArea.style.display = 'flex';
    listenChatMessages();
  } else {
    emailArea.style.display = 'block';
    chatArea.style.display = 'none';
  }
}

function closeChat() {
  hideModal('chat-modal');
  document.getElementById('overlay').classList.remove('active');
  restoreBodyScroll();
  if (unsubscribeChat) { unsubscribeChat(); unsubscribeChat = null; }
}

function startChat() {
  const emailInput = document.getElementById('chat-email-input');
  const email = emailInput.value.trim().toLowerCase();
  if (!isValidEmail(email)) {
    emailInput.classList.add('shake');
    setTimeout(() => emailInput.classList.remove('shake'), 500);
    return;
  }
  chatEmail = email;
  chatSessionId = getChatSessionId(email);
  document.getElementById('chat-email-area').style.display = 'none';
  document.getElementById('chat-messages-area').style.display = 'flex';
  listenChatMessages();
}

function listenChatMessages() {
  if (unsubscribeChat) unsubscribeChat();
  const msgsRef = collection(db, 'chats', chatSessionId, 'messages');
  const q = query(msgsRef, orderBy('createdAt', 'asc'));
  unsubscribeChat = onSnapshot(q, snap => {
    const list = document.getElementById('chat-messages-list');
    if (!list) return;
    list.innerHTML = snap.docs.map(d => {
      const msg = d.data();
      const isMe = msg.sender === 'user';
      const time = msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      return `<div class="chat-msg ${isMe ? 'chat-msg-user' : 'chat-msg-admin'}">
        <span class="chat-msg-sender">${isMe ? t('chat_you') : t('chat_admin')}</span>
        <p>${escHtml(msg.text)}</p>
        <span class="chat-msg-time">${time}</span>
      </div>`;
    }).join('');
    // scroll to bottom
    list.scrollTop = list.scrollHeight;

    // Update session email in firestore
    setDoc(doc(db, 'chats', chatSessionId), { email: chatEmail, updatedAt: serverTimestamp(), unread: false }, { merge: true });
  });
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || !chatSessionId) return;

  input.value = '';
  try {
    const msgsRef = collection(db, 'chats', chatSessionId, 'messages');
    await addDoc(msgsRef, { text, sender: 'user', createdAt: serverTimestamp() });
    // Update session
    await setDoc(doc(db, 'chats', chatSessionId), {
      email: chatEmail,
      lastMsg: text,
      updatedAt: serverTimestamp(),
      unread: true
    }, { merge: true });
  } catch (err) {
    console.error(err);
    alert(t('chat_send_error'));
  }
}

// ── ADMIN CHAT PANEL ───────────────────────────────────────────
let adminChatSessions = [];
let activeChatSession = null;
let unsubscribeAdminChat = null;

async function loadAdminChats() {
  const adminChatList = document.getElementById('admin-chat-list');
  if (!adminChatList) return;

  const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
  onSnapshot(q, snap => {
    adminChatSessions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    adminChatList.innerHTML = adminChatSessions.length === 0
      ? `<p class="no-chats-msg">${currentLang === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}</p>`
      : adminChatSessions.map(s => `
        <div class="admin-chat-session${s.unread ? ' unread' : ''}" onclick="openAdminChatSession('${s.id}')">
          <div class="chat-session-email">${escHtml(s.email || s.id)}</div>
          <div class="chat-session-last">${escHtml(s.lastMsg || '')}</div>
          ${s.unread ? `<span class="unread-dot"></span>` : ''}
        </div>`).join('');
  });
}

async function openAdminChatSession(sessionId) {
  activeChatSession = sessionId;
  document.getElementById('admin-chat-thread').style.display = 'flex';
  document.getElementById('admin-chat-list-wrap').style.display = 'none';

  if (unsubscribeAdminChat) unsubscribeAdminChat();
  const msgsRef = collection(db, 'chats', sessionId, 'messages');
  const q = query(msgsRef, orderBy('createdAt', 'asc'));
  unsubscribeAdminChat = onSnapshot(q, snap => {
    const list = document.getElementById('admin-chat-messages');
    list.innerHTML = snap.docs.map(d => {
      const msg = d.data();
      const isUser = msg.sender === 'user';
      const time = msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      return `<div class="chat-msg ${isUser ? 'chat-msg-user' : 'chat-msg-admin'}">
        <span class="chat-msg-sender">${isUser ? (currentLang === 'ar' ? 'العميل' : 'Customer') : (currentLang === 'ar' ? 'أنت' : 'You')}</span>
        <p>${escHtml(msg.text)}</p>
        <span class="chat-msg-time">${time}</span>
      </div>`;
    }).join('');
    list.scrollTop = list.scrollHeight;
  });

  // Mark as read
  await updateDoc(doc(db, 'chats', sessionId), { unread: false });
}

function backToAdminChatList() {
  activeChatSession = null;
  document.getElementById('admin-chat-thread').style.display = 'none';
  document.getElementById('admin-chat-list-wrap').style.display = 'block';
  if (unsubscribeAdminChat) { unsubscribeAdminChat(); unsubscribeAdminChat = null; }
}

async function sendAdminReply() {
  if (!activeChatSession) return;
  const input = document.getElementById('admin-reply-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  const msgsRef = collection(db, 'chats', activeChatSession, 'messages');
  await addDoc(msgsRef, { text, sender: 'admin', createdAt: serverTimestamp() });
  await updateDoc(doc(db, 'chats', activeChatSession), {
    lastMsg: text,
    updatedAt: serverTimestamp(),
    unread: false
  });
}

// ── OVERLAY CLOSE ──────────────────────────────────────────────
document.getElementById('overlay').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
    closeAdmin();
    closeChat();
  }
});

// ── ADMIN TRIGGER ──────────────────────────────────────────────
let triggerClicks = 0, triggerTimer = null;
document.getElementById('admin-trigger').addEventListener('click', () => {
  triggerClicks++;
  clearTimeout(triggerTimer);
  if (triggerClicks >= 3) {
    triggerClicks = 0;
    openAdmin();
  } else {
    triggerTimer = setTimeout(() => { triggerClicks = 0; }, 800);
  }
});

// ── EXPOSE TO WINDOW (required for onclick in HTML with type=module) ──
window.toggleLang         = toggleLang;
window.filterCat          = filterCat;
window.handleSearch       = handleSearch;
window.openBook           = openBook;
window.closeModal         = closeModal;
window.openAdmin          = openAdmin;
window.closeAdmin         = closeAdmin;
window.adminLogin         = adminLogin;
window.adminLogout        = adminLogout;
window.saveBook           = saveBook;
window.editBook           = editBook;
window.deleteBook         = deleteBook;
window.pickStar           = pickStar;
window.submitRating       = submitRating;
window.openChat           = openChat;
window.closeChat          = closeChat;
window.startChat          = startChat;
window.sendChatMessage    = sendChatMessage;
window.sendAdminReply     = sendAdminReply;
window.backToAdminChatList= backToAdminChatList;
window.openAdminChatSession = openAdminChatSession;

window.trackVisit          = trackVisit;
window.listenVisitorCount  = listenVisitorCount;

// ── REFRESH ────────────────────────────────────────────────────
function refreshPage(btn) {
  if (btn) {
    btn.classList.add('spinning');
    setTimeout(() => location.reload(true), 500);
  } else {
    location.reload(true);
  }
}
window.refreshPage = refreshPage;

// ── INIT ───────────────────────────────────────────────────────
applyLang();
listenBooks();
trackVisit();