import React, { useState } from "react";
import PropTypes from "prop-types";
import { PlusCircle } from "lucide-react";
import { KATEGORI_LIST, tanggalRelatif } from "../data";

function FormTransaksi({ padaTambah }) {
  const hariIni = tanggalRelatif(0);
  const [judul, setJudul] = useState("");
  const [nominal, setNominal] = useState("");
  const [tipe, setTipe] = useState("pengeluaran");
  const [kategori, setKategori] = useState(KATEGORI_LIST[2]);
  const [tanggal, setTanggal] = useState(hariIni);
  const [pesanError, setPesanError] = useState("");

  function tanganiSubmit(e) {
    e.preventDefault();
    const angkaNominal = Number(nominal);

    if (!judul.trim()) {
      setPesanError("Isi nama atau keterangan transaksi terlebih dahulu.");
      return;
    }
    if (!Number.isFinite(angkaNominal) || angkaNominal <= 0) {
      setPesanError("Masukkan nominal lebih dari Rp 0.");
      return;
    }

    padaTambah({
      id: `trx-${Date.now()}`,
      judul: judul.trim(),
      nominal: Math.round(angkaNominal),
      tipe,
      kategori,
      tanggal: tanggal || hariIni,
    });

    setJudul("");
    setNominal("");
    setPesanError("");
  }

  return (
    <form className="brutal-card trx-form" onSubmit={tanganiSubmit} noValidate>
      <h2 className="section-title">Catat Transaksi Baru</h2>

      <div className="tipe-switcher" role="group" aria-label="Pilih tipe transaksi">
        <button
          type="button"
          aria-pressed={tipe === "pemasukan"}
          className={`tipe-tab ${tipe === "pemasukan" ? "active pemasukan" : ""}`}
          onClick={() => {
            setTipe("pemasukan");
            setKategori("Gaji & Proyek");
          }}
        >
          + Pemasukan
        </button>
        <button
          type="button"
          aria-pressed={tipe === "pengeluaran"}
          className={`tipe-tab ${tipe === "pengeluaran" ? "active pengeluaran" : ""}`}
          onClick={() => {
            setTipe("pengeluaran");
            setKategori("Makanan & Minuman");
          }}
        >
          - Pengeluaran
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="input-judul">Keterangan Transaksi</label>
        <input
          id="input-judul"
          type="text"
          className="brutal-input"
          placeholder="Contoh: Makan siang kantin"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="input-nominal">Nominal (Rp)</label>
          <input
            id="input-nominal"
            type="number"
            min="1"
            className="brutal-input mono"
            placeholder="50000"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-tanggal">Tanggal</label>
          <input
            id="input-tanggal"
            type="date"
            className="brutal-input mono"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="input-kategori">Kategori</label>
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

      {pesanError && (
        <p className="form-error" role="alert">
          {pesanError}
        </p>
      )}

      <button
        type="submit"
        className={`brutal-btn full-width ${
          tipe === "pemasukan" ? "emerald" : "coral"
        }`}
      >
        <PlusCircle size={19} strokeWidth={2.5} aria-hidden="true" />
        <span>Catat {tipe === "pemasukan" ? "Pemasukan" : "Pengeluaran"}</span>
      </button>
    </form>
  );
}

FormTransaksi.propTypes = {
  padaTambah: PropTypes.func.isRequired,
};

export default FormTransaksi;
