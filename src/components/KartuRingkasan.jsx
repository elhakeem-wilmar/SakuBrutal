import React from "react";
import PropTypes from "prop-types";
import { formatRupiah } from "../data";

function KartuRingkasan({
  judul,
  nominal,
  awalan = "",
  varian,
  keterangan,
  children,
}) {
  return (
    <article className={`brutal-card summary-card ${varian}`}>
      <div className="summary-card-top">
        <h2 className="summary-label">{judul}</h2>
        <div className="summary-icon" aria-hidden="true">
          {children}
        </div>
      </div>
      <p className="summary-amount mono">
        {awalan}
        {formatRupiah(Math.abs(nominal))}
      </p>
      <p className="summary-note">{keterangan}</p>
    </article>
  );
}

KartuRingkasan.propTypes = {
  judul: PropTypes.string.isRequired,
  nominal: PropTypes.number.isRequired,
  awalan: PropTypes.string,
  varian: PropTypes.oneOf(["gold", "emerald", "coral"]).isRequired,
  keterangan: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default KartuRingkasan;
