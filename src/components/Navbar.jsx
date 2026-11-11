import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router";
import {
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
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
              <path
                d="M14 19L25 46L36 19"
                stroke="#F8F6F0"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M35 46V19H50"
                stroke="#C5A46D"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="35"
                y1="32"
                x2="46"
                y2="32"
                stroke="#C5A46D"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <span className="brand-title">VERVE FOLIO</span>
            <span className="brand-subtitle">Personal Cashflow & Savings</span>
          </div>
        </div>

        <nav className="navbar-links" aria-label="Primary Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <LayoutDashboard size={17} strokeWidth={2} aria-hidden="true" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/transaksi"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <ArrowLeftRight size={17} strokeWidth={2} aria-hidden="true" />
            <span>Ledger</span>
          </NavLink>

          <NavLink
            to="/target"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <PiggyBank size={17} strokeWidth={2} aria-hidden="true" />
            <span>Savings Vault</span>
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="brutal-btn white btn-reset"
            onClick={padaResetData}
            title="Kosongkan seluruh data kembali ke Rp 0"
          >
            <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
            <span>Reset</span>
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
