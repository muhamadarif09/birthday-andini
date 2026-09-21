# Untuk Andini 💐

Website ulang tahun interaktif berbahasa Indonesia dengan alur lima bagian yang berurutan:

1. Selamat Datang
2. Surat Untukmu
3. Empat Kenangan Kita
4. Ensiklopedia Andini
5. Mawar Interaktif dan ending “I Love You”

Tidak ada menu bab. Setiap bagian memiliki tombol lanjut dan kembali yang jelas, sedangkan bagian terakhir berhenti pada animasi bubble “I Love You”.

## Mengganti teks

Semua isi personal utama berada di `js/data.js`:

- nama;
- teks pembuka dan surat;
- urutan empat foto;
- enam entri Ensiklopedia Andini;
- array `loveMessages` berisi empat pesan kelopak.

Empat pesan mawar sengaja disimpan pada satu array agar mudah diedit:

```javascript
const loveMessages = [
  "Pesan pertama",
  "Pesan kedua",
  "Pesan ketiga",
  "Pesan keempat"
];
```

Jumlah pesannya harus tetap empat agar sesuai dengan empat kelopak interaktif.

## Mengganti foto

Foto galeri berada di `assets/images/` dengan nama:

- `memory-01.jpeg`
- `memory-02.jpeg`
- `memory-03.jpeg`
- `memory-04.jpeg`

Ganti file dengan nama yang sama untuk mempertahankan urutan tanpa mengubah kode. Galeri memang tidak menampilkan caption atau judul per foto.

## Musik

Website sudah menyertakan instrumental akustik romantis orisinal di `assets/music/romantic-acoustic.wav`. Musik berjalan setelah hadiah disentuh dan bisa dinyalakan atau dimatikan dari tombol musik.

## Menjalankan lokal

`index.html` bisa dibuka langsung untuk melihat sebagian besar fitur. Untuk menguji PWA, service worker, dan mode offline, jalankan server lokal dari folder proyek:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Memasang di Android atau iPhone

Setelah dipublikasikan melalui GitHub Pages:

- **Android/Chrome:** ketuk ikon panah turun di kanan atas, lalu pilih **Pasang Sekarang**. Bisa juga melalui menu browser → **Install app**.
- **iPhone/Safari:** ketuk ikon panah turun untuk melihat panduan, atau pilih **Bagikan → Tambahkan ke Layar Utama**.

PWA memerlukan HTTPS; GitHub Pages sudah menyediakannya secara otomatis.

## Deploy ke GitHub Pages

1. Upload seluruh isi folder ini ke root repository GitHub.
2. Buka **Settings → Pages**.
3. Pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`.
5. Simpan dan tunggu alamat `https://username.github.io/nama-repository/` aktif.

## Reset untuk pengujian

Klik tombol `⋯` di kanan atas, lalu pilih **Mulai dari awal**. Progres empat kelopak disimpan hanya di perangkat melalui `localStorage`.
