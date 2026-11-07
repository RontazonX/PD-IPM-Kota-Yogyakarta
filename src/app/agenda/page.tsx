"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  List,
  LayoutGrid,
  CalendarDays,
  MapPin,
  Users,
  ArrowUpRight,
  X,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { useIPMData } from "@/context/IPMDataContext";
import { AgendaItem } from "@/data/ipm-data";

export default function AgendaPage() {
  const { agendaList, addAgenda, deleteAgenda, isLoadingDB } = useIPMData();

  const [searchQuery, setSearchQuery] = useState("");
  const [bulanFilter, setBulanFilter] = useState("Semua bulan");
  const [statusFilter, setStatusFilter] = useState("Semua status");
  const [tampilan, setTampilan] = useState<"daftar" | "kartu">("daftar");
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaItem | null>(null);
  const [daftarSukses, setDaftarSukses] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newJudul, setNewJudul] = useState("");
  const [newTanggalHari, setNewTanggalHari] = useState("15");
  const [newBulanTahun, setNewBulanTahun] = useState("November 2026");
  const [newJam, setNewJam] = useState("08.00 - 12.00 WIB");
  const [newLokasi, setNewLokasi] = useState("");
  const [newPenyelenggara, setNewPenyelenggara] = useState("");
  const [newDeskripsi, setNewDeskripsi] = useState("");

  const bulanOptions = useMemo(() => {
    return Array.from(new Set(agendaList.map((a) => a.bulanFilter).filter(Boolean)));
  }, [agendaList]);

  const featuredAgenda = agendaList.find((a) => a.unggulan) || agendaList[0] || null;

  const filteredAgenda = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return agendaList.filter((item) => {
      if (bulanFilter !== "Semua bulan" && item.bulanFilter !== bulanFilter) {
        return false;
      }
      if (statusFilter !== "Semua status" && item.status !== statusFilter) {
        return false;
      }
      if (q) {
        const mJudul = item.judul.toLowerCase().includes(q);
        const mLokasi = item.lokasi.toLowerCase().includes(q);
        const mPenyelenggara = item.penyelenggara.toLowerCase().includes(q);
        if (!mJudul && !mLokasi && !mPenyelenggara) return false;
      }
      return true;
    });
  }, [agendaList, bulanFilter, statusFilter, searchQuery]);

  const handleCreateAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim() || !newLokasi.trim() || !newPenyelenggara.trim()) return;
    await addAgenda(
      newJudul.trim(),
      newTanggalHari.trim() || "15",
      newBulanTahun.trim() || "November 2026",
      newLokasi.trim(),
      newPenyelenggara.trim(),
      newDeskripsi.trim(),
      newJam.trim()
    );
    setNewJudul("");
    setNewLokasi("");
    setNewPenyelenggara("");
    setNewDeskripsi("");
    setAddModalOpen(false);
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
              <span className="text-ipm-dark font-semibold">Agenda &amp; kegiatan</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                    AGENDA KEGIATAN • PD IPM KOTA YOGYAKARTA
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-semibold text-ipm-dark tracking-tight">
                  Isi harimu dengan langkah bermakna.
                </h1>
                <p className="text-base sm:text-lg text-ipm-muted max-w-2xl">
                  Temukan kegiatan pelajar di tingkat Daerah, Cabang Kemantren, dan Ranting Sekolah se-Kota Yogyakarta. Catat waktunya dan ambil bagian.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover transition-colors"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Tambah Agenda</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTampilan((prev) => (prev === "daftar" ? "kartu" : "daftar"))
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors"
                >
                  <span>
                    {tampilan === "daftar" ? "Tampilan daftar" : "Tampilan kartu"}
                  </span>
                  {tampilan === "daftar" ? (
                    <List className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AGENDA BODY */}
        <section className="bg-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* FILTER BAR */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end"
            >
              <div className="lg:col-span-6 space-y-1">
                <label
                  htmlFor="agenda-search"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Pencarian kegiatan
                </label>
                <div className="relative">
                  <Search
                    className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="agenda-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama kegiatan, lokasi, atau penyelenggara..."
                    className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark placeholder:text-ipm-muted/75"
                  />
                </div>
              </div>

              <div className="lg:col-span-3 space-y-1">
                <label
                  htmlFor="agenda-bulan"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Bulan
                </label>
                <select
                  id="agenda-bulan"
                  value={bulanFilter}
                  onChange={(e) => setBulanFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark"
                >
                  <option value="Semua bulan">Semua bulan</option>
                  {bulanOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3 space-y-1">
                <label
                  htmlFor="agenda-status"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Status
                </label>
                <select
                  id="agenda-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark"
                >
                  <option value="Semua status">Semua status</option>
                  <option value="Pendaftaran dibuka">Pendaftaran dibuka</option>
                  <option value="Segera hadir">Segera hadir</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </form>

            {/* FEATURED AGENDA BANNER */}
            {featuredAgenda && (
              <div className="rounded-2xl overflow-hidden bg-white text-ipm-dark border border-ipm-border p-6 sm:p-10 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ipm-gold-tint border border-ipm-gold/50">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-badge">
                      AGENDA TERDEKAT
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-ipm-gold-soft text-ipm-gold-badge">
                    {featuredAgenda.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark leading-tight tracking-tight">
                    {featuredAgenda.judul}
                  </h2>
                  <p className="text-sm sm:text-base text-ipm-muted leading-relaxed">
                    {featuredAgenda.deskripsi}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium text-ipm-dark">
                  <p className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 text-ipm-gold-deep shrink-0" aria-hidden="true" />
                    <span>{featuredAgenda.waktuLengkap} • {featuredAgenda.jam}</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-ipm-gold-deep shrink-0" aria-hidden="true" />
                    <span>{featuredAgenda.lokasi}</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-ipm-gold-deep shrink-0" aria-hidden="true" />
                    <span>{featuredAgenda.penyelenggara}</span>
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgenda(featuredAgenda);
                      setDaftarSukses(false);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs sm:text-sm hover:bg-ipm-gold-hover transition-colors"
                  >
                    <span>Lihat &amp; daftar</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* AGENDA LIST */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-2xl font-semibold text-ipm-dark tracking-tight">
                  Daftar agenda ({filteredAgenda.length})
                </h2>
              </div>

              {isLoadingDB ? (
                <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-10 text-center">
                  <p className="text-sm font-medium text-ipm-muted">
                    Memuat jadwal kegiatan dari database Supabase...
                  </p>
                </div>
              ) : filteredAgenda.length === 0 ? (
                <div
                  role="status"
                  className="rounded-2xl bg-ipm-surface border border-ipm-border p-10 text-center space-y-3"
                >
                  <p className="text-lg font-semibold text-ipm-dark">
                    {agendaList.length === 0
                      ? "Belum ada agenda kegiatan di database"
                      : "Tidak ada agenda kegiatan yang cocok dengan filter"}
                  </p>
                  <p className="text-xs text-ipm-muted max-w-md mx-auto">
                    {agendaList.length === 0
                      ? "Klik tombol Tambah Agenda untuk menjadwalkan kegiatan baru di database Supabase."
                      : "Coba ubah pilihan bulan atau kata kunci pencarian untuk melihat kegiatan lainnya."}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    {agendaList.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setBulanFilter("Semua bulan");
                          setStatusFilter("Semua status");
                        }}
                        className="px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-ipm-dark text-xs font-semibold"
                      >
                        Reset filter agenda
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      <span>Tambah Agenda Baru</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    tampilan === "daftar"
                      ? "space-y-4"
                      : "grid grid-cols-1 md:grid-cols-2 gap-4"
                  }
                >
                  {filteredAgenda.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-white border border-ipm-border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 hover:border-ipm-gold transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-ipm-gold-tint border border-ipm-gold/60 flex flex-col items-center justify-center shrink-0">
                            <span className="text-xl font-semibold text-ipm-dark leading-none">
                              {item.tanggalHari}
                            </span>
                            <span className="text-[10px] font-semibold text-ipm-gold-badge uppercase mt-1">
                              {item.bulanTahun.slice(0, 8)}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="text-base sm:text-lg font-semibold text-ipm-dark">
                                {item.judul}
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-ipm-gold-soft text-ipm-gold-badge">
                                {item.status}
                              </span>
                            </div>
                            <p className="text-xs text-ipm-muted">
                              {item.waktuLengkap} • {item.jam}
                            </p>
                            <p className="text-xs font-medium text-ipm-dark">
                              {item.lokasi} • {item.penyelenggara}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => deleteAgenda(item.id)}
                            aria-label={`Hapus agenda ${item.judul}`}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-ipm-border text-ipm-muted hover:text-[#9B2C2C] hover:bg-[#FFF5F5]"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAgenda(item);
                              setDaftarSukses(false);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors"
                          >
                            <span>Lihat &amp; daftar</span>
                            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* TAMBAH AGENDA MODAL */}
      {addModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-agenda-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-2xl border border-ipm-border max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="add-agenda-title" className="text-lg font-semibold text-ipm-dark">
                Tambah Agenda Kegiatan ke Database
              </h2>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                aria-label="Tutup tambah agenda"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-ipm-border hover:bg-ipm-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAgenda} className="space-y-3">
              <div>
                <label
                  htmlFor="ag-judul"
                  className="block text-xs font-semibold text-ipm-dark mb-1"
                >
                  Nama Kegiatan
                </label>
                <input
                  id="ag-judul"
                  type="text"
                  required
                  value={newJudul}
                  onChange={(e) => setNewJudul(e.target.value)}
                  placeholder="Contoh: Taruna Melati 1"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="ag-tgl"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Tanggal (Angka)
                  </label>
                  <input
                    id="ag-tgl"
                    type="text"
                    required
                    value={newTanggalHari}
                    onChange={(e) => setNewTanggalHari(e.target.value)}
                    placeholder="15"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ag-bln"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Bulan &amp; Tahun
                  </label>
                  <input
                    id="ag-bln"
                    type="text"
                    required
                    value={newBulanTahun}
                    onChange={(e) => setNewBulanTahun(e.target.value)}
                    placeholder="November 2026"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ag-jam"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Jam Pelaksanaan
                  </label>
                  <input
                    id="ag-jam"
                    type="text"
                    value={newJam}
                    onChange={(e) => setNewJam(e.target.value)}
                    placeholder="08.00 - 12.00 WIB"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="ag-lokasi"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Lokasi
                  </label>
                  <input
                    id="ag-lokasi"
                    type="text"
                    required
                    value={newLokasi}
                    onChange={(e) => setNewLokasi(e.target.value)}
                    placeholder="Aula Sekolah / Sekretariat"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ag-penyelenggara"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Penyelenggara (Cabang / Ranting)
                  </label>
                  <input
                    id="ag-penyelenggara"
                    type="text"
                    required
                    value={newPenyelenggara}
                    onChange={(e) => setNewPenyelenggara(e.target.value)}
                    placeholder="Nama PC / PR IPM"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="ag-desk"
                  className="block text-xs font-semibold text-ipm-dark mb-1"
                >
                  Deskripsi Kegiatan
                </label>
                <textarea
                  id="ag-desk"
                  rows={3}
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  placeholder="Penjelasan singkat kegiatan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ipm-border text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                >
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AGENDA REGISTRATION / DETAIL MODAL */}
      {selectedAgenda && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="agenda-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-2xl border border-ipm-border max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-ipm-gold-soft text-ipm-gold-badge">
                  {selectedAgenda.status}
                </span>
                <h2
                  id="agenda-modal-title"
                  className="text-lg sm:text-xl font-semibold text-ipm-dark mt-1"
                >
                  {selectedAgenda.judul}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgenda(null)}
                aria-label="Tutup detail agenda"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-ipm-border hover:bg-ipm-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-ipm-muted leading-relaxed">
              {selectedAgenda.deskripsi}
            </p>

            <div className="rounded-xl bg-ipm-surface border border-ipm-border p-4 space-y-1.5 text-xs">
              <p>
                <strong className="text-ipm-dark">Waktu:</strong>{" "}
                {selectedAgenda.waktuLengkap} ({selectedAgenda.jam})
              </p>
              <p>
                <strong className="text-ipm-dark">Lokasi:</strong>{" "}
                {selectedAgenda.lokasi}
              </p>
              <p>
                <strong className="text-ipm-dark">Penyelenggara:</strong>{" "}
                {selectedAgenda.penyelenggara}
              </p>
            </div>

            {selectedAgenda.status === "Pendaftaran dibuka" ? (
              daftarSukses ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-ipm-gold-soft border border-ipm-gold text-xs font-medium text-ipm-dark flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-ipm-gold-badge shrink-0" />
                    <span>
                      Pendaftaran kegiatan berhasil tercatat!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAgenda(null)}
                    className="w-full py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDaftarSukses(true);
                  }}
                  className="space-y-3 pt-1"
                >
                  <div>
                    <label
                      htmlFor="daftar-nama"
                      className="block text-xs font-semibold text-ipm-dark mb-1"
                    >
                      Nama Lengkap Peserta
                    </label>
                    <input
                      id="daftar-nama"
                      type="text"
                      required
                      placeholder="Nama Anda"
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="daftar-ranting"
                      className="block text-xs font-semibold text-ipm-dark mb-1"
                    >
                      Asal Sekolah / Ranting / Cabang
                    </label>
                    <input
                      id="daftar-ranting"
                      type="text"
                      required
                      placeholder="Asal Ranting / Cabang IPM"
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAgenda(null)}
                      className="px-4 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                    >
                      Daftar Kegiatan
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAgenda(null)}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}
