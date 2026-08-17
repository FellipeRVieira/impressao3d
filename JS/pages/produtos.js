/* =========================================================
   PRODUTOS — busca, filtros e grid
========================================================= */
document.addEventListener('DOMContentLoaded',()=>{
  const filtersEl=document.getElementById('filters');
  const grid=document.getElementById('grid');
  const empty=document.getElementById('emptyState');
  const meta=document.getElementById('resultsMeta');
  const searchInput=document.getElementById('searchInput');
  const searchClear=document.getElementById('searchClear');
  let activeCategory='Todos';
  let searchTerm='';

  filtersEl.innerHTML=window.SavioData.categories.map(category=>`<button class="filter-btn ${category===activeCategory?'active':''}" type="button" role="tab" aria-selected="${category===activeCategory}" data-category="${category}">${category}</button>`).join('');
  filtersEl.addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;filtersEl.querySelectorAll('.filter-btn').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active));});renderGrid();});

  function imageMarkup(product){
    const src=window.SavioData.getProductImage(product); const fallback=window.SavioData.getProductFallback(product);
    return src ? `<img src="${src}" alt="${product.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><div class="fallback-art" style="display:none">${fallback}</div>` : fallback;
  }
  function filtered(){
    const normalized=searchTerm.toLocaleLowerCase('pt-BR');
    return window.SavioData.products.filter(product=>{
      const matchesCategory=activeCategory==='Todos'||product.category===activeCategory;
      const haystack=`${product.name} ${product.category} ${product.description}`.toLocaleLowerCase('pt-BR');
      return matchesCategory && haystack.includes(normalized);
    });
  }
  function renderGrid(){
    const list=filtered();
    meta.textContent=`${list.length} ${list.length===1?'produto encontrado':'produtos encontrados'}`;
    grid.innerHTML=list.map(product=>`
      <article class="card" data-product-id="${product.id}" tabindex="0" role="button" aria-label="Ver detalhes de ${product.name}">
        <div class="card-img">${imageMarkup(product)}</div>
        <span class="card-cat">${product.category}</span>
        <div class="card-name">${product.name}</div>
        <div class="card-price">${window.SavioFormat.formatBRL(product.price)}</div>
        <button class="card-cta" data-add-cart="${product.id}" type="button">Adicionar ao carrinho</button>
      </article>`).join('');
    empty.classList.toggle('show',list.length===0);grid.style.display=list.length?'grid':'none';
    grid.querySelectorAll('[data-product-id]').forEach(card=>{
      card.addEventListener('click',()=>window.SavioModal?.openProduct(card.dataset.productId));
      card.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&!event.target.closest('button')){event.preventDefault();window.SavioModal?.openProduct(card.dataset.productId);}});
    });
    grid.querySelectorAll('[data-add-cart]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();window.SavioCart.add(button.dataset.addCart);window.SavioCart.openCart();}));
  }

  searchInput.addEventListener('input',()=>{searchTerm=searchInput.value.trim();searchClear.classList.toggle('show',Boolean(searchTerm));renderGrid();});
  searchClear.addEventListener('click',()=>{searchInput.value='';searchTerm='';searchClear.classList.remove('show');renderGrid();searchInput.focus();});
  renderGrid();
});
