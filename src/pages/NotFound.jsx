import React from "react";
import { NavLink } from "react-router";
import { AlertOctagon, Home } from "lucide-react";
import "./Pages.css";

function NotFound() {
  return (
    <main className="notfound-screen">
      <section className="brutal-card notfound-box">
        <div className="notfound-icon" aria-hidden="true">
          <AlertOctagon size={42} strokeWidth={2.5} />
        </div>
        <h1 className="page-heading">404: Halaman Tidak Ditemukan</h1>
        <p className="page-sub">
          Alamat URL yang kamu tuju tidak terdaftar di sistem pencatatan
          SakuBrutal.
        </p>
        <NavLink to="/" className="brutal-btn">
          <Home size={18} strokeWidth={2.5} aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </NavLink>
      </section>
    </main>
  );
}

export default NotFound;
