"use client";

import React, { useState } from "react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [walletCreated, setWalletCreated] = useState(false);

  function sendMagicLinkOrOtp() {
    // In real app: send OTP or magic link. Here we just advance.
    setStep(2);
  }

  function verifyCode() {
    setStep(3);
    // Simulate backend creating a custodial wallet during first login
    setWalletCreated(true);
  }

  function createPassword() {
    setStep(4);
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/Overlay.png')",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          zIndex: 0,
          opacity: 0.7,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4 text-white">Onboarding Pengrajin</h1>

        {step === 1 && (
          <div className="card bg-white/10 backdrop-blur-sm p-4">
            <p className="mb-4 text-white/90">Masukkan email atau nomor HP. Sistem akan mengirimkan link sekali pakai atau OTP.</p>
            <input className="input input-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30 w-full mb-3" placeholder="Email atau No. HP" value={contact} onChange={(e) => setContact(e.target.value)} />
            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={sendMagicLinkOrOtp} disabled={!contact}>
                Kirim Link / OTP
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card bg-white/10 backdrop-blur-sm p-4">
            <p className="mb-4 text-white/90">Masukkan kode OTP yang dikirimkan (demo: ketik 123456 atau tekan verify).</p>
            <input className="input input-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30 w-full mb-3" placeholder="Kode OTP" value={code} onChange={(e) => setCode(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline border-white text-white hover:bg-white/10" onClick={() => setStep(1)}>
                Kembali
              </button>
              <button className="btn btn-primary" onClick={verifyCode}>
                Verifikasi
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card bg-white/10 backdrop-blur-sm p-4">
            <p className="mb-4 text-white/90">Buat password sederhana untuk akun Anda.</p>
            <input className="input input-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30 w-full mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline border-white text-white hover:bg-white/10" onClick={() => setStep(2)}>
                Kembali
              </button>
              <button className="btn btn-primary" onClick={createPassword} disabled={!password}>
                Buat Akun
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card bg-white/10 backdrop-blur-sm p-4">
            <h2 className="text-lg font-semibold mb-2 text-white">Selesai</h2>
            <p className="text-white/90">Akunnya sudah siap. Sistem telah membuat dompet kustodial untuk Anda. (Demo)</p>
            <div className="mt-4">
              <button className="btn btn-primary" onClick={() => window.location.assign("/pengrajin/beranda")}>
                Pergi ke Beranda
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-white/70">
          <strong>Catatan keamanan:</strong> Untuk keamanan, agen tidak boleh meminta private key. Sistem membuat dompet kustodial untuk menyederhanakan pengalaman.
        </div>
      </div>
    </div>
  );
}
