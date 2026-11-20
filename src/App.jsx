import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import PropTypes from "prop-types";
import Navbar from "./components/Navbar";
import Beranda from "./pages/Beranda";
import Transaksi from "./pages/Transaksi";
import TargetTabungan from "./pages/TargetTabungan";
import NotFound from "./pages/NotFound";
import { tanggalRelatif, unduhFile } from "./data";

const KUNCI_STORAGE_TRX = "sakubrutal_transaksi_v3";
const KUNCI_STORAGE_TARGET = "sakubrutal_target_v3";
const KUNCI_STORAGE_ANGGARAN = "wilmar_anggaran_bulanan_v1";
const KUNCI_STORAGE_TEMA = "wilmar_tema_v1";

// shortcut: penyimpanan di localStorage per-browser (~5MB), gunakan Backup/Restore JSON untuk pindah perangkat
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

function LayoutUtama({
  tema,
  padaToggleTema,
  padaEksporBackup,
  padaImporBackup,
  padaResetData,
  pesanErrorStorage,
  padaTutupError,
  pesanInfoBackup,
  padaTutupInfo,
}) {
  return (
    <div className="layout-root">
      <Navbar
        tema={tema}
        padaToggleTema={padaToggleTema}
        padaEksporBackup={padaEksporBackup}
        padaImporBackup={padaImporBackup}
        padaResetData={padaResetData}
      />
      <div className="app-shell">
        {pesanErrorStorage && (
          <div className="brutal-card form-error status-banner" role="alert">
            <span>{pesanErrorStorage}</span>
            <button
              type="button"
              className="brutal-btn white btn-sm"
              onClick={padaTutupError}
            >
              Tutup
            </button>
          </div>
        )}
        {pesanInfoBackup && (
          <div className="brutal-card status-banner info-banner" role="status">
            <span>{pesanInfoBackup}</span>
            <button
              type="button"
              className="brutal-btn white btn-sm"
              onClick={padaTutupInfo}
            >
              Tutup
            </button>
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
  tema: PropTypes.string.isRequired,
  padaToggleTema: PropTypes.func.isRequired,
  padaEksporBackup: PropTypes.func.isRequired,
  padaImporBackup: PropTypes.func.isRequired,
  padaResetData: PropTypes.func.isRequired,
  pesanErrorStorage: PropTypes.string,
  padaTutupError: PropTypes.func.isRequired,
  pesanInfoBackup: PropTypes.string,
  padaTutupInfo: PropTypes.func.isRequired,
};

function App() {
  const hasilAwalTrx = muatDataLokal(KUNCI_STORAGE_TRX, []);
  const hasilAwalTarget = muatDataLokal(KUNCI_STORAGE_TARGET, []);
  const hasilAwalAnggaran = muatDataLokal(KUNCI_STORAGE_ANGGARAN, 0);
  const hasilAwalTema = muatDataLokal(KUNCI_STORAGE_TEMA, "terang");

  const [daftarTransaksi, setDaftarTransaksi] = useState(hasilAwalTrx.data);
  const [daftarTarget, setDaftarTarget] = useState(hasilAwalTarget.data);
  const [batasAnggaran, setBatasAnggaran] = useState(
    Number(hasilAwalAnggaran.data) || 0,
  );
  const [tema, setTema] = useState(
    hasilAwalTema.data === "gelap" ? "gelap" : "terang",
  );
  const [errorStorage, setErrorStorage] = useState(
    hasilAwalTrx.error || hasilAwalTarget.error,
  );
  const [infoBackup, setInfoBackup] = useState("");
  const [sedangMemuat, setSedangMemuat] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    try {
      localStorage.setItem(KUNCI_STORAGE_TEMA, JSON.stringify(tema));
    } catch {
      // Abaikan jika mode privat menolak penyimpanan tema
    }
  }, [tema]);

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

  useEffect(() => {
    try {
      localStorage.setItem(
        KUNCI_STORAGE_ANGGARAN,
        JSON.stringify(batasAnggaran),
      );
    } catch {
      setErrorStorage("Gagal menyimpan batas anggaran ke localStorage.");
    }
  }, [batasAnggaran]);

  function toggleTema() {
    setTema((lama) => (lama === "terang" ? "gelap" : "terang"));
  }

  function tambahTransaksi(transaksiBaru) {
    setDaftarTransaksi((lama) => [transaksiBaru, ...lama]);
  }

  function editTransaksi(transaksiUpdate) {
    setDaftarTransaksi((lama) =>
      lama.map((item) =>
        item.id === transaksiUpdate.id ? { ...item, ...transaksiUpdate } : item,
      ),
    );
  }

  function hapusTransaksi(id) {
    setDaftarTransaksi((lama) => lama.filter((item) => item.id !== id));
  }

  function buatTargetBaru(targetBaru) {
    setDaftarTarget((lama) => [targetBaru, ...lama]);
  }

  function editTarget(targetUpdate) {
    setDaftarTarget((lama) =>
      lama.map((item) =>
        item.id === targetUpdate.id ? { ...item, ...targetUpdate } : item,
      ),
    );
  }

  function tambahTabungan(idTarget, nominalDelta) {
    setDaftarTarget((lama) =>
      lama.map((item) =>
        item.id === idTarget
          ? {
              ...item,
              terkumpul: Math.max(0, item.terkumpul + nominalDelta),
            }
          : item,
      ),
    );
  }

  function hapusTarget(idTarget) {
    setDaftarTarget((lama) => lama.filter((item) => item.id !== idTarget));
  }

  function eksporBackupJson() {
    const paketData = {
      versi: 1,
      aplikasi: "Wilmar Trance",
      tanggalEkspor: tanggalRelatif(0),
      batasAnggaran,
      daftarTransaksi,
      daftarTarget,
    };
    unduhFile(
      `wilmar-trance-backup-${tanggalRelatif(0)}.json`,
      JSON.stringify(paketData, null, 2),
      "application/json;charset=utf-8;",
    );
    setInfoBackup("File backup JSON berhasil diunduh ke perangkatmu.");
  }

  function imporBackupJson(file) {
    if (!file) return;
    const pembaca = new FileReader();
    pembaca.onload = (e) => {
      try {
        const hasil = JSON.parse(String(e.target?.result || "{}"));
        if (
          !Array.isArray(hasil.daftarTransaksi) ||
          !Array.isArray(hasil.daftarTarget)
        ) {
          setErrorStorage(
            "Format file backup tidak valid. Pastikan memilih file JSON backup Wilmar Trance.",
          );
          return;
        }
        setDaftarTransaksi(hasil.daftarTransaksi);
        setDaftarTarget(hasil.daftarTarget);
        if (typeof hasil.batasAnggaran === "number" && hasil.batasAnggaran >= 0) {
          setBatasAnggaran(hasil.batasAnggaran);
        }
        setErrorStorage(null);
        setInfoBackup(
          `Data berhasil dipulihkan: ${hasil.daftarTransaksi.length} catatan transaksi & ${hasil.daftarTarget.length} target tabungan.`,
        );
      } catch {
        setErrorStorage("File JSON rusak atau tidak dapat dibaca.");
      }
    };
    pembaca.readAsText(file);
  }

  function resetKeDataAwal() {
    setSedangMemuat(true);
    setDaftarTransaksi([]);
    setDaftarTarget([]);
    setBatasAnggaran(0);
    setErrorStorage(null);
    setInfoBackup("");
    localStorage.setItem(KUNCI_STORAGE_TRX, JSON.stringify([]));
    localStorage.setItem(KUNCI_STORAGE_TARGET, JSON.stringify([]));
    localStorage.setItem(KUNCI_STORAGE_ANGGARAN, JSON.stringify(0));
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
              tema={tema}
              padaToggleTema={toggleTema}
              padaEksporBackup={eksporBackupJson}
              padaImporBackup={imporBackupJson}
              padaResetData={resetKeDataAwal}
              pesanErrorStorage={errorStorage}
              padaTutupError={() => setErrorStorage(null)}
              pesanInfoBackup={infoBackup}
              padaTutupInfo={() => setInfoBackup("")}
            />
          }
        >
          <Route
            path="/"
            element={
              <Beranda
                daftarTransaksi={daftarTransaksi}
                batasAnggaran={batasAnggaran}
                padaUbahAnggaran={setBatasAnggaran}
                padaTambahTransaksi={tambahTransaksi}
                padaEditTransaksi={editTransaksi}
                padaHapusTransaksi={hapusTransaksi}
              />
            }
          />
          <Route
            path="/transaksi"
            element={
              <Transaksi
                daftarTransaksi={daftarTransaksi}
                padaEditTransaksi={editTransaksi}
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
                padaEditTarget={editTarget}
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
