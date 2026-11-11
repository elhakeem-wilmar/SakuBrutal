# SakuBrutal: Studi Kasus Aplikasi Catatan Keuangan & Target Tabungan (Praktikum DPW Pertemuan 12)

## 1. Deskripsi Studi Kasus
SakuBrutal adalah aplikasi web pencatat arus kas pribadi dan target tabungan berbasis React dengan gaya visual Neobrutalism bertema Paper Money & Gold. Aplikasi ini berfokus murni pada pencatatan keuangan (tanpa konsep saldo dompet mengendap): pengguna mencatat pemasukan serta pengeluaran berdasarkan waktu, melihat statistik distribusi kategori, dan memantau progres tabungan untuk setiap target yang ingin dicapai.

## 2. Daftar Fitur Lengkap (Studi Kasus)
1. **Filter Rentang Waktu di Beranda (`Harian`, `Mingguan`, `Bulanan`, `Semua Waktu`)**:
   - Menyaring otomatis total pemasukan, total pengeluaran, panel statistik, serta daftar catatan terbaru sesuai rentang waktu yang dipilih.
2. **Panel Statistik Keuangan di Beranda (`/`)**:
   - Menampilkan rasio proporsi arus kas masuk vs keluar dalam bentuk visual bar dan persentase.
   - Menampilkan rata-rata pengeluaran per transaksi pada periode terpilih.
   - Menampilkan rincian kategori pengeluaran terbesar lengkap dengan nominal dan persentase porsi belanja.
3. **Pencatatan Transaksi Baru (Form Reaktif)**:
   - Menambahkan catatan pemasukan (+) maupun pengeluaran (-) lengkap dengan validasi input, pilihan kategori, dan tanggal.
4. **Manajemen & Filter Riwayat Transaksi (`/transaksi`)**:
   - Pencarian catatan berdasarkan kata kunci keterangan.
   - Filter berdasarkan tipe (`Semua`, `Pemasukan`, `Pengeluaran`) dan kategori.
   - Ringkasan total pemasukan dan pengeluaran dari daftar yang sedang difilter serta tombol hapus catatan.
5. **Target & Progres Tabungan (`/target`)**:
   - Membuat target tabungan baru dengan menentukan nama target, nominal target, dan tabungan awal opsional.
   - Menambahkan uang yang sudah ditabung pada setiap target (baik dengan nominal manual maupun tombol cepat +Rp 50.000 / +Rp 100.000).
   - Menampilkan progres tabungan secara visual dan dalam persentase (`0%` hingga `100%`) beserta sisa nominal yang dibutuhkan.
6. **Halaman 404 Standalone (`*`)**:
   - Menampilkan halaman khusus `NotFound` di tengah layar tanpa navbar saat pengguna mengakses rute yang tidak terdaftar.

## 3. Kesesuaian Materi Modul Praktikum (Modul 9, 10, 11)
| Materi Modul | Implementasi pada Proyek |
| :--- | :--- |
| **Modul 9: Komponen, Composition, `map()`, & `data.js`** | Pemisahan komponen reusable (`Navbar`, `KartuRingkasan`, `FormTransaksi`, `ItemTransaksi`), impor data awal dari `src/data.js`, dan rendering daftar menggunakan `.map()`. |
| **Modul 10: Props, State (`useState`), & Event Handling** | State utama dikelola di `App.jsx` serta state lokal filter/form di `Beranda.jsx`, `FormTransaksi.jsx`, `Transaksi.jsx`, dan `TargetTabungan.jsx`. Aliran data satu arah melalui Props dan pengiriman fungsi event handler. |
| **Modul 11: Struktur Bersih & React Router** | Struktur folder `src/components/` dan `src/pages/` beserta penggunaan `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Outlet>`, `<NavLink>`, dan rute `path="*"` (`NotFound.jsx`). |
| **Tambahan (`prop-types` & `lucide-react`)** | Validasi tipe props dengan `PropTypes` di seluruh komponen serta ikon fungsional dari `lucide-react`. |

## 4. Alasan Keputusan Visual (R-31 Antislop)
- **Palet Warna (Paper Money & Gold):** Latar kertas hangat (`#FFFDF5`), hijau emerald (`#22C55E`) untuk pemasukan/tabungan, merah coral (`#FB7185`) untuk pengeluaran, dan kuning emas (`#FACC15`) sebagai aksen fokus aktif agar hierarki masuk vs keluar terbaca instan dengan kontras WCAG AA (> 7:1).
- **Tipografi (`Plus Jakarta Sans` & `Space Mono`):** Sans-serif geometris untuk keterbacaan label Indonesia dan monospace khusus untuk deretan angka Rupiah, tanggal, serta persentase agar sejajar saat dipindai.
- **Tata Letak & Kartu:** Struktur setiap halaman mengikuti keputusan utama pengguna (filter periode + statistik di Beranda, pencarian penuh di Transaksi, dan pembuatan + setoran tabungan di Target Tabungan) dengan border tebal 3px dan bayangan tajam untuk memisahkan kelompok data.
- **Ikon (`lucide-react`):** Dipertahankan sesuai instruksi praktikum dengan setiap ikon dipasangkan pada aksi/label finansial yang relevan dan atribut `aria-hidden="true"`.

## 5. Cara Menjalankan Proyek
```bash
npm install
npm run dev
```
