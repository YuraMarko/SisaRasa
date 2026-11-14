// ===== Router sederhana berbasis #hash =====
const appEl = document.getElementById('app');

function rute() {
  const h = (location.hash || '#/').replace(/^#\/?/, '');
  const [a, b] = h.split('/');
  return { nama: a || '', param: b ? decodeURIComponent(b) : '' };
}

function render() {
  const { nama, param } = rute();
  let html;
  if (nama === '') html = halamanBeranda();
  else if (KATEGORI[nama]) html = halamanKatalog(nama);
  else if (nama === 'keranjang') html = halamanKeranjang();
  else if (nama === 'checkout') html = halamanCheckout();
  else if (nama === 'pesanan') html = param ? halamanPesanan(param) : halamanDaftarPesanan();
  else if (nama === 'pedagang') html = halamanPedagang();
  else html = '<h1 class="rata-kiri">Halaman tidak ditemukan</h1><p><a href="#/">Kembali ke beranda</a></p>';
  appEl.innerHTML = html;
  perbaruiNav(nama);
  if (nama === 'pedagang') sesuaikanFormStok();
}

function perbaruiNav(nama) {
  document.querySelectorAll('#nav a[data-r]').forEach((a) => {
    const aktif = a.dataset.r === nama || (a.dataset.r === 'pesanan' && nama === 'pesanan');
    a.classList.toggle('aktif', aktif);
    if (aktif) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const badge = document.getElementById('badge-cart');
  const n = jumlahKeranjang();
  badge.textContent = n;
  badge.hidden = n === 0;
}

window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

// ===== Toast kecil =====
let toastTimer;
function toast(teks, galat = false) {
  const t = document.getElementById('toast');
  t.textContent = teks;
  t.classList.toggle('galat', galat);
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

// ===== Klik (delegasi) =====
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-aksi]');
  if (!el) return;
  const aksi = el.dataset.aksi;
  const id = el.dataset.id;

  // Stepper di kartu katalog: ubah angka saja, tanpa render ulang
  if (aksi === 'qty-kurang' || aksi === 'qty-tambah') {
    const kartu = el.closest('[data-produk]');
    const p = cariProduk(kartu.dataset.produk);
    const langkah = KATEGORI[p.kat].langkah;
    const out = kartu.querySelector('[data-qty]');
    const sekarang = Number(out.textContent.replace(',', '.'));
    const batas = sisa(p);
    let baru = Math.round((sekarang + (aksi === 'qty-tambah' ? langkah : -langkah)) * 10) / 10;
    baru = Math.max(langkah, Math.min(baru, batas));
    out.textContent = fmtQty(baru);
    return;
  }

  if (aksi === 'tambah') {
    const kartu = el.closest('[data-produk]');
    const qty = Number(kartu.querySelector('[data-qty]').textContent.replace(',', '.'));
    const r = tambahKeranjang(id, qty);
    if (!r.ok) toast(r.pesan, true);
    else toast(r.terbatas ? 'Ditambahkan, jumlah dibatasi sesuai stok.' : 'Masuk keranjang.');
    perbaruiNav(rute().nama);
    return;
  }

  if (aksi === 'cart-kurang' || aksi === 'cart-tambah') {
    ubahQtyKeranjang(id, aksi === 'cart-tambah' ? 1 : -1);
    render();
    return;
  }
  if (aksi === 'cart-hapus') { hapusKeranjang(id); render(); return; }

  if (aksi === 'stok-simpan') {
    const baris = el.closest('[data-stok]');
    const stok = Number(baris.querySelector('[data-f="stok"]').value);
    const harga = Number(baris.querySelector('[data-f="harga"]').value);
    if (!(stok >= 0) || !(harga >= 0)) { toast('Isi angka yang benar.', true); return; }
    ubahStok(id, stok, harga);
    toast('Stok diperbarui.');
    render();
    return;
  }
  if (aksi === 'stok-hapus') {
    if (confirm('Hapus produk ini dari katalog?')) { hapusProduk(id); render(); }
    return;
  }
  if (aksi === 'reset') {
    if (confirm('Kembalikan semua data (stok, keranjang, pesanan) ke data contoh?')) { resetData(); render(); }
  }
});

// ===== Form pedagang: tampilkan kolom sesuai kategori =====
function sesuaikanFormStok() {
  const f = document.getElementById('form-stok');
  if (!f) return;
  const kat = f.kat.value;
  f.querySelectorAll('[data-untuk]').forEach((d) => { d.hidden = d.dataset.untuk !== kat; });
  document.getElementById('wrap-lain').hidden = !(kat === 'buah' && f.jenisBuah.value === 'lain');
  document.getElementById('lbl-stok').textContent = kat === 'buah' ? 'Jumlah tersedia (kg)' : 'Jumlah tersedia (pcs)';
  document.getElementById('lbl-harga').textContent = kat === 'buah' ? 'Harga jual per kg (Rp)' : 'Harga jual per pcs (Rp)';
  f.stok.step = kat === 'buah' ? '0.5' : '1';
  f.stok.min = kat === 'buah' ? '0.5' : '1';
}

document.addEventListener('change', (e) => {
  if (e.target.closest('#form-stok') && (e.target.name === 'kat' || e.target.name === 'jenisBuah')) sesuaikanFormStok();
});

function tampilPesanForm(teks) {
  const el = document.getElementById('pesan-form');
  el.textContent = teks;
  el.hidden = !teks;
}

// ===== Kirim form =====
document.addEventListener('submit', (e) => {
  const form = e.target;

  if (form.id === 'form-stok') {
    e.preventDefault();
    const kat = form.kat.value;
    const stok = Number(form.stok.value);
    const harga = Number(form.harga.value);
    const penjual = form.penjual.value.trim();
    const lokasi = form.lokasi.value.trim();
    if (!penjual || !lokasi) return tampilPesanForm('Nama lapak dan lokasi pengambilan wajib diisi.');
    if (!(stok > 0)) return tampilPesanForm('Jumlah harus lebih dari 0.');
    if (!(harga > 0)) return tampilPesanForm('Harga harus lebih dari 0.');
    if (!form.ambilSampai.value) return tampilPesanForm('Isi batas jam pengambilan.');
    const data = {
      kat, stok, harga, penjual, lokasi,
      ambilSampai: form.ambilSampai.value.replace(':', '.'),
    };
    if (kat === 'buah') {
      data.jenisBuah = form.jenisBuah.value;
      data.namaLain = form.namaLain.value.trim();
      if (data.jenisBuah === 'lain' && !data.namaLain) return tampilPesanForm('Isi nama buahnya.');
      data.kondisiPendek = form.kondisi.value;
      data.kondisi = form.kondisi.value === 'matang'
        ? 'Matang, layak dan aman dimakan'
        : 'Terlalu matang, tampilan kurang mulus, masih layak dan aman';
    } else {
      data.nama = form.nama.value.trim();
      if (!data.nama) return tampilPesanForm('Isi nama roti atau kue.');
      data.hargaNormal = Number(form.hargaNormal.value) || null;
    }
    tambahStok(data);
    location.hash = '#/' + kat;
    toast('Stok ditambahkan ke katalog.');
    return;
  }

  if (form.id === 'form-checkout') {
    e.preventDefault();
    const nama = form.nama.value.trim();
    const wa = form.wa.value.replace(/[\s-]/g, '');
    if (nama.length < 2) return tampilPesanForm('Isi nama kamu.');
    if (!/^(\+62|62|0)8\d{7,12}$/.test(wa)) return tampilPesanForm('Nomor WhatsApp belum benar. Contoh: 081234567890.');
    const metode = form.metode.value;
    const r = buatPesanan({ nama, wa }, metode);
    if (!r.ok) return tampilPesanForm(r.pesan);
    location.hash = '#/pesanan/' + encodeURIComponent(r.pesanan.kode);
  }
});

render();
