const pageTitle = document.getElementById('page-title');
const navButtons = document.querySelectorAll('.nav-button');
const pages = document.querySelectorAll('.page');
const productList = document.getElementById('product-list');
const totalProducts = document.getElementById('total-products');
const productCount = document.getElementById('product-count');
const productSearch = document.getElementById('product-search');
const mitraNameEl = document.getElementById('mitra-name');
const ownerNameEl = document.getElementById('owner-name');
const ownerEmailEl = document.getElementById('owner-email');
const ownerAddressEl = document.getElementById('owner-address');
const profileNameEl = document.getElementById('profile-name');
const profileSchoolEl = document.getElementById('profile-school');
const profileOwnerEl = document.getElementById('profile-owner');
const profileCategoryEl = document.getElementById('profile-category');
const profileEmailEl = document.getElementById('profile-email');
const profileAddressEl = document.getElementById('profile-address');
const homeWelcome = document.getElementById('home-welcome');
const productCategoryEl = document.getElementById('product-category');

let mitraData = [];
let productData = [];
let activeCategory = 'Semua';

const loadJson = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Fetch gagal');
    return await response.json();
  } catch (error) {
    console.warn('Gagal mengambil', url, error);
    return null;
  }
};

const updateHome = () => {
  const mitra = mitraData[0] || {};
  mitraNameEl.textContent = mitra.Mitra_Name || '-';
  ownerNameEl.textContent = mitra.Owner_Name || '-';
  ownerEmailEl.textContent = mitra.Email_Owner || '-';
  ownerAddressEl.textContent = mitra.Address_Owner || '-';
  profileNameEl.textContent = mitra.Mitra_Name || '-';
  profileSchoolEl.textContent = mitra.School || '-';
  profileOwnerEl.textContent = mitra.Owner_Name || '-';
  profileCategoryEl.textContent = mitra.Category || '-';
  profileEmailEl.textContent = mitra.Email_Owner || '-';
  profileAddressEl.textContent = mitra.Address_Owner || '-';
  homeWelcome.textContent = `Lihat produk dan riwayat di bawah untuk Kantin ${mitra.Mitra_Name || 'Anda'}.`;
  totalProducts.textContent = productData.length;
  const categories = Array.from(new Set(productData.map((item) => item.Product_Category || 'Lainnya')));
  productCategoryEl.textContent = categories.join(', ') || '-';
};

const normalizeImageUrl = (url) => {
  if (!url) return '';
  const driveIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveIdMatch[1]}`;
  }
  // Handle Google Photos URLs
  const photosMatch = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (photosMatch) {
    return `https://lh3.googleusercontent.com/d/${photosMatch[1]}`;
  }
  return url;
};

const createProductCard = (product) => {
  const container = document.createElement('article');
  container.className = 'product-card';

  const image = document.createElement('img');
  image.src = normalizeImageUrl(product.Product_Image || '');
  image.alt = product.Product_Name || 'Produk';
  image.loading = 'lazy';

  const info = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = product.Product_Name || 'Nama produk';
  const price = document.createElement('p');
  price.textContent = product.Product_Price || '-';
  const meta = document.createElement('div');
  meta.className = 'product-meta';
  const categoryTag = document.createElement('span');
  categoryTag.className = 'product-chip';
  categoryTag.textContent = product.Product_Category || 'Kategori';
  const stockTag = document.createElement('span');
  stockTag.className = 'product-chip';
  stockTag.textContent = `Stok ${product.Product_Stock || 0}`;
  meta.append(categoryTag, stockTag);
  info.append(title, price, meta);
  container.append(image, info);
  return container;
};

const renderProducts = (filterText = '') => {
  const normalized = filterText.trim().toLowerCase();
  const filtered = productData.filter((item) => {
    const name = (item.Product_Name || '').toLowerCase();
    const category = (item.Product_Category || '').toLowerCase();
    return name.includes(normalized) || category.includes(normalized);
  });
  productList.innerHTML = '';
  if (filtered.length === 0) {
    productList.innerHTML = '<p>Tidak ada produk yang cocok.</p>';
  } else {
    filtered.forEach((item) => productList.appendChild(createProductCard(item)));
  }
  productCount.textContent = `${filtered.length} produk`;
};

const activatePage = (targetId) => {
  pages.forEach((page) => {
    page.classList.toggle('active', page.id === targetId);
  });
  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.target === targetId);
  });
  const titles = {
    'home-page': 'Beranda',
    'products-page': 'Produk',
    'history-page': 'Riwayat',
    'profile-page': 'Profil',
  };
  pageTitle.textContent = titles[targetId] || 'Aplikasi';
};

navButtons.forEach((button) => {
  button.addEventListener('click', () => activatePage(button.dataset.target));
});

productSearch.addEventListener('input', (event) => {
  renderProducts(event.target.value);
});

const initialize = async () => {
  const mitraJson = await loadJson('./Data/Mitra_Table_rows.json');
  const productsJson = await loadJson('./Data/Product_Table_rows.json');
  mitraData = mitraJson || [];
  productData = productsJson || [];
  updateHome();
  renderProducts();
};

initialize();
