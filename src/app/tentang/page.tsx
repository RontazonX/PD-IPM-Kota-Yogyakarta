"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  BookOpen,
  Handshake,
  Zap,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function TentangPage() {
  const [pesanTerkirim, setPesanTerkirim] = useState(false);
  const [namaPengirim, setNamaPengirim] = useState("");
  const [emailPengirim, setEmailPengirim] = useState("");
  const [isiPesan, setIsiPesan] = useState("");

  const handleSubmitKontak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPengirim.trim() || !emailPengirim.trim() || !isiPesan.trim()) return;
    setPesanTerkirim(true);
    setNamaPengirim("");
    setEmailPengirim("");
    setIsiPesan("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main id="main-content" className="flex-1">
        {/* PAGE INTRO */}
        <section className="bg-ipm-surface border-b border-ipm-border py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <nav aria-label="Breadcrumb" className="text-xs font-medium text-ipm-muted">
              <Link href="/" className="hover:text-ipm-dark">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ipm-dark font-semibold">Tentang IPM</span>
            </nav>

            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  PIMPINAN DAERAH IPM KOTA YOGYAKARTA
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold text-ipm-dark tracking-tight">
                PD IPM Kota Yogyakarta
              </h1>
              <p className="text-base sm:text-lg text-ipm-muted max-w-2xl">
                Mengenal peran Pimpinan Daerah Ikatan Pelajar Muhammadiyah Kota Yogyakarta sebagai pilar penggerak, pembina 14 Pimpinan Cabang Kemantren dan seluruh Pimpinan Ranting Sekolah/Komunitas di Kota Pelajar.
              </p>
            </div>
          </div>
        </section>

        {/* PENGENALAN IPM - PELAJAR SEBAGAI PENGGERAK */}
        <section className="bg-white border-b border-ipm-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden border border-ipm-border bg-ipm-surface">
                  <img
                    src="/images/figma/f0dbfc3eecb733b4c747e70f6e2db79f2dd8e6af.jpg"
                    alt="Kegiatan diskusi kelompok pelajar Ikatan Pelajar Muhammadiyah"
                    width={560}
                    height={380}
                    fetchPriority="high"
                    className="w-full h-auto aspect-[56/38] object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                    PELAJAR SEBAGAI PENGGERAK
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-semibold text-ipm-dark leading-tight tracking-tight">
                  Belajar bukan hanya di kelas.
                  <br />
                  Berkarya bukan hanya sendiri.
                </h2>
                <p className="text-sm sm:text-base text-ipm-muted leading-relaxed">
                  Ikatan Pelajar Muhammadiyah adalah ruang berorganisasi bagi pelajar Muhammadiyah. Semangat keislaman dan keilmuan hadir dalam kegiatan belajar, kepemimpinan, kreativitas, serta kepedulian kepada lingkungan sekitar.
                </p>
                <p className="text-sm sm:text-base text-ipm-muted leading-relaxed">
                  Website ini dirancang untuk mempertemukan pelajar dan pengurus, mengenalkan kegiatan, serta merapikan informasi cabang dan ranting dalam satu ruang digital.
                </p>
                <div className="pt-2">
                  <Link
                    href="/direktori"
                    className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors"
                  >
                    <span>Temukan jaringan IPM</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VISI DAN MISI - Minimalist Clean Surface with #F4BE38 badges */}
        <section className="bg-ipm-surface border-b border-ipm-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                    ARAH YANG MENYATUKAN
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-semibold text-ipm-dark leading-tight tracking-tight">
                  Pelajar berilmu, berakhlak, dan berdaya untuk membawa manfaat.
                </h2>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-semibold text-ipm-dark">
                  Mewujudkan semangat itu melalui
                </h3>
                <ol className="space-y-3">
                  {[
                    {
                      no: "01",
                      teks: "Menguatkan nilai Islam dalam keseharian pelajar.",
                    },
                    {
                      no: "02",
                      teks: "Membangun tradisi literasi dan berpikir kritis.",
                    },
                    {
                      no: "03",
                      teks: "Mengembangkan kepemimpinan yang kolaboratif.",
                    },
                    {
                      no: "04",
                      teks: "Mendorong karya dan aksi sosial yang bermakna.",
                    },
                  ].map((misi) => (
                    <li
                      key={misi.no}
                      className="p-4 rounded-xl bg-white border border-ipm-border flex items-center gap-4 text-sm sm:text-base font-medium text-ipm-dark"
                    >
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-ipm-gold text-white text-xs font-semibold shrink-0">
                        {misi.no}
                      </span>
                      <span>{misi.teks}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* NILAI BERSAMA */}
        <section className="bg-white border-b border-ipm-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  YANG KITA BAWA DALAM SETIAP LANGKAH
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
                Nilai yang hidup dalam tindakan.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Heart,
                  judul: "Keislaman",
                  deskripsi:
                    "Berakhlak baik, terbuka, dan membawa rahmat bagi sesama.",
                },
                {
                  icon: BookOpen,
                  judul: "Keilmuan",
                  deskripsi:
                    "Terus bertanya, belajar, dan berbagi pengetahuan.",
                },
                {
                  icon: Handshake,
                  judul: "Kebersamaan",
                  deskripsi:
                    "Menghargai perbedaan dan menguatkan satu sama lain.",
                },
                {
                  icon: Zap,
                  judul: "Kebermanfaatan",
                  deskripsi:
                    "Menghadirkan karya dan kepedulian yang nyata.",
                },
              ].map((nilai) => {
                const Icon = nilai.icon;
                return (
                  <div
                    key={nilai.judul}
                    className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 space-y-3"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold text-white">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-ipm-dark">
                      {nilai.judul}
                    </h3>
                    <p className="text-sm text-ipm-muted leading-relaxed">
                      {nilai.deskripsi}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STRUKTUR ORGANISASI */}
        <section className="bg-ipm-surface border-b border-ipm-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  TERHUBUNG DARI PUSAT HINGGA RANTING
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
                Struktur Pembinaan Organisasi di Daerah.
              </h2>
              <p className="text-sm text-ipm-muted">
                Pimpinan Daerah menaungi dan membina seluruh Pimpinan Cabang dan Pimpinan Ranting dalam satu kesatuan sistem gerakan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  label: "NASIONAL",
                  nama: "Pimpinan Pusat",
                  peran: "Pimpinan Nasional IPM",
                  fokus: false,
                },
                {
                  label: "PROVINSI",
                  nama: "Pimpinan Wilayah",
                  peran: "Pimpinan Wilayah Provinsi",
                  fokus: false,
                },
                {
                  label: "KABUPATEN / KOTA",
                  nama: "Pimpinan Daerah",
                  peran: "Pengelola portal & pembina cabang naungan",
                  fokus: true,
                },
                {
                  label: "CABANG",
                  nama: "Pimpinan Cabang",
                  peran: "Membina ranting se-kecamatan",
                  fokus: true,
                },
                {
                  label: "SEKOLAH / KOMUNITAS",
                  nama: "Pimpinan Ranting",
                  peran: "Basis gerakan pelajar",
                  fokus: true,
                },
              ].map((t) => (
                <Link
                  key={t.nama}
                  href="/direktori"
                  className={`rounded-2xl p-5 flex flex-col justify-between gap-4 border transition-colors ${
                    t.fokus
                      ? "bg-white text-ipm-dark border-ipm-gold ring-1 ring-ipm-gold/50"
                      : "bg-white text-ipm-dark border-ipm-border hover:border-ipm-gold"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-ipm-muted">
                        {t.label}
                      </p>
                    </div>
                    <h3 className="text-base font-semibold text-ipm-dark">{t.nama}</h3>
                  </div>
                  <p className="text-xs font-medium text-ipm-muted">
                    {t.peran}
                  </p>
                </Link>
              ))}
            </div>

            <div className="rounded-xl bg-white border border-ipm-border px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <p className="text-ipm-dark font-medium">
                Alur Pembinaan: Pimpinan Daerah → Pimpinan Cabang → Pimpinan Ranting
              </p>
              <Link
                href="/direktori"
                className="inline-flex items-center gap-1.5 text-ipm-gold-deep font-semibold hover:underline min-h-[36px]"
              >
                <span>Lihat keterkaitan di direktori</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* KONTAK ORGANISASI */}
        <section
          id="kontak-organisasi"
          className="bg-white border-b border-ipm-border py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                    ADA IDE UNTUK DIBAGIKAN?
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark leading-tight tracking-tight">
                  Mari mulai percakapan yang baik.
                </h2>
                <p className="text-sm sm:text-base text-ipm-muted leading-relaxed">
                  Untuk kolaborasi, informasi kegiatan, atau pembaruan profil pimpinan, hubungi pengelola website.
                </p>

                <div className="space-y-4 pt-3">
                  <div className="flex items-start gap-3.5">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold-tint border border-ipm-gold/50 text-ipm-dark shrink-0">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs text-ipm-muted">Email pengelola</p>
                      <p className="text-sm font-semibold text-ipm-dark">
                        sekretariat@ipm.or.id
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold-tint border border-ipm-gold/50 text-ipm-dark shrink-0">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs text-ipm-muted">Lokasi sekretariat</p>
                      <p className="text-sm font-semibold text-ipm-dark">
                        Pusat Dakwah Muhammadiyah Kota Yogyakarta, Jl. Sultan Agung No. 14, Kota Yogyakarta
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold-tint border border-ipm-gold/50 text-ipm-dark shrink-0">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs text-ipm-muted">Jam layanan sekretariat</p>
                      <p className="text-sm font-semibold text-ipm-dark">
                        Senin-Jumat • 09.00-16.00 WIB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Contact Form */}
              <div className="lg:col-span-7">
                <form
                  onSubmit={handleSubmitKontak}
                  className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 sm:p-8 space-y-4"
                >
                  <h3 className="text-lg font-semibold text-ipm-dark">
                    Kirim Pesan atau Usulan Kolaborasi
                  </h3>

                  {pesanTerkirim && (
                    <div
                      role="status"
                      className="p-4 rounded-xl bg-ipm-gold-soft border border-ipm-gold text-ipm-dark text-sm font-medium flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-ipm-gold-badge shrink-0" />
                      <span>
                        Pesan Anda berhasil dikirim! Tim pengelola wilayah akan segera menindaklanjuti.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="kontak-nama"
                        className="block text-xs font-semibold text-ipm-dark"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        id="kontak-nama"
                        type="text"
                        required
                        value={namaPengirim}
                        onChange={(e) => setNamaPengirim(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark placeholder:text-ipm-muted/70"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="kontak-email"
                        className="block text-xs font-semibold text-ipm-dark"
                      >
                        Alamat Email
                      </label>
                      <input
                        id="kontak-email"
                        type="email"
                        required
                        value={emailPengirim}
                        onChange={(e) => setEmailPengirim(e.target.value)}
                        placeholder="email@ipm.or.id"
                        className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark placeholder:text-ipm-muted/70"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="kontak-pesan"
                      className="block text-xs font-semibold text-ipm-dark"
                    >
                      Pesan atau Keperluan
                    </label>
                    <textarea
                      id="kontak-pesan"
                      rows={3}
                      required
                      value={isiPesan}
                      onChange={(e) => setIsiPesan(e.target.value)}
                      placeholder="Tuliskan ide kegiatan, permohonan pembaruan data pimpinan, atau pertanyaan..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark placeholder:text-ipm-muted/70"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors"
                  >
                    <span>Kirim pesan ke pengelola</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
