"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Share2,
  GitBranch,
  ArrowUpRight,
  ArrowRight,
  Mail,
  CheckCircle2,
  X,
  Building2,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { useIPMData } from "@/context/IPMDataContext";

export default function ProfilPimpinanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { pimpinanList, beritaList, agendaList, isLoadingDB } = useIPMData();

  const profil = pimpinanList.find((p) => p.slug === slug);

  const [activeTab, setActiveTab] = useState<
    "ringkasan" | "pengurus" | "kegiatan" | "kontak"
  >("ringkasan");
  const [copiedShare, setCopiedShare] = useState(false);
  const [pesanModalOpen, setPesanModalOpen] = useState(false);
  const [pesanSent, setPesanSent] = useState(false);

  const handleBagikan = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  if (isLoadingDB) {
    return (
      <div className="min-h-screen flex flex-col bg-ipm-surface">
        <PublicHeader />
        <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-sm font-medium text-ipm-muted">Memuat profil pimpinan dari database...</p>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="min-h-screen flex flex-col bg-ipm-surface">
        <PublicHeader />
        <main id="main-content" className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-2xl bg-white border border-ipm-border p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-ipm-gold-soft border border-ipm-gold text-ipm-dark flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-semibold text-ipm-dark">
              Profil Pimpinan Belum Tersedia di Database
            </h1>
            <p className="text-sm text-ipm-muted max-w-md mx-auto leading-relaxed">
              Data pimpinan yang Anda cari belum terdaftar di database. Silakan tambahkan data Pimpinan Cabang atau Pimpinan Ranting melalui Portal Admin.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/direktori"
                className="px-5 py-2.5 min-h-[44px] inline-flex items-center rounded-xl bg-ipm-surface border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-gold-tint"
              >
                Kembali ke Direktori
              </Link>
              <Link
                href="/admin/pimpinan"
                className="px-5 py-2.5 min-h-[44px] inline-flex items-center gap-1.5 rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
              >
                <span>Tambah Data Pimpinan</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const rantingSeCabang = pimpinanList.filter(
    (p) =>
      p.tingkatan === "Ranting" &&
      (profil.tingkatan === "Cabang"
        ? p.pimpinanInduk === profil.nama
        : p.pimpinanInduk === profil.pimpinanInduk)
  );

  const relatedAgenda = agendaList.filter(
    (a) =>
      a.penyelenggaraSlug === profil.slug ||
      a.penyelenggara.toLowerCase().includes(profil.nama.toLowerCase())
  );

  const relatedBerita = beritaList.filter(
    (b) =>
      b.rantingTerkaitSlug === profil.slug ||
      b.penulis.toLowerCase().includes(profil.nama.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-ipm-surface">
      <PublicHeader />

      <main id="main-content" className="flex-1">
        {/* TOP PROFILE HEADER */}
        <section className="bg-ipm-surface border-b border-ipm-border pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <nav
              aria-label="Breadcrumb"
              className="text-xs font-medium text-ipm-muted flex flex-wrap items-center gap-1.5"
            >
              <Link href="/" className="hover:text-ipm-dark">
                Home
              </Link>
              <span>/</span>
              <Link href="/direktori" className="hover:text-ipm-dark">
                Direktori
              </Link>
              {profil.tingkatan === "Ranting" && profil.pimpinanInduk && (
                <>
                  <span>/</span>
                  {profil.pimpinanIndukSlug ? (
                    <Link
                      href={`/direktori/${profil.pimpinanIndukSlug}`}
                      className="hover:text-ipm-dark"
                    >
                      {profil.pimpinanInduk}
                    </Link>
                  ) : (
                    <span>{profil.pimpinanInduk}</span>
                  )}
                </>
              )}
              <span>/</span>
              <span className="text-ipm-dark font-semibold">{profil.nama}</span>
            </nav>

            {/* Main Identity Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pt-2">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-ipm-dark text-ipm-gold flex items-center justify-center font-semibold text-xl sm:text-2xl shrink-0 border-2 border-ipm-gold">
                  IPM
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-ipm-gold text-white">
                      {profil.labelTingkatan}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-ipm-surface text-ipm-muted border border-ipm-border">
                      Kode: {profil.kode} • {profil.statusVerifikasi}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-semibold text-ipm-dark tracking-tight">
                    {profil.nama}
                  </h1>
                  <p className="text-xs sm:text-sm text-ipm-muted font-medium">
                    {profil.kecamatan}, {profil.kabupatenKota} • {profil.provinsi}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
                <Link
                  href="/admin/profil-pimpinan"
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover transition-colors"
                >
                  <span>Update Profil Pimpinan</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={handleBagikan}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-surface transition-colors"
                >
                  <span>{copiedShare ? "Tautan disalin!" : "Bagikan profil"}</span>
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SUB-NAVIGATION TABS */}
        <div className="bg-white border-b border-ipm-border sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto">
            {[
              { id: "ringkasan", label: "Ringkasan", href: "#ringkasan" },
              { id: "pengurus", label: "Susunan pengurus", href: "#susunan-pengurus" },
              { id: "kegiatan", label: "Kegiatan", href: "#kegiatan-ranting" },
              { id: "kontak", label: "Kontak", href: "#kontak-ranting" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  onClick={() =>
                    setActiveTab(tab.id as "ringkasan" | "pengurus" | "kegiatan" | "kontak")
                  }
                  className={`relative px-4 py-3.5 min-h-[44px] text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                    active ? "text-ipm-dark" : "text-ipm-muted hover:text-ipm-dark"
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-1 rounded-full bg-ipm-gold"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* PROFILE BODY CONTENT */}
        <section className="bg-white py-12 lg:py-16 border-b border-ipm-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left 8 Columns */}
              <div className="lg:col-span-8 space-y-10">
                <div id="ringkasan" className="space-y-5 scroll-mt-36">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                      {profil.tingkatan === "Ranting"
                        ? "PIMPINAN RANTING"
                        : "PIMPINAN CABANG"}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark">
                    {profil.tagline || profil.nama}
                  </h2>
                  <p className="text-sm sm:text-base text-ipm-muted leading-relaxed">
                    {profil.deskripsi ||
                      "Belum ada deskripsi profil. Pengurus dapat memperbarui deskripsi melalui halaman Update Profil Pimpinan."}
                  </p>

                  {/* 3 Stat Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-5 space-y-1">
                      <p className="text-2xl font-semibold text-ipm-dark">
                        {profil.jumlahAnggota}
                      </p>
                      <p className="text-xs font-medium text-ipm-muted">Anggota</p>
                    </div>
                    <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-5 space-y-1">
                      <p className="text-2xl font-semibold text-ipm-dark">
                        {profil.pengurus.length || profil.jumlahPengurus}
                      </p>
                      <p className="text-xs font-medium text-ipm-muted">
                        Pengurus inti &amp; bidang
                      </p>
                    </div>
                    <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-5 space-y-1">
                      <p className="text-2xl font-semibold text-ipm-dark">
                        {profil.periode}
                      </p>
                      <p className="text-xs font-medium text-ipm-muted">
                        Periode kepengurusan
                      </p>
                    </div>
                  </div>
                </div>

                {/* Network Affiliation Box */}
                <div className="rounded-2xl bg-ipm-gold-tint border border-ipm-gold/60 p-6 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <GitBranch
                      className="w-5 h-5 text-ipm-gold-deep shrink-0"
                      aria-hidden="true"
                    />
                    <h3 className="text-base font-semibold text-ipm-dark">
                      Jaringan {profil.kecamatan}
                    </h3>
                  </div>
                  <p className="text-sm text-ipm-muted leading-relaxed">
                    {profil.tingkatan === "Ranting"
                      ? `Ranting ini berada di bawah koordinasi ${profil.pimpinanInduk}.`
                      : `${profil.nama} menaungi ${rantingSeCabang.length} Pimpinan Ranting terdaftar di wilayah ${profil.kecamatan}, ${profil.kabupatenKota}.`}
                  </p>
                </div>

                {/* Susunan Pengurus */}
                <div id="susunan-pengurus" className="space-y-5 scroll-mt-36">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-ipm-dark">
                      Susunan pengurus
                    </h2>
                    <span className="text-xs font-semibold text-ipm-muted">
                      Periode {profil.periode}
                    </span>
                  </div>

                  {profil.pengurus.length === 0 ? (
                    <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 text-sm text-ipm-muted">
                      Susunan pengurus belum ditambahkan. Admin Pimpinan dapat mengisi struktur pengurus melalui halaman{" "}
                      <Link href="/admin/profil-pimpinan" className="font-semibold text-ipm-dark underline">
                        Update Profil Pimpinan
                      </Link>
                      .
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {profil.pengurus.map((org, idx) => (
                        <div
                          key={`${org.nama}-${idx}`}
                          className="rounded-2xl bg-white border border-ipm-border p-5 space-y-3"
                        >
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ipm-gold-soft text-ipm-dark font-semibold text-xs border border-ipm-gold">
                            {org.inisial.toUpperCase()}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-ipm-dark">
                              {org.nama}
                            </h3>
                            <p className="text-xs text-ipm-muted mt-0.5">{org.jabatan}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right 4 Columns */}
              <aside id="kontak-ranting" className="lg:col-span-4 space-y-6 scroll-mt-36">
                <div className="rounded-2xl bg-white border border-ipm-border p-6 space-y-4">
                  <h2 className="text-base font-semibold text-ipm-dark">
                    Informasi pimpinan
                  </h2>
                  <dl className="space-y-3 text-xs">
                    <div>
                      <dt className="text-ipm-muted">Tingkatan</dt>
                      <dd className="font-semibold text-ipm-dark mt-0.5">
                        {profil.labelTingkatan}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ipm-muted">
                        {profil.tingkatan === "Ranting" ? "Cabang induk" : "Daerah induk"}
                      </dt>
                      <dd className="font-semibold text-ipm-dark mt-0.5">
                        {profil.pimpinanInduk}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ipm-muted">Wilayah</dt>
                      <dd className="font-semibold text-ipm-dark mt-0.5">
                        {profil.kabupatenKota}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ipm-muted">Periode</dt>
                      <dd className="font-semibold text-ipm-dark mt-0.5">
                        {profil.periode}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ipm-muted">Status data</dt>
                      <dd className="font-semibold text-ipm-dark mt-0.5">
                        {profil.statusVerifikasi}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ipm-muted">Pembaruan terakhir</dt>
                      <dd className="font-semibold text-ipm-dark mt-0.5">
                        {profil.tanggalDiperbarui}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 space-y-4">
                  <h2 className="text-base font-semibold text-ipm-dark">
                    Kontak sekretariat
                  </h2>
                  <p className="text-xs text-ipm-muted leading-relaxed">
                    {profil.alamatSekretariat || "Alamat sekretariat belum diisi."}
                  </p>
                  {profil.email && (
                    <p className="flex items-center gap-2 text-xs font-semibold text-ipm-gold-deep">
                      <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{profil.email}</span>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setPesanModalOpen(true);
                      setPesanSent(false);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs hover:bg-ipm-gold-hover transition-colors"
                  >
                    <span>Kirim pesan</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* CERITA DAN KEGIATAN DARI DATABASE */}
        <section id="kegiatan-ranting" className="bg-ipm-surface py-14 lg:py-16 scroll-mt-36">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-semibold text-ipm-dark">
                Berita dan agenda terkait
              </h2>
              <div className="flex items-center gap-2">
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-gold transition-colors"
                >
                  <span>Berita</span>
                </Link>
                <Link
                  href="/agenda"
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-gold transition-colors"
                >
                  <span>Semua agenda</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {relatedAgenda.length === 0 && relatedBerita.length === 0 ? (
              <div className="rounded-2xl bg-white border border-ipm-border p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-ipm-dark">
                  Belum ada berita atau agenda yang diterbitkan untuk {profil.nama}
                </p>
                <p className="text-xs text-ipm-muted">
                  Tambahkan berita di halaman Berita atau kegiatan baru di halaman Agenda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedAgenda.map((ag) => (
                  <Link
                    key={ag.id}
                    href={`/agenda?kegiatan=${ag.slug}`}
                    className="group rounded-2xl bg-white border border-ipm-border p-6 hover:border-ipm-gold transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full font-semibold bg-ipm-gold-soft text-ipm-gold-badge">
                          Agenda • {ag.tanggalHari} {ag.bulanTahun}
                        </span>
                        <span className="text-ipm-muted">{ag.status}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-ipm-dark group-hover:text-ipm-gold-deep">
                        {ag.judul}
                      </h3>
                      <p className="text-xs text-ipm-muted line-clamp-2">{ag.deskripsi}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-ipm-muted font-medium pt-2 border-t border-ipm-border">
                      <span>{ag.lokasi}</span>
                      <ArrowUpRight className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
                {relatedBerita.map((ber) => (
                  <Link
                    key={ber.id}
                    href={`/berita?baca=${ber.slug}`}
                    className="group rounded-2xl bg-white border border-ipm-border p-6 hover:border-ipm-gold transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full font-semibold bg-ipm-gold-soft text-ipm-gold-badge">
                          {ber.kategori}
                        </span>
                        <span className="text-ipm-muted">{ber.tanggal}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-ipm-dark group-hover:text-ipm-gold-deep">
                        {ber.judul}
                      </h3>
                      <p className="text-xs text-ipm-muted line-clamp-2">{ber.ringkasan}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-ipm-muted font-medium pt-2 border-t border-ipm-border">
                      <span>{ber.penulis}</span>
                      <ArrowUpRight className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* KIRIM PESAN MODAL */}
      {pesanModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-kirim-pesan-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="bg-white rounded-2xl border border-ipm-border max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="modal-kirim-pesan-title" className="text-lg font-semibold text-ipm-dark">
                Hubungi {profil.nama}
              </h2>
              <button
                type="button"
                onClick={() => setPesanModalOpen(false)}
                aria-label="Tutup dialog kirim pesan"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-ipm-border hover:bg-ipm-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pesanSent ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-ipm-gold-soft border border-ipm-gold text-xs font-semibold text-ipm-dark flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-ipm-gold-badge shrink-0" />
                  <span>
                    Pesan untuk pengurus {profil.nama} telah dikirim.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPesanModalOpen(false)}
                  className="w-full py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPesanSent(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label
                    htmlFor="pesan-pengirim"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Nama Anda
                  </label>
                  <input
                    id="pesan-pengirim"
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pesan-isi"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Pesan Kolaborasi / Pertanyaan
                  </label>
                  <textarea
                    id="pesan-isi"
                    rows={3}
                    required
                    placeholder="Tuliskan pesan singkat untuk pengurus..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPesanModalOpen(false)}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                  >
                    Kirim Pesan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}
