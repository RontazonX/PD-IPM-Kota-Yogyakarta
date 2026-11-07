"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  User,
  Phone,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useIPMData } from "@/context/IPMDataContext";

export default function LoginPage() {
  const router = useRouter();
  const { pimpinanList, loginUnified, registerAnggota } = useIPMData();

  const rantingOptions = pimpinanList.filter((p) => p.tingkatan === "Ranting");

  // Tab State: "masuk" or "daftar"
  const [activeTab, setActiveTab] = useState<"masuk" | "daftar">("masuk");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state (khusus anggota pelajar)
  const [regNama, setRegNama] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regTelepon, setRegTelepon] = useState("");
  const [regKelas, setRegKelas] = useState("");
  const [regRantingSlug, setRegRantingSlug] = useState("");
  const [regRantingManual, setRegRantingManual] = useState("");
  const [regCabangManual, setRegCabangManual] = useState("");
  const [regMinat, setRegMinat] = useState("Literasi & Keilmuan");
  const [regError, setRegError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Submit Handler: Login Tunggal
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Mohon masukkan email dan kata sandi Anda.");
      return;
    }
    setLoginError("");
    setIsLoggingIn(true);

    const res = await loginUnified(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (res.success) {
      if (
        res.role === "admin_utama" ||
        res.role === "admin_cabang" ||
        res.role === "admin_ranting"
      ) {
        router.push("/admin/dashboard");
      } else {
        router.push("/anggota");
      }
    } else {
      setLoginError(
        res.error ||
        "Email atau kata sandi tidak ditemukan. Jika Anda anggota pelajar baru, silakan gunakan tab Daftar Akun Anggota."
      );
    }
  };

  // Submit Handler: Registrasi Anggota Pelajar
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNama.trim() || !regEmail.trim()) {
      setRegError("Mohon lengkapi nama dan alamat email Anda.");
      return;
    }
    setRegError("");
    setIsRegistering(true);

    try {
      const selectedRanting = rantingOptions.find(
        (r) => r.slug === regRantingSlug
      );
      await registerAnggota({
        nama: regNama,
        email: regEmail,
        telepon: regTelepon || "-",
        kelasAngkatan: regKelas || "-",
        rantingSlug:
          selectedRanting?.slug ||
          (regRantingManual
            ? regRantingManual
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
            : "ranting-ipm"),
        rantingNamaManual:
          selectedRanting?.nama || regRantingManual || "PR IPM",
        cabangNamaManual:
          selectedRanting?.pimpinanInduk || regCabangManual || "PC IPM",
        bidangMinat: regMinat,
        bio: `Anggota pelajar di ${selectedRanting?.nama || regRantingManual || "Ranting IPM"
          }.`,
      });
      setIsRegistering(false);
      router.push("/anggota");
    } catch {
      setIsRegistering(false);
      setRegError("Gagal mendaftarkan akun. Silakan coba kembali.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-ipm-dark">
      {/* LEFT SIDE PANEL */}
      <aside className="lg:col-span-5 bg-ipm-surface text-ipm-dark p-6 sm:p-10 lg:p-12 flex flex-col justify-between gap-8 border-b lg:border-b-0 lg:border-r border-ipm-border">
        <div className="space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 min-h-[44px]"
            aria-label="Kembali ke Beranda"
          >
            <img
              src="/images/logo-ipm-jogja-trimmed.png"
              alt="Logo IPM Jogja"
              className="h-10 w-auto object-contain"
            />
            <span className="h-6 w-px bg-ipm-border" aria-hidden="true" />
            <span className="text-xs font-medium leading-tight text-ipm-muted">
              Pimpinan Daerah
              <br />
              IPM Kota Yogyakarta
            </span>
          </Link>

          <div className="space-y-4 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
              PD IPM KOTA YOGYAKARTA
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-ipm-dark leading-[1.15] tracking-tight">
              Sistem Informasi PD IPM Kota Yogyakarta
            </h1>

            <p className="text-sm sm:text-base text-ipm-muted leading-relaxed">
              Portal resmi Pimpinan Daerah Ikatan Pelajar Muhammadiyah Kota Yogyakarta untuk pengelolaan 14 Pimpinan Cabang Kemantren, ranting sekolah, dan keanggotaan pelajar se-Kota Yogyakarta.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-ipm-dark">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-ipm-gold text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-ipm-dark">Pengelola (Admin)</p>
                  <p className="text-ipm-muted text-xs">
                    Email yang didaftarkan sebagai admin otomatis diarahkan ke Dashboard Pengelolaan (Ranting, Cabang, atau Daerah).
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-ipm-gold text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-ipm-dark">Anggota Pelajar</p>
                  <p className="text-ipm-muted text-xs">
                    Masuk ke Portal Anggota untuk Kartu Tanda Anggota (KTA) digital, agenda kegiatan, dan data pimpinan asal.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-3 text-xs text-ipm-muted pt-6 border-t border-ipm-border">
          <ShieldCheck
            className="w-5 h-5 text-ipm-gold-deep shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p>
            Otentikasi terhubung langsung dengan tabel akun di Supabase PostgreSQL. Dashboard admin hanya dapat diakses oleh akun pengelola yang terdaftar.
          </p>
        </div>
      </aside>

      {/* RIGHT SIDE: AUTHENTICATION FORM */}
      <main
        id="main-content"
        className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between bg-white"
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-ipm-muted hover:text-ipm-dark min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-8 space-y-6">
          {/* Header Title */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
              {activeTab === "masuk"
                ? "Masuk ke Akun Anda"
                : "Daftar Akun Anggota Baru"}
            </h2>
            <p className="text-xs sm:text-sm text-ipm-muted">
              {activeTab === "masuk"
                ? "Masukkan email dan kata sandi yang terdaftar di database Supabase."
                : "Daftarkan diri Anda sebagai anggota pelajar Ikatan Pelajar Muhammadiyah."}
            </p>
          </div>

          {/* Clean 2-Way Tab Switcher: Masuk vs Daftar */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-ipm-surface border border-ipm-border">
            <button
              type="button"
              onClick={() => {
                setActiveTab("masuk");
                setLoginError("");
              }}
              className={`py-2.5 px-4 rounded-lg text-xs font-semibold min-h-[44px] transition-colors ${activeTab === "masuk"
                  ? "bg-white text-ipm-dark shadow-sm border border-ipm-border font-bold"
                  : "text-ipm-muted hover:text-ipm-dark"
                }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("daftar");
                setRegError("");
              }}
              className={`py-2.5 px-4 rounded-lg text-xs font-semibold min-h-[44px] transition-colors ${activeTab === "daftar"
                  ? "bg-white text-ipm-dark shadow-sm border border-ipm-border font-bold"
                  : "text-ipm-muted hover:text-ipm-dark"
                }`}
            >
              Daftar Anggota
            </button>
          </div>

          {/* TAB 1: MASUK (LOGIN) */}
          {activeTab === "masuk" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-[#FFF5F5] border border-[#E53E3E]/40 text-xs font-medium text-[#742A2A] leading-relaxed"
                >
                  {loginError}
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail
                    className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@ipm.or.id"
                    className="w-full pl-10 pr-4 py-3 min-h-[46px] rounded-xl bg-white border border-ipm-border focus:border-ipm-gold text-sm text-ipm-dark"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <LockKeyhole
                    className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-10 pr-12 py-3 min-h-[46px] rounded-xl bg-white border border-ipm-border focus:border-ipm-gold text-sm text-ipm-dark"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 inline-flex items-center justify-center rounded-lg text-ipm-muted hover:text-ipm-dark"
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 min-h-[48px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors disabled:opacity-50"
              >
                <span>{isLoggingIn ? "Memeriksa Akun..." : "Masuk ke Sistem"}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="rounded-xl bg-ipm-surface border border-ipm-border p-3.5 text-xs text-ipm-muted space-y-1 leading-relaxed">
                <p className="font-semibold text-ipm-dark">Petunjuk Akun Pengelola:</p>
                <p>
                  Akun Admin (Ranting, Cabang, Daerah) disediakan oleh administrator. Untuk inisialisasi awal pengelola utama, silakan gunakan email <code>admin@ipm.or.id</code>.
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: DAFTAR AKUN ANGGOTA */}
          {activeTab === "daftar" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-[#FFF5F5] border border-[#E53E3E]/40 text-xs font-medium text-[#742A2A]"
                >
                  {regError}
                </div>
              )}

              <div className="space-y-1">
                <label
                  htmlFor="reg-nama"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Nama Lengkap Pelajar
                </label>
                <div className="relative">
                  <User
                    className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="reg-nama"
                    type="text"
                    required
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@pelajar.id"
                      className="w-full pl-10 pr-3 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reg-pass"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-pass"
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-3 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="reg-telp"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    WhatsApp / Telepon
                  </label>
                  <div className="relative">
                    <Phone
                      className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-telp"
                      type="text"
                      value={regTelepon}
                      onChange={(e) => setRegTelepon(e.target.value)}
                      placeholder="08xx-xxxx-xxxx"
                      className="w-full pl-10 pr-3 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reg-kelas"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    Kelas &amp; Angkatan
                  </label>
                  <div className="relative">
                    <GraduationCap
                      className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-kelas"
                      type="text"
                      value={regKelas}
                      onChange={(e) => setRegKelas(e.target.value)}
                      placeholder="Kelas X / Angkatan 2026"
                      className="w-full pl-10 pr-3 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Ranting Selection */}
              {rantingOptions.length > 0 ? (
                <div className="space-y-1">
                  <label
                    htmlFor="reg-ranting"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    Asal Pimpinan Ranting
                  </label>
                  <div className="relative">
                    <Building2
                      className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      id="reg-ranting"
                      value={regRantingSlug}
                      onChange={(e) => setRegRantingSlug(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm bg-white"
                    >
                      <option value="">-- Pilih Ranting Sekolah / Desa --</option>
                      {rantingOptions.map((r) => (
                        <option key={r.id} value={r.slug}>
                          {r.nama} ({r.pimpinanInduk})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="reg-ranting-manual"
                      className="block text-xs font-semibold text-ipm-dark"
                    >
                      Nama Pimpinan Ranting
                    </label>
                    <input
                      id="reg-ranting-manual"
                      type="text"
                      required
                      value={regRantingManual}
                      onChange={(e) => setRegRantingManual(e.target.value)}
                      placeholder="PR IPM SMA ..."
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="reg-cabang-manual"
                      className="block text-xs font-semibold text-ipm-dark"
                    >
                      Nama Pimpinan Cabang
                    </label>
                    <input
                      id="reg-cabang-manual"
                      type="text"
                      required
                      value={regCabangManual}
                      onChange={(e) => setRegCabangManual(e.target.value)}
                      placeholder="PC IPM ..."
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label
                  htmlFor="reg-minat"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Bidang Minat Gerakan
                </label>
                <select
                  id="reg-minat"
                  value={regMinat}
                  onChange={(e) => setRegMinat(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm bg-white"
                >
                  <option value="Literasi & Keilmuan">Literasi &amp; Keilmuan</option>
                  <option value="Kaderisasi & Kepemimpinan">
                    Kaderisasi &amp; Kepemimpinan
                  </option>
                  <option value="Lingkungan & Aksi Sosial">
                    Lingkungan &amp; Aksi Sosial
                  </option>
                  <option value="Kreativitas & Media">Kreativitas &amp; Media</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 min-h-[48px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isRegistering
                    ? "Menyimpan Akun..."
                    : "Daftar sebagai Anggota Pelajar"}
                </span>
              </button>
            </form>
          )}
        </div>

        <div className="max-w-md w-full mx-auto text-[11px] text-ipm-muted">
          <p>Ikatan Pelajar Muhammadiyah • Sistem Informasi &amp; Direktori Pimpinan</p>
        </div>
      </main>
    </div>
  );
}
