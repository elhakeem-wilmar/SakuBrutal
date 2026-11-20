import React, { useState } from "react";
import PropTypes from "prop-types";
import { Search, Filter, ArrowUpDown, FileSpreadsheet } from "lucide-react";
import ItemTransaksi from "../components/ItemTransaksi";
import {
  KATEGORI_LIST,
  hitungStatistik,
  formatRupiah,
  buatCsvTransaksi,
  unduhFile,
  tanggalRelatif,
} from "../data";
import "./Pages.css";

function Transaksi({ daftarTransaksi, padaEditTransaksi, padaHapusTransaksi }) {
  const [kataKunci, setKataKunci] = useState("");
  const [filterTipe, setFilterTipe] = useState("semua");
  const [filterKategori, setFilterKategori] = useState("semua");
  const [urutan, setUrutan] = useState("terbaru");

  const hasilFilter = daftarTransaksi.filter((item) => {
    const cocokKata = item.judul
      .toLowerCase()
      .includes(kataKunci.trim().toLowerCase());
    const cocokTipe = filterTipe === "semua" || item.tipe === filterTipe;
    const cocokKategori =
      filterKategori === "semua" || item.kategori === filterKategori;
    return cocokKata && cocokTipe && cocokKategori;
  });

  const hasilUrut = [...hasilFilter].sort((a, b) => {
    if (urutan === "terbesar") return b.nominal - a.nominal;
    if (urutan === "terkecil") return a.nominal - b.nominal;
    if (urutan === "terlama") return a.tanggal.localeCompare(b.tanggal);
    return b.tanggal.localeCompare(a.tanggal);
  });

  const ringkasanFilter = hitungStatistik(hasilUrut);

  function tanganiEksporCsv() {
    if (hasilUrut.length === 0) return;
    const isiCsv = buatCsvTransaksi(hasilUrut);
    unduhFile(
      `wilmar-trance-ledger-${tanggalRelatif(0)}.csv`,
      isiCsv,
      "text/csv;charset=utf-8;",
    );
  }

  return (
    <main className="page-container">
      <section className="brutal-card filter-bar">
        <div className="filter-header">
          <div>
            <h1 className="page-heading">Complete Transaction Ledger</h1>
            <p className="page-sub">
              Cari, saring, urutkan, edit catatan, atau unduh laporan arus kas
              dalam format CSV.
            </p>
          </div>

          <div className="filter-header-right">
            <div className="filter-summary mono">
              <span>{hasilUrut.length} entries</span>
              <span className="summary-in">
                +{formatRupiah(ringkasanFilter.pemasukan)}
              </span>
              <span className="summary-out">
                -{formatRupiah(ringkasanFilter.pengeluaran)}
              </span>
              <span
                className={
                  ringkasanFilter.selisih >= 0 ? "summary-in" : "summary-out"
                }
              >
                Net: {ringkasanFilter.selisih >= 0 ? "+" : "-"}
                {formatRupiah(Math.abs(ringkasanFilter.selisih))}
              </span>
            </div>

            <button
              type="button"
              className="brutal-btn emerald btn-sm"
              onClick={tanganiEksporCsv}
              disabled={hasilUrut.length === 0}
              title="Unduh daftar transaksi yang sedang ditampilkan ke file CSV (Excel)"
            >
              <FileSpreadsheet size={16} strokeWidth={2} aria-hidden="true" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <label htmlFor="cari-transaksi" className="sr-label">
              Search Description
            </label>
            <div className="search-input-wrap">
              <Search size={17} className="search-icon" aria-hidden="true" />
              <input
                id="cari-transaksi"
                type="text"
                className="brutal-input with-icon"
                placeholder="Contoh: Honor asisten, Kopi, Bensin..."
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
              />
            </div>
          </div>

          <div className="select-group-three">
            <div className="filter-field">
              <label htmlFor="filter-tipe" className="sr-label">
                <Filter size={13} aria-hidden="true" /> Entry Type
              </label>
              <select
                id="filter-tipe"
                className="brutal-select"
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value)}
              >
                <option value="semua">All Types</option>
                <option value="pemasukan">Inflow (+)</option>
                <option value="pengeluaran">Outflow (-)</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="filter-kategori" className="sr-label">
                Category
              </label>
              <select
                id="filter-kategori"
                className="brutal-select"
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
              >
                <option value="semua">All Categories</option>
                {KATEGORI_LIST.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="urut-transaksi" className="sr-label">
                <ArrowUpDown size={13} aria-hidden="true" /> Sort By
              </label>
              <select
                id="urut-transaksi"
                className="brutal-select"
                value={urutan}
                onChange={(e) => setUrutan(e.target.value)}
              >
                <option value="terbaru">Newest Date</option>
                <option value="terlama">Oldest Date</option>
                <option value="terbesar">Highest Amount</option>
                <option value="terkecil">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="brutal-card" aria-label="Filtered ledger entries">
        <div className="box-header">
          <h2 className="section-title">
            Ledger Records ({hasilUrut.length})
          </h2>
          {(kataKunci ||
            filterTipe !== "semua" ||
            filterKategori !== "semua" ||
            urutan !== "terbaru") && (
            <button
              type="button"
              className="brutal-btn white btn-sm"
              onClick={() => {
                setKataKunci("");
                setFilterTipe("semua");
                setFilterKategori("semua");
                setUrutan("terbaru");
              }}
            >
              Reset Filter
            </button>
          )}
        </div>

        {hasilUrut.length === 0 ? (
          <div className="empty-state-box">
            <p className="empty-state">
              {daftarTransaksi.length === 0
                ? "Belum ada catatan transaksi tersimpan. Tambahkan transaksi pertamamu melalui halaman Overview."
                : "Tidak ada transaksi yang cocok dengan filter pencarian saat ini."}
            </p>
            {(kataKunci || filterTipe !== "semua" || filterKategori !== "semua") && (
              <button
                type="button"
                className="brutal-btn white"
                onClick={() => {
                  setKataKunci("");
                  setFilterTipe("semua");
                  setFilterKategori("semua");
                }}
              >
                Show All Entries
              </button>
            )}
          </div>
        ) : (
          <ul className="trx-list">
            {hasilUrut.map((item) => (
              <ItemTransaksi
                key={item.id}
                id={item.id}
                judul={item.judul}
                nominal={item.nominal}
                tipe={item.tipe}
                kategori={item.kategori}
                tanggal={item.tanggal}
                padaEdit={padaEditTransaksi}
                padaHapus={padaHapusTransaksi}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

Transaksi.propTypes = {
  daftarTransaksi: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      judul: PropTypes.string.isRequired,
      nominal: PropTypes.number.isRequired,
      tipe: PropTypes.string.isRequired,
      kategori: PropTypes.string.isRequired,
      tanggal: PropTypes.string.isRequired,
    }),
  ).isRequired,
  padaEditTransaksi: PropTypes.func.isRequired,
  padaHapusTransaksi: PropTypes.func.isRequired,
};

export default Transaksi;
