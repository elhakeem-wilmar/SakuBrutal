import React, { useState } from "react";
import PropTypes from "prop-types";
import { PlusCircle, AlertTriangle, Check, X } from "lucide-react";
import { KATEGORI_LIST, tanggalRelatif, formatRupiah } from "../data";

const NOMINAL_CEPAT = [
  { label: "+25rb", nilai: 25000 },
  { label: "+50rb", nilai: 50000 },
  { label: "+100rb", nilai: 100000 },
  { label: "+500rb", nilai: 500000 },
];

function FormTransaksi({
  padaTambah,
  batasAnggaran = 0,
  pengeluaranBulanIni = 0,
}) {
  const hariIni = tanggalRelatif(0);
  const [judul, setJudul] = useState("");
  const [nominal, setNominal] = useState("");
  const [tipe, setTipe] = useState("pengeluaran");
  const [kategori, setKategori] = useState("Makanan & Minuman");
  const [tanggal, setTanggal] = useState(hariIni);
  const [pesanError, setPesanError] = useState("");
  const [konfirmasiLewatBatas, setKonfirmasiLewatBatas] = useState(false);

  const angkaNominal = Number(nominal);
  const nominalValid = Number.isFinite(angkaNominal) && angkaNominal > 0;
  const nominalBulat = nominalValid ? Math.round(angkaNominal) : 0;

  const totalSetelahInput = pengeluaranBulanIni + nominalBulat;
  const kelebihanAnggaran = totalSetelahInput - batasAnggaran;
  const melewatiBatas =
    tipe === "pengeluaran" &&
    batasAnggaran > 0 &&
    nominalValid &&
    kelebihanAnggaran > 0;

  function tambahNominalCepat(tambahan) {
    const saatIni =
      Number.isFinite(angkaNominal) && angkaNominal > 0 ? angkaNominal : 0;
    setNominal(String(saatIni + tambahan));
    setPesanError("");
    setKonfirmasiLewatBatas(false);
  }

  function tanganiSubmit(e) {
    e.preventDefault();

    if (!judul.trim()) {
      setPesanError("Isi nama atau keterangan transaksi terlebih dahulu.");
      return;
    }
    if (!nominalValid) {
      setPesanError("Masukkan nominal lebih dari Rp 0.");
      return;
    }

    if (melewatiBatas && !konfirmasiLewatBatas) {
      setPesanError("");
      setKonfirmasiLewatBatas(true);
      return;
    }

    padaTambah({
      id: `trx-${Date.now()}`,
      judul: judul.trim(),
      nominal: nominalBulat,
      tipe,
      kategori,
      tanggal: tanggal || hariIni,
    });

    setJudul("");
    setNominal("");
    setPesanError("");
    setKonfirmasiLewatBatas(false);
  }

  return (
    <form className="brutal-card trx-form" onSubmit={tanganiSubmit} noValidate>
      <div className="form-card-header">
        <h2 className="section-title">New Ledger Entry</h2>
        <span className="form-subtitle">Catat arus kas harianmu</span>
      </div>

      <div className="tipe-switcher" role="group" aria-label="Select entry type">
        <button
          type="button"
          aria-pressed={tipe === "pemasukan"}
          className={`tipe-tab ${tipe === "pemasukan" ? "active pemasukan" : ""}`}
          onClick={() => {
            setTipe("pemasukan");
            setKategori("Gaji & Proyek");
            setKonfirmasiLewatBatas(false);
          }}
        >
          + Inflow
        </button>
        <button
          type="button"
          aria-pressed={tipe === "pengeluaran"}
          className={`tipe-tab ${tipe === "pengeluaran" ? "active pengeluaran" : ""}`}
          onClick={() => {
            setTipe("pengeluaran");
            setKategori("Makanan & Minuman");
            setKonfirmasiLewatBatas(false);
          }}
        >
          - Outflow
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="input-judul">Description</label>
        <input
          id="input-judul"
          type="text"
          className="brutal-input"
          placeholder="Contoh: Makan siang, Bensin, Gaji..."
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <div className="label-with-preview">
            <label htmlFor="input-nominal">Amount (Rp)</label>
            {nominalValid && (
              <span className="rupiah-preview mono">
                {formatRupiah(nominalBulat)}
              </span>
            )}
          </div>
          <input
            id="input-nominal"
            type="number"
            min="1"
            className="brutal-input mono"
            placeholder="50000"
            value={nominal}
            onChange={(e) => {
              setNominal(e.target.value);
              setKonfirmasiLewatBatas(false);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-tanggal">Date</label>
          <input
            id="input-tanggal"
            type="date"
            className="brutal-input mono"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>
      </div>

      <div className="quick-nominal-chips" role="group" aria-label="Nominal cepat">
        {NOMINAL_CEPAT.map((chip) => (
          <button
            key={chip.nilai}
            type="button"
            className="chip-btn mono"
            onClick={() => tambahNominalCepat(chip.nilai)}
          >
            {chip.label}
          </button>
        ))}
        {nominalValid && (
          <button
            type="button"
            className="chip-btn chip-clear"
            onClick={() => {
              setNominal("");
              setKonfirmasiLewatBatas(false);
            }}
          >
            Reset Rp
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="input-kategori">Category</label>
        <select
          id="input-kategori"
          className="brutal-select"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          {KATEGORI_LIST.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>
      </div>

      {melewatiBatas && (
        <div className="budget-warning-box" role="alert">
          <div className="budget-warning-title">
            <AlertTriangle size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>Melewati Batas Anggaran Bulanan!</span>
          </div>
          <p className="budget-warning-desc">
            Pengeluaran ini akan membuat total 30 hari menjadi{" "}
            <strong className="mono">{formatRupiah(totalSetelahInput)}</strong>{" "}
            (melebihi batas <strong className="mono">{formatRupiah(batasAnggaran)}</strong>{" "}
            sebesar <strong className="mono">{formatRupiah(kelebihanAnggaran)}</strong>).
          </p>
        </div>
      )}

      {pesanError && (
        <p className="form-error" role="alert">
          {pesanError}
        </p>
      )}

      {!konfirmasiLewatBatas ? (
        <button
          type="submit"
          className={`brutal-btn full-width ${
            tipe === "pemasukan" ? "emerald" : "coral"
          }`}
        >
          <PlusCircle size={18} strokeWidth={2} aria-hidden="true" />
          <span>Record {tipe === "pemasukan" ? "Inflow" : "Outflow"}</span>
        </button>
      ) : (
        <div
          className="overbudget-confirm-actions"
          role="group"
          aria-label="Konfirmasi pencatatan melebihi batas anggaran"
        >
          <button type="submit" className="brutal-btn coral full-width">
            <Check size={17} strokeWidth={2} aria-hidden="true" />
            <span>Tetap Catat Pengeluaran</span>
          </button>
          <button
            type="button"
            className="brutal-btn white full-width"
            onClick={() => setKonfirmasiLewatBatas(false)}
          >
            <X size={17} strokeWidth={2} aria-hidden="true" />
            <span>Batal</span>
          </button>
        </div>
      )}
    </form>
  );
}

FormTransaksi.propTypes = {
  padaTambah: PropTypes.func.isRequired,
  batasAnggaran: PropTypes.number,
  pengeluaranBulanIni: PropTypes.number,
};

export default FormTransaksi;
