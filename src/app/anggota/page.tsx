"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  UserPlus,
  Building2,
  CalendarDays,
  CheckCircle2,
  ArrowUpRight,
  Save,
  CreditCard,
  MapPin,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { useIPMData } from "@/context/IPMDataContext";

export default function PortalAnggotaPage() {
  const {
    anggotaList,
    pimpinanList,
    agendaList,
    registerAnggota,
    updateAnggota,
    toggleAgendaAnggota,
    isLoadingDB,
  } = useIPMData();

  const rantingList = pimpinanList.filter((p) => p.tingkatan === "Ranting");

  const [selectedAnggotaId, setSelectedAnggotaId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "profil" | "pimpinan" | "agenda" | "daftar_baru"
  >("daftar_baru");
  const [saveMessage, setSaveMessage] = useState("");

  const activeAnggota =
    anggotaList.find((a) => a.id === selectedAnggotaId) || anggotaList[0] || null;

  useEffect(() => {
    if (activeAnggota && !selectedAnggotaId) {
      setSelectedAnggotaId(activeAnggota.id);
      setEditNama(activeAnggota.nama);
      setEditTelepon(activeAnggota.telepon);
      setEditKelas(activeAnggota.kelasAngkatan);
      setEditRantingSlug(activeAnggota.rantingSlug);
      setEditMinat(activeAnggota.bidangMinat);
      setEditBio(activeAnggota.bio);
      setActiveTab("profil");
    } else if (!activeAnggota) {
      setActiveTab("daftar_baru");
    }
  }, [activeAnggota, selectedAnggotaId]);

  const myRanting =
    pimpinanList.find((p) => p.slug === activeAnggota?.rantingSlug) ||
    pimpinanList.find((p) => p.nama === activeAnggota?.rantingNama) ||
    null;

  const myCabang = pimpinanList.find(
    (p) =>
      p.tingkatan === "Cabang" &&
      (p.nama === myRanting?.pimpinanInduk ||
        p.slug === myRanting?.pimpinanIndukSlug ||
        p.nama === activeAnggota?.cabangNama)
  );

  // Edit profile states
  const [editNama, setEditNama] = useState("");
  const [editTelepon, setEditTelepon] = useState("");
  const [editKelas, setEditKelas] = useState("");
  const [editRantingSlug, setEditRantingSlug] = useState("");
  const [editMinat, setEditMinat] = useState("Literasi & Keilmuan");
  const [editBio, setEditBio] = useState("");

  // Registration form states
  const [regNama, setRegNama] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regTelepon, setRegTelepon] = useState("");
  const [regKelas, setRegKelas] = useState("");
  const [regRantingSlug, setRegRantingSlug] = useState("");
  const [regRantingManual, setRegRantingManual] = useState("");
  const [regCabangManual, setRegCabangManual] = useState("");
  const [regMinat, setRegMinat] = useState("Literasi & Keilmuan");
  const [regBio, setRegBio] = useState("");

  const handleSelectMember = (id: string) => {
    setSelectedAnggotaId(id);
    const found = anggotaList.find((a) => a.id === id);
    if (found) {
      setEditNama(found.nama);
      setEditTelepon(found.telepon);
      setEditKelas(found.kelasAngkatan);
      setEditRantingSlug(found.rantingSlug);
      setEditMinat(found.bidangMinat);
      setEditBio(found.bio);
      setActiveTab("profil");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAnggota) return;
    await updateAnggota(activeAnggota.id, {
      nama: editNama.trim(),
      telepon: editTelepon.trim(),
      kelasAngkatan: editKelas.trim(),
      rantingSlug: editRantingSlug || activeAnggota.rantingSlug,
      bidangMinat: editMinat,
      bio: editBio.trim(),
    });
    setSaveMessage("Profil akun anggota berhasil diperbarui di database Supabase!");
    setTimeout(() => setSaveMessage(""), 4000);
  };

  const handleRegisterNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNama.trim() || !regEmail.trim()) return;
    const chosenSlug = regRantingSlug || rantingList[0]?.slug || "";
    const created = await registerAnggota({
      nama: regNama,
      email: regEmail,
      telepon: regTelepon,
      kelasAngkatan: regKelas || "Kelas X",
      rantingSlug: chosenSlug,
      rantingNamaManual: regRantingManual,
      cabangNamaManual: regCabangManual,
      bidangMinat: regMinat,
      bio: regBio,
    });
    handleSelectMember(created.id);
    setActiveTab("profil");
    setRegNama("");
    setRegEmail("");
    setRegTelepon("");
    setRegKelas("");
    setRegRantingManual("");
    setRegCabangManual("");
    setRegBio("");
    setSaveMessage(
      `Selamat datang, ${created.nama}! Akun anggota Anda (${created.nba}) telah tersimpan di database Supabase.`
    );
    setTimeout(() => setSaveMessage(""), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main id="main-content" className="flex-1">
        {/* TOP HEADER */}
        <section className="bg-ipm-surface border-b border-ipm-border py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  PORTAL ANGGOTA • PD IPM KOTA YOGYAKARTA
                </p>
                <h1 className="text-3xl sm:text-4xl font-semibold text-ipm-dark tracking-tight">
                  Ruang Akun &amp; Kartu Anggota
                </h1>
                <p className="text-sm sm:text-base text-ipm-muted max-w-2xl">
                  Kelola profil keanggotaan pelajar, terhubung dengan Ranting Sekolah dan Cabang Kemantren naungan PD IPM Kota Yogyakarta.
                </p>
              </div>

              {/* Member Account Switcher */}
              <div className="rounded-2xl bg-white border border-ipm-border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                {anggotaList.length > 0 && (
                  <div>
                    <label
                      htmlFor="member-account-switcher"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-ipm-muted"
                    >
                      Akun Anggota Terdaftar ({anggotaList.length})
                    </label>
                    <select
                      id="member-account-switcher"
                      value={activeAnggota?.id || ""}
                      onChange={(e) => handleSelectMember(e.target.value)}
                      className="mt-1 px-3 py-2 min-h-[40px] rounded-xl bg-ipm-surface border border-ipm-border text-xs font-semibold text-ipm-dark"
                    >
                      {anggotaList.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nama} ({a.rantingNama})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab("daftar_baru")}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[40px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover transition-colors shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Daftar Anggota Baru</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {saveMessage && (
              <div
                role="status"
                className="p-4 rounded-2xl bg-ipm-gold-soft border border-ipm-gold text-sm font-semibold text-ipm-dark flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-5 h-5 text-ipm-gold-badge shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT 4 COLUMNS: DIGITAL KTA CARD & TABS */}
              <div className="lg:col-span-4 space-y-5">
                {activeAnggota ? (
                  <div className="rounded-2xl bg-white border border-ipm-border overflow-hidden shadow-sm">
                    <div className="bg-ipm-gold px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="/images/logo-ipm-jogja-trimmed.png"
                          alt="Logo IPM Jogja"
                          className="h-7 w-auto object-contain bg-white/95 rounded px-1.5 py-0.5"
                        />
                        <span className="text-xs font-semibold text-white">
                          KTA Digital • Kota Yogyakarta
                        </span>
                      </div>
                      <CreditCard className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3.5">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-ipm-surface border border-ipm-border text-ipm-dark font-semibold text-base shrink-0">
                          {activeAnggota.nama
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <div>
                          <h2 className="text-lg font-semibold text-ipm-dark">
                            {activeAnggota.nama}
                          </h2>
                          <p className="text-xs font-medium text-ipm-muted">
                            NBA: {activeAnggota.nba}
                          </p>
                        </div>
                      </div>

                      <dl className="pt-3 border-t border-ipm-border space-y-2.5 text-xs">
                        <div>
                          <dt className="text-ipm-muted">Pimpinan Ranting</dt>
                          <dd className="font-semibold text-ipm-dark mt-0.5">
                            {activeAnggota.rantingNama}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-ipm-muted">Pimpinan Cabang Induk</dt>
                          <dd className="font-semibold text-ipm-dark mt-0.5">
                            {activeAnggota.cabangNama}
                          </dd>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <dt className="text-ipm-muted">Kelas / Angkatan</dt>
                            <dd className="font-medium text-ipm-dark mt-0.5">
                              {activeAnggota.kelasAngkatan}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-ipm-muted">Status</dt>
                            <dd className="mt-0.5">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-ipm-gold-soft text-ipm-gold-badge">
                                {activeAnggota.statusKeanggotaan}
                              </span>
                            </dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 space-y-2">
                    <h2 className="text-base font-semibold text-ipm-dark">
                      Belum Ada Akun Anggota di Database
                    </h2>
                    <p className="text-xs text-ipm-muted leading-relaxed">
                      {isLoadingDB
                        ? "Sedang memuat data anggota dari Supabase..."
                        : "Silakan lengkapi formulir registrasi di samping untuk menerbitkan Kartu Anggota Digital (KTA) pertama di database Supabase."}
                    </p>
                  </div>
                )}

                {/* Navigation Tabs */}
                <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-2 space-y-1">
                  {activeAnggota && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profil")}
                        className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                          activeTab === "profil"
                            ? "bg-white text-ipm-dark shadow-sm border border-ipm-border"
                            : "text-ipm-muted hover:text-ipm-dark"
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                        <span>Edit Profil Anggota</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab("pimpinan")}
                        className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                          activeTab === "pimpinan"
                            ? "bg-white text-ipm-dark shadow-sm border border-ipm-border"
                            : "text-ipm-muted hover:text-ipm-dark"
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                        <span>Pimpinan Ranting &amp; Cabang Saya</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab("agenda")}
                        className={`w-full flex items-center justify-between px-4 py-3 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                          activeTab === "agenda"
                            ? "bg-white text-ipm-dark shadow-sm border border-ipm-border"
                            : "text-ipm-muted hover:text-ipm-dark"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <CalendarDays className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                          <span>Kegiatan yang Diikuti</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-ipm-gold text-white text-[11px]">
                          {activeAnggota.agendaDiikuti.length || 0}
                        </span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTab("daftar_baru")}
                    className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                      activeTab === "daftar_baru"
                        ? "bg-white text-ipm-dark shadow-sm border border-ipm-border"
                        : "text-ipm-muted hover:text-ipm-dark"
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                    <span>Daftar Akun Anggota Baru</span>
                  </button>
                </div>
              </div>

              {/* RIGHT 8 COLUMNS: TAB CONTENT */}
              <div className="lg:col-span-8">
                {activeTab === "profil" && activeAnggota && (
                  <form
                    onSubmit={handleSaveProfile}
                    className="rounded-2xl bg-white border border-ipm-border p-6 sm:p-8 space-y-5"
                  >
                    <div className="border-b border-ipm-border pb-4">
                      <h2 className="text-xl font-semibold text-ipm-dark">
                        Pengaturan Profil Anggota
                      </h2>
                      <p className="text-xs text-ipm-muted mt-1">
                        Perbarui data diri, kelas/angkatan, bidang minat, dan afiliasi Pimpinan Ranting Anda di database.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="edit-ang-nama"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Nama Lengkap
                        </label>
                        <input
                          id="edit-ang-nama"
                          type="text"
                          required
                          value={editNama}
                          onChange={(e) => setEditNama(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="edit-ang-telp"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Nomor Telepon / WhatsApp
                        </label>
                        <input
                          id="edit-ang-telp"
                          type="text"
                          value={editTelepon}
                          onChange={(e) => setEditTelepon(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                        />
                      </div>

                      {rantingList.length > 0 && (
                        <div className="space-y-1.5">
                          <label
                            htmlFor="edit-ang-ranting"
                            className="block text-xs font-semibold text-ipm-dark"
                          >
                            Pimpinan Ranting Tempat Bernaung
                          </label>
                          <select
                            id="edit-ang-ranting"
                            value={editRantingSlug}
                            onChange={(e) => setEditRantingSlug(e.target.value)}
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark"
                          >
                            {rantingList.map((r) => (
                              <option key={r.id} value={r.slug}>
                                {r.nama} ({r.pimpinanInduk})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label
                          htmlFor="edit-ang-kelas"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Kelas &amp; Angkatan
                        </label>
                        <input
                          id="edit-ang-kelas"
                          type="text"
                          value={editKelas}
                          onChange={(e) => setEditKelas(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label
                          htmlFor="edit-ang-minat"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Bidang Minat Gerakan
                        </label>
                        <select
                          id="edit-ang-minat"
                          value={editMinat}
                          onChange={(e) => setEditMinat(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark"
                        >
                          <option value="Literasi & Keilmuan">
                            Literasi &amp; Keilmuan
                          </option>
                          <option value="Kaderisasi & Kepemimpinan">
                            Kaderisasi &amp; Kepemimpinan
                          </option>
                          <option value="Lingkungan & Aksi Sosial">
                            Lingkungan &amp; Aksi Sosial
                          </option>
                          <option value="Kreativitas & Media">
                            Kreativitas &amp; Media
                          </option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label
                          htmlFor="edit-ang-bio"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Bio Singkat &amp; Aktivitas di Ranting
                        </label>
                        <textarea
                          id="edit-ang-bio"
                          rows={3}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-ipm-border text-sm text-ipm-dark"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors"
                      >
                        <Save className="w-4 h-4" aria-hidden="true" />
                        <span>Simpan ke Database</span>
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === "pimpinan" && activeAnggota && (
                  <div className="space-y-6">
                    {myRanting ? (
                      <div className="rounded-2xl bg-white border border-ipm-border p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ipm-gold text-white">
                              Pimpinan Ranting Saya
                            </span>
                            <h2 className="text-xl font-semibold text-ipm-dark mt-2">
                              {myRanting.nama}
                            </h2>
                            <p className="text-xs text-ipm-muted flex items-center gap-1.5 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-ipm-gold-deep" />
                              <span>{myRanting.alamatSekretariat || myRanting.kecamatan}</span>
                            </p>
                          </div>
                          <Link
                            href={`/direktori/${myRanting.slug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-ipm-surface border border-ipm-border text-xs font-semibold text-ipm-dark hover:border-ipm-gold self-start sm:self-auto"
                          >
                            <span>Buka Profil Ranting</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>

                        <p className="text-sm text-ipm-muted leading-relaxed">
                          {myRanting.deskripsi}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-white border border-ipm-border p-6 space-y-3">
                        <h2 className="text-lg font-semibold text-ipm-dark">
                          {activeAnggota.rantingNama}
                        </h2>
                        <p className="text-xs text-ipm-muted">
                          Cabang Induk: {activeAnggota.cabangNama}
                        </p>
                      </div>
                    )}

                    {myCabang && (
                      <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-ipm-gold-deep uppercase tracking-wider">
                            Pimpinan Cabang Induk
                          </span>
                          <h3 className="text-lg font-semibold text-ipm-dark">
                            {myCabang.nama}
                          </h3>
                          <p className="text-xs text-ipm-muted">
                            {myCabang.tagline}
                          </p>
                        </div>
                        <Link
                          href={`/direktori/${myCabang.slug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:border-ipm-gold self-start sm:self-auto shrink-0"
                        >
                          <span>Profil Cabang</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "agenda" && activeAnggota && (
                  <div className="rounded-2xl bg-white border border-ipm-border p-6 space-y-5">
                    <div>
                      <h2 className="text-xl font-semibold text-ipm-dark">
                        Agenda &amp; Kegiatan Pelajar
                      </h2>
                      <p className="text-xs text-ipm-muted mt-1">
                        Klik tombol daftar untuk mengikuti kegiatan menggunakan akun anggota Anda.
                      </p>
                    </div>

                    {agendaList.length === 0 ? (
                      <div className="p-6 rounded-xl bg-ipm-surface border border-ipm-border text-center space-y-2">
                        <p className="text-sm font-semibold text-ipm-dark">
                          Belum ada agenda kegiatan di database
                        </p>
                        <Link
                          href="/agenda"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ipm-gold-deep underline"
                        >
                          <span>Buka Halaman Agenda</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {agendaList.map((ag) => {
                          const joined = activeAnggota.agendaDiikuti.includes(ag.id);
                          return (
                            <div
                              key={ag.id}
                              className="p-4 rounded-xl bg-ipm-surface border border-ipm-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-semibold text-ipm-dark">
                                    {ag.judul}
                                  </h3>
                                  {joined && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-ipm-gold text-white">
                                      Terdaftar
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-ipm-muted">
                                  {ag.waktuLengkap} • {ag.lokasi}
                                </p>
                                <p className="text-[11px] font-medium text-ipm-gold-deep">
                                  Penyelenggara: {ag.penyelenggara}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleAgendaAnggota(activeAnggota.id, ag.id)
                                }
                                className={`px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-semibold transition-colors shrink-0 self-start sm:self-auto ${
                                  joined
                                    ? "bg-white border border-ipm-border text-ipm-dark hover:bg-ipm-surface"
                                    : "bg-ipm-gold text-white hover:bg-ipm-gold-hover"
                                }`}
                              >
                                {joined ? "Batalkan Kehadiran" : "Daftar dengan Akun"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "daftar_baru" && (
                  <form
                    onSubmit={handleRegisterNewMember}
                    className="rounded-2xl bg-white border border-ipm-border p-6 sm:p-8 space-y-5"
                  >
                    <div className="border-b border-ipm-border pb-4">
                      <h2 className="text-xl font-semibold text-ipm-dark">
                        Registrasi Akun Anggota ke Database
                      </h2>
                      <p className="text-xs text-ipm-muted mt-1">
                        Daftarkan diri Anda sebagai anggota Ikatan Pelajar Muhammadiyah. Data akan langsung disimpan ke tabel <code>anggota</code> di Supabase.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="reg-nama"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Nama Lengkap
                        </label>
                        <input
                          id="reg-nama"
                          type="text"
                          required
                          value={regNama}
                          onChange={(e) => setRegNama(e.target.value)}
                          placeholder="Nama lengkap Anda"
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="reg-email"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Email Aktif
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="nama@email.com"
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="reg-telp"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Nomor Telepon / WhatsApp
                        </label>
                        <input
                          id="reg-telp"
                          type="text"
                          required
                          value={regTelepon}
                          onChange={(e) => setRegTelepon(e.target.value)}
                          placeholder="0812-xxxx-xxxx"
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="reg-kelas"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Kelas &amp; Angkatan
                        </label>
                        <input
                          id="reg-kelas"
                          type="text"
                          required
                          value={regKelas}
                          onChange={(e) => setRegKelas(e.target.value)}
                          placeholder="Contoh: Kelas XI • Angkatan 2025"
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                        />
                      </div>

                      {rantingList.length > 0 ? (
                        <div className="space-y-1.5">
                          <label
                            htmlFor="reg-ranting"
                            className="block text-xs font-semibold text-ipm-dark"
                          >
                            Pilih Pimpinan Ranting Terdaftar
                          </label>
                          <select
                            id="reg-ranting"
                            value={regRantingSlug || rantingList[0]?.slug || ""}
                            onChange={(e) => setRegRantingSlug(e.target.value)}
                            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm"
                          >
                            {rantingList.map((r) => (
                              <option key={r.id} value={r.slug}>
                                {r.nama} ({r.pimpinanInduk})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <label
                              htmlFor="reg-ranting-manual"
                              className="block text-xs font-semibold text-ipm-dark"
                            >
                              Nama Pimpinan Ranting / Sekolah
                            </label>
                            <input
                              id="reg-ranting-manual"
                              type="text"
                              required
                              value={regRantingManual}
                              onChange={(e) => setRegRantingManual(e.target.value)}
                              placeholder="Contoh: PR IPM SMA Muhammadiyah 1"
                              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label
                              htmlFor="reg-cabang-manual"
                              className="block text-xs font-semibold text-ipm-dark"
                            >
                              Nama Pimpinan Cabang Induk
                            </label>
                            <input
                              id="reg-cabang-manual"
                              type="text"
                              required
                              value={regCabangManual}
                              onChange={(e) => setRegCabangManual(e.target.value)}
                              placeholder="Contoh: PC IPM Gondokusuman"
                              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-1.5">
                        <label
                          htmlFor="reg-minat"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Bidang Minat
                        </label>
                        <select
                          id="reg-minat"
                          value={regMinat}
                          onChange={(e) => setRegMinat(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm"
                        >
                          <option value="Literasi & Keilmuan">
                            Literasi &amp; Keilmuan
                          </option>
                          <option value="Kaderisasi & Kepemimpinan">
                            Kaderisasi &amp; Kepemimpinan
                          </option>
                          <option value="Lingkungan & Aksi Sosial">
                            Lingkungan &amp; Aksi Sosial
                          </option>
                          <option value="Kreativitas & Media">
                            Kreativitas &amp; Media
                          </option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label
                          htmlFor="reg-bio"
                          className="block text-xs font-semibold text-ipm-dark"
                        >
                          Motivasi Bergabung / Bio Singkat
                        </label>
                        <textarea
                          id="reg-bio"
                          rows={2}
                          value={regBio}
                          onChange={(e) => setRegBio(e.target.value)}
                          placeholder="Ceritakan minat kegiatanmu di IPM..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-ipm-border text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors"
                      >
                        <UserPlus className="w-4 h-4" aria-hidden="true" />
                        <span>Simpan Akun Anggota ke Database</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
