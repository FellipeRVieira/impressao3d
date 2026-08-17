/* =========================================================
   MODAL — produto, galeria e relacionados
========================================================= */
(function(){
  let overlay = null;
  let currentProduct = null;

  function imageMarkup(product,index=0){
    const src = window.SavioData.getProductImage(product,index);
    const fallback = window.SavioData.getProductFallback(product);
    if(!src) return `<div class="fallback-art">${fallback}</div>`;
    return `<img src="${src}" alt="${product.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><div class="fallback-art" style="display:none">${fallback}</div>`;
  }

  function openProduct(id){
    const product = window.SavioData.getById(id);
    if(!product || !document.getElementById('modalOverlay')) return;
    currentProduct = product; overlay = document.getElementById('modalOverlay');
    document.getElementById('modalCat').textContent = product.category;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalPrice').textContent = window.SavioFormat.formatBRL(product.price);
    document.getElementById('modalDesc').textContent = product.description;
    document.getElementById('galleryMain').innerHTML = imageMarkup(product,0);
    const thumbs = document.getElementById('galleryThumbs');
    const images = product.images?.length ? product.images : [''];
    thumbs.innerHTML = images.map((_,index)=>`<button class="thumb ${index===0?'active':''}" data-index="${index}" aria-label="Ver imagem ${index+1}">${imageMarkup(product,index)}</button>`).join('');
    thumbs.querySelectorAll('.thumb').forEach(button => button.addEventListener('click',()=>{
      thumbs.querySelectorAll('.thumb').forEach(item=>item.classList.remove('active')); button.classList.add('active');
      document.getElementById('galleryMain').innerHTML = imageMarkup(product,Number(button.dataset.index));
    }));

    const related = window.SavioData.getRelated(product.id);
    document.getElementById('relatedGrid').innerHTML = related.map(item=>`
      <article class="related-card" data-product-id="${item.id}">
        <div class="card-img">${imageMarkup(item)}</div>
        <div class="card-name">${item.name}</div>
        <div class="card-price">${window.SavioFormat.formatBRL(item.price)}</div>
      </article>`).join('');
    document.querySelectorAll('#relatedGrid [data-product-id]').forEach(card=>card.addEventListener('click',()=>openProduct(card.dataset.productId)));

    document.getElementById('modalAddCart')?.addEventListener('click', addCurrentToCart, {once:true});
    document.getElementById('modalWhats').href = window.SavioFormat.buildWhatsAppLink(window.SavioFormat.buildWhatsAppMessage(product));
    overlay.classList.add('open'); document.body.style.overflow='hidden'; history.pushState(null,'',`#produto/${product.id}`);
  }

  function addCurrentToCart(){ if(currentProduct){ window.SavioCart.add(currentProduct.id); window.SavioCart.openCart(); } }
  function closeModal(){ if(!overlay) return; overlay.classList.remove('open'); document.body.style.overflow=''; if(location.hash.startsWith('#produto/')) history.pushState(null,'',location.pathname+location.search); }
  function checkHash(){ const match=location.hash.match(/#produto\/([^/]+)/); if(match) openProduct(match[1]); }

  document.addEventListener('DOMContentLoaded',()=>{
    overlay=document.getElementById('modalOverlay'); if(!overlay) return;
    document.getElementById('modalClose')?.addEventListener('click',closeModal);
    overlay.addEventListener('click',event=>{if(event.target===overlay) closeModal();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay.classList.contains('open')) closeModal();});
    window.addEventListener('hashchange',checkHash); checkHash();
  });
  window.SavioModal = {openProduct,closeModal};
})();
