const STORAGE_KEY = 'inventory.products.v1';

const seededProducts = [
  { id: crypto.randomUUID(), name: 'Full-Face Helmet Pro', category: 'Helmets', price: 249.99, quantity: 16 },
  { id: crypto.randomUUID(), name: 'Youth MX Helmet', category: 'Helmets', price: 149.99, quantity: 10 },
  { id: crypto.randomUUID(), name: 'MX Goggles Clear Lens', category: 'Eyewear', price: 49.99, quantity: 30 },
  { id: crypto.randomUUID(), name: 'Tear-Off Pack', category: 'Eyewear', price: 19.99, quantity: 45 },
  { id: crypto.randomUUID(), name: 'Riding Jersey - Red', category: 'Apparel', price: 59.99, quantity: 24 },
  { id: crypto.randomUUID(), name: 'Riding Pants - Black', category: 'Apparel', price: 129.99, quantity: 18 },
  { id: crypto.randomUUID(), name: 'MX Gloves', category: 'Apparel', price: 34.99, quantity: 40 },
  { id: crypto.randomUUID(), name: 'Motocross Boots', category: 'Footwear', price: 299.99, quantity: 12 },
  { id: crypto.randomUUID(), name: 'Knee Brace Set', category: 'Protection', price: 399.99, quantity: 8 },
  { id: crypto.randomUUID(), name: 'Chest Protector', category: 'Protection', price: 159.99, quantity: 14 },
  { id: crypto.randomUUID(), name: 'Elbow Guards', category: 'Protection', price: 49.99, quantity: 22 },
  { id: crypto.randomUUID(), name: 'Handlebar Grips', category: 'Parts', price: 14.99, quantity: 55 },
  { id: crypto.randomUUID(), name: 'Drive Chain 520', category: 'Parts', price: 89.99, quantity: 20 },
  { id: crypto.randomUUID(), name: 'Rear Sprocket 49T', category: 'Parts', price: 59.99, quantity: 17 },
  { id: crypto.randomUUID(), name: 'Air Filter', category: 'Parts', price: 24.99, quantity: 38 },
  { id: crypto.randomUUID(), name: 'Brake Lever', category: 'Parts', price: 39.99, quantity: 25 },
  { id: crypto.randomUUID(), name: 'Fork Oil 1L', category: 'Maintenance', price: 22.99, quantity: 28 },
  { id: crypto.randomUUID(), name: 'Chain Lube', category: 'Maintenance', price: 12.99, quantity: 60 },
  { id: crypto.randomUUID(), name: 'Engine Oil 10W-40', category: 'Maintenance', price: 17.99, quantity: 34 },
  { id: crypto.randomUUID(), name: 'Bike Stand', category: 'Workshop', price: 74.99, quantity: 11 }
];

const inventoryBody = document.getElementById('inventory-body');
const addForm = document.getElementById('add-product-form');
const searchInput = document.getElementById('search');

function loadProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seededProducts));
  return seededProducts;
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

let products = loadProducts();

function toCurrency(value) {
  return `$${Number(value).toFixed(2)}`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
  );

  inventoryBody.innerHTML = filtered
    .map(
      (product) => `
      <tr data-id="${product.id}">
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${toCurrency(product.price)}</td>
        <td>
          <div class="quantity-controls">
            <button type="button" class="decrement">-</button>
            <input type="number" min="0" step="1" class="quantity-input" value="${product.quantity}" />
            <button type="button" class="increment">+</button>
          </div>
        </td>
        <td>
          <button type="button" class="delete-btn">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');
}

function updateQuantity(id, quantity) {
  const nextQuantity = Number.isNaN(quantity) ? 0 : Math.max(0, Math.floor(quantity));
  products = products.map((product) =>
    product.id === id ? { ...product, quantity: nextQuantity } : product
  );
  saveProducts(products);
  renderProducts();
}

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(addForm);

  const product = {
    id: crypto.randomUUID(),
    name: String(formData.get('name')).trim(),
    category: String(formData.get('category')).trim(),
    price: Number(formData.get('price')),
    quantity: Math.max(0, Math.floor(Number(formData.get('quantity'))))
  };

  if (!product.name || !product.category || Number.isNaN(product.price) || Number.isNaN(product.quantity)) {
    return;
  }

  products = [product, ...products];
  saveProducts(products);
  addForm.reset();
  renderProducts();
});

inventoryBody.addEventListener('click', (event) => {
  const row = event.target.closest('tr');
  if (!row) return;

  const productId = row.dataset.id;
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  if (event.target.classList.contains('delete-btn')) {
    products = products.filter((item) => item.id !== productId);
  }

  if (event.target.classList.contains('increment')) {
    product.quantity += 1;
  }

  if (event.target.classList.contains('decrement')) {
    product.quantity = Math.max(0, product.quantity - 1);
  }

  saveProducts(products);
  renderProducts();
});

inventoryBody.addEventListener('change', (event) => {
  if (!event.target.classList.contains('quantity-input')) return;
  const row = event.target.closest('tr');
  if (!row) return;
  updateQuantity(row.dataset.id, Number(event.target.value));
});

searchInput.addEventListener('input', renderProducts);
renderProducts();
