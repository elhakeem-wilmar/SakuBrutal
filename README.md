# SakuBrutal

Aplikasi web pencatat pemasukan, pengeluaran, dan target tabungan berbasis React + Vite. Dibuat untuk memantau arus kas harian dan progres tabungan per target tanpa sistem saldo dompet mengendap.

## Halaman & Fitur

- **Beranda (`/`)**: Ringkasan pemasukan dan pengeluaran yang bisa difilter per rentang waktu (harian, mingguan, bulanan, atau semua waktu), perbandingan kas masuk vs keluar, rincian kategori pengeluaran terbesar, dan form tambah transaksi baru.
- **Riwayat Transaksi (`/transaksi`)**: Daftar seluruh catatan dengan pencarian kata kunci, filter tipe transaksi serta kategori, dan tombol hapus catatan.
- **Target Tabungan (`/target`)**: Buat target tabungan baru, tambah nominal tabungan (manual atau tombol cepat +Rp50.000 / +Rp100.000), dan pantau persentase progres beserta sisa kekurangan dana.

## Menjalankan Proyek

```bash
npm install
npm run dev
```
