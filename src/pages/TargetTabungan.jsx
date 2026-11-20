import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  PiggyBank,
  PlusCircle,
  CheckCircle2,
  Coins,
  ArrowDownLeft,
  Pencil,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { formatRupiah } from "../data";
import "./Pages.css";

function TargetTabungan({
  daftarTarget,
  padaBuatTarget,
  padaEditTarget,
  padaTambahTabungan,
  padaHapusTarget,
}) {
  const [namaTarget, setNamaTarget] = useState("");
  const [nominalTarget, setNominalTarget] = useState("");
  const [tabunganAwal, setTabunganAwal] = useState("");
  const [pesanErrorForm, setPesanErrorForm] = useState("");

  const [inputSetoran, setInputSetoran] = useState({});
  const [errorSetoran, setErrorSetoran] = useState({});

  const [idSedangEdit, setIdSedangEdit] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editTargetNominal, setEditTargetNominal] = useState("");
  const [errorEditTarget, setErrorEditTarget] = useState("");

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

  const angkaTargetBaru = Number(nominalTarget);
  const angkaAwalBaru = Number(tabunganAwal);

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

  function mulaiEditTarget(item) {
    setIdSedangEdit(item.id);
    setEditNama(item.nama);
    setEditTargetNominal(String(item.targetNominal));
    setErrorEditTarget("");
  }

  function simpanEditTarget(e, idTarget) {
    e.preventDefault();
    const nilaiBaru = Number(editTargetNominal);
    if (!editNama.trim()) {
      setErrorEditTarget("Nama target tidak boleh kosong.");
      return;
    }
    if (!Number.isFinite(nilaiBaru) || nilaiBaru <= 0) {
      setErrorEditTarget("Target jumlah harus lebih dari Rp 0.");
      return;
    }

    padaEditTarget({
      id: idTarget,
      nama: editNama.trim(),
      targetNominal: Math.round(nilaiBaru),
    });
    setIdSedangEdit(null);
  }

  function tanganiTransaksiVault(idTarget, arah, saldoSaatIni) {
    const nilai = Number(inputSetoran[idTarget]);
    if (!Number.isFinite(nilai) || nilai <= 0) {
      setErrorSetoran((lama) => ({
        ...lama,
        [idTarget]: "Masukkan nominal lebih dari Rp 0.",
      }));
      return;
    }

    if (arah === "tarik" && nilai > saldoSaatIni) {
      setErrorSetoran((lama) => ({
        ...lama,
        [idTarget]: `Penarikan melebihi dana terkumpul (${formatRupiah(saldoSaatIni)}).`,
      }));
      return;
    }

    const delta = arah === "tarik" ? -Math.round(nilai) : Math.round(nilai);
    padaTambahTabungan(idTarget, delta);
    setInputSetoran((lama) => ({ ...lama, [idTarget]: "" }));
    setErrorSetoran((lama) => ({ ...lama, [idTarget]: "" }));
  }

  return (
    <main className="page-container">
      <section className="brutal-card target-overview">
        <div>
          <h1 className="page-heading">Savings Vault & Goals</h1>
          <p className="page-sub">
            Buat target dana impianmu, kelola setoran maupun penarikan dana, dan
            pantau progres tabungan hingga mencapai 100%.
          </p>
        </div>

        <div className="target-total-box mono">
          <span className="target-total-label">Total Vault Progress</span>
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
          <div className="form-card-header">
            <h2 className="section-title">Create New Vault</h2>
            <span className="form-subtitle">Target tabungan baru</span>
          </div>

          <div className="form-group">
            <label htmlFor="input-nama-target">Goal Name</label>
            <input
              id="input-nama-target"
              type="text"
              className="brutal-input"
              placeholder="Contoh: Dana Darurat, Beli Laptop..."
              value={namaTarget}
              onChange={(e) => setNamaTarget(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="label-with-preview">
              <label htmlFor="input-nominal-target">Target Amount (Rp)</label>
              {Number.isFinite(angkaTargetBaru) && angkaTargetBaru > 0 && (
                <span className="rupiah-preview mono">
                  {formatRupiah(Math.round(angkaTargetBaru))}
                </span>
              )}
            </div>
            <input
              id="input-nominal-target"
              type="number"
              min="1"
              className="brutal-input mono"
              placeholder="3000000"
              value={nominalTarget}
              onChange={(e) => setNominalTarget(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="label-with-preview">
              <label htmlFor="input-awal-target">
                Initial Deposit (Optional, Rp)
              </label>
              {Number.isFinite(angkaAwalBaru) && angkaAwalBaru > 0 && (
                <span className="rupiah-preview mono">
                  {formatRupiah(Math.round(angkaAwalBaru))}
                </span>
              )}
            </div>
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
            <PlusCircle size={18} strokeWidth={2} aria-hidden="true" />
            <span>Create Savings Goal</span>
          </button>
        </form>

        <div className="target-list-wrapper">
          <h2 className="section-title list-heading">
            Active Savings Vaults ({daftarTarget.length})
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
                const nilaiKetik = Number(inputSetoran[item.id]);

                return (
                  <article key={item.id} className="brutal-card budget-card">
                    {idSedangEdit === item.id ? (
                      <form
                        className="inline-edit-form"
                        onSubmit={(e) => simpanEditTarget(e, item.id)}
                        noValidate
                      >
                        <div className="inline-edit-header">
                          <span className="inline-edit-badge">Edit Vault Goal</span>
                          {Number(editTargetNominal) > 0 && (
                            <span className="rupiah-preview mono">
                              {formatRupiah(Math.round(Number(editTargetNominal)))}
                            </span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor={`edit-nama-tgt-${item.id}`}>
                            Goal Name
                          </label>
                          <input
                            id={`edit-nama-tgt-${item.id}`}
                            type="text"
                            className="brutal-input"
                            value={editNama}
                            onChange={(e) => setEditNama(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`edit-nom-tgt-${item.id}`}>
                            Target Amount (Rp)
                          </label>
                          <input
                            id={`edit-nom-tgt-${item.id}`}
                            type="number"
                            min="1"
                            className="brutal-input mono"
                            value={editTargetNominal}
                            onChange={(e) => setEditTargetNominal(e.target.value)}
                          />
                        </div>

                        {errorEditTarget && (
                          <p className="form-error" role="alert">
                            {errorEditTarget}
                          </p>
                        )}

                        <div className="inline-edit-actions">
                          <button type="submit" className="brutal-btn emerald btn-sm">
                            <Check size={15} strokeWidth={2} aria-hidden="true" />
                            <span>Save Goal</span>
                          </button>
                          <button
                            type="button"
                            className="brutal-btn white btn-sm"
                            onClick={() => setIdSedangEdit(null)}
                          >
                            <X size={15} strokeWidth={2} aria-hidden="true" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </form>
                    ) : (
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
                                Goal Reached (100%)
                              </>
                            ) : (
                              <>
                                <PiggyBank size={13} aria-hidden="true" />
                                Progress {persen}%
                              </>
                            )}
                          </span>
                        </div>

                        <div className="trx-action-btns">
                          <button
                            type="button"
                            className="btn-icon-action"
                            onClick={() => mulaiEditTarget(item)}
                            title={`Edit target ${item.nama}`}
                            aria-label={`Edit target ${item.nama}`}
                          >
                            <Pencil size={16} strokeWidth={2} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-delete"
                            onClick={() => padaHapusTarget(item.id)}
                            title={`Hapus target ${item.nama}`}
                            aria-label={`Hapus target ${item.nama}`}
                          >
                            <Trash2 size={17} strokeWidth={2} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    )}

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
                      <span>Saved: {formatRupiah(item.terkumpul)}</span>
                      <span>Target: {formatRupiah(item.targetNominal)}</span>
                    </div>

                    <p className="target-remaining mono">
                      {sudahTercapai
                        ? "Target sudah terpenuhi!"
                        : `Kurang ${formatRupiah(sisaTarget)} lagi untuk mencapai 100%`}
                    </p>

                    <form
                      className="setor-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        tanganiTransaksiVault(item.id, "setor", item.terkumpul);
                      }}
                      noValidate
                    >
                      <div className="setor-input-row">
                        <div className="label-with-preview">
                          <label
                            htmlFor={`setor-${item.id}`}
                            className="setor-label"
                          >
                            Deposit / Withdraw Amount (Rp)
                          </label>
                          {Number.isFinite(nilaiKetik) && nilaiKetik > 0 && (
                            <span className="rupiah-preview mono">
                              {formatRupiah(Math.round(nilaiKetik))}
                            </span>
                          )}
                        </div>
                        <div className="setor-controls-dual">
                          <input
                            id={`setor-${item.id}`}
                            type="number"
                            min="1"
                            className="brutal-input mono"
                            placeholder="Nominal Rp..."
                            value={inputSetoran[item.id] || ""}
                            onChange={(e) =>
                              setInputSetoran((lama) => ({
                                ...lama,
                                [item.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            type="submit"
                            className="brutal-btn emerald btn-sm"
                            title="Tambahkan ke tabungan"
                          >
                            <Coins size={15} strokeWidth={2} aria-hidden="true" />
                            <span>+ Deposit</span>
                          </button>
                          <button
                            type="button"
                            className="brutal-btn white btn-sm"
                            disabled={item.terkumpul <= 0}
                            onClick={() =>
                              tanganiTransaksiVault(
                                item.id,
                                "tarik",
                                item.terkumpul,
                              )
                            }
                            title="Tarik atau kurangi saldo tabungan"
                          >
                            <ArrowDownLeft
                              size={15}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                            <span>- Withdraw</span>
                          </button>
                        </div>
                      </div>

                      <div className="quick-add-row">
                        <span className="quick-label">Quick Deposit:</span>
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
                        <button
                          type="button"
                          className="brutal-btn white btn-sm mono"
                          onClick={() => padaTambahTabungan(item.id, 500000)}
                        >
                          +Rp 500.000
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
  padaEditTarget: PropTypes.func.isRequired,
  padaTambahTabungan: PropTypes.func.isRequired,
  padaHapusTarget: PropTypes.func.isRequired,
};

export default TargetTabungan;
