import React from "react";
import PropTypes from "prop-types";
import { ArrowUpRight, ArrowDownRight, Trash2, Calendar, Tag } from "lucide-react";
import { formatRupiah } from "../data";

function ItemTransaksi({ id, judul, nominal, tipe, kategori, tanggal, padaHapus }) {
  const isPemasukan = tipe === "pemasukan";

  return (
    <li className="trx-item">
      <div className="trx-left">
        <div
          className={`trx-icon ${isPemasukan ? "pemasukan" : "pengeluaran"}`}
          aria-hidden="true"
        >
          {isPemasukan ? (
            <ArrowUpRight size={20} strokeWidth={2.75} />
          ) : (
            <ArrowDownRight size={20} strokeWidth={2.75} />
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
        {padaHapus && (
          <button
            type="button"
            className="btn-icon-delete"
            onClick={() => padaHapus(id)}
            title={`Hapus catatan ${judul}`}
            aria-label={`Hapus catatan ${judul}`}
          >
            <Trash2 size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}
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
  padaHapus: PropTypes.func,
};

export default ItemTransaksi;
