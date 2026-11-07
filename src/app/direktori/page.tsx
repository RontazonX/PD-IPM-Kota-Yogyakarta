"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  GitBranch,
  ArrowUpRight,
  LayoutGrid,
  List,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { useIPMData } from "@/context/IPMDataContext";

export default function DirektoriPage() {
  const { pimpinanList, anggotaList } = useIPMData();

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [provinsi, setProvinsi] = useState("DI Yogyakarta");
  const [kabupaten, setKabupaten] = useState("Kota Yogyakarta");
  const [tingkatanFilter, setTingkatanFilter] = useState<"Semua" | "Cabang" | "Ranting">("Semua");
  const [cabangIndukFilter, setCabangIndukFilter] = useState("Semua cabang");
  const [urutkan, setUrutkan] = useState<"rekomendasi" | "nama" | "anggota">("rekomendasi");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // R-27: UI state simulation support (normal | loading | error)
  const [uiState, setUiState] = useState<"normal" | "loading" | "error">("normal");

  const cabangOptions = useMemo(() => {
    return pimpinanList
      .filter((p) => p.tingkatan === "Cabang")
      .map((p) => p.nama);
  }, [pimpinanList]);

  const totalCabang = pimpinanList.filter((p) => p.tingkatan === "Cabang").length;
  const totalRanting = pimpinanList.filter((p) => p.tingkatan === "Ranting").length;
  const totalAnggota =
    pimpinanList.reduce((acc, item) => acc + item.jumlahAnggota, 0) ||
    anggotaList.length;
  const totalWilayah = new Set(
    pimpinanList.map((p) => p.kabupatenKota).filter(Boolean)
  ).size;

  const filteredList = useMemo(() => {
    const q = (appliedSearch || searchQuery).trim().toLowerCase();
    const list = pimpinanList.filter((item) => {
      if (tingkatanFilter !== "Semua" && item.tingkatan !== tingkatanFilter) {
        return false;
      }
      if (cabangIndukFilter !== "Semua cabang") {
        if (item.tingkatan === "Cabang" && item.nama !== cabangIndukFilter) {
          return false;
        }
        if (item.tingkatan === "Ranting" && item.pimpinanInduk !== cabangIndukFilter) {
          return false;
        }
      }
      if (q) {
        const matchNama = item.nama.toLowerCase().includes(q);
        const matchKec = item.kecamatan.toLowerCase().includes(q);
        const matchKode = item.kode.toLowerCase().includes(q);
        const matchInduk = item.pimpinanInduk.toLowerCase().includes(q);
        if (!matchNama && !matchKec && !matchKode && !matchInduk) return false;
      }
      return true;
    });

    if (urutkan === "nama") {
      return [...list].sort((a, b) => a.nama.localeCompare(b.nama));
    }
    if (urutkan === "anggota") {
      return [...list].sort((a, b) => b.jumlahAnggota - a.jumlahAnggota);
    }
    return list;
  }, [pimpinanList, appliedSearch, searchQuery, tingkatanFilter, cabangIndukFilter, urutkan]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredList.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleReset = () => {
    setSearchQuery("");
    setAppliedSearch("");
    setProvinsi("DI Yogyakarta");
    setKabupaten("Kota Yogyakarta");
    setTingkatanFilter("Semua");
    setCabangIndukFilter("Semua cabang");
    setUrutkan("rekomendasi");
    setCurrentPage(1);
    setUiState("normal");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ipm-surface">
      <PublicHeader />

      <main id="main-content" className="flex-1">
        {/* PAGE INTRO */}
        <section className="bg-ipm-surface border-b border-ipm-border py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <nav aria-label="Breadcrumb" className="text-xs font-medium text-ipm-muted">
              <Link href="/" className="hover:text-ipm-dark">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ipm-dark font-semibold">Direktori pimpinan</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                    DIREKTORI DAERAH • KOTA YOGYAKARTA
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-semibold text-ipm-dark tracking-tight">
                  Cabang &amp; Ranting PD IPM Kota Yogyakarta
                </h1>
                <p className="text-base sm:text-lg text-ipm-muted max-w-2xl">
                  Pusat direktori resmi 14 Pimpinan Cabang Kemantren dan seluruh Pimpinan Ranting Sekolah/Komunitas di bawah naungan PD IPM Kota Yogyakarta.
                </p>
              </div>

              <span className="inline-flex items-center self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-ipm-gold-soft text-ipm-gold-badge border border-ipm-gold">
                PD IPM Kota Yogyakarta
              </span>
            </div>
          </div>
        </section>

        {/* DIRECTORY CONTENT */}
        <section className="bg-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* 4 SUMMARY METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-ipm-dark">
                  {totalCabang}
                </span>
                <span className="text-xs sm:text-sm font-medium text-ipm-muted">
                  Pimpinan cabang
                </span>
              </div>
              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-ipm-dark">
                  {totalRanting}
                </span>
                <span className="text-xs sm:text-sm font-medium text-ipm-muted">
                  Pimpinan ranting
                </span>
              </div>
              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-ipm-dark">
                  {totalAnggota}
                </span>
                <span className="text-xs sm:text-sm font-medium text-ipm-muted">
                  Anggota terdata
                </span>
              </div>
              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-ipm-dark">
                  {totalWilayah}
                </span>
                <span className="text-xs sm:text-sm font-medium text-ipm-muted">
                  Kabupaten / kota
                </span>
              </div>
            </div>

            {/* SEARCH & FILTER CARD */}
            <form
              onSubmit={handleSearchSubmit}
              className="rounded-2xl bg-white border border-ipm-border p-5 sm:p-6 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <label htmlFor="direktori-search" className="sr-only">
                    Cari nama pimpinan, sekolah, atau wilayah
                  </label>
                  <Search
                    className="w-4 h-4 text-ipm-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="direktori-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setAppliedSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari nama pimpinan, sekolah, atau wilayah..."
                    className="w-full pl-11 pr-4 py-3 min-h-[46px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark placeholder:text-ipm-muted/75"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-xl bg-ipm-gold text-white font-bold text-sm hover:bg-ipm-gold-hover transition-colors shrink-0"
                >
                  <span>Cari pimpinan</span>
                  <Search className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
                <div className="lg:col-span-3 space-y-1">
                  <label
                    htmlFor="filter-provinsi"
                    className="block text-xs font-bold text-ipm-dark"
                  >
                    Provinsi
                  </label>
                  <select
                    id="filter-provinsi"
                    value={provinsi}
                    onChange={(e) => setProvinsi(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark"
                  >
                    <option value="DI Yogyakarta">DI Yogyakarta</option>
                  </select>
                </div>

                <div className="lg:col-span-3 space-y-1">
                  <label
                    htmlFor="filter-kabupaten"
                    className="block text-xs font-bold text-ipm-dark"
                  >
                    Kabupaten / kota
                  </label>
                  <select
                    id="filter-kabupaten"
                    value={kabupaten}
                    onChange={(e) => setKabupaten(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark"
                  >
                    <option value="Kota Yogyakarta">Kota Yogyakarta</option>
                  </select>
                </div>

                <div className="lg:col-span-2 space-y-1">
                  <label
                    htmlFor="filter-tingkatan"
                    className="block text-xs font-bold text-ipm-dark"
                  >
                    Tingkatan
                  </label>
                  <select
                    id="filter-tingkatan"
                    value={tingkatanFilter}
                    onChange={(e) => {
                      setTingkatanFilter(e.target.value as "Semua" | "Cabang" | "Ranting");
                      setCurrentPage(1);
                    }}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark"
                  >
                    <option value="Semua">Semua tingkatan</option>
                    <option value="Cabang">Pimpinan Cabang</option>
                    <option value="Ranting">Pimpinan Ranting</option>
                  </select>
                </div>

                <div className="lg:col-span-3 space-y-1">
                  <label
                    htmlFor="filter-cabang-induk"
                    className="block text-xs font-bold text-ipm-dark"
                  >
                    Cabang induk
                  </label>
                  <select
                    id="filter-cabang-induk"
                    value={cabangIndukFilter}
                    onChange={(e) => {
                      setCabangIndukFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark"
                  >
                    <option value="Semua cabang">Semua cabang</option>
                    {cabangOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-bold text-ipm-dark hover:bg-ipm-surface transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>

            {/* NETWORK CALLOUT BANNER */}
            <div className="rounded-2xl bg-ipm-gold-tint border border-ipm-gold/60 p-4 sm:p-5 flex items-start gap-3.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-ipm-gold text-white shrink-0 mt-0.5">
                <GitBranch className="w-4 h-4" aria-hidden="true" />
              </span>
              <div className="space-y-0.5 text-sm">
                <p className="font-semibold text-ipm-dark">
                  Cabang dan ranting, terhubung dalam satu jaringan.
                </p>
                <p className="text-xs sm:text-sm text-ipm-gold-badge">
                  Setiap ranting menampilkan cabang induknya. Buka profil cabang untuk melihat seluruh ranting yang dinaungi.
                </p>
              </div>
            </div>

            {/* TABS & SORT CONTROL BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div
                role="tablist"
                aria-label="Filter tab tingkatan pimpinan"
                className="flex flex-wrap items-center gap-2"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tingkatanFilter === "Semua"}
                  onClick={() => {
                    setTingkatanFilter("Semua");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-bold transition-colors ${
                    tingkatanFilter === "Semua"
                      ? "bg-ipm-gold text-white"
                      : "bg-ipm-surface text-ipm-muted hover:text-ipm-dark border border-ipm-border"
                  }`}
                >
                  Semua pimpinan ({pimpinanList.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tingkatanFilter === "Cabang"}
                  onClick={() => {
                    setTingkatanFilter("Cabang");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-bold transition-colors ${
                    tingkatanFilter === "Cabang"
                      ? "bg-ipm-gold text-white"
                      : "bg-ipm-surface text-ipm-muted hover:text-ipm-dark border border-ipm-border"
                  }`}
                >
                  Cabang ({totalCabang})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tingkatanFilter === "Ranting"}
                  onClick={() => {
                    setTingkatanFilter("Ranting");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-bold transition-colors ${
                    tingkatanFilter === "Ranting"
                      ? "bg-ipm-gold text-white"
                      : "bg-ipm-surface text-ipm-muted hover:text-ipm-dark border border-ipm-border"
                  }`}
                >
                  Ranting ({totalRanting})
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="urutkan-select" className="text-xs font-medium text-ipm-muted">
                    Urutkan:
                  </label>
                  <select
                    id="urutkan-select"
                    value={urutkan}
                    onChange={(e) =>
                      setUrutkan(e.target.value as "rekomendasi" | "nama" | "anggota")
                    }
                    className="px-3 py-2 min-h-[44px] rounded-lg bg-white border border-ipm-border text-xs font-bold text-ipm-dark"
                  >
                    <option value="rekomendasi">Rekomendasi</option>
                    <option value="nama">Nama (A-Z)</option>
                    <option value="anggota">Jumlah Anggota</option>
                  </select>
                </div>

                <div className="inline-flex rounded-lg border border-ipm-border p-0.5 bg-ipm-surface">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Tampilan kartu grid"
                    aria-pressed={viewMode === "grid"}
                    className={`p-2 min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-md ${
                      viewMode === "grid"
                        ? "bg-ipm-gold text-white font-bold"
                        : "text-ipm-muted hover:text-ipm-dark"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="Tampilan baris daftar"
                    aria-pressed={viewMode === "list"}
                    className={`p-2 min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-md ${
                      viewMode === "list"
                        ? "bg-ipm-gold text-white font-bold"
                        : "text-ipm-muted hover:text-ipm-dark"
                    }`}
                  >
                    <List className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* R-27: LOADING, ERROR, EMPTY & DATA STATES */}
            {uiState === "loading" ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl bg-ipm-surface border border-ipm-border p-10 text-center space-y-3"
              >
                <RefreshCw
                  className="w-7 h-7 text-ipm-gold-deep animate-spin mx-auto"
                  aria-hidden="true"
                />
                <p className="text-base font-semibold text-ipm-dark">
                  Memuat direktori pimpinan Cabang &amp; Ranting...
                </p>
                <p className="text-xs text-ipm-muted">
                  Menyiapkan daftar pimpinan wilayah Kota Yogyakarta beserta keterkaitan induknya.
                </p>
                <button
                  type="button"
                  onClick={() => setUiState("normal")}
                  className="px-4 py-2 min-h-[44px] rounded-lg bg-ipm-gold text-white text-xs font-bold"
                >
                  Tampilkan Data Sekarang
                </button>
              </div>
            ) : uiState === "error" ? (
              <div
                role="alert"
                className="rounded-2xl bg-[#FFF5F5] border border-[#E53E3E]/40 p-8 text-center space-y-3"
              >
                <AlertCircle className="w-7 h-7 text-[#9B2C2C] mx-auto" aria-hidden="true" />
                <p className="text-base font-semibold text-[#742A2A]">
                  Gagal memuat sinkronisasi direktori wilayah
                </p>
                <p className="text-xs text-[#742A2A]">
                  Koneksi ke layanan direktori terputus sementara. Silakan muat ulang untuk menampilkan kembali 16 data pimpinan.
                </p>
                <button
                  type="button"
                  onClick={() => setUiState("normal")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-bold"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  <span>Coba muat ulang direktori</span>
                </button>
              </div>
            ) : filteredList.length === 0 ? (
              <div
                role="status"
                className="rounded-2xl bg-ipm-surface border border-ipm-border p-10 text-center space-y-3"
              >
                <p className="text-lg font-semibold text-ipm-dark">
                  {pimpinanList.length === 0
                    ? "Belum ada data pimpinan di database"
                    : "Tidak ada pimpinan yang cocok dengan kriteria pencarian Anda"}
                </p>
                <p className="text-sm text-ipm-muted max-w-md mx-auto">
                  {pimpinanList.length === 0
                    ? "Silakan tambahkan data Pimpinan Cabang atau Pimpinan Ranting melalui Portal Admin."
                    : `Pencarian untuk "${searchQuery || cabangIndukFilter}" belum menemukan cabang atau ranting yang sesuai.`}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  {pimpinanList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-ipm-dark font-semibold text-xs hover:bg-ipm-surface"
                    >
                      <span>Reset pencarian &amp; filter</span>
                    </button>
                  )}
                  <Link
                    href="/admin/pimpinan"
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs hover:bg-ipm-gold-hover"
                  >
                    <span>Tambah Data Pimpinan di Admin</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {paginatedItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/direktori/${item.slug}`}
                      className="bg-white rounded-2xl border border-ipm-border p-6 flex flex-col justify-between gap-6 hover:border-ipm-gold hover:shadow-md transition-all group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-ipm-gold-soft text-ipm-dark font-semibold text-sm">
                            IPM
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-ipm-gold-tint text-ipm-gold-badge border border-ipm-gold/60">
                            {item.labelTingkatan}
                          </span>
                        </div>

                        <h2 className="text-lg font-semibold text-ipm-dark group-hover:text-ipm-gold-deep transition-colors">
                          {item.nama}
                        </h2>

                        <div className="space-y-1.5 text-xs text-ipm-muted">
                          <p className="flex items-center gap-1.5 font-medium text-ipm-dark">
                            <MapPin
                              className="w-3.5 h-3.5 text-ipm-gold-deep shrink-0"
                              aria-hidden="true"
                            />
                            <span>
                              {item.kecamatan}, {item.kabupatenKota}
                            </span>
                          </p>
                          <p>
                            {item.tingkatan === "Cabang"
                              ? `Menaungi ${item.jumlahRantingDinaungi || 3} ranting • Induk: ${item.pimpinanInduk}`
                              : `Afiliasi: ${item.pimpinanInduk}`}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-ipm-border flex items-center justify-between text-xs font-semibold text-ipm-muted">
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

                {/* PAGINATION */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-ipm-border">
                  <p className="text-xs font-medium text-ipm-muted">
                    Menampilkan {(safePage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(safePage * ITEMS_PER_PAGE, filteredList.length)} dari{" "}
                    {filteredList.length} pimpinan
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-4 py-2 min-h-[44px] rounded-xl border border-ipm-border bg-white text-xs font-bold text-ipm-dark hover:bg-ipm-surface disabled:opacity-50"
                    >
                      Sebelumnya
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={safePage === page ? "page" : undefined}
                        className={`w-11 h-11 rounded-xl text-xs font-bold transition-colors ${
                          safePage === page
                            ? "bg-ipm-gold text-white border border-ipm-dark/20"
                            : "bg-white text-ipm-dark border border-ipm-border hover:bg-ipm-surface"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-4 py-2 min-h-[44px] rounded-xl border border-ipm-border bg-white text-xs font-bold text-ipm-dark hover:bg-ipm-surface disabled:opacity-50"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* BOTTOM UPDATE CALLOUT */}
            <div className="pt-6 border-t border-ipm-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-ipm-dark">
                  Profil pimpinanmu belum ada atau perlu diperbarui?
                </h2>
                <p className="text-xs text-ipm-muted">
                  Pengurus dapat mengajukan pembaruan melalui pengelola wilayah.
                </p>
              </div>
              <Link
                href="/tentang#kontak-organisasi"
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-bold text-ipm-dark hover:bg-ipm-gold hover:border-ipm-gold transition-colors self-start sm:self-auto"
              >
                <span>Hubungi pengelola</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

