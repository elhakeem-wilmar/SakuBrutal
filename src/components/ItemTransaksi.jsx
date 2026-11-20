import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Pencil,
  Check,
  X,
  Calendar,
  Tag,
} from "lucide-react";
import { KATEGORI_LIST, formatRupiah } from "../data";

function ItemTransaksi({
  id,
  judul,
  nominal,
  tipe,
  kategori,
  tanggal,
  padaEdit,
  padaHapus,
}) {
  const [sedangEdit, setSedangEdit] = useState(false);
  const [editJudul, setEditJudul] = useState(judul);
  const [editNominal, setEditNominal] = useState(String(nominal));
  const [editTipe, setEditTipe] = useState(tipe);
  const [editKategori, setEditKategori] = useState(kategori);
  const [editTanggal, setEditTanggal] = useState(tanggal);
  const [errorEdit, setErrorEdit] = useState("");

  const isPemasukan = tipe === "pemasukan";
  const angkaEdit = Number(editNominal);
  const nominalEditValid = Number.isFinite(angkaEdit) && angkaEdit > 0;

  function mulaiEdit() {
    setEditJudul(judul);
    setEditNominal(String(nominal));
    setEditTipe(tipe);
    setEditKategori(kategori);
    setEditTanggal(tanggal);
    setErrorEdit("");
    setSedangEdit(true);
  }

  function simpanEdit(e) {
    e.preventDefault();
    if (!editJudul.trim()) {
      setErrorEdit("Keterangan transaksi tidak boleh kosong.");
      return;
    }
    if (!nominalEditValid) {
      setErrorEdit("Nominal harus lebih dari Rp 0.");
      return;
    }

    if (padaEdit) {
      padaEdit({
        id,
        judul: editJudul.trim(),
        nominal: Math.round(angkaEdit),
        tipe: editTipe,
        kategori: editKategori,
        tanggal: editTanggal || tanggal,
      });
    }
    setSedangEdit(false);
  }

  if (sedangEdit) {
    return (
      <li className="trx-item trx-item-editing">
        <form className="inline-edit-form" onSubmit={simpanEdit} noValidate>
          <div className="inline-edit-header">
            <span className="inline-edit-badge">Edit Ledger Entry</span>
            {nominalEditValid && (
              <span className="rupiah-preview mono">
                {formatRupiah(Math.round(angkaEdit))}
              </span>
            )}
          </div>

          <div className="inline-edit-grid">
            <div className="form-group">
              <label htmlFor={`edit-judul-${id}`}>Description</label>
              <input
                id={`edit-judul-${id}`}
                type="text"
                className="brutal-input"
                value={editJudul}
                onChange={(e) => setEditJudul(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`edit-nominal-${id}`}>Amount (Rp)</label>
              <input
                id={`edit-nominal-${id}`}
                type="number"
                min="1"
                className="brutal-input mono"
                value={editNominal}
                onChange={(e) => setEditNominal(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`edit-tipe-${id}`}>Type</label>
              <select
                id={`edit-tipe-${id}`}
                className="brutal-select"
                value={editTipe}
                onChange={(e) => setEditTipe(e.target.value)}
              >
                <option value="pemasukan">Inflow (+)</option>
                <option value="pengeluaran">Outflow (-)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={`edit-kat-${id}`}>Category</label>
              <select
                id={`edit-kat-${id}`}
                className="brutal-select"
                value={editKategori}
                onChange={(e) => setEditKategori(e.target.value)}
              >
                {KATEGORI_LIST.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={`edit-tgl-${id}`}>Date</label>
              <input
                id={`edit-tgl-${id}`}
                type="date"
                className="brutal-input mono"
                value={editTanggal}
                onChange={(e) => setEditTanggal(e.target.value)}
              />
            </div>
          </div>

          {errorEdit && (
            <p className="form-error" role="alert">
              {errorEdit}
            </p>
          )}

          <div className="inline-edit-actions">
            <button type="submit" className="brutal-btn emerald btn-sm">
              <Check size={15} strokeWidth={2} aria-hidden="true" />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              className="brutal-btn white btn-sm"
              onClick={() => setSedangEdit(false)}
            >
              <X size={15} strokeWidth={2} aria-hidden="true" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="trx-item">
      <div className="trx-left">
        <div
          className={`trx-icon ${isPemasukan ? "pemasukan" : "pengeluaran"}`}
          aria-hidden="true"
        >
          {isPemasukan ? (
            <ArrowUpRight size={20} strokeWidth={2.5} />
          ) : (
            <ArrowDownRight size={20} strokeWidth={2.5} />
          )}
        </div>
        <div className="trx-info">
          <h3 className="trx-title">{judul}</h3>
          <div className="trx-meta">
            <span className={`brutal-badge ${tipe}`}>
              <Tag size={12} aria-hidden="true" />
              {kategori}
            </span>
            <span className="trx-date mono">
              <Calendar size={13} aria-hidden="true" />
              {tanggal}
            </span>
          </div>
        </div>
      </div>

      <div className="trx-right">
        <span className={`trx-nominal mono ${tipe}`}>
          {isPemasukan ? "+" : "-"}
          {formatRupiah(nominal)}
        </span>

        <div className="trx-action-btns">
          {padaEdit && (
            <button
              type="button"
              className="btn-icon-action"
              onClick={mulaiEdit}
              title={`Edit catatan ${judul}`}
              aria-label={`Edit catatan ${judul}`}
            >
              <Pencil size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
          {padaHapus && (
            <button
              type="button"
              className="btn-icon-delete"
              onClick={() => padaHapus(id)}
              title={`Hapus catatan ${judul}`}
              aria-label={`Hapus catatan ${judul}`}
            >
              <Trash2 size={17} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

ItemTransaksi.propTypes = {
  id: PropTypes.string.isRequired,
  judul: PropTypes.string.isRequired,
  nominal: PropTypes.number.isRequired,
  tipe: PropTypes.oneOf(["pemasukan", "pengeluaran"]).isRequired,
  kategori: PropTypes.string.isRequired,
  tanggal: PropTypes.string.isRequired,
  padaEdit: PropTypes.func,
  padaHapus: PropTypes.func,
};

export default ItemTransaksi;
