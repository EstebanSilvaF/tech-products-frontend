
const API_BASE = window.API_BASE || 'http://localhost:3000';

const container = document.getElementById('products');

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

function setStatus(html, className = '') {
  container.className = `container ${className}`.trim();
  container.innerHTML = html;
  container.setAttribute('aria-busy', className === 'loading' ? 'true' : 'false');
}

async function fetchProducts() {
  const url = `${API_BASE.replace(/\/$/, '')}/api/products`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}${text ? `: ${text.slice(0, 120)}` : ''}`);
  }

  return response.json();
}

function displayProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    setStatus('<p class="hint">No hay productos para mostrar.</p>', 'empty');
    return;
  }

  container.className = 'container';
  container.setAttribute('aria-busy', 'false');
  container.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h2>${escapeHtml(product.name)}</h2>
      <p class="price">${currencyFormatter.format(Number(product.price) || 0)}</p>
      <p class="stock">Stock: ${escapeHtml(String(product.stock ?? ''))}</p>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function init() {
  setStatus('<p class="hint">Cargando productos…</p>', 'loading');

  try {
    const result = await fetchProducts();
    const list = result && result.data;
    displayProducts(list);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    setStatus(
      `
      <div class="error-box">
        <p><strong>No se pudo conectar con la API.</strong></p>
        <p class="hint">Comprueba que el backend esté en marcha (<code>${escapeHtml(API_BASE)}</code>) y vuelve a intentar.</p>
        <p class="hint mono">${escapeHtml(error.message)}</p>
      </div>
      `,
      'error'
    );
  }
}

init();
