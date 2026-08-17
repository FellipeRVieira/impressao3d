/* =========================================================
   PRODUCTS — única fonte de verdade dos produtos
========================================================= */

const WHATSAPP_NUMBER = "5500000000000";

const fallbackIcons = {
  controle: '<svg viewBox="0 0 100 100" fill="none"><rect x="20" y="30" width="60" height="45" rx="4" stroke="currentColor" stroke-width="2"/><path d="M30 30v-8h40v8" stroke="currentColor" stroke-width="2"/></svg>',
  vaso: '<svg viewBox="0 0 100 100" fill="none"><path d="M50 20c14 0 22 10 22 24 0 12-10 16-10 28H38c0-12-10-16-10-28 0-14 8-24 22-24Z" stroke="currentColor" stroke-width="2"/></svg>',
  luminaria: '<svg viewBox="0 0 100 100" fill="none"><path d="M50 18v14M35 55l15-23 15 23z" stroke="currentColor" stroke-width="2"/><rect x="30" y="55" width="40" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M42 65v12h16V65" stroke="currentColor" stroke-width="2"/></svg>',
  celular: '<svg viewBox="0 0 100 100" fill="none"><rect x="26" y="24" width="48" height="52" rx="8" stroke="currentColor" stroke-width="2"/><path d="M38 65h24" stroke="currentColor" stroke-width="2"/></svg>',
  miniatura: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="42" r="16" stroke="currentColor" stroke-width="2"/><path d="M30 78c2-14 10-20 20-20s18 6 20 20" stroke="currentColor" stroke-width="2"/></svg>',
  organizador: '<svg viewBox="0 0 100 100" fill="none"><rect x="22" y="30" width="56" height="40" rx="4" stroke="currentColor" stroke-width="2"/><path d="M22 46h56M40 30v40M60 30v40" stroke="currentColor" stroke-width="1.4"/></svg>',
  porta_chaves: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="30" r="10" stroke="currentColor" stroke-width="2"/><path d="M50 40v34M38 60h24M40 74h20" stroke="currentColor" stroke-width="2"/></svg>',
  quadro: '<svg viewBox="0 0 100 100" fill="none"><rect x="24" y="22" width="52" height="56" rx="3" stroke="currentColor" stroke-width="2"/><path d="M24 62 42 46l12 12 22-20" stroke="currentColor" stroke-width="2"/></svg>',
  porta_copo: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="26" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="10" stroke="currentColor" stroke-width="1.4"/></svg>'
};

const products = [
  { id:"suporte-controle", name:"Suporte para controle", price:39.90, category:"Acessórios", material:"PLA · fosco", icon:"controle", featured:true, description:"Suporte produzido em impressão 3D, ideal para organizar seu controle de videogame na mesa ou estante. Acabamento fosco e encaixe firme.", images:["IMG/produtos/suporte-controle.jpg"] },
  { id:"vaso-geometrico", name:"Vaso geométrico", price:54.90, category:"Decoração", material:"PETG · translúcido", icon:"vaso", featured:true, description:"Vaso com design geométrico moderno, impresso em PETG translúcido. Perfeito para plantas pequenas ou suculentas.", images:["IMG/produtos/vaso-geometrico.jpg"] },
  { id:"luminaria-modular", name:"Luminária modular", price:89.90, category:"Decoração", material:"PLA · difusor", icon:"luminaria", featured:true, description:"Luminária de mesa com difusor impresso em 3D, montagem modular e luz aconchegante para o ambiente.", images:["IMG/produtos/luminaria-modular.jpg"] },
  { id:"suporte-celular", name:"Suporte para celular", price:32.90, category:"Acessórios", material:"PLA+ · rígido", icon:"celular", featured:true, description:"Suporte compacto para celular, ideal para mesa de trabalho ou cabeceira. Material rígido e resistente.", images:["IMG/produtos/suporte-celular.jpg"] },
  { id:"miniatura-personalizada", name:"Miniatura personalizada", price:64.90, category:"Decoração", material:"Resina · detalhado", icon:"miniatura", featured:true, description:"Miniatura impressa em resina com alto nível de detalhe. Personalizamos conforme sua referência.", images:["IMG/produtos/miniatura-personalizada.jpg"] },
  { id:"organizador-mesa", name:"Organizador de mesa", price:47.90, category:"Organizadores", material:"PLA · modular", icon:"organizador", featured:false, description:"Organizador modular para canetas, clipes e acessórios de escritório. Encaixa em qualquer mesa.", images:["IMG/produtos/organizador-mesa.jpg"] },
  { id:"porta-chaves", name:"Porta-chaves de parede", price:29.90, category:"Utilidades", material:"PLA · preciso", icon:"porta_chaves", featured:false, description:"Porta-chaves compacto para fixar na parede, com acabamento em camadas finas para maior precisão.", images:["IMG/produtos/porta-chaves.jpg"] },
  { id:"quadro-3d", name:"Quadro decorativo 3D", price:74.90, category:"Decoração", material:"PLA · relevo", icon:"quadro", featured:false, description:"Quadro com relevo impresso em 3D, textura única que faz o design ganhar profundidade na parede.", images:["IMG/produtos/quadro-3d.jpg"] },
  { id:"porta-copos", name:"Porta-copos em par", price:24.90, category:"Utilidades", material:"PLA · resistente", icon:"porta_copo", featured:false, description:"Par de porta-copos com base emborrachável, resistentes a líquidos e fáceis de limpar.", images:["IMG/produtos/porta-copos.jpg"] }
];

const categories = ["Todos", ...new Set(products.map(product => product.category))];

function getById(id){ return products.find(product => String(product.id) === String(id)) || null; }
function getFeatured(){ return products.filter(product => product.featured); }
function getRelated(productId, limit=3){
  const product = getById(productId);
  if(!product) return [];
  return products.filter(item => item.category === product.category && item.id !== product.id).slice(0, limit);
}
function getProductImage(product, index=0){
  return product?.images?.[index] || product?.images?.[0] || "";
}
function getProductFallback(product){ return fallbackIcons[product?.icon] || '<span aria-hidden="true">3D</span>'; }

window.SavioData = { products, categories, getById, getFeatured, getRelated, getProductImage, getProductFallback, WHATSAPP_NUMBER };
