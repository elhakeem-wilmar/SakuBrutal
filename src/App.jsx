import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import PropTypes from "prop-types";
import Navbar from "./components/Navbar";
import Beranda from "./pages/Beranda";
import Transaksi from "./pages/Transaksi";
import TargetTabungan from "./pages/TargetTabungan";
import NotFound from "./pages/NotFound";

const KUNCI_STORAGE_TRX = "sakubrutal_transaksi_v3";
const KUNCI_STORAGE_TARGET = "sakubrutal_target_v3";

// shortcut: penyimpanan di localStorage per-browser (~5MB), upgrade ke database/API jika butuh sinkronisasi multi-perangkat
function muatDataLokal(kunci, nilaiDefault) {
  try {
    const tersimpan = localStorage.getItem(kunci);
    return {
      data: tersimpan !== null ? JSON.parse(tersimpan) : nilaiDefault,
      error: null,
    };
  } catch {
    return {
      data: nilaiDefault,
      error: "Penyimpanan lokal browser gagal dibaca. Menampilkan data awal.",
    };
  }
}

function LayoutUtama({ padaResetData, pesanErrorStorage }) {
  return (
    <div className="layout-root">
      <Navbar padaResetData={padaResetData} />
      <div className="app-shell">
        {pesanErrorStorage && (
          <div className="brutal-card form-error" role="alert">
            {pesanErrorStorage}
          </div>
        )}
        <Outlet />
      </div>
      <footer className="app-footer">
        <div className="footer-inner">
          <span className="mono">&copy; El Hakeem Wilmar &middot; Wilmar Trance</span>
        </div>
      </footer>
    </div>
  );
}

LayoutUtama.propTypes = {
  padaResetData: PropTypes.func.isRequired,
  pesanErrorStorage: PropTypes.string,
};

function App() {
  const hasilAwalTrx = muatDataLokal(KUNCI_STORAGE_TRX, []);
  const hasilAwalTarget = muatDataLokal(KUNCI_STORAGE_TARGET, []);

  const [daftarTransaksi, setDaftarTransaksi] = useState(hasilAwalTrx.data);
  const [daftarTarget, setDaftarTarget] = useState(hasilAwalTarget.data);
  const [errorStorage, setErrorStorage] = useState(
    hasilAwalTrx.error || hasilAwalTarget.error,
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI_STORAGE_TRX, JSON.stringify(daftarTransaksi));
    } catch {
      setErrorStorage("Gagal menyimpan transaksi ke localStorage karena kapasitas penuh.");
    }
  }, [daftarTransaksi]);

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI_STORAGE_TARGET, JSON.stringify(daftarTarget));
    } catch {
      setErrorStorage("Gagal menyimpan target tabungan ke localStorage.");
    }
  }, [daftarTarget]);

  function tambahTransaksi(transaksiBaru) {
    setDaftarTransaksi((lama) => [transaksiBaru, ...lama]);
  }

  function hapusTransaksi(id) {
    setDaftarTransaksi((lama) => lama.filter((item) => item.id !== id));
  }

  function buatTargetBaru(targetBaru) {
    setDaftarTarget((lama) => [targetBaru, ...lama]);
  }

  function tambahTabungan(idTarget, nominalTambah) {
    setDaftarTarget((lama) =>
      lama.map((item) =>
        item.id === idTarget
          ? { ...item, terkumpul: item.terkumpul + nominalTambah }
          : item,
      ),
    );
  }

  function hapusTarget(idTarget) {
    setDaftarTarget((lama) => lama.filter((item) => item.id !== idTarget));
  }

  function resetKeDataAwal() {
    setSedangMemuat(true);
    setDaftarTransaksi([]);
    setDaftarTarget([]);
    setErrorStorage(null);
    localStorage.setItem(KUNCI_STORAGE_TRX, JSON.stringify([]));
    localStorage.setItem(KUNCI_STORAGE_TARGET, JSON.stringify([]));
    setTimeout(() => setSedangMemuat(false), 150);
  }

  if (sedangMemuat) {
    return (
      <main className="notfound-screen" aria-busy="true">
        <section className="brutal-card notfound-box">
          <h1 className="page-heading">Mereset Data...</h1>
          <p className="page-sub">Mengosongkan seluruh catatan keuangan.</p>
        </section>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <LayoutUtama
              padaResetData={resetKeDataAwal}
              pesanErrorStorage={errorStorage}
            />
          }
        >
          <Route
            path="/"
            element={
              <Beranda
                daftarTransaksi={daftarTransaksi}
                padaTambahTransaksi={tambahTransaksi}
                padaHapusTransaksi={hapusTransaksi}
              />
            }
          />
          <Route
            path="/transaksi"
            element={
              <Transaksi
                daftarTransaksi={daftarTransaksi}
                padaHapusTransaksi={hapusTransaksi}
              />
            }
          />
          <Route
            path="/target"
            element={
              <TargetTabungan
                daftarTarget={daftarTarget}
                padaBuatTarget={buatTargetBaru}
                padaTambahTabungan={tambahTabungan}
                padaHapusTarget={hapusTarget}
              />
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
