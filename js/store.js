// ===== Pengaturan (ubah di sini) =====
const CONFIG = {
  // Selai: pre-order dibuka 5 hari, lalu diproduksi, lalu diambil. Siklus berulang tiap 7 hari.
  PO_ANCHOR: '2026-11-14',   // tanggal mulai batch pre-order pertama (YYYY-MM-DD)
  PO_HARI: 5,                // lama pre-order dibuka
  PO_SIKLUS: 7,              // batch baru dibuka tiap sekian hari
  PO_PRODUKSI_HARI: 2,       // jeda dari penutupan PO sampai selai siap diambil
  TITIK_AMBIL_SELAI: 'Titik temu area Universitas Tarumanagara',
  KEY: 'sisarasa.v1',
};

const KATEGORI = {
  selai: {
    label: 'Selai',
    judul: 'Selai SisaRasa',
    desk: 'Produk olahan yang kami produksi sendiri dari pisang dan nanas matang berlebih.',
    aturan: 'Pre-order 5 hari',
    satuan: 'jar',
    langkah: 1,
  },
  roti: {
    label: 'Roti',
    judul: 'Roti surplus',
    desk: 'Roti dan kue sisa dari toko mitra yang masih layak konsumsi, dijual lebih murah.',
    aturan: 'Ready stock · ambil di toko',
    satuan: 'pcs',
    langkah: 1,
  },
  buah: {
    label: 'Buah',
    judul: 'Buah dari pedagang',
    desk: 'Pisang dan nanas yang tampilannya kurang mulus atau terlalu matang, tetapi masih layak dan aman dimakan.',
    aturan: 'Ready stock · ambil di lapak pedagang',
    satuan: 'kg',
    langkah: 0.5,
  },
};

// ===== Format =====
const rupiah = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');
const fmtQty = (n) => (Number.isInteger(n) ? String(n) : String(n).replace('.', ','));
const tgl = (d) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// ===== Data contoh =====
function dataAwal() {
  return {
    produk: [
      { id: 's-nanas',  kat: 'selai', jenis: 'selaiNanas',  nama: 'Selai Nanas, 100 g',  penjual: 'SisaRasa', lokasi: CONFIG.TITIK_AMBIL_SELAI, harga: 25000, stok: null, badge: 'PRE-<br>ORDER' },
      { id: 's-pisang', kat: 'selai', jenis: 'selaiPisang', nama: 'Selai Pisang, 100 g', penjual: 'SisaRasa', lokasi: CONFIG.TITIK_AMBIL_SELAI, harga: 25000, stok: null, badge: 'PRE-<br>ORDER' },

      { id: 'r-tawar',   kat: 'roti', jenis: 'rotiTawar',   nama: 'Roti Tawar Kupas',   penjual: 'Mitra toko roti', lokasi: 'Toko mitra (alamat contoh)', harga: 12600, hargaNormal: 18000, stok: 6,  ambilSampai: '20.00', badge: '30%<br>OFF' },
      { id: 'r-cokelat', kat: 'roti', jenis: 'rotiCokelat', nama: 'Roti Isi Cokelat',   penjual: 'Mitra toko roti', lokasi: 'Toko mitra (alamat contoh)', harga: 4800,  hargaNormal: 8000,  stok: 10, ambilSampai: '20.00', badge: '40%<br>OFF' },
      { id: 'r-donat',   kat: 'roti', jenis: 'donat',       nama: 'Donat Gula',         penjual: 'Mitra kafe',      lokasi: 'Kafe mitra (alamat contoh)', harga: 4500,  hargaNormal: 6000,  stok: 8,  ambilSampai: '21.00', badge: '25%<br>OFF' },
      { id: 'r-bolu',    kat: 'roti', jenis: 'bolu',        nama: 'Kue Bolu, potong',   penjual: 'Mitra toko roti', lokasi: 'Toko mitra (alamat contoh)', harga: 6500,  hargaNormal: 10000, stok: 5,  ambilSampai: '20.00', badge: '35%<br>OFF' },
      { id: 'r-muffin',  kat: 'roti', jenis: 'muffin',      nama: 'Muffin Pisang',      penjual: 'Mitra kafe',      lokasi: 'Kafe mitra (alamat contoh)', harga: 8400,  hargaNormal: 12000, stok: 4,  ambilSampai: '21.00', badge: '30%<br>OFF' },
      { id: 'r-kering',  kat: 'roti', jenis: 'kueKering',   nama: 'Kue Kering Cokelat', penjual: 'Mitra kafe',      lokasi: 'Kafe mitra (alamat contoh)', harga: 20000, hargaNormal: 25000, stok: 3,  ambilSampai: '21.00', badge: '20%<br>OFF' },

      { id: 'b-pisang', kat: 'buah', jenis: 'buahPisang', nama: 'Pisang matang', penjual: 'Lapak buah mitra 1', lokasi: 'Pasar Grogol, lapak mitra 1 (contoh)', harga: 7000, stok: 5, ambilSampai: '17.00', kondisi: 'Terlalu matang, kulit berbintik, daging masih layak', badge: 'MATANG' },
      { id: 'b-nanas',  kat: 'buah', jenis: 'buahNanas',  nama: 'Nanas matang',  penjual: 'Lapak buah mitra 2', lokasi: 'Pasar Grogol, lapak mitra 2 (contoh)', harga: 5000, stok: 4, ambilSampai: '17.00', kondisi: 'Matang berlebih, manis, masih layak', badge: 'MATANG' },
    ],
    keranjang: [],
    pesanan: [],
  };
}

// ===== Penyimpanan (localStorage) =====
let STATE = muat();

function muat() {
  try {
    const raw = localStorage.getItem(CONFIG.KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.produk) && Array.isArray(s.keranjang) && Array.isArray(s.pesanan)) return s;
    }
  } catch (e) { /* abaikan, pakai data contoh */ }
  return dataAwal();
}

function simpan() {
  try { localStorage.setItem(CONFIG.KEY, JSON.stringify(STATE)); } catch (e) { /* penyimpanan penuh atau diblokir */ }
}

function resetData() {
  STATE = dataAwal();
  simpan();
}

// ===== Pre-order selai =====
function infoPO(sekarang = new Date()) {
  const [y, m, d] = CONFIG.PO_ANCHOR.split('-').map(Number);
  const anchor = new Date(y, m - 1, d);
  const hari = 86400000;
  let mulai = anchor;
  if (sekarang >= anchor) {
    const fase = Math.floor((sekarang - anchor) / (CONFIG.PO_SIKLUS * hari));
    mulai = new Date(anchor.getTime() + fase * CONFIG.PO_SIKLUS * hari);
  }
  const tutup = new Date(mulai.getTime() + CONFIG.PO_HARI * hari);   // PO tutup pada awal hari ini
  const siap = new Date(tutup.getTime() + CONFIG.PO_PRODUKSI_HARI * hari);
  const buka = sekarang >= mulai && sekarang < tutup;
  const berikutnya = buka ? null : new Date(mulai.getTime() + CONFIG.PO_SIKLUS * hari);
  const terakhirOrder = new Date(tutup.getTime() - hari);            // hari terakhir menerima pesanan
  return { buka, mulai, tutup, terakhirOrder, siap, berikutnya: berikutnya || mulai };
}

// ===== Produk =====
const cariProduk = (id) => STATE.produk.find((p) => p.id === id);
const produkKategori = (kat) => STATE.produk.filter((p) => p.kat === kat);

// Jumlah yang masih bisa dipesan (null = tanpa batas, khusus selai)
function sisa(p) {
  if (p.kat === 'selai') return infoPO().buka ? Infinity : 0;
  return p.stok;
}

// ===== Keranjang =====
function itemKeranjang() {
  return STATE.keranjang
    .map((c) => ({ ...c, produk: cariProduk(c.id) }))
    .filter((c) => c.produk);
}

function jumlahKeranjang() {
  return itemKeranjang().length;
}

function tambahKeranjang(id, qty) {
  const p = cariProduk(id);
  if (!p) return { ok: false, pesan: 'Produk tidak ditemukan.' };
  const batas = sisa(p);
  if (batas <= 0) {
    return { ok: false, pesan: p.kat === 'selai' ? 'Pre-order sedang ditutup.' : 'Stok habis.' };
  }
  const ada = STATE.keranjang.find((c) => c.id === id);
  const baru = (ada ? ada.qty : 0) + qty;
  const final = Math.min(baru, batas);
  if (ada) ada.qty = final; else STATE.keranjang.push({ id, qty: final });
  simpan();
  return { ok: true, terbatas: final < baru, qty: final };
}

function ubahQtyKeranjang(id, delta) {
  const c = STATE.keranjang.find((x) => x.id === id);
  const p = cariProduk(id);
  if (!c || !p) return;
  const langkah = KATEGORI[p.kat].langkah;
  const batas = sisa(p);
  const baru = Math.round((c.qty + delta * langkah) * 10) / 10;
  if (baru <= 0) { hapusKeranjang(id); return; }
  c.qty = Math.min(baru, batas);
  simpan();
}

function hapusKeranjang(id) {
  STATE.keranjang = STATE.keranjang.filter((c) => c.id !== id);
  simpan();
}

// Kelompokkan per tempat pengambilan
function kelompokAmbil(items) {
  const po = infoPO();
  const peta = new Map();
  items.forEach((it) => {
    const p = it.produk || it;
    const kunci = p.kat + '|' + p.penjual + '|' + p.lokasi;
    if (!peta.has(kunci)) {
      peta.set(kunci, { kunci, kat: p.kat, penjual: p.penjual, lokasi: p.lokasi, ambilSampai: p.ambilSampai, items: [], subtotal: 0 });
    }
    const g = peta.get(kunci);
    g.items.push(it);
    g.subtotal += (it.produk ? it.produk.harga : it.harga) * it.qty;
  });
  return [...peta.values()].map((g) => ({
    ...g,
    waktu: g.kat === 'selai'
      ? 'Siap diambil sekitar ' + tgl(po.siap)
      : 'Ambil hari yang sama sebelum jam ' + (g.ambilSampai || '-'),
  }));
}

function totalKeranjang(items) {
  return items.reduce((t, it) => t + it.produk.harga * it.qty, 0);
}

// ===== Pesanan =====
function kodePesanan() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let k = '';
  for (let i = 0; i < 6; i++) k += a[Math.floor(Math.random() * a.length)];
  return 'SR-' + k;
}

// Cek stok sebelum bayar. Mengembalikan daftar masalah (kosong = aman).
function cekKeranjang(items) {
  const masalah = [];
  const po = infoPO();
  items.forEach((it) => {
    const p = it.produk;
    if (p.kat === 'selai' && !po.buka) {
      masalah.push(p.nama + ': pre-order sedang ditutup, batch berikutnya dibuka ' + tgl(po.berikutnya) + '.');
    } else if (p.kat !== 'selai' && it.qty > p.stok) {
      masalah.push(p.nama + ': stok tinggal ' + fmtQty(p.stok) + ' ' + KATEGORI[p.kat].satuan + '.');
    }
  });
  return masalah;
}

function buatPesanan(pembeli, metode, tambahan = {}) {
  const items = itemKeranjang();
  if (!items.length) return { ok: false, pesan: 'Keranjang masih kosong.' };
  const masalah = cekKeranjang(items);
  if (masalah.length) return { ok: false, pesan: masalah.join(' ') };

  const po = infoPO();
  const baris = items.map((it) => ({
    id: it.produk.id, kat: it.produk.kat, nama: it.produk.nama, penjual: it.produk.penjual,
    lokasi: it.produk.lokasi, ambilSampai: it.produk.ambilSampai || null,
    harga: it.produk.harga, qty: it.qty, satuan: KATEGORI[it.produk.kat].satuan,
  }));
  const pesanan = {
    kode: kodePesanan(),
    dibuat: new Date().toISOString(),
    pembeli,
    metode,
    items: baris,
    total: baris.reduce((t, b) => t + b.harga * b.qty, 0),
    email: tambahan.email || '',
    catatan: tambahan.catatan || '',
    pengambil: tambahan.pengambil || '',
    pengambilan: tambahan.pengambilan || [],
    detailBayar: tambahan.detailBayar || metode,
    statusBayar: 'Lunas (simulasi)',
    poSiap: baris.some((b) => b.kat === 'selai') ? po.siap.toISOString() : null,
  };

  // Kurangi stok ready stock
  items.forEach((it) => {
    if (it.produk.kat !== 'selai') it.produk.stok = Math.round((it.produk.stok - it.qty) * 10) / 10;
  });
  STATE.keranjang = [];
  STATE.pesanan.unshift(pesanan);
  simpan();
  return { ok: true, pesanan };
}

// ===== Stok pedagang =====
function tambahStok(data) {
  const kat = data.kat;
  const id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  let p;
  if (kat === 'buah') {
    const jenis = data.jenisBuah === 'pisang' ? 'buahPisang' : data.jenisBuah === 'nanas' ? 'buahNanas' : 'buahLain';
    const nama = data.jenisBuah === 'pisang' ? 'Pisang ' : data.jenisBuah === 'nanas' ? 'Nanas ' : '';
    p = {
      id, kat, jenis,
      nama: (nama + (data.jenisBuah === 'lain' ? data.namaLain : data.kondisiPendek)).trim(),
      penjual: data.penjual, lokasi: data.lokasi, harga: data.harga, stok: data.stok,
      ambilSampai: data.ambilSampai, kondisi: data.kondisi, badge: 'MATANG',
    };
  } else {
    p = {
      id, kat: 'roti', jenis: 'rotiLain', nama: data.nama,
      penjual: data.penjual, lokasi: data.lokasi, harga: data.harga,
      hargaNormal: data.hargaNormal || null, stok: data.stok, ambilSampai: data.ambilSampai,
      badge: data.hargaNormal && data.hargaNormal > data.harga
        ? Math.round((1 - data.harga / data.hargaNormal) * 100) + '%<br>OFF' : 'SURPLUS',
    };
  }
  STATE.produk.push(p);
  simpan();
  return p;
}

function ubahStok(id, stok, harga) {
  const p = cariProduk(id);
  if (!p || p.kat === 'selai') return;
  p.stok = stok;
  if (harga > 0) p.harga = harga;
  const c = STATE.keranjang.find((x) => x.id === id);
  if (c && c.qty > stok) c.qty = stok;
  STATE.keranjang = STATE.keranjang.filter((x) => x.qty > 0);
  simpan();
}

function hapusProduk(id) {
  STATE.produk = STATE.produk.filter((p) => p.id !== id);
  STATE.keranjang = STATE.keranjang.filter((c) => c.id !== id);
  simpan();
}
