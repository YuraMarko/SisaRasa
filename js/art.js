// ===== Ilustrasi produk =====
const ILUSTRASI = {
  selaiNanas: () => '<img src="images/nanas.jpg" alt="Selai nanas SisaRasa">',
  selaiPisang: () => '<img src="images/pisang.jpg" alt="Selai pisang SisaRasa">',

  buahPisang: () => '<img src="images/bRaaja.jpg" alt="Pisang matang">',
  buahNanas: () => '<img src="images/bNanas.jpg" alt="Nanas matang">',

  buahLain: () => `
    <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Buah">
      <circle cx="60" cy="68" r="38" fill="#D9825B"/>
      <path d="M60 30 Q58 14 70 8 Q74 20 62 30 Z" fill="#4C8A3A"/>
      <circle cx="48" cy="58" r="3" fill="#9A3F1B" opacity="0.6"/><circle cx="70" cy="76" r="3" fill="#9A3F1B" opacity="0.6"/>
    </svg>`,

  rotiTawar: () => '<img src="images/rotiTawar.jpg" alt="Roti tawar">',
  rotiCokelat: () => '<img src="images/chocolateBread.jpg" alt="Roti isi cokelat">',
  donat: () => '<img src="images/donatGula.jpg" alt="Donat gula">',
  bolu: () => '<img src="images/kueBolu.jpg" alt="Kue bolu">',
  muffin: () => '<img src="images/muffin.jpg" alt="Muffin pisang">',
  kueKering: () => '<img src="images/kkueKeringCoklat.jpg" alt="Kue kering cokelat">',
  rotiLain: () => ILUSTRASI.rotiCokelat(),
};

function ilustrasi(jenis) {
  return (ILUSTRASI[jenis] || ILUSTRASI.buahLain)();
}

// ===== Gambar utama: pakai foto produk nyata =====
function heroHTML() {
  return `
    <div class="herovisuals" aria-label="Produk SisaRasa">
      <img src="images/produk.jpg" alt="Produk SisaRasa" class="herovisuals-main">
      <img src="images/pisang.jpg" alt="Selai pisang" class="herovisuals-side herovisuals-side-left">
      <img src="images/nanas.jpg" alt="Selai nanas" class="herovisuals-side herovisuals-side-right">
    </div>`;
}
