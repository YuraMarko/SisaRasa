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

  rotiTawar: () => `
    <svg width="130" height="110" viewBox="0 0 130 110" role="img" aria-label="Roti tawar">
      <path d="M18 40 Q18 14 48 14 Q65 4 82 14 Q112 14 112 40 L108 98 Q108 104 102 104 L28 104 Q22 104 22 98 Z" fill="#D9A45B"/>
      <path d="M28 44 Q28 26 48 26 L82 26 Q102 26 102 44 L99 94 L31 94 Z" fill="#F3D9A4"/>
      <path d="M52 40 L52 88 M78 40 L78 88" stroke="#E2BE80" stroke-width="3"/>
    </svg>`,
  rotiCokelat: () => `
    <svg width="130" height="110" viewBox="0 0 130 110" role="img" aria-label="Roti isi cokelat">
      <ellipse cx="65" cy="62" rx="52" ry="34" fill="#D9A45B"/>
      <ellipse cx="65" cy="52" rx="44" ry="24" fill="#B77A3A"/>
      <path d="M34 50 Q65 40 96 50" stroke="#5A3A22" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M40 60 Q65 52 90 60" stroke="#5A3A22" stroke-width="5" fill="none" stroke-linecap="round"/>
    </svg>`,
  donat: () => `
    <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Donat gula">
      <circle cx="60" cy="60" r="50" fill="#D9A45B"/>
      <circle cx="60" cy="60" r="44" fill="#F1CF94"/>
      <circle cx="60" cy="60" r="15" fill="#fff"/>
      <g fill="#fff" opacity="0.9">
        <circle cx="34" cy="48" r="2.5"/><circle cx="46" cy="30" r="2.5"/><circle cx="78" cy="30" r="2.5"/>
        <circle cx="90" cy="52" r="2.5"/><circle cx="84" cy="82" r="2.5"/><circle cx="52" cy="90" r="2.5"/>
        <circle cx="30" cy="72" r="2.5"/>
      </g>
    </svg>`,
  bolu: () => `
    <svg width="130" height="110" viewBox="0 0 130 110" role="img" aria-label="Kue bolu">
      <path d="M10 90 L65 20 L120 90 Z" fill="#F3D9A4"/>
      <path d="M10 90 L120 90 L120 100 L10 100 Z" fill="#D9A45B"/>
      <path d="M26 70 L104 70" stroke="#B9772E" stroke-width="5"/>
      <path d="M42 50 L88 50" stroke="#B9772E" stroke-width="5"/>
      <circle cx="65" cy="16" r="9" fill="#9A3F1B"/>
    </svg>`,
  muffin: () => `
    <svg width="110" height="120" viewBox="0 0 110 120" role="img" aria-label="Muffin pisang">
      <path d="M24 58 L32 108 L78 108 L86 58 Z" fill="#9A3F1B"/>
      <path d="M30 70 L80 70" stroke="#7B2F13" stroke-width="3"/>
      <path d="M12 58 Q8 22 38 16 Q55 0 74 16 Q104 22 98 58 Z" fill="#E4B56A"/>
      <circle cx="40" cy="38" r="3" fill="#B9772E"/><circle cx="66" cy="32" r="3" fill="#B9772E"/><circle cx="78" cy="46" r="3" fill="#B9772E"/>
    </svg>`,
  kueKering: () => `
    <svg width="130" height="110" viewBox="0 0 130 110" role="img" aria-label="Kue kering cokelat">
      <circle cx="44" cy="44" r="30" fill="#D9A45B"/>
      <circle cx="86" cy="62" r="30" fill="#E4B56A"/>
      <circle cx="52" cy="78" r="22" fill="#C98A3B"/>
      <g fill="#5A3A22">
        <circle cx="36" cy="38" r="3"/><circle cx="50" cy="52" r="3"/><circle cx="80" cy="54" r="3"/>
        <circle cx="94" cy="68" r="3"/><circle cx="48" cy="80" r="3"/>
      </g>
    </svg>`,
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
