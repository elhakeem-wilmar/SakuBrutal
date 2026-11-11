import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router";
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";
import KartuRingkasan from "../components/KartuRingkasan";
import FormTransaksi from "../components/FormTransaksi";
import ItemTransaksi from "../components/ItemTransaksi";
import {
  PERIODE_LIST,
  filterTransaksiPeriode,
  hitungStatistik,
  formatRupiah,
} from "../data";
import "./Pages.css";

function Beranda({ daftarTransaksi, padaTambahTransaksi, padaHapusTransaksi }) {
  const [periodeAktif, setPeriodeAktif] = useState("bulanan");

  const transaksiPeriode = filterTransaksiPeriode(daftarTransaksi, periodeAktif);
  const statistik = hitungStatistik(transaksiPeriode);
  const transaksiTerbaru = transaksiPeriode.slice(0, 5);
  const labelPeriode =
    PERIODE_LIST.find((p) => p.id === periodeAktif)?.label || "This Period";

  return (
    <main className="page-container">
      <section className="hero-banner brutal-card">
        <div className="hero-text">
          <h1 className="page-heading">Cashflow Overview & Analytics</h1>
          <p className="page-sub">
            Pantau arus kas masuk, distribusi pengeluaran per kategori, dan
            ringkasan finansial berdasarkan rentang waktu pilihanmu.
          </p>
        </div>

        <div
          className="periode-tabs"
          role="group"
          aria-label="Filter timeframe"
        >
          {PERIODE_LIST.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={periodeAktif === item.id}
              className={`periode-btn ${
                periodeAktif === item.id ? "active" : ""
              }`}
              onClick={() => setPeriodeAktif(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="summary-grid-two" aria-label="Period summary">
        <KartuRingkasan
          judul={`CASH INFLOW (${labelPeriode.toUpperCase()})`}
          nominal={statistik.pemasukan}
          varian="emerald"
          keterangan={`${statistik.jumlahPemasukan} catatan pemasukan pada periode ini`}
        >
          <TrendingUp size={20} strokeWidth={2} />
        </KartuRingkasan>

        <KartuRingkasan
          judul={`CASH OUTFLOW (${labelPeriode.toUpperCase()})`}
          nominal={statistik.pengeluaran}
          varian="coral"
          keterangan={`${statistik.jumlahPengeluaran} catatan pengeluaran (Rata-rata ${formatRupiah(
            statistik.rataRataPengeluaran,
          )} / transaksi)`}
        >
          <TrendingDown size={20} strokeWidth={2} />
        </KartuRingkasan>
      </section>

      <section className="stats-grid" aria-label="Cashflow and category statistics">
        <article className="brutal-card stats-card">
          <div className="stats-header">
            <h2 className="section-title">
              How Does Inflow Compare to Outflow ({labelPeriode})?
            </h2>
            <BarChart3 size={19} strokeWidth={2} aria-hidden="true" />
          </div>

          {statistik.pemasukan === 0 && statistik.pengeluaran === 0 ? (
            <p className="empty-state">
              Belum ada data arus kas pada rentang {labelPeriode.toLowerCase()}.
              Gunakan formulir di bawah untuk mencatat transaksi pertama.
            </p>
          ) : (
            <>
              <div
                className="cashflow-bar"
                role="img"
                aria-label={`Inflow proportion ${statistik.persenPemasukan}% and outflow proportion ${statistik.persenPengeluaran}%`}
              >
                {statistik.persenPemasukan > 0 && (
                  <div
                    className="cashflow-segment pemasukan"
                    style={{ width: `${statistik.persenPemasukan}%` }}
                  >
                    <span>{statistik.persenPemasukan}%</span>
                  </div>
                )}
                {statistik.persenPengeluaran > 0 && (
                  <div
                    className="cashflow-segment pengeluaran"
                    style={{ width: `${statistik.persenPengeluaran}%` }}
                  >
                    <span>{statistik.persenPengeluaran}%</span>
                  </div>
                )}
              </div>

              <div className="stats-legend mono">
                <div className="legend-item">
                  <span className="legend-swatch pemasukan" aria-hidden="true" />
                  <span>
                    Inflow: {formatRupiah(statistik.pemasukan)} (
                    {statistik.persenPemasukan}%)
                  </span>
                </div>
                <div className="legend-item">
                  <span className="legend-swatch pengeluaran" aria-hidden="true" />
                  <span>
                    Outflow: {formatRupiah(statistik.pengeluaran)} (
                    {statistik.persenPengeluaran}%)
                  </span>
                </div>
              </div>

              <div className="stats-highlight">
                <span>Average Outflow per Entry:</span>
                <strong className="mono">
                  {formatRupiah(statistik.rataRataPengeluaran)}
                </strong>
              </div>
            </>
          )}
        </article>

        <article className="brutal-card stats-card">
          <div className="stats-header">
            <h2 className="section-title">
              Where Do Top Outflows Go ({labelPeriode})?
            </h2>
            <PieChart size={19} strokeWidth={2} aria-hidden="true" />
          </div>

          {statistik.perKategori.length === 0 ? (
            <p className="empty-state">
              Tidak ada pengeluaran tercatat pada {labelPeriode.toLowerCase()}.
              Pilih rentang waktu lain atau tambahkan catatan pengeluaran baru.
            </p>
          ) : (
            <ul className="kategori-stat-list">
              {statistik.perKategori.map((item) => (
                <li key={item.kategori} className="kategori-stat-item">
                  <div className="kategori-stat-top">
                    <span className="kategori-stat-name">{item.kategori}</span>
                    <span className="mono kategori-stat-val">
                      {formatRupiah(item.nominal)} ({item.persen}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill coral"
                      style={{ width: `${Math.max(item.persen, 4)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="dashboard-split">
        <FormTransaksi padaTambah={padaTambahTransaksi} />

        <div className="brutal-card recent-box">
          <div className="box-header">
            <h2 className="section-title">
              Recent Entries ({labelPeriode}: {transaksiPeriode.length})
            </h2>
            <NavLink to="/transaksi" className="link-more">
              View Full Ledger
            </NavLink>
          </div>

          {transaksiTerbaru.length === 0 ? (
            <p className="empty-state">
              Belum ada transaksi pada rentang {labelPeriode.toLowerCase()}.
              Isi formulir di samping untuk menambahkan catatan baru, atau ganti
              tab rentang waktu di atas.
            </p>
          ) : (
            <ul className="trx-list">
              {transaksiTerbaru.map((item) => (
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
        </div>
      </section>
    </main>
  );
}

Beranda.propTypes = {
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
  padaTambahTransaksi: PropTypes.func.isRequired,
  padaHapusTransaksi: PropTypes.func.isRequired,
};

export default Beranda;
