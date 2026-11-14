// ===== Potongan tampilan yang dipakai berulang =====
function stepperHTML(aksiKurang, aksiTambah, id, qty, satuan) {
  return `
    <div class="stepper">
      <button type="button" class="step" data-aksi="${aksiKurang}" data-id="${id}" aria-label="Kurangi">−</button>
      <span class="qty" aria-live="polite"><b data-qty>${fmtQty(qty)}</b> ${satuan}</span>
      <button type="button" class="step" data-aksi="${aksiTambah}" data-id="${id}" aria-label="Tambah">+</button>
    </div>`;
}

function chipAturan(kat) {
  return `<span class="chip chip-${kat}">${KATEGORI[kat].aturan}</span>`;
}

function infoPOHTML() {
  const po = infoPO();
  if (po.buka) {
    return `<div class="po po-buka">
      <b>Pre-order dibuka</b>
      <span>Pesan sampai ${tgl(po.terakhirOrder)}. Selai dimasak setelah pre-order ditutup, lalu siap diambil sekitar ${tgl(po.siap)}.</span>
    </div>`;
  }
  return `<div class="po po-tutup">
    <b>Pre-order sedang ditutup</b>
    <span>Batch berikutnya dibuka ${tgl(po.berikutnya)} dan berlangsung ${CONFIG.PO_HARI} hari.</span>
  </div>`;
}

// ===== Beranda =====
function halamanBeranda() {
  const kartuKat = (kat, jenis, teks) => `
    <a class="kat" href="#/${kat}">
      <div class="kat-art">${ilustrasi(jenis)}</div>
      <h3>${KATEGORI[kat].label}</h3>
      <p>${teks}</p>
      ${chipAturan(kat)}
      <span class="kat-lanjut">Lihat ${KATEGORI[kat].label.toLowerCase()} →</span>
    </a>`;
  return `
    <h1>Selamatkan buah, hemat belanja</h1>
    <section class="intro">
      <p>Pisang dan nanas matang berlebih dari pedagang pasar kami olah jadi selai, atau kamu beli langsung dengan harga lebih murah. Roti dan kue sisa dari toko mitra juga ada. Semua bisa dipesan di satu tempat.</p>
      <div class="hero">${heroHTML()}</div>
    </section>
    <h2 class="judul-bagian">Pilih kategori</h2>
    <section class="kat-grid" aria-label="Kategori produk">
      ${kartuKat('selai', 'selaiNanas', KATEGORI.selai.desk)}
      ${kartuKat('roti', 'rotiTawar', KATEGORI.roti.desk)}
      ${kartuKat('buah', 'buahPisang', KATEGORI.buah.desk)}
    </section>
    <section class="langkah">
      <h2 class="judul-bagian">Cara beli</h2>
      <ol>
        <li><b>Pilih kategori</b> lalu masukkan produk ke keranjang.</li>
        <li><b>Checkout dan bayar</b>. Satu keranjang bisa berisi selai, roti, dan buah.</li>
        <li><b>Ambil pesanan</b>: selai di titik temu setelah pre-order selesai, roti dan buah langsung di lokasi penjual dengan menunjukkan kode pesanan.</li>
      </ol>
      <p class="catatan">Kamu pedagang atau pemilik toko? <a href="#/pedagang">Masukkan stok di sini</a>.</p>
    </section>`;
}

// ===== Katalog per kategori =====
function kartuProduk(p) {
  const k = KATEGORI[p.kat];
  const batas = sisa(p);
  const habis = batas <= 0;
  const harga = p.hargaNormal && p.hargaNormal > p.harga
    ? `<s>${rupiah(p.hargaNormal)}</s> ${rupiah(p.harga)}` : rupiah(p.harga);
  let info;
  if (p.kat === 'selai') info = 'Pre-order · diambil di titik temu';
  else info = `Sisa ${fmtQty(p.stok)} ${k.satuan} · ambil sebelum ${esc(p.ambilSampai)}`;
  const tanpaSatuan = p.kat === 'selai' ? ' / jar' : p.kat === 'buah' ? ' / kg' : ' / pcs';
  return `
    <article class="card${habis ? ' habis' : ''}" data-produk="${p.id}">
      <div class="badge">${p.badge || ''}</div>
      <div class="img">${ilustrasi(p.jenis)}</div>
      <div class="brand">${esc(p.penjual)}</div>
      <div class="name">${esc(p.nama)}</div>
      ${p.kondisi ? `<div class="kondisi">${esc(p.kondisi)}</div>` : ''}
      ${p.kat !== 'selai' ? `<div class="lokasi">${esc(p.lokasi)}</div>` : ''}
      <div class="price">${harga}<small>${tanpaSatuan}</small></div>
      <div class="info">${info}</div>
      ${habis
        ? `<div class="habis-teks">${p.kat === 'selai' ? 'Pre-order ditutup' : 'Stok habis'}</div>`
        : `${stepperHTML('qty-kurang', 'qty-tambah', p.id, k.langkah, k.satuan)}
           <button type="button" class="btn" data-aksi="tambah" data-id="${p.id}">Tambah ke keranjang</button>`}
    </article>`;
}

function halamanKatalog(kat) {
  const k = KATEGORI[kat];
  const daftar = produkKategori(kat);
  const kosong = kat === 'buah'
    ? `<div class="kosong"><p>Belum ada stok buah.</p><p>Pedagang bisa menambahkan stok di halaman <a href="#/pedagang">Pedagang</a>.</p></div>`
    : `<div class="kosong"><p>Belum ada produk di kategori ini.</p></div>`;
  return `
    <p class="jejak"><a href="#/">Beranda</a> / ${k.label}</p>
    <h1 class="rata-kiri">${k.judul}</h1>
    <p class="desk">${k.desk}</p>
    <p>${chipAturan(kat)}</p>
    ${kat === 'selai' ? infoPOHTML() : ''}
    ${kat === 'buah' ? `<p class="catatan">Dijual per kg, tersedia dalam kelipatan 0,5 kg. Bayar di website, lalu ambil langsung di lapak pedagang. Pedagang bisa <a href="#/pedagang">menambah stok</a>.</p>` : ''}
    ${kat === 'roti' ? `<p class="catatan">Stok terbatas dan berkurang otomatis saat ada yang membeli. Ambil di toko sebelum jam yang tertera.</p>` : ''}
    ${daftar.length ? `<section class="grid" aria-label="${k.label}">${daftar.map(kartuProduk).join('')}</section>` : kosong}`;
}

// ===== Keranjang =====
function barisKeranjang(it) {
  const p = it.produk;
  const k = KATEGORI[p.kat];
  return `
    <li class="baris">
      <div class="baris-info">
        <b>${esc(p.nama)}</b>
        <span>${rupiah(p.harga)} / ${k.satuan}</span>
      </div>
      ${stepperHTML('cart-kurang', 'cart-tambah', p.id, it.qty, k.satuan)}
      <div class="baris-harga">${rupiah(p.harga * it.qty)}</div>
      <button type="button" class="link-hapus" data-aksi="cart-hapus" data-id="${p.id}" aria-label="Hapus ${esc(p.nama)}">Hapus</button>
    </li>`;
}

function blokKelompok(g, denganItems = true) {
  const ikon = KATEGORI[g.kat].label;
  return `
    <section class="kelompok">
      <div class="kel-kepala">
        <span class="chip chip-${g.kat}">${ikon}</span>
        <b>${esc(g.penjual)}</b>
      </div>
      <p class="kel-ambil"><b>Ambil di:</b> ${esc(g.lokasi)}<br><b>Waktu:</b> ${esc(g.waktu)}</p>
      ${denganItems ? `<ul class="daftar">${g.items.map(barisKeranjang).join('')}</ul>` : ''}
    </section>`;
}

function halamanKeranjang() {
  const items = itemKeranjang();
  if (!items.length) {
    return `
      <h1 class="rata-kiri">Keranjang</h1>
      <div class="kosong"><p>Keranjang masih kosong.</p>
      <p><a href="#/selai">Selai</a> · <a href="#/roti">Roti</a> · <a href="#/buah">Buah</a></p></div>`;
  }
  const masalah = cekKeranjang(items);
  const kelompok = kelompokAmbil(items);
  return `
    <h1 class="rata-kiri">Keranjang</h1>
    ${masalah.length ? `<div class="peringatan" role="alert">${masalah.map(esc).join('<br>')}</div>` : ''}
    ${kelompok.map((g) => blokKelompok(g)).join('')}
    <div class="total-bar">
      <span>Total</span><b>${rupiah(totalKeranjang(items))}</b>
    </div>
    <p class="aksi-bawah">
      <a class="btn btn-garis" href="#/">Belanja lagi</a>
      ${masalah.length
        ? `<button type="button" class="btn" disabled>Selesaikan masalah di atas dulu</button>`
        : `<a class="btn" href="#/checkout">Lanjut ke checkout</a>`}
    </p>`;
}

// ===== Checkout =====
function halamanCheckout() {
  const items = itemKeranjang();
  if (!items.length) {
    return `<h1 class="rata-kiri">Checkout</h1><div class="kosong"><p>Keranjang masih kosong.</p><p><a href="#/">Kembali belanja</a></p></div>`;
  }
  const masalah = cekKeranjang(items);
  const kelompok = kelompokAmbil(items);
  const ringkas = (g) => `
    <section class="kelompok">
      <div class="kel-kepala"><span class="chip chip-${g.kat}">${KATEGORI[g.kat].label}</span><b>${esc(g.penjual)}</b></div>
      <ul class="daftar ringkas">${g.items.map((it) => `
        <li><span>${esc(it.produk.nama)} × ${fmtQty(it.qty)} ${KATEGORI[g.kat].satuan}</span><b>${rupiah(it.produk.harga * it.qty)}</b></li>`).join('')}
      </ul>
      <p class="kel-ambil"><b>Ambil di:</b> ${esc(g.lokasi)}<br><b>Waktu:</b> ${esc(g.waktu)}</p>
    </section>`;
  return `
    <p class="jejak"><a href="#/keranjang">Keranjang</a> / Checkout</p>
    <h1 class="rata-kiri">Checkout</h1>
    ${masalah.length ? `<div class="peringatan" role="alert">${masalah.map(esc).join('<br>')} <a href="#/keranjang">Ubah keranjang</a></div>` : ''}
    ${kelompok.map(ringkas).join('')}
    <div class="total-bar"><span>Total bayar</span><b>${rupiah(totalKeranjang(items))}</b></div>

    <form id="form-checkout" class="form" novalidate>
      <h2 class="judul-bagian">Data pembeli</h2>
      <label for="nama">Nama</label>
      <input id="nama" name="nama" type="text" autocomplete="name" required maxlength="60">
      <label for="wa">Nomor WhatsApp</label>
      <input id="wa" name="wa" type="tel" inputmode="numeric" autocomplete="tel" placeholder="08xxxxxxxxxx" required maxlength="16">

      <fieldset>
        <legend>Metode pembayaran</legend>
        <label class="radio"><input type="radio" name="metode" value="QRIS" checked> QRIS</label>
        <label class="radio"><input type="radio" name="metode" value="Transfer bank"> Transfer bank</label>
        <label class="radio"><input type="radio" name="metode" value="E-wallet"> E-wallet</label>
      </fieldset>
      <p class="catatan">Pembayaran di prototipe ini masih simulasi: tidak ada uang yang sungguh dipindahkan.</p>
      <div id="pesan-form" class="peringatan" role="alert" hidden></div>
      <button type="submit" class="btn btn-besar"${masalah.length ? ' disabled' : ''}>Bayar sekarang (simulasi)</button>
    </form>`;
}

// ===== Pesanan =====
function rincianPesanan(o) {
  const kelompok = kelompokAmbil(o.items);
  // pakai tanggal siap yang tersimpan di pesanan
  const siap = o.poSiap ? 'Siap diambil sekitar ' + tgl(new Date(o.poSiap)) : null;
  return kelompok.map((g) => {
    const waktu = g.kat === 'selai' && siap ? siap : g.waktu;
    return `
      <section class="kelompok">
        <div class="kel-kepala"><span class="chip chip-${g.kat}">${KATEGORI[g.kat].label}</span><b>${esc(g.penjual)}</b></div>
        <ul class="daftar ringkas">${g.items.map((it) => `
          <li><span>${esc(it.nama)} × ${fmtQty(it.qty)} ${it.satuan}</span><b>${rupiah(it.harga * it.qty)}</b></li>`).join('')}
        </ul>
        <p class="kel-ambil"><b>Ambil di:</b> ${esc(g.lokasi)}<br><b>Waktu:</b> ${esc(waktu)}</p>
      </section>`;
  }).join('');
}

function halamanPesanan(kode) {
  const o = STATE.pesanan.find((x) => x.kode === kode);
  if (!o) {
    return `<h1 class="rata-kiri">Pesanan tidak ditemukan</h1><div class="kosong"><p><a href="#/pesanan">Lihat semua pesanan</a></p></div>`;
  }
  return `
    <div class="sukses">
      <p class="sukses-label">Pembayaran diterima (simulasi)</p>
      <p class="kode" aria-label="Kode pesanan">${esc(o.kode)}</p>
      <p>Tunjukkan kode ini saat mengambil pesanan.</p>
    </div>
    ${rincianPesanan(o)}
    <div class="total-bar"><span>Total dibayar (${esc(o.metode)})</span><b>${rupiah(o.total)}</b></div>
    <p class="catatan">Atas nama ${esc(o.pembeli.nama)} · WhatsApp ${esc(o.pembeli.wa)} · ${new Date(o.dibuat).toLocaleString('id-ID')}</p>
    <p class="aksi-bawah"><a class="btn btn-garis" href="#/pesanan">Semua pesanan</a><a class="btn" href="#/">Belanja lagi</a></p>`;
}

function halamanDaftarPesanan() {
  if (!STATE.pesanan.length) {
    return `<h1 class="rata-kiri">Pesanan saya</h1><div class="kosong"><p>Belum ada pesanan di browser ini.</p><p><a href="#/">Mulai belanja</a></p></div>`;
  }
  return `
    <h1 class="rata-kiri">Pesanan saya</h1>
    <ul class="daftar pesanan-list">${STATE.pesanan.map((o) => `
      <li>
        <a href="#/pesanan/${encodeURIComponent(o.kode)}"><b>${esc(o.kode)}</b></a>
        <span>${new Date(o.dibuat).toLocaleDateString('id-ID')} · ${o.items.length} produk</span>
        <b>${rupiah(o.total)}</b>
      </li>`).join('')}
    </ul>`;
}

// ===== Pedagang =====
function halamanPedagang() {
  const stok = STATE.produk.filter((p) => p.kat !== 'selai');
  const baris = (p) => `
    <li class="baris" data-stok="${p.id}">
      <div class="baris-info">
        <span class="chip chip-${p.kat}">${KATEGORI[p.kat].label}</span>
        <b>${esc(p.nama)}</b>
        <span>${esc(p.penjual)} · ${esc(p.lokasi)}</span>
      </div>
      <label class="kecil">Stok (${KATEGORI[p.kat].satuan})
        <input type="number" min="0" step="${KATEGORI[p.kat].langkah}" value="${p.stok}" data-f="stok"></label>
      <label class="kecil">Harga
        <input type="number" min="0" step="500" value="${p.harga}" data-f="harga"></label>
      <button type="button" class="btn btn-kecil" data-aksi="stok-simpan" data-id="${p.id}">Simpan</button>
      <button type="button" class="link-hapus" data-aksi="stok-hapus" data-id="${p.id}">Hapus</button>
    </li>`;
  return `
    <p class="jejak"><a href="#/">Beranda</a> / Pedagang</p>
    <h1 class="rata-kiri">Masukkan stok</h1>
    <p class="desk">Pedagang buah dan toko roti mitra bisa menambahkan stok yang tersedia hari ini. Stok langsung muncul di katalog dan pembeli bisa memesannya.</p>

    <form id="form-stok" class="form" novalidate>
      <label for="kat">Kategori</label>
      <select id="kat" name="kat">
        <option value="buah">Buah</option>
        <option value="roti">Roti</option>
      </select>

      <div data-untuk="buah">
        <label for="jenisBuah">Jenis buah</label>
        <select id="jenisBuah" name="jenisBuah">
          <option value="pisang">Pisang</option>
          <option value="nanas">Nanas</option>
          <option value="lain">Buah lain</option>
        </select>
        <div id="wrap-lain" hidden>
          <label for="namaLain">Nama buah</label>
          <input id="namaLain" name="namaLain" type="text" maxlength="40">
        </div>
        <label for="kondisi">Kondisi buah</label>
        <select id="kondisi" name="kondisi">
          <option value="matang">Matang</option>
          <option value="terlalu matang">Terlalu matang, tapi masih layak dan aman</option>
        </select>
      </div>

      <div data-untuk="roti" hidden>
        <label for="nama">Nama roti atau kue</label>
        <input id="nama" name="nama" type="text" maxlength="50">
        <label for="hargaNormal">Harga normal per pcs (opsional)</label>
        <input id="hargaNormal" name="hargaNormal" type="number" min="0" step="500">
      </div>

      <label for="penjual">Nama lapak atau toko</label>
      <input id="penjual" name="penjual" type="text" required maxlength="50">
      <label for="lokasi">Lokasi pengambilan</label>
      <input id="lokasi" name="lokasi" type="text" required maxlength="100" placeholder="Contoh: Pasar Grogol, blok B no. 12">
      <label for="stok" id="lbl-stok">Jumlah tersedia (kg)</label>
      <input id="stok" name="stok" type="number" min="0.5" step="0.5" required>
      <label for="harga" id="lbl-harga">Harga jual per kg (Rp)</label>
      <input id="harga" name="harga" type="number" min="500" step="500" required>
      <label for="ambilSampai">Bisa diambil sebelum jam</label>
      <input id="ambilSampai" name="ambilSampai" type="time" required value="17:00">

      <div id="pesan-form" class="peringatan" role="alert" hidden></div>
      <button type="submit" class="btn btn-besar">Tambahkan ke katalog</button>
    </form>

    <h2 class="judul-bagian">Stok yang tersedia</h2>
    <ul class="daftar stok-list">${stok.length ? stok.map(baris).join('') : '<li class="kosong">Belum ada stok.</li>'}</ul>
    <p class="aksi-bawah"><button type="button" class="link-hapus" data-aksi="reset">Kembalikan ke data contoh</button></p>`;
}
