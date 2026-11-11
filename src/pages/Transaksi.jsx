import React, { useState } from "react";
import PropTypes from "prop-types";
import { Search, Filter } from "lucide-react";
import ItemTransaksi from "../components/ItemTransaksi";
import { KATEGORI_LIST, hitungStatistik, formatRupiah } from "../data";
import "./Pages.css";

function Transaksi({ daftarTransaksi, padaHapusTransaksi }) {
  const [kataKunci, setKataKunci] = useState("");
  const [filterTipe, setFilterTipe] = useState("semua");
  const [filterKategori, setFilterKategori] = useState("semua");

  const hasilFilter = daftarTransaksi.filter((item) => {
    const cocokKata = item.judul
      .toLowerCase()
      .includes(kataKunci.trim().toLowerCase());
    const cocokTipe = filterTipe === "semua" || item.tipe === filterTipe;
    const cocokKategori =
      filterKategori === "semua" || item.kategori === filterKategori;
    return cocokKata && cocokTipe && cocokKategori;
  });

  const ringkasanFilter = hitungStatistik(hasilFilter);

  return (
    <main className="page-container">
      <section className="brutal-card filter-bar">
        <div className="filter-header">
          <div>
            <h1 className="page-heading">Complete Transaction Ledger</h1>
            <p className="page-sub">
              Cari dan saring seluruh catatan pemasukan maupun pengeluaran
              berdasarkan kategori.
            </p>
          </div>
          <div className="filter-summary mono">
            <span>{hasilFilter.length} entries matched</span>
            <span className="summary-in">
              +{formatRupiah(ringkasanFilter.pemasukan)}
            </span>
            <span className="summary-out">
              -{formatRupiah(ringkasanFilter.pengeluaran)}
            </span>
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

          <div className="select-group">
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
          </div>
        </div>
      </section>

      <section className="brutal-card" aria-label="Filtered ledger entries">
        <h2 className="section-title list-heading">
          Ledger Records ({hasilFilter.length})
        </h2>
        {hasilFilter.length === 0 ? (
          <div className="empty-state-box">
            <p className="empty-state">
              Tidak ada transaksi yang cocok dengan filter pencarian saat ini.
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
            {hasilFilter.map((item) => (
              <ItemTransaksi
                key={item.id}
                id={item.id}
                judul={item.judul}
                nominal={item.nominal}
                tipe={item.tipe}
                kategori={item.kategori}
                tanggal={item.tanggal}
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
  padaHapusTransaksi: PropTypes.func.isRequired,
};

export default Transaksi;
