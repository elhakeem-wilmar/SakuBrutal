import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  Scale,
  ShieldAlert,
  BarChart3,
  PieChart,
  SlidersHorizontal,
  Check,
  X,
} from "lucide-react";
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

function Beranda({
  daftarTransaksi,
  batasAnggaran,
  padaUbahAnggaran,
  padaTambahTransaksi,
  padaEditTransaksi,
  padaHapusTransaksi,
}) {
  const [periodeAktif, setPeriodeAktif] = useState("bulanan");
  const [bukaEditAnggaran, setBukaEditAnggaran] = useState(false);
  const [inputAnggaran, setInputAnggaran] = useState(
    batasAnggaran > 0 ? String(batasAnggaran) : "",
  );
  const [errorAnggaran, setErrorAnggaran] = useState("");

  const transaksiPeriode = filterTransaksiPeriode(daftarTransaksi, periodeAktif);
  const statistik = hitungStatistik(transaksiPeriode);
  const transaksiTerbaru = transaksiPeriode.slice(0, 6);
  const labelPeriode =
    PERIODE_LIST.find((p) => p.id === periodeAktif)?.label || "This Period";

  // Statistik 30 hari terakhir khusus untuk pengukur Batas Anggaran Bulanan
  const transaksiBulanan = filterTransaksiPeriode(daftarTransaksi, "bulanan");
  const statBulanan = hitungStatistik(transaksiBulanan);
  const persenAnggaran =
    batasAnggaran > 0
      ? Math.round((statBulanan.pengeluaran / batasAnggaran) * 100)
      : 0;
  const sisaAnggaran = batasAnggaran - statBulanan.pengeluaran;

  const isSurplus = statistik.selisih >= 0;
  const awalanSelisih =
    statistik.selisih > 0 ? "+" : statistik.selisih < 0 ? "-" : "";

  function simpanAnggaran(e) {
    e.preventDefault();
    const nilai = inputAnggaran === "" ? 0 : Number(inputAnggaran);
    if (!Number.isFinite(nilai) || nilai < 0) {
      setErrorAnggaran("Masukkan batas anggaran Rp 0 atau lebih.");
      return;
    }
    padaUbahAnggaran(Math.round(nilai));
    setErrorAnggaran("");
    setBukaEditAnggaran(false);
  }

  return (
    <main className="page-container">
      <section className="hero-banner brutal-card">
        <div className="hero-text">
          <h1 className="page-heading">Cashflow Overview & Analytics</h1>
          <p className="page-sub">
            Pantau arus kas masuk, selisih kas bersih, batas anggaran bulanan,
            dan rincian pengeluaran per kategori.
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

      <section className="summary-grid-three" aria-label="Executive period summary">
        <KartuRingkasan
          judul={`CASH INFLOW (${labelPeriode.toUpperCase()})`}
          nominal={statistik.pemasukan}
          awalan={statistik.pemasukan > 0 ? "+" : ""}
          varian="emerald"
          keterangan={`${statistik.jumlahPemasukan} catatan pemasukan pada periode ini`}
        >
          <TrendingUp size={20} strokeWidth={2} />
        </KartuRingkasan>

        <KartuRingkasan
          judul={`CASH OUTFLOW (${labelPeriode.toUpperCase()})`}
          nominal={statistik.pengeluaran}
          awalan={statistik.pengeluaran > 0 ? "-" : ""}
          varian="coral"
          keterangan={`${statistik.jumlahPengeluaran} pengeluaran (Rata-rata ${formatRupiah(
            statistik.rataRataPengeluaran,
          )} / transaksi)`}
        >
          <TrendingDown size={20} strokeWidth={2} />
        </KartuRingkasan>

        <KartuRingkasan
          judul={`NET CASHFLOW (${labelPeriode.toUpperCase()})`}
          nominal={statistik.selisih}
          awalan={awalanSelisih}
          varian="gold"
          keterangan={
            statistik.pemasukan === 0 && statistik.pengeluaran === 0
              ? "Belum ada arus kas pada periode ini"
              : isSurplus
                ? `Surplus kas (${statistik.rasioTabungan}% pemasukan tersimpan)`
                : "Defisit kas (Pengeluaran melebihi pemasukan)"
          }
        >
          <Scale size={20} strokeWidth={2} />
        </KartuRingkasan>
      </section>

      <section className="brutal-card budget-limit-panel" aria-label="Monthly spending limit">
        <div className="budget-limit-header">
          <div className="budget-limit-title-wrap">
            <div className="summary-icon gold-icon" aria-hidden="true">
              <ShieldAlert size={19} strokeWidth={2} />
            </div>
            <div>
              <h2 className="section-title">Monthly Spending Limit (30 Days)</h2>
              <p className="page-sub">
                {batasAnggaran > 0
                  ? `Pengeluaran 30 hari terakhir: ${formatRupiah(statBulanan.pengeluaran)} dari batas ${formatRupiah(batasAnggaran)} (${persenAnggaran}%)`
                  : "Atur batas anggaran pengeluaran bulanan untuk menjaga disiplin finansial harianmu."}
              </p>
            </div>
          </div>

          {!bukaEditAnggaran && (
            <button
              type="button"
              className="brutal-btn white btn-sm"
              onClick={() => {
                setInputAnggaran(batasAnggaran > 0 ? String(batasAnggaran) : "");
                setErrorAnggaran("");
                setBukaEditAnggaran(true);
              }}
            >
              <SlidersHorizontal size={15} strokeWidth={2} aria-hidden="true" />
              <span>{batasAnggaran > 0 ? "Edit Limit" : "Set Monthly Limit"}</span>
            </button>
          )}
        </div>

        {bukaEditAnggaran && (
          <form className="budget-limit-form" onSubmit={simpanAnggaran} noValidate>
            <div className="budget-limit-input-wrap">
              <label htmlFor="input-batas-anggaran">
                Target Batas Pengeluaran 30 Hari (Rp)
              </label>
              <div className="budget-limit-controls">
                <input
                  id="input-batas-anggaran"
                  type="number"
                  min="0"
                  className="brutal-input mono"
                  placeholder="Contoh: 2500000"
                  value={inputAnggaran}
                  onChange={(e) => setInputAnggaran(e.target.value)}
                />
                <button type="submit" className="brutal-btn emerald btn-sm">
                  <Check size={15} strokeWidth={2} aria-hidden="true" />
                  <span>Save Limit</span>
                </button>
                <button
                  type="button"
                  className="brutal-btn white btn-sm"
                  onClick={() => setBukaEditAnggaran(false)}
                >
                  <X size={15} strokeWidth={2} aria-hidden="true" />
                  <span>Cancel</span>
                </button>
              </div>
              {Number(inputAnggaran) > 0 && (
                <span className="rupiah-preview mono">
                  Pratinjau batas: {formatRupiah(Math.round(Number(inputAnggaran)))} / bulan
                </span>
              )}
              {errorAnggaran && (
                <p className="form-error" role="alert">
                  {errorAnggaran}
                </p>
              )}
            </div>
          </form>
        )}

        {batasAnggaran > 0 && (
          <div className="budget-limit-progress">
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={Math.min(100, persenAnggaran)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Persentase pemakaian anggaran bulanan"
            >
              <div
                className={`progress-fill ${
                  persenAnggaran >= 100
                    ? "coral"
                    : persenAnggaran >= 75
                      ? "gold"
                      : "emerald"
                }`}
                style={{ width: `${Math.min(100, persenAnggaran)}%` }}
              />
            </div>

            <div className="budget-limit-meta mono">
              <span>
                Used: {formatRupiah(statBulanan.pengeluaran)} ({persenAnggaran}%)
              </span>
              <span
                className={
                  sisaAnggaran < 0
                    ? "summary-out"
                    : persenAnggaran >= 75
                      ? "text-gold-strong"
                      : "summary-in"
                }
              >
                {sisaAnggaran >= 0
                  ? `Remaining Allowance: ${formatRupiah(sisaAnggaran)}`
                  : `Over Budget by ${formatRupiah(Math.abs(sisaAnggaran))}`}
              </span>
            </div>
          </div>
        )}
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
        <FormTransaksi
          padaTambah={padaTambahTransaksi}
          batasAnggaran={batasAnggaran}
          pengeluaranBulanIni={statBulanan.pengeluaran}
        />

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
                  padaEdit={padaEditTransaksi}
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
  batasAnggaran: PropTypes.number.isRequired,
  padaUbahAnggaran: PropTypes.func.isRequired,
  padaTambahTransaksi: PropTypes.func.isRequired,
  padaEditTransaksi: PropTypes.func.isRequired,
  padaHapusTransaksi: PropTypes.func.isRequired,
};

export default Beranda;
