"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  HeartHandshake,
  Lightbulb,
  Network,
  MapPin,
  Users,
  Sprout,
  PenTool,
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { useIPMData } from "@/context/IPMDataContext";

export default function HomePage() {
  const { pimpinanList, beritaList, agendaList } = useIPMData();
  const [downloadedDoc, setDownloadedDoc] = useState<string | null>(null);

  const featuredPimpinan = pimpinanList.slice(0, 3);
  const homeBerita = beritaList.slice(0, 3);
  const homeAgenda = agendaList.slice(0, 3);

  const handleDownloadDocument = (title: string, filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedDoc(title);
    setTimeout(() => setDownloadedDoc(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main id="main-content" className="flex-1">
        {/* HERO SECTION - Clean minimalist layout without decorative pills or lines */}
        <section className="bg-white border-b border-ipm-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              {/* Left Hero Message */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2">
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-semibold tracking-tight leading-[1.12] text-ipm-dark">
                  Pimpinan Daerah
                  <br />
                  Ikatan Pelajar
                  <br />
                  Muhammadiyah
                  <br />
                  <span className="text-ipm-gold-deep">Kota Yogyakarta.</span>
                </h1>

                <p className="text-base sm:text-lg text-ipm-muted leading-relaxed max-w-xl font-normal">
                  Pusat informasi gerakan pelajar berkemajuan, direktori 14 Pimpinan Cabang Kemantren dan seluruh Pimpinan Ranting Sekolah/Komunitas di wilayah Kota Yogyakarta.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    href="/direktori"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors"
                  >
                    <span>Direktori Cabang &amp; Ranting</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-white text-ipm-dark font-medium text-sm border border-ipm-border hover:bg-ipm-surface transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                    <span>Masuk / Daftar Akun</span>
                  </Link>
                </div>
              </div>

              {/* Right Hero Photo & Minimalist Caption Card */}
              <div className="lg:col-span-6 relative">
                <div className="rounded-2xl overflow-hidden border border-ipm-border bg-ipm-surface">
                  <img
                    src="/images/figma/18ba58c8a3fed5543b0447979b0b9d0a1e1030c4.jpg"
                    alt="Pelajar Ikatan Pelajar Muhammadiyah berdiskusi bersama di taman"
                    width={620}
                    height={500}
                    fetchPriority="high"
                    className="w-full h-auto aspect-[62/50] object-cover"
                  />
                </div>

                <Link
                  href="/direktori"
                  className="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:left-6 sm:right-12 bg-white text-ipm-dark rounded-xl p-4 sm:p-5 border border-ipm-border shadow-md flex items-center justify-between gap-4 group hover:border-ipm-gold transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ipm-gold text-white shrink-0">
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ipm-dark">
                        Mulai dari langkah kecil.
                      </p>
                      <p className="text-xs text-ipm-muted mt-0.5">
                        Belajar bersama, berdampak bersama.
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="w-5 h-5 text-ipm-gold-deep shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4-PILLAR DIRECTION STRIP */}
        <section
          aria-label="Nilai arah gerakan IPM"
          className="bg-ipm-surface border-b border-ipm-border"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-ipm-gold text-white shrink-0">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-ipm-dark">
                  Ilmu yang mencerahkan
                </span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-ipm-gold text-white shrink-0">
                  <HeartHandshake className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-ipm-dark">
                  Akhlak yang menguatkan
                </span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-ipm-gold text-white shrink-0">
                  <Lightbulb className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-ipm-dark">
                  Karya yang berdampak
                </span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-ipm-gold text-white shrink-0">
                  <Network className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-ipm-dark">
                  Ikatan yang menghubungkan
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MENGENAL PD IPM KOTA YOGYAKARTA */}
        <section className="bg-white border-b border-ipm-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  MENGENAL PD IPM KOTA YOGYAKARTA
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold text-ipm-dark leading-tight tracking-tight">
                  Pilar pembina gerakan pelajar di Kota Pelajar.
                </h2>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <p className="text-base text-ipm-muted leading-relaxed">
                  Pimpinan Daerah Ikatan Pelajar Muhammadiyah (PD IPM) Kota Yogyakarta mengoordinasikan gerakan pelajar di 14 Pimpinan Cabang Kemantren dan puluhan Pimpinan Ranting berbasis sekolah Muhammadiyah serta ranting komunitas se-Kota Yogyakarta. Melalui portal ini, PD IPM mengelola basis data keorganisasian terpadu, memfasilitasi kaderisasi, dan memperluas karya kolaboratif pelajar.
                </p>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-ipm-gold-deep hover:text-ipm-dark min-h-[44px] group"
                >
                  <span>Profil lengkap PD IPM Kota Yogyakarta</span>
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CABANG & RANTING NAUNGAN PD IPM KOTA YOGYAKARTA */}
        <section className="bg-ipm-surface border-b border-ipm-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  14 CABANG KEMANTREN &amp; RANTING SEKOLAH SE-KOTA YOGYAKARTA
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
                  Direktori Cabang &amp; Ranting PD IPM Kota Yogyakarta.
                </h2>
              </div>
              <Link
                href="/direktori"
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm font-medium text-ipm-dark hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors self-start sm:self-auto"
              >
                <span>Buka direktori lengkap</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <p className="text-sm text-ipm-muted">
              Jelajahi 14 Pimpinan Cabang Kemantren dan seluruh Pimpinan Ranting Sekolah Muhammadiyah di bawah naungan PD IPM Kota Yogyakarta.
            </p>

            {featuredPimpinan.length === 0 ? (
              <div className="rounded-2xl bg-white border border-ipm-border p-8 text-center space-y-3">
                <p className="text-base font-semibold text-ipm-dark">
                  Belum ada data Pimpinan Cabang atau Ranting di database
                </p>
                <p className="text-xs text-ipm-muted max-w-md mx-auto">
                  Silakan tambahkan data Pimpinan Cabang atau Pimpinan Ranting melalui Portal Admin agar tampil di direktori publik.
                </p>
                <div className="pt-1">
                  <Link
                    href="/admin/pimpinan"
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                  >
                    <span>Tambah Data Pimpinan</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPimpinan.map((item) => (
                  <Link
                    key={item.id}
                    href={`/direktori/${item.slug}`}
                    className="bg-white rounded-2xl border border-ipm-border p-6 flex flex-col justify-between gap-6 hover:border-ipm-gold transition-colors group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-ipm-gold text-white font-semibold text-xs">
                          IPM
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-ipm-surface text-ipm-muted border border-ipm-border">
                          {item.labelTingkatan}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-ipm-dark group-hover:text-ipm-gold-deep transition-colors">
                        {item.nama}
                      </h3>

                      <div className="space-y-1.5 text-xs text-ipm-muted">
                        <p className="flex items-center gap-1.5 font-medium text-ipm-dark">
                          <MapPin
                            className="w-3.5 h-3.5 text-ipm-gold-deep shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            {item.tingkatan === "Cabang"
                              ? `${item.kabupatenKota}, ${item.provinsi}`
                              : `${item.kecamatan}, ${item.kabupatenKota}`}
                          </span>
                        </p>
                        <p>
                          {item.tingkatan === "Cabang"
                            ? `Wilayah ${item.kecamatan}`
                            : `Terhubung ke ${item.pimpinanInduk}`}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-ipm-border flex items-center justify-between text-xs font-medium text-ipm-muted">
                      <span>
                        {item.jumlahAnggota} anggota • {item.periode}
                      </span>
                      <ArrowUpRight
                        className="w-4 h-4 text-ipm-gold-deep group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* BANYAK POTENSI. SATU SEMANGAT. - PROGRAM GERAKAN */}
        <section
          id="program-gerakan"
          className="bg-white border-b border-ipm-border py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                DARI IDE MENJADI AKSI
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
                Banyak potensi. Satu semangat.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold text-white">
                    <BookOpen className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-ipm-dark">
                    Literasi &amp; keilmuan
                  </h3>
                  <p className="text-sm text-ipm-muted leading-relaxed">
                    Membaca, berdiskusi, dan merawat rasa ingin tahu melalui ruang literasi pelajar.
                  </p>
                </div>
                <Link
                  href="/berita?kategori=Literasi"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ipm-gold-deep hover:text-ipm-dark min-h-[44px]"
                >
                  <span>Kenali program</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold text-white">
                    <Users className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-ipm-dark">
                    Kaderisasi &amp; kepemimpinan
                  </h3>
                  <p className="text-sm text-ipm-muted leading-relaxed">
                    Belajar memimpin diri, menguatkan tim, dan menyiapkan langkah organisasi.
                  </p>
                </div>
                <Link
                  href="/berita?kategori=Kaderisasi"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ipm-gold-deep hover:text-ipm-dark min-h-[44px]"
                >
                  <span>Kenali program</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold text-white">
                    <Sprout className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-ipm-dark">
                    Aksi sosial &amp; lingkungan
                  </h3>
                  <p className="text-sm text-ipm-muted leading-relaxed">
                    Mengubah kepedulian menjadi aksi yang terasa dekat dengan keseharian.
                  </p>
                </div>
                <Link
                  href="/berita?kategori=Aksi+pelajar"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ipm-gold-deep hover:text-ipm-dark min-h-[44px]"
                >
                  <span>Kenali program</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-6 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold text-white">
                    <PenTool className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-ipm-dark">
                    Kreativitas &amp; karya
                  </h3>
                  <p className="text-sm text-ipm-muted leading-relaxed">
                    Merayakan gagasan pelajar melalui media, seni, dan karya yang bermakna.
                  </p>
                </div>
                <Link
                  href="/berita?kategori=Inspirasi"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ipm-gold-deep hover:text-ipm-dark min-h-[44px]"
                >
                  <span>Kenali program</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* KABAR BAIK YANG TERUS BERGERAK - CERITA DARI PELAJAR */}
        <section className="bg-white border-b border-ipm-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  CERITA DARI PELAJAR
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
                  Kabar baik yang terus bergerak.
                </h2>
              </div>
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm font-medium text-ipm-dark hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors self-start sm:self-auto"
              >
                <span>Semua berita</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {homeBerita.length === 0 ? (
              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-8 text-center space-y-3">
                <p className="text-base font-semibold text-ipm-dark">
                  Belum ada berita yang diterbitkan di database
                </p>
                <p className="text-xs text-ipm-muted max-w-md mx-auto">
                  Silakan terbitkan kabar dan artikel kegiatan pelajar melalui halaman Berita.
                </p>
                <div className="pt-1">
                  <Link
                    href="/berita"
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                  >
                    <span>Tulis Berita Pertama</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {homeBerita.map((art) => (
                  <Link
                    key={art.slug}
                    href={`/berita?baca=${art.slug}`}
                    className="group flex flex-col justify-between rounded-2xl bg-white border border-ipm-border overflow-hidden hover:border-ipm-gold transition-colors"
                  >
                    <div>
                      <div className="overflow-hidden bg-ipm-surface">
                        <img
                          src={art.gambar}
                          alt={art.judul}
                          width={408}
                          height={232}
                          loading="lazy"
                          className="w-full h-auto aspect-[408/232] object-cover group-hover:scale-[1.02] transition-transform"
                        />
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2.5 text-xs">
                          <span className="px-2.5 py-0.5 rounded-full font-medium bg-ipm-gold-soft text-ipm-gold-badge">
                            {art.kategori}
                          </span>
                          <span className="text-ipm-muted">{art.tanggal}</span>
                        </div>
                        <h3 className="text-base font-semibold text-ipm-dark group-hover:text-ipm-gold-deep leading-snug">
                          {art.judul}
                        </h3>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-ipm-muted">
                      <span>{art.penulis}</span>
                      <ArrowUpRight
                        className="w-4 h-4 text-ipm-gold-deep"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CATAT TANGGALNYA - AGENDA TERDEKAT */}
        <section className="bg-ipm-surface border-b border-ipm-border py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  CATAT TANGGALNYA
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark leading-tight tracking-tight">
                  Ada ruang untuk
                  <br />
                  kamu ikut bergerak.
                </h2>
                <p className="text-sm sm:text-base text-ipm-muted leading-relaxed">
                  Temukan agenda belajar, bertemu, dan berkarya bersama pelajar lainnya.
                </p>
                <div className="pt-2">
                  <Link
                    href="/agenda"
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm font-medium text-ipm-dark hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors"
                  >
                    <span>Lihat semua agenda</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3.5">
                {homeAgenda.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-ipm-border p-8 text-center space-y-3">
                    <p className="text-base font-semibold text-ipm-dark">
                      Belum ada agenda terjadwal di database
                    </p>
                    <p className="text-xs text-ipm-muted">
                      Tambahkan jadwal kegiatan baru di halaman Agenda agar muncul di sini.
                    </p>
                    <Link
                      href="/agenda"
                      className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                    >
                      <span>Tambah Agenda</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  homeAgenda.map((ag) => (
                    <Link
                      key={ag.id}
                      href={`/agenda?kegiatan=${ag.slug}`}
                      className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-ipm-border hover:border-ipm-gold transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-ipm-gold-tint border border-ipm-gold/50 flex flex-col items-center justify-center shrink-0">
                          <span className="text-lg font-semibold text-ipm-dark leading-none">
                            {ag.tanggalHari}
                          </span>
                          <span className="text-[10px] font-semibold text-ipm-gold-badge uppercase mt-1">
                            {ag.bulanTahun.split(" ")[0]}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm sm:text-base font-semibold text-ipm-dark group-hover:text-ipm-gold-deep">
                            {ag.judul}
                          </h3>
                          <p className="text-xs text-ipm-muted">
                            {ag.jam} • {ag.lokasi}
                          </p>
                          <span
                            className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${ag.status === "Pendaftaran dibuka"
                              ? "bg-ipm-gold-soft text-ipm-gold-badge"
                              : "bg-ipm-surface text-ipm-muted border border-ipm-border"
                              }`}
                          >
                            {ag.status}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight
                        className="w-4 h-4 text-ipm-gold-deep shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* BEKAL UNTUK BERGERAK - RUANG REFERENSI */}
        <section
          id="ruang-referensi"
          className="bg-white border-b border-ipm-border py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                  BEKAL UNTUK BERGERAK
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
                  Ide baik perlu bekal yang baik.
                </h2>
                <p className="text-sm text-ipm-muted leading-relaxed">
                  Temukan panduan organisasi, bahan diskusi, dan inspirasi program untuk cabang dan rantingmu.
                </p>
                {downloadedDoc && (
                  <p
                    role="status"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-ipm-gold-badge bg-ipm-gold-soft px-3 py-1.5 rounded-lg border border-ipm-gold"
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>Mengunduh berkas: {downloadedDoc}</span>
                  </p>
                )}
              </div>

              <div className="lg:col-span-6 space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    handleDownloadDocument(
                      "Panduan pengelolaan data pimpinan",
                      "Panduan-Pengelolaan-Data-Pimpinan-IPM.txt",
                      "PANDUAN PENGELOLAAN DATA PIMPINAN IPM\n\n1. Setiap Pimpinan Ranting terhubung ke Pimpinan Cabang induk.\n2. Admin Ranting dan Admin Cabang dapat memperbarui profil pimpinan secara mandiri.\n3. Gunakan format CSV/JSON standar saat melakukan impor data."
                    )
                  }
                  className="w-full flex items-center justify-between gap-4 p-4 rounded-xl bg-ipm-surface border border-ipm-border hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ipm-gold text-white shrink-0">
                      <FileText className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ipm-dark">
                        Panduan pengelolaan data pimpinan
                      </p>
                      <p className="text-xs text-ipm-muted">Panduan Administrasi • Berkas Unduhan</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-ipm-gold-deep shrink-0" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadDocument(
                      "Lembar rencana kegiatan pelajar",
                      "Lembar-Rencana-Kegiatan-Pelajar-IPM.txt",
                      "LEMBAR RENCANA KEGIATAN PELAJAR IPM\n\n- Nama Kegiatan:\n- Penyelenggara (Cabang/Ranting):\n- Tujuan Kegiatan:\n- Waktu & Tempat:\n- Estimasi Peserta:"
                    )
                  }
                  className="w-full flex items-center justify-between gap-4 p-4 rounded-xl bg-ipm-surface border border-ipm-border hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ipm-gold text-white shrink-0">
                      <FileText className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ipm-dark">
                        Lembar rencana kegiatan pelajar
                      </p>
                      <p className="text-xs text-ipm-muted">Templat Program • Berkas Unduhan</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-ipm-gold-deep shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM COLLABORATION CTA BANNER */}
        <section className="bg-white py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-8 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
                  Langkah baikmu bisa dimulai di sini.
                </h2>
                <p className="text-sm sm:text-base text-ipm-muted">
                  Temukan pimpinan terdekat, kelola profil ranting/cabang, atau aktifkan akun anggotamu.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/anggota"
                  className="inline-flex items-center gap-2 px-5 py-3.5 min-h-[48px] rounded-xl bg-white border border-ipm-border text-ipm-dark font-semibold text-sm hover:bg-ipm-gold-tint transition-colors"
                >
                  <span>Daftar Akun Anggota</span>
                </Link>
                <Link
                  href="/direktori"
                  className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors"
                >
                  <span>Temukan pimpinan</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
