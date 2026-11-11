import React from "react";
import { NavLink } from "react-router";
import { AlertOctagon, Home } from "lucide-react";
import "./Pages.css";

function NotFound() {
  return (
    <main className="notfound-screen">
      <section className="brutal-card notfound-box">
        <div className="notfound-icon" aria-hidden="true">
          <AlertOctagon size={36} strokeWidth={2} />
        </div>
        <h1 className="page-heading">404: Page Not Found</h1>
        <p className="page-sub">
          Alamat URL yang kamu tuju tidak terdaftar di sistem pencatatan Verve
          Folio.
        </p>
        <NavLink to="/" className="brutal-btn">
          <Home size={17} strokeWidth={2} aria-hidden="true" />
          <span>Return to Overview</span>
        </NavLink>
      </section>
    </main>
  );
}

export default NotFound;
