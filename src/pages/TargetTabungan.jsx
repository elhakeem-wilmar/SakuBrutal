import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  PiggyBank,
  PlusCircle,
  CheckCircle2,
  Coins,
  Trash2,
} from "lucide-react";
import { formatRupiah } from "../data";
import "./Pages.css";

function TargetTabungan({
  daftarTarget,
  padaBuatTarget,
  padaTambahTabungan,
  padaHapusTarget,
}) {
  const [namaTarget, setNamaTarget] = useState("");
  const [nominalTarget, setNominalTarget] = useState("");
  const [tabunganAwal, setTabunganAwal] = useState("");
  const [pesanErrorForm, setPesanErrorForm] = useState("");

  const [inputSetoran, setInputSetoran] = useState({});
  const [errorSetoran, setErrorSetoran] = useState({});

  const totalTargetSemua = daftarTarget.reduce(
    (sum, t) => sum + t.targetNominal,
    0,
  );
  const totalTerkumpulSemua = daftarTarget.reduce(
    (sum, t) => sum + t.terkumpul,
    0,
  );
  const persenKeseluruhan =
    totalTargetSemua > 0
      ? Math.min(100, Math.round((totalTerkumpulSemua / totalTargetSemua) * 100))
      : 0;

  function tanganiBuatTarget(e) {
    e.preventDefault();
    const angkaTarget = Number(nominalTarget);
    const angkaAwal = tabunganAwal === "" ? 0 : Number(tabunganAwal);

    if (!namaTarget.trim()) {
      setPesanErrorForm("Isi nama target tabungan terlebih dahulu.");
      return;
    }
    if (!Number.isFinite(angkaTarget) || angkaTarget <= 0) {
      setPesanErrorForm("Nominal target harus lebih dari Rp 0.");
      return;
    }
    if (!Number.isFinite(angkaAwal) || angkaAwal < 0) {
      setPesanErrorForm("Tabungan awal tidak boleh bernilai negatif.");
      return;
    }

    padaBuatTarget({
      id: `tgt-${Date.now()}`,
      nama: namaTarget.trim(),
      targetNominal: Math.round(angkaTarget),
      terkumpul: Math.round(angkaAwal),
    });

    setNamaTarget("");
    setNominalTarget("");
    setTabunganAwal("");
    setPesanErrorForm("");
  }

  function tanganiSetorManual(e, idTarget) {
    e.preventDefault();
    const nilai = Number(inputSetoran[idTarget]);
    if (!Number.isFinite(nilai) || nilai <= 0) {
      setErrorSetoran((lama) => ({
        ...lama,
        [idTarget]: "Masukkan nominal tabungan lebih dari Rp 0.",
      }));
      return;
    }

    padaTambahTabungan(idTarget, Math.round(nilai));
    setInputSetoran((lama) => ({ ...lama, [idTarget]: "" }));
    setErrorSetoran((lama) => ({ ...lama, [idTarget]: "" }));
  }

  return (
    <main className="page-container">
      <section className="brutal-card target-overview">
        <div>
          <h1 className="page-heading">Target & Progres Tabungan</h1>
          <p className="page-sub">
            Buat target barang atau dana impianmu, tentukan jumlahnya, dan catat
            setiap uang yang berhasil kamu sisihkan hingga mencapai 100%.
          </p>
        </div>

        <div className="target-total-box mono">
          <span className="target-total-label">Progres Seluruh Target</span>
          <strong className="target-total-num">
            {formatRupiah(totalTerkumpulSemua)} / {formatRupiah(totalTargetSemua)} (
            {persenKeseluruhan}%)
          </strong>
        </div>
      </section>

      <section className="dashboard-split">
        <form
          className="brutal-card trx-form"
          onSubmit={tanganiBuatTarget}
          noValidate
        >
          <h2 className="section-title">Buat Target Baru</h2>

          <div className="form-group">
            <label htmlFor="input-nama-target">Nama Target Tabungan</label>
            <input
              id="input-nama-target"
              type="text"
              className="brutal-input"
              placeholder="Contoh: Beli Mobil"
              value={namaTarget}
              onChange={(e) => setNamaTarget(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-nominal-target">Target Jumlah (Rp)</label>
            <input
              id="input-nominal-target"
              type="number"
              min="1"
              className="brutal-input mono"
              placeholder="1500000"
              value={nominalTarget}
              onChange={(e) => setNominalTarget(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-awal-target">
              Uang Sudah Ditabung Saat Ini (Opsional, Rp)
            </label>
            <input
              id="input-awal-target"
              type="number"
              min="0"
              className="brutal-input mono"
              placeholder="0"
              value={tabunganAwal}
              onChange={(e) => setTabunganAwal(e.target.value)}
            />
          </div>

          {pesanErrorForm && (
            <p className="form-error" role="alert">
              {pesanErrorForm}
            </p>
          )}

          <button type="submit" className="brutal-btn full-width">
            <PlusCircle size={19} strokeWidth={2.5} aria-hidden="true" />
            <span>Tambah Target Tabungan</span>
          </button>
        </form>

        <div className="target-list-wrapper">
          <h2 className="section-title list-heading">
            Daftar Target Aktif   
          </h2>

          {daftarTarget.length === 0 ? (
            <div className="brutal-card">
              <p className="empty-state">
                Belum ada target tabungan. Isi formulir di samping untuk mulai
                mencatat target tabungan pertamamu.
              </p>
            </div>
          ) : (
            <div className="target-cards-stack">
              {daftarTarget.map((item) => {
                const persen =
                  item.targetNominal > 0
                    ? Math.min(
                        100,
                        Math.round((item.terkumpul / item.targetNominal) * 100),
                      )
                    : 0;
                const sisaTarget = Math.max(
                  0,
                  item.targetNominal - item.terkumpul,
                );
                const sudahTercapai = item.terkumpul >= item.targetNominal;

                return (
                  <article key={item.id} className="brutal-card budget-card">
                    <div className="budget-top">
                      <div>
                        <h3 className="budget-title">{item.nama}</h3>
                        <span
                          className={`brutal-badge ${
                            sudahTercapai ? "pemasukan" : ""
                          }`}
                        >
                          {sudahTercapai ? (
                            <>
                              <CheckCircle2 size={13} aria-hidden="true" />
                              Target Tercapai (100%)
                            </>
                          ) : (
                            <>
                              <PiggyBank size={13} aria-hidden="true" />
                              Progres {persen}%
                            </>
                          )}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn-icon-delete"
                        onClick={() => padaHapusTarget(item.id)}
                        title={`Hapus target ${item.nama}`}
                        aria-label={`Hapus target ${item.nama}`}
                      >
                        <Trash2 size={18} strokeWidth={2.5} aria-hidden="true" />
                      </button>
                    </div>

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-valuenow={persen}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progres tabungan ${item.nama}`}
                    >
                      <div
                        className={`progress-fill ${
                          sudahTercapai ? "emerald" : "gold"
                        }`}
                        style={{ width: `${persen}%` }}
                      />
                    </div>

                    <div className="budget-numbers mono">
                      <span>Terkumpul: {formatRupiah(item.terkumpul)}</span>
                      <span>Target: {formatRupiah(item.targetNominal)}</span>
                    </div>

                    <p className="target-remaining mono">
                      {sudahTercapai
                        ? "Target sudah terpenuhi!"
                        : `Kurang ${formatRupiah(sisaTarget)} lagi untuk mencapai 100%`}
                    </p>

                    <form
                      className="setor-form"
                      onSubmit={(e) => tanganiSetorManual(e, item.id)}
                      noValidate
                    >
                      <div className="setor-input-row">
                        <label
                          htmlFor={`setor-${item.id}`}
                          className="setor-label"
                        >
                          Tambah Uang Tabungan (Rp)
                        </label>
                        <div className="setor-controls">
                          <input
                            id={`setor-${item.id}`}
                            type="number"
                            min="1"
                            className="brutal-input mono"
                            placeholder="Nominal ditabung..."
                            value={inputSetoran[item.id] || ""}
                            onChange={(e) =>
                              setInputSetoran((lama) => ({
                                ...lama,
                                [item.id]: e.target.value,
                              }))
                            }
                          />
                          <button type="submit" className="brutal-btn emerald">
                            <Coins size={17} strokeWidth={2.5} aria-hidden="true" />
                            <span>Tabung</span>
                          </button>
                        </div>
                      </div>

                      <div className="quick-add-row">
                        <span className="quick-label">Tambah cepat:</span>
                        <button
                          type="button"
                          className="brutal-btn white btn-sm mono"
                          onClick={() => padaTambahTabungan(item.id, 50000)}
                        >
                          +Rp 50.000
                        </button>
                        <button
                          type="button"
                          className="brutal-btn white btn-sm mono"
                          onClick={() => padaTambahTabungan(item.id, 100000)}
                        >
                          +Rp 100.000
                        </button>
                      </div>

                      {errorSetoran[item.id] && (
                        <p className="form-error" role="alert">
                          {errorSetoran[item.id]}
                        </p>
                      )}
                    </form>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

TargetTabungan.propTypes = {
  daftarTarget: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nama: PropTypes.string.isRequired,
      targetNominal: PropTypes.number.isRequired,
      terkumpul: PropTypes.number.isRequired,
    }),
  ).isRequired,
  padaBuatTarget: PropTypes.func.isRequired,
  padaTambahTabungan: PropTypes.func.isRequired,
  padaHapusTarget: PropTypes.func.isRequired,
};

export default TargetTabungan;

