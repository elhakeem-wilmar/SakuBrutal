# Wilmar Trance

Aplikasi web pencatat arus kas pribadi dan target tabungan berbasis React + Vite dengan konsep visual *Quiet Heritage Banking* (mendukung mode *Ivory Day* dan *Obsidian Night*). Dirancang untuk pemakaian finansial harian tanpa sistem saldo dompet mengendap.

## Halaman & Fitur Utama

- **Overview (`/`)**:
  - 3 Kartu Ringkasan Eksekutif (*Cash Inflow*, *Cash Outflow*, dan *Net Cashflow* beserta persentase *savings rate*) yang dapat difilter per rentang waktu (*Daily*, *Weekly*, *Monthly*, atau *All Time*).
  - Pengukur **Monthly Spending Limit** (batas anggaran pengeluaran 30 hari) dengan bilah indikator warna otomatis.
  - Perbandingan proporsi arus kas masuk vs keluar dan rincian kategori pengeluaran terbesar.
  - Form pencatatan transaksi baru dengan pratinjau format Rupiah langsung, chip nominal cepat (`+25rb` s.d. `+500rb`), serta fitur edit/hapus langsung pada daftar catatan terbaru.
- **Ledger (`/transaksi`)**:
  - Riwayat lengkap seluruh catatan dengan pencarian kata kunci, filter tipe & kategori, pengurutan (*Newest*, *Oldest*, *Highest Amount*, *Lowest Amount*), edit catatan langsung (*inline edit*), serta tombol **Export CSV** untuk dibuka di Excel/Spreadsheet.
- **Savings Vault (`/target`)**:
  - Buat dan edit target tabungan, tambah setoran (`+ Deposit`) maupun tarik dana (`- Withdraw`), tombol setoran cepat, serta pemantauan persentase progres dan sisa target.
- **Keamanan Data Harian (Navbar)**:
  - Fitur **Backup** (unduh JSON), **Restore** (pulihkan dari file JSON), sakelar tema **Ivory Day / Obsidian Night**, dan tombol **Reset** dengan konfirmasi dua langkah agar data tidak terhapus secara tidak sengaja.

## Menjalankan Proyek

```bash
npm install
npm run dev
```
