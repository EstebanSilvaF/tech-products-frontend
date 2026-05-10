const container = document.getElementById('products');

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

async function getProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    displayProducts(result.data);

  } catch (error) {
    console.error('Error loading products:', error);

    container.innerHTML = `
      <p>Products not found</p>
    `;
  }
}

function displayProducts(products) {

  container.innerHTML = '';

  products.forEach(product => {

    const card = document.createElement('div');

    card.classList.add('card');

    card.innerHTML = `
      <h2>${product.name}</h2>
      <p class="price">${currencyFormatter.format(Number(product.price) || 0)}</p>
      <p class="stock">Stock: ${product.stock}</p>
    `;

    container.appendChild(card);
  });
}

getProducts();