/* =========================================================
   NAVBAR — scroll, menu mobile e badge do carrinho
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if(header){
    const updateShadow = () => header.classList.toggle('scrolled', window.scrollY > 8);
    updateShadow(); window.addEventListener('scroll', updateShadow,{passive:true});
  }

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navlinks = document.querySelector('.navlinks');
  mobileBtn?.addEventListener('click', () => {
    const open = navlinks?.classList.toggle('mobile-open');
    mobileBtn.setAttribute('aria-expanded', String(Boolean(open)));
  });

  document.querySelectorAll('.navlinks a').forEach(link => link.addEventListener('click', () => navlinks?.classList.remove('mobile-open')));
  window.addEventListener('cart:updated', event => {
    const count = (event.detail?.items || []).reduce((sum,item)=>sum + item.quantity,0);
    const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = count || '';
  });
});
