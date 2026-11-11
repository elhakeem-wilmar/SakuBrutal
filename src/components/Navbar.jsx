import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router";
import {
  BookOpen,
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  RotateCcw,
} from "lucide-react";
import "./Navbar.css";

function Navbar({ padaResetData }) {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-icon" aria-hidden="true">
            <BookOpen size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-title">SAKUBRUTAL</span>
            <span className="brand-subtitle">Buku Catatan Arus Kas & Tabungan</span>
          </div>
        </div>

        <nav className="navbar-links" aria-label="Navigasi Utama">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <LayoutDashboard size={18} strokeWidth={2.5} aria-hidden="true" />
            <span>Beranda</span>
          </NavLink>

          <NavLink
            to="/transaksi"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <ArrowLeftRight size={18} strokeWidth={2.5} aria-hidden="true" />
            <span>Transaksi</span>
          </NavLink>

          <NavLink
            to="/target"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <PiggyBank size={18} strokeWidth={2.5} aria-hidden="true" />
            <span>Target Tabungan</span>
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="brutal-btn white btn-reset"
            onClick={padaResetData}
            title="Kembalikan contoh data awal dari src/data.js"
          >
            <RotateCcw size={16} strokeWidth={2.5} aria-hidden="true" />
            <span>Reset Data Sampel</span>
          </button>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  padaResetData: PropTypes.func.isRequired,
};

export default Navbar;
