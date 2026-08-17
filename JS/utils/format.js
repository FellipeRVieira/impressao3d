/* =========================================================
   FORMAT — preço e WhatsApp
========================================================= */
function formatBRL(value){
  return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(value)||0);
}

function buildWhatsAppMessage(productOrItems, quantity=1){
  if(Array.isArray(productOrItems)){
    const items = productOrItems;
    if(!items.length) return 'Olá! Gostaria de conhecer os produtos da Forma3D.';
    const lines = items.map(item => `• ${item.name} — ${item.quantity}x — ${formatBRL(item.price * item.quantity)}`);
    const total = items.reduce((sum,item) => sum + item.price * item.quantity,0);
    return `Olá! Gostaria de finalizar meu pedido:\n\n${lines.join('\n')}\n\nTotal: ${formatBRL(total)}`;
  }
  return `Olá! Tenho interesse no produto ${productOrItems.name}${quantity > 1 ? ` (${quantity} unidades)` : ''}.`;
}

function buildWhatsAppLink(message){
  const number = window.SavioData?.WHATSAPP_NUMBER || '5500000000000';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

window.SavioFormat = { formatBRL, buildWhatsAppMessage, buildWhatsAppLink };
