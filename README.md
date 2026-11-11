# Verve Folio

Aplikasi web pencatat arus kas pribadi dan target tabungan berbasis React + Vite dengan konsep visual *Quiet Heritage Banking*. Dibuat untuk memantau pemasukan, pengeluaran, dan progres tabungan per target tanpa sistem saldo dompet mengendap.

## Halaman & Fitur

- **Overview (`/`)**: Ringkasan *Cash Inflow* dan *Cash Outflow* yang bisa difilter per rentang waktu (*Daily*, *Weekly*, *Monthly*, atau *All Time*), perbandingan proporsi arus kas, rincian kategori pengeluaran terbesar, dan form pencatatan transaksi baru.
- **Ledger (`/transaksi`)**: Riwayat seluruh catatan transaksi dengan pencarian kata kunci, filter tipe transaksi serta kategori, dan tombol hapus catatan.
- **Savings Vault (`/target`)**: Buat target tabungan baru, tambah nominal setoran (manual atau tombol cepat +Rp50.000 / +Rp100.000), dan pantau persentase progres beserta sisa kekurangan dana.

## Menjalankan Proyek

```bash
npm install
npm run dev
```
