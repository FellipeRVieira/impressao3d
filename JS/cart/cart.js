/* =========================================================
   CART — localStorage + evento cart:updated
========================================================= */
const CART_KEY = 'savio-cart-v1';

function readCart(){
  try{
    const data = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(data) ? data : [];
  }catch{ return []; }
}
function writeCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated',{detail:{items}}));
}
function getItems(){ return readCart(); }
function add(productId, quantity=1){
  const product = window.SavioData?.getById(productId);
  if(!product) return getItems();
  const items = readCart();
  const existing = items.find(item => item.id === product.id);
  if(existing) existing.quantity += Math.max(1, Number(quantity)||1);
  else items.push({id:product.id,name:product.name,price:product.price,images:product.images,quantity:Math.max(1,Number(quantity)||1)});
  writeCart(items); return items;
}
function remove(productId){ writeCart(readCart().filter(item => item.id !== productId)); }
function updateQty(productId, quantity){
  const items = readCart();
  const item = items.find(entry => entry.id === productId);
  if(!item) return;
  item.quantity = Math.max(0, Number(quantity)||0);
  writeCart(items.filter(entry => entry.quantity > 0));
}
function clear(){ writeCart([]); }
function getTotal(){ return readCart().reduce((sum,item)=>sum + item.price * item.quantity,0); }
function getCount(){ return readCart().reduce((sum,item)=>sum + item.quantity,0); }

function renderCart(){
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartBadge');
  if(!itemsEl) return;
  const items = readCart();
  if(countEl) countEl.textContent = getCount() || '';
  totalEl && (totalEl.textContent = window.SavioFormat.formatBRL(getTotal()));
  if(!items.length){ itemsEl.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.<br>Adicione um produto para começar.</div>'; return; }
  itemsEl.innerHTML = items.map(item => `
    <article class="cart-item">
      <div class="cart-item-image">${item.images?.[0] ? `<img src="${item.images[0]}" alt="${item.name}" onerror="this.style.display='none'">` : ''}</div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${window.SavioFormat.formatBRL(item.price)}</div>
        <div class="cart-qty">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
        <button class="cart-remove" data-action="remove" data-id="${item.id}">Remover</button>
      </div>
      <div class="cart-item-total">${window.SavioFormat.formatBRL(item.price * item.quantity)}</div>
    </article>`).join('');
}

function openCart(){ document.getElementById('cartDrawer')?.classList.add('open'); document.getElementById('cartOverlay')?.classList.add('open'); document.body.style.overflow='hidden'; renderCart(); }
function closeCart(){ document.getElementById('cartDrawer')?.classList.remove('open'); document.getElementById('cartOverlay')?.classList.remove('open'); document.body.style.overflow=''; }

window.addEventListener('cart:updated', renderCart);
document.addEventListener('click', event => {
  const actionEl = event.target.closest('[data-action]');
  if(!actionEl) return;
  const id = actionEl.dataset.id;
  const item = getItems().find(entry => entry.id === id);
  if(actionEl.dataset.action === 'increase') add(id,1);
  if(actionEl.dataset.action === 'decrease' && item) updateQty(id,item.quantity-1);
  if(actionEl.dataset.action === 'remove') remove(id);
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('cartClear')?.addEventListener('click', clear);
  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    const items = getItems();
    if(!items.length) return;
    window.open(window.SavioFormat.buildWhatsAppLink(window.SavioFormat.buildWhatsAppMessage(items)), '_blank','noopener');
  });
  renderCart();
});

window.SavioCart = { add, remove, updateQty, getItems, getTotal, getCount, clear, openCart, closeCart };
