"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Building2,
  GitBranch,
  Users,
  Clock,
  CheckCircle2,
  SquarePen,
  Search,
  ArrowUpRight,
  ChevronRight,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { useIPMData } from "@/context/IPMDataContext";
import { TingkatanPimpinan } from "@/data/ipm-data";

export default function AdminDashboardPage() {
  const {
    pimpinanList,
    anggotaList,
    aktivitasList,
    adminUser,
    addPimpinan,
  } = useIPMData();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchTable, setSearchTable] = useState("");
  const [tingkatanTab, setTingkatanTab] = useState<"Semua" | "Cabang" | "Ranting">("Semua");

  // Modal Form State
  const [namaBaru, setNamaBaru] = useState("");
  const [kodeBaru, setKodeBaru] = useState("");
  const [tingkatanBaru, setTingkatanBaru] = useState<TingkatanPimpinan>("Ranting");
  const [kecamatanBaru, setKecamatanBaru] = useState("");
  const [indukBaru, setIndukBaru] = useState("");
  const [anggotaBaru, setAnggotaBaru] = useState(0);
  const [suksesTambah, setSuksesTambah] = useState(false);

  // Summary Counts
  const totalCabang = pimpinanList.filter((p) => p.tingkatan === "Cabang").length;
  const totalRanting = pimpinanList.filter((p) => p.tingkatan === "Ranting").length;
  const totalAnggota =
    pimpinanList.reduce((acc, p) => acc + p.jumlahAnggota, 0) || anggotaList.length;
  const menungguCount = pimpinanList.filter((p) => p.statusVerifikasi === "Menunggu").length;

  // Filtered Table Data for Dashboard
  const filteredPimpinan = useMemo(() => {
    let list = pimpinanList;
    if (tingkatanTab !== "Semua") {
      list = list.filter((p) => p.tingkatan === tingkatanTab);
    }
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      list = list.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.kecamatan.toLowerCase().includes(q) ||
          p.kode.toLowerCase().includes(q)
      );
    }
    return list;
  }, [pimpinanList, tingkatanTab, searchTable]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBaru.trim()) return;
    await addPimpinan({
      kode:
        kodeBaru.trim() ||
        `${tingkatanBaru === "Cabang" ? "PC" : "PR"}-${Date.now().toString().slice(-4)}`,
      nama: namaBaru.trim(),
      tingkatan: tingkatanBaru,
      labelTingkatan:
        tingkatanBaru === "Cabang" ? "Pimpinan Cabang" : "Pimpinan Ranting",
      kecamatan: kecamatanBaru.trim() || "Wilayah",
      kabupatenKota: "Kota Yogyakarta",
      provinsi: "DI Yogyakarta",
      pimpinanInduk:
        tingkatanBaru === "Cabang"
          ? "PD IPM Kota Yogyakarta"
          : indukBaru.trim() || "PC IPM",
      jumlahAnggota: Number(anggotaBaru) || 0,
      jumlahPengurus: 0,
      periode: "2025-2027",
      statusVerifikasi: "Menunggu",
      tagline: "",
      deskripsi: "",
      alamatSekretariat: "",
      email: "",
      kelengkapan: {
        identitasWilayah: true,
        susunanPengurus: false,
        informasiKontak: false,
        dokumenPendukung: false,
      },
      pengurus: [],
    });
    setSuksesTambah(true);
    setNamaBaru("");
    setKodeBaru("");
    setKecamatanBaru("");
    setIndukBaru("");
    setAnggotaBaru(0);
  };

  return (
    <AdminShell breadcrumb="Dashboard">
      <div className="space-y-6">
        {/* HEADER SECTION - Clean & Minimalist */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-ipm-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-ipm-gold">
                <span className="w-1.5 h-1.5 rounded-full bg-ipm-gold" />
                PD IPM KOTA YOGYAKARTA
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ipm-dark tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAddModalOpen(true);
                setSuksesTambah(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-surface transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 text-ipm-gold" />
              <span>Tambah Pimpinan</span>
            </button>
            <Link
              href="/admin/profil-pimpinan"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover transition-colors shadow-xs"
            >
              <SquarePen className="w-4 h-4" />
              <span>Profil</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI STATS CARDS - Clean Numbers Without Filler Text */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-ipm-border p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-ipm-muted">Cabang</p>
              <p className="text-2xl sm:text-3xl font-bold text-ipm-dark mt-1">{totalCabang}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-ipm-gold flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-ipm-border p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-ipm-muted">Ranting</p>
              <p className="text-2xl sm:text-3xl font-bold text-ipm-dark mt-1">{totalRanting}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-ipm-gold flex items-center justify-center shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-ipm-border p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-ipm-muted">Anggota</p>
              <p className="text-2xl sm:text-3xl font-bold text-ipm-dark mt-1">
                {anggotaList.length || totalAnggota}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-ipm-gold flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-ipm-border p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-ipm-muted">Menunggu</p>
              <p className="text-2xl sm:text-3xl font-bold text-ipm-dark mt-1">{menungguCount}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 8 COLUMNS: DAFTAR PIMPINAN */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-ipm-border shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              {/* Card Header with Tabs & Inline Search */}
              <div className="p-4 sm:p-5 border-b border-ipm-border flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-ipm-dark">
                  Daftar Pimpinan
                </h2>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-ipm-surface border border-ipm-border">
                  {(["Semua", "Cabang", "Ranting"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTingkatanTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        tingkatanTab === tab
                          ? "bg-white text-ipm-dark shadow-xs border border-ipm-border"
                          : "text-ipm-muted hover:text-ipm-dark"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-3 bg-ipm-surface border-b border-ipm-border">
                <div className="relative">
                  <Search className="w-4 h-4 text-ipm-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTable}
                    onChange={(e) => setSearchTable(e.target.value)}
                    placeholder="Cari pimpinan..."
                    className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-white border border-ipm-border text-ipm-dark placeholder:text-ipm-muted focus:border-ipm-gold focus:outline-none"
                  />
                  {searchTable && (
                    <button
                      type="button"
                      onClick={() => setSearchTable("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ipm-muted hover:text-ipm-dark"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                {filteredPimpinan.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <p className="text-sm font-semibold text-ipm-dark">
                      Tidak ada data pimpinan
                    </p>
                    <p className="text-xs text-ipm-muted max-w-sm mx-auto">
                      Tambahkan pimpinan baru ke database Supabase.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAddModalOpen(true);
                          setSuksesTambah(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Pimpinan</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-ipm-border bg-ipm-surface text-ipm-muted uppercase text-[11px] font-semibold">
                        <th className="py-3 px-4">Pimpinan</th>
                        <th className="py-3 px-3">Tingkat</th>
                        <th className="py-3 px-3">Wilayah</th>
                        <th className="py-3 px-3">Anggota</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ipm-border">
                      {filteredPimpinan.slice(0, 8).map((item) => (
                        <tr key={item.id} className="hover:bg-ipm-surface transition-colors">
                          <td className="py-3 px-4">
                            <Link
                              href={`/direktori/${item.slug}`}
                              className="font-semibold text-ipm-dark hover:text-ipm-gold flex items-center gap-1.5"
                            >
                              <span>{item.nama}</span>
                              <ArrowUpRight className="w-3 h-3 text-ipm-muted opacity-60" />
                            </Link>
                            <p className="text-[11px] text-ipm-muted mt-0.5">
                              {item.kode}
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                item.tingkatan === "Cabang"
                                  ? "bg-blue-50 text-ipm-gold"
                                  : "bg-gray-100 text-ipm-dark"
                              }`}
                            >
                              {item.tingkatan}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-ipm-muted">
                            {item.kecamatan}
                          </td>
                          <td className="py-3 px-3 font-medium text-ipm-dark">
                            {item.jumlahAnggota}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                item.statusVerifikasi === "Terverifikasi"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.statusVerifikasi === "Terverifikasi"
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              {item.statusVerifikasi}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/admin/profil-pimpinan?id=${item.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ipm-surface hover:bg-ipm-gold hover:text-white border border-ipm-border text-ipm-dark text-[11px] font-semibold transition-colors"
                            >
                              <SquarePen className="w-3 h-3" />
                              <span>Edit</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Table Footer */}
            <div className="p-3.5 border-t border-ipm-border bg-ipm-surface flex items-center justify-between text-xs">
              <span className="text-ipm-muted">
                {Math.min(filteredPimpinan.length, 8)} dari {pimpinanList.length} pimpinan
              </span>
              <Link
                href="/admin/pimpinan"
                className="inline-flex items-center gap-1 font-semibold text-ipm-gold hover:underline"
              >
                <span>Kelola Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: PROFIL ADMIN & AKTIVITAS */}
          <div className="lg:col-span-4 space-y-5">
            {/* Widget 1: Akun Admin */}
            <div className="bg-white rounded-2xl border border-ipm-border p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold text-white font-bold text-xs shrink-0">
                  {adminUser.inisial}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-ipm-dark truncate">{adminUser.nama}</h3>
                  <p className="text-xs text-ipm-muted truncate">{adminUser.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-ipm-gold/20 text-xs">
                <span className="font-semibold text-ipm-gold">Peran</span>
                <span className="px-2 py-0.5 rounded-md bg-white text-ipm-gold font-semibold text-[11px] border border-ipm-gold/30">
                  {adminUser.peran}
                </span>
              </div>

              {/* Quick Navigation Links */}
              <div className="space-y-1 pt-1 border-t border-ipm-border">
                <Link
                  href="/admin/pimpinan"
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-ipm-dark hover:bg-ipm-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-ipm-gold" />
                    <span>Data Pimpinan</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-ipm-muted" />
                </Link>
                <Link
                  href="/admin/anggota"
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-ipm-dark hover:bg-ipm-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-ipm-gold" />
                    <span>Data Anggota</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-ipm-muted" />
                </Link>
                <Link
                  href="/admin/profil-pimpinan"
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-ipm-dark hover:bg-ipm-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <SquarePen className="w-4 h-4 text-ipm-gold" />
                    <span>Profil Pimpinan</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-ipm-muted" />
                </Link>
              </div>
            </div>

            {/* Widget 2: Log Aktivitas */}
            <div className="bg-white rounded-2xl border border-ipm-border p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ipm-dark">Aktivitas</h3>
                <span className="text-[11px] font-medium text-ipm-muted flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ipm-gold" />
                  Realtime
                </span>
              </div>

              {aktivitasList.length === 0 ? (
                <p className="text-xs text-ipm-muted py-3 text-center">
                  Belum ada aktivitas.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {aktivitasList.slice(0, 5).map((akt) => (
                    <li key={akt.id} className="flex items-start gap-2.5 text-xs">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-ipm-gold font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {akt.inisial}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-ipm-dark truncate">{akt.aksi}</p>
                        <p className="text-[10px] text-ipm-muted">
                          {akt.nama} • {akt.waktu}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TAMBAH PIMPINAN MODAL */}
      {addModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dash-add-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-2xl border border-ipm-border max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2
                id="dash-add-modal-title"
                className="text-base font-bold text-ipm-dark"
              >
                Tambah Pimpinan
              </h2>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-ipm-muted hover:text-ipm-dark hover:bg-ipm-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {suksesTambah ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Data pimpinan berhasil ditambahkan!</span>
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSuksesTambah(false)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
                  >
                    Tambah Lagi
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-semibold text-xs"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label htmlFor="modal-nama" className="font-semibold text-ipm-dark">
                    Nama
                  </label>
                  <input
                    id="modal-nama"
                    type="text"
                    required
                    value={namaBaru}
                    onChange={(e) => setNamaBaru(e.target.value)}
                    placeholder="Nama Cabang / Ranting"
                    className="w-full px-3 py-2 rounded-xl border border-ipm-border bg-white text-ipm-dark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="modal-tingkatan" className="font-semibold text-ipm-dark">
                      Tingkat
                    </label>
                    <select
                      id="modal-tingkatan"
                      value={tingkatanBaru}
                      onChange={(e) => setTingkatanBaru(e.target.value as TingkatanPimpinan)}
                      className="w-full px-3 py-2 rounded-xl border border-ipm-border bg-white text-ipm-dark"
                    >
                      <option value="Cabang">Cabang</option>
                      <option value="Ranting">Ranting</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="modal-kecamatan" className="font-semibold text-ipm-dark">
                      Wilayah
                    </label>
                    <input
                      id="modal-kecamatan"
                      type="text"
                      required
                      value={kecamatanBaru}
                      onChange={(e) => setKecamatanBaru(e.target.value)}
                      placeholder="Kemantren / Wilayah"
                      className="w-full px-3 py-2 rounded-xl border border-ipm-border bg-white text-ipm-dark"
                    />
                  </div>
                </div>

                {tingkatanBaru === "Ranting" && (
                  <div className="space-y-1">
                    <label htmlFor="modal-induk" className="font-semibold text-ipm-dark">
                      Cabang Induk
                    </label>
                    <input
                      id="modal-induk"
                      type="text"
                      value={indukBaru}
                      onChange={(e) => setIndukBaru(e.target.value)}
                      placeholder="PC IPM ..."
                      className="w-full px-3 py-2 rounded-xl border border-ipm-border bg-white text-ipm-dark"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="modal-kode" className="font-semibold text-ipm-dark">
                      Kode
                    </label>
                    <input
                      id="modal-kode"
                      type="text"
                      value={kodeBaru}
                      onChange={(e) => setKodeBaru(e.target.value)}
                      placeholder="Auto"
                      className="w-full px-3 py-2 rounded-xl border border-ipm-border bg-white text-ipm-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="modal-anggota" className="font-semibold text-ipm-dark">
                      Anggota
                    </label>
                    <input
                      id="modal-anggota"
                      type="number"
                      min={0}
                      value={anggotaBaru}
                      onChange={(e) => setAnggotaBaru(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-ipm-border bg-white text-ipm-dark"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-ipm-border font-semibold text-ipm-dark hover:bg-ipm-surface"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-ipm-gold text-white font-semibold hover:bg-ipm-gold-hover"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
