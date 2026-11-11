export const KATEGORI_LIST = [
  "Gaji & Proyek",
  "Investasi",
  "Makanan & Minuman",
  "Transportasi",
  "Kuliah & Buku",
  "Hiburan & Langganan",
];

export const PERIODE_LIST = [
  { id: "harian", label: "Daily (Today)" },
  { id: "mingguan", label: "Weekly (7 Days)" },
  { id: "bulanan", label: "Monthly (30 Days)" },
  { id: "semua", label: "All Time" },
];

// Menghasilkan string YYYY-MM-DD mundur sejumlah hari dari hari ini agar filter Harian/Mingguan/Bulanan selalu memiliki sampel data aktif
export function tanggalRelatif(hariLalu = 0) {
  const tgl = new Date();
  tgl.setDate(tgl.getDate() - hariLalu);
  const tahun = tgl.getFullYear();
  const bulan = String(tgl.getMonth() + 1).padStart(2, "0");
  const hari = String(tgl.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
}

export const DATA_TRANSAKSI_AWAL = [
  {
    id: "trx-1",
    judul: "Honor Asisten Praktikum DPW",
    nominal: 1500000,
    tipe: "pemasukan",
    kategori: "Gaji & Proyek",
    tanggal: tanggalRelatif(0),
  },
  {
    id: "trx-2",
    judul: "Kopi & Makan Siang Kampus",
    nominal: 65000,
    tipe: "pengeluaran",
    kategori: "Makanan & Minuman",
    tanggal: tanggalRelatif(0),
  },
  {
    id: "trx-3",
    judul: "Bensin & Parkir Motor",
    nominal: 85000,
    tipe: "pengeluaran",
    kategori: "Transportasi",
    tanggal: tanggalRelatif(2),
  },
  {
    id: "trx-4",
    judul: "Freelance Desain UI Web UMKM",
    nominal: 950000,
    tipe: "pemasukan",
    kategori: "Gaji & Proyek",
    tanggal: tanggalRelatif(4),
  },
  {
    id: "trx-5",
    judul: "Beli Modul & Referensi Pemrograman",
    nominal: 180000,
    tipe: "pengeluaran",
    kategori: "Kuliah & Buku",
    tanggal: tanggalRelatif(11),
  },
  {
    id: "trx-6",
    judul: "Belanja Bahan Makanan Kos",
    nominal: 240000,
    tipe: "pengeluaran",
    kategori: "Makanan & Minuman",
    tanggal: tanggalRelatif(16),
  },
  {
    id: "trx-7",
    judul: "Imbal Hasil Reksadana Pasar Uang",
    nominal: 200000,
    tipe: "pemasukan",
    kategori: "Investasi",
    tanggal: tanggalRelatif(21),
  },
];

export const DATA_TARGET_AWAL = [
  {
    id: "tgt-1",
    nama: "Dana Darurat Mahasiswa",
    targetNominal: 3000000,
    terkumpul: 1800000,
  },
  {
    id: "tgt-2",
    nama: "Upgrade SSD & RAM Laptop",
    targetNominal: 1200000,
    terkumpul: 900000,
  },
  {
    id: "tgt-3",
    nama: "Biaya Sertifikasi & Domain Proyek",
    targetNominal: 600000,
    terkumpul: 600000,
  },
];

export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

export function filterTransaksiPeriode(
  daftarTransaksi,
  periode = "semua",
  acuanTanggalStr = tanggalRelatif(0),
) {
  if (periode === "semua") return daftarTransaksi;

  const acuan = new Date(`${acuanTanggalStr}T23:59:59`);
  const batasHari =
    periode === "harian" ? 0 : periode === "mingguan" ? 6 : 29;

  const awalPeriode = new Date(`${acuanTanggalStr}T00:00:00`);
  awalPeriode.setDate(awalPeriode.getDate() - batasHari);

  return daftarTransaksi.filter((item) => {
    if (periode === "harian") {
      return item.tanggal === acuanTanggalStr;
    }
    const tglItem = new Date(`${item.tanggal}T12:00:00`);
    return tglItem >= awalPeriode && tglItem <= acuan;
  });
}

export function hitungStatistik(daftarTransaksi) {
  let pemasukan = 0;
  let pengeluaran = 0;
  let jumlahPemasukan = 0;
  let jumlahPengeluaran = 0;
  const mapKategori = {};

  for (const item of daftarTransaksi) {
    const nilai = Number(item.nominal) || 0;
    if (item.tipe === "pemasukan") {
      pemasukan += nilai;
      jumlahPemasukan += 1;
    } else if (item.tipe === "pengeluaran") {
      pengeluaran += nilai;
      jumlahPengeluaran += 1;
      mapKategori[item.kategori] = (mapKategori[item.kategori] || 0) + nilai;
    }
  }

  const totalVolume = pemasukan + pengeluaran;
  const persenPemasukan =
    totalVolume > 0 ? Math.round((pemasukan / totalVolume) * 100) : 0;
  const persenPengeluaran =
    totalVolume > 0 ? 100 - persenPemasukan : 0;
  const rataRataPengeluaran =
    jumlahPengeluaran > 0 ? Math.round(pengeluaran / jumlahPengeluaran) : 0;

  const perKategori = Object.entries(mapKategori)
    .map(([kategori, nominal]) => ({
      kategori,
      nominal,
      persen: pengeluaran > 0 ? Math.round((nominal / pengeluaran) * 100) : 0,
    }))
    .sort((a, b) => b.nominal - a.nominal);

  return {
    pemasukan,
    pengeluaran,
    jumlahPemasukan,
    jumlahPengeluaran,
    persenPemasukan,
    persenPengeluaran,
    rataRataPengeluaran,
    perKategori,
  };
}

// Self-check kalkulasi statistik dan filter periode saat modul dimuat
const _ujiStat = hitungStatistik([
  { tipe: "pemasukan", nominal: 600000, kategori: "Gaji & Proyek" },
  { tipe: "pengeluaran", nominal: 200000, kategori: "Makanan & Minuman" },
  { tipe: "pengeluaran", nominal: 200000, kategori: "Transportasi" },
]);
console.assert(
  _ujiStat.pemasukan === 600000 &&
    _ujiStat.pengeluaran === 400000 &&
    _ujiStat.rataRataPengeluaran === 200000 &&
    _ujiStat.perKategori.length === 2,
  "Self-check hitungStatistik gagal",
);
