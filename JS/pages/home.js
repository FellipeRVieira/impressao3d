/* =========================================================
   HOME — hero, carrossel, destaques e reveal
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const totalLayers = 312;
  let layer = 0;
  const layerLabel = document.getElementById('layer-count');
  const layerFill = document.getElementById('layer-fill');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(layerLabel && layerFill){
    if(!prefersReduced){
      setInterval(()=>{layer=(layer+7)%(totalLayers+1);layerLabel.textContent=`camada ${String(layer).padStart(3,'0')}/${totalLayers}`;layerFill.style.width=`${layer/totalLayers*100}%`;},220);
    }else{layerLabel.textContent=`camada ${totalLayers}/${totalLayers}`;layerFill.style.width='100%';}
  }

  const carousel=document.getElementById('carousel');
  document.getElementById('nextBtn')?.addEventListener('click',()=>carousel?.scrollBy({left:260,behavior:prefersReduced?'auto':'smooth'}));
  document.getElementById('prevBtn')?.addEventListener('click',()=>carousel?.scrollBy({left:-260,behavior:prefersReduced?'auto':'smooth'}));
  document.querySelectorAll('.cbtn').forEach(button=>button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ') button.click();}));

  const featured = window.SavioData.getFeatured().slice(0,5);
  if(carousel){
    carousel.innerHTML = featured.map(product=>`
      <article class="card" data-product-id="${product.id}">
        <div class="card-img">${product.images?.[0] ? `<img src="${product.images[0]}" alt="${product.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">` : ''}<div class="fallback-art" style="display:${product.images?.[0]?'none':'block'}">${window.SavioData.getProductFallback(product)}</div><div class="card-dots"><span></span><span></span><span></span></div></div>
        <div class="card-mat mono">${product.material || product.category}</div>
        <div class="card-name">${product.name}</div>
        <div class="card-price">${window.SavioFormat.formatBRL(product.price)}</div>
        <button class="card-cta" data-add-cart="${product.id}">Adicionar ao carrinho</button>
      </article>`).join('');
    carousel.querySelectorAll('[data-add-cart]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();window.SavioCart.add(button.dataset.addCart);window.SavioCart.openCart();}));
  }

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target);}}),{threshold:.15}) : null;
  document.querySelectorAll('.reveal').forEach(el=>io?io.observe(el):el.classList.add('in'));
});
