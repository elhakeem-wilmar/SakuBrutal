import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  RotateCcw,
  Sun,
  Moon,
  Download,
  Upload,
} from "lucide-react";
import "./Navbar.css";

function Navbar({
  tema,
  padaToggleTema,
  padaEksporBackup,
  padaImporBackup,
  padaResetData,
}) {
  const [konfirmasiReset, setKonfirmasiReset] = useState(false);
  const inputFileRef = useRef(null);

  function tanganiPilihFile(e) {
    const file = e.target.files?.[0];
    if (file) {
      padaImporBackup(file);
      e.target.value = "";
    }
  }

  return (
    <header className="navbar-wrapper">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
              <path
                d="M13 22L19.5 43L25 27L30.5 43L37 22"
                stroke="#F8F6F0"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="38"
                y1="22"
                x2="51"
                y2="22"
                stroke="#C5A46D"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="44.5"
                y1="22"
                x2="44.5"
                y2="43"
                stroke="#C5A46D"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <span className="brand-title">WILMAR TRANCE</span>
            <span className="brand-subtitle">
              Private Cashflow & Savings Ledger
            </span>
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
            className="brutal-btn white btn-tool"
            onClick={padaToggleTema}
            aria-pressed={tema === "gelap"}
            title={
              tema === "gelap"
                ? "Beralih ke tema terang (Ivory Heritage)"
                : "Beralih ke tema gelap (Obsidian Night)"
            }
          >
            {tema === "gelap" ? (
              <>
                <Sun size={15} strokeWidth={2} aria-hidden="true" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon size={15} strokeWidth={2} aria-hidden="true" />
                <span>Dark Theme</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="brutal-btn white btn-tool"
            onClick={padaEksporBackup}
            title="Simpan cadangan data ke file JSON"
          >
            <Download size={15} strokeWidth={2} aria-hidden="true" />
            <span>Backup</span>
          </button>

          <button
            type="button"
            className="brutal-btn white btn-tool"
            onClick={() => inputFileRef.current?.click()}
            title="Pulihkan data dari file backup JSON"
          >
            <Upload size={15} strokeWidth={2} aria-hidden="true" />
            <span>Restore</span>
          </button>
          <input
            ref={inputFileRef}
            type="file"
            accept=".json,application/json"
            className="sr-only-input"
            onChange={tanganiPilihFile}
            aria-label="Pilih file backup JSON untuk dipulihkan"
          />

          {!konfirmasiReset ? (
            <button
              type="button"
              className="brutal-btn white btn-tool"
              onClick={() => setKonfirmasiReset(true)}
              title="Kosongkan seluruh data kembali ke Rp 0"
            >
              <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
              <span>Reset</span>
            </button>
          ) : (
            <div className="reset-confirm-group" role="group" aria-label="Konfirmasi reset semua data">
              <button
                type="button"
                className="brutal-btn coral btn-tool"
                onClick={() => {
                  setKonfirmasiReset(false);
                  padaResetData();
                }}
              >
                <span>Ya, Kosongkan</span>
              </button>
              <button
                type="button"
                className="brutal-btn white btn-tool"
                onClick={() => setKonfirmasiReset(false)}
              >
                <span>Batal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  tema: PropTypes.string.isRequired,
  padaToggleTema: PropTypes.func.isRequired,
  padaEksporBackup: PropTypes.func.isRequired,
  padaImporBackup: PropTypes.func.isRequired,
  padaResetData: PropTypes.func.isRequired,
};

export default Navbar;
