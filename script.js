const PRODUK = [
  { jenis: 'nanas',       penjual: 'SisaRasa',        nama: 'Selai Nanas, 100 g',  info: 'Rp25.000',            badge: 'PRE-<br>ORDER' },
  { jenis: 'pisang',      penjual: 'SisaRasa',        nama: 'Selai Pisang, 100 g', info: 'Rp25.000',            badge: 'PRE-<br>ORDER' },
  { jenis: 'rotiTawar',   penjual: 'Mitra toko roti', nama: 'Roti Tawar Kupas',    info: 'Ambil sebelum 20.00', badge: '30%<br>OFF' },
  { jenis: 'rotiCokelat', penjual: 'Mitra toko roti', nama: 'Roti Isi Cokelat',    info: 'Ambil sebelum 20.00', badge: '40%<br>OFF' },
  { jenis: 'donat',       penjual: 'Mitra kafe',      nama: 'Donat Gula',          info: 'Ambil sebelum 21.00', badge: '25%<br>OFF' },
  { jenis: 'bolu',        penjual: 'Mitra toko roti', nama: 'Kue Bolu, potong',    info: 'Ambil sebelum 20.00', badge: '35%<br>OFF' },
  { jenis: 'muffin',      penjual: 'Mitra kafe',      nama: 'Muffin Pisang',       info: 'Ambil sebelum 21.00', badge: '30%<br>OFF' },
  { jenis: 'kueKering',   penjual: 'Mitra kafe',      nama: 'Kue Kering Cokelat',  info: 'Ambil sebelum 21.00', badge: '20%<br>OFF' },
];
 
// ===== Ilustrasi (SVG buatan sendiri) =====
const JAR_WARNA = { nanas: '#F4B942', pisang: '#B9772E' };
const JAR_LABEL = { nanas: 'Nanas', pisang: 'Pisang' };
 
function jarSVG(jenis, lebar = 92, tinggi = 115) {
  return `
    <svg width="${lebar}" height="${tinggi}" viewBox="0 0 120 150" role="img" aria-label="Jar selai ${JAR_LABEL[jenis]}">${jarInner(jenis)}</svg>`;
}
 
function jarInner(jenis) {
  return `
    <rect x="22" y="4" width="76" height="24" rx="6" fill="#2A1B12"/>
    <rect x="12" y="24" width="96" height="120" rx="18" fill="${JAR_WARNA[jenis]}"/>
    <rect x="24" y="64" width="72" height="56" rx="8" fill="#FBF4E4"/>
    <text x="60" y="88" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#9A3F1B">SisaRasa</text>
    <text x="60" y="106" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#6B5646">${JAR_LABEL[jenis]}</text>`;
}
 
const ILUSTRASI = {
  nanas: () => jarSVG('nanas'),
  pisang: () => jarSVG('pisang'),
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
};
 
// ===== Kartu menu =====
function kartuHTML(p) {
  return `
    <article class="card">
      <div class="badge">${p.badge}</div>
      <div class="img">${ILUSTRASI[p.jenis]()}</div>
      <div class="brand">${p.penjual}</div>
      <div class="name">${p.nama}</div>
      <div class="price">${p.info}</div>
    </article>`;
}
 
// ===== Gambar utama: dua jar dalam kotak =====
function heroHTML() {
  return `
    <svg width="100%" height="100%" viewBox="0 0 325 325" role="img" aria-label="Jar selai SisaRasa dalam kotak">
      <rect x="40" y="215" width="245" height="110" fill="#E9A64B"/>
      <rect x="40" y="215" width="245" height="14" fill="#C98A3B"/>
      <g transform="translate(70,70)">${jarInner('nanas')}</g>
      <g transform="translate(150,40) scale(0.9)">${jarInner('pisang')}</g>
      <text x="162" y="278" text-anchor="middle" font-family="Bitstream Charter, DejaVu Serif, serif"
            font-size="30" font-weight="700" fill="#FBF4E4">SisaRasa</text>
      <rect x="190" y="292" width="60" height="22" rx="4" fill="#2A1B12"/>
      <text x="220" y="307" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#F4B942">Rp25.000</text>
      <rect x="256" y="292" width="52" height="22" rx="4" fill="#9A3F1B"/>
      <text x="282" y="307" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#fff">100 g</text>
    </svg>`;
}
 
// ===== Tampilkan ke halaman =====
document.getElementById('grid').innerHTML = PRODUK.map(kartuHTML).join('');
document.getElementById('hero').innerHTML = heroHTML();
 