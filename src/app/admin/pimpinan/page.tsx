"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  X,
  ArrowUpRight,
  SlidersHorizontal,
  Eye,
  Building2,
  GitBranch,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { useIPMData } from "@/context/IPMDataContext";
import {
  PimpinanItem,
  StatusVerifikasi,
  TingkatanPimpinan,
} from "@/data/ipm-data";

export default function AdminKelolaPimpinanPage() {
  const {
    pimpinanList,
    adminUser,
    updateStatusVerifikasi,
    updatePimpinan,
    addPimpinan,
    deletePimpinan,
    importPimpinanBatch,
  } = useIPMData();

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [tabFilter, setTabFilter] = useState<"Semua" | "Cabang" | "Ranting" | "Menunggu">("Semua");
  const [wilayahFilter, setWilayahFilter] = useState("Semua Wilayah");
  const [sortBy, setSortBy] = useState<"terbaru" | "nama" | "anggota">("terbaru");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Inspect Drawer (Clean side drawer on demand, not taking permanent layout space)
  const [inspectItem, setInspectItem] = useState<PimpinanItem | null>(null);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Add Form State
  const [newNama, setNewNama] = useState("");
  const [newTingkatan, setNewTingkatan] = useState<TingkatanPimpinan>("Ranting");
  const [newInduk, setNewInduk] = useState("");
  const [newKecamatan, setNewKecamatan] = useState("");
  const [newKetua, setNewKetua] = useState("");
  const [newAnggota, setNewAnggota] = useState("");
  const [newPeriode, setNewPeriode] = useState("2025-2027");
  const [newAlamat, setNewAlamat] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Edit Form State
  const [editTarget, setEditTarget] = useState<PimpinanItem | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editKetua, setEditKetua] = useState("");
  const [editAnggota, setEditAnggota] = useState(0);
  const [editPeriode, setEditPeriode] = useState("");
  const [editInduk, setEditInduk] = useState("");
  const [editKecamatan, setEditKecamatan] = useState("");
  const [editStatus, setEditStatus] = useState<StatusVerifikasi>("Terverifikasi");

  // Import State
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Scope: Admin Utama has full access to ALL pimpinan
  const roleScopedPimpinan = useMemo(() => {
    if (adminUser.role === "admin_ranting" && adminUser.pimpinanSlug) {
      return pimpinanList.filter((p) => p.slug === adminUser.pimpinanSlug);
    }
    if (adminUser.role === "admin_cabang" && adminUser.pimpinanNama) {
      return pimpinanList.filter(
        (p) =>
          p.slug === adminUser.pimpinanSlug ||
          p.pimpinanInduk === adminUser.pimpinanNama
      );
    }
    return pimpinanList;
  }, [pimpinanList, adminUser]);

  // Wilayah List
  const wilayahList = useMemo(() => {
    const unique = Array.from(
      new Set(roleScopedPimpinan.map((p) => p.kecamatan).filter(Boolean))
    );
    return ["Semua Wilayah", ...unique];
  }, [roleScopedPimpinan]);

  // Summary counts
  const totalCount = roleScopedPimpinan.length;
  const cabangCount = roleScopedPimpinan.filter((p) => p.tingkatan === "Cabang").length;
  const rantingCount = roleScopedPimpinan.filter((p) => p.tingkatan === "Ranting").length;
  const waitingCount = roleScopedPimpinan.filter((p) => p.statusVerifikasi === "Menunggu").length;

  // Filtered & Sorted
  const filteredList = useMemo(() => {
    let result = roleScopedPimpinan;

    if (tabFilter === "Cabang") {
      result = result.filter((p) => p.tingkatan === "Cabang");
    } else if (tabFilter === "Ranting") {
      result = result.filter((p) => p.tingkatan === "Ranting");
    } else if (tabFilter === "Menunggu") {
      result = result.filter((p) => p.statusVerifikasi === "Menunggu");
    }

    if (wilayahFilter !== "Semua Wilayah") {
      result = result.filter((p) => p.kecamatan === wilayahFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.kode.toLowerCase().includes(q) ||
          p.kecamatan.toLowerCase().includes(q) ||
          p.pimpinanInduk.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === "nama") return a.nama.localeCompare(b.nama);
      if (sortBy === "anggota") return b.jumlahAnggota - a.jumlahAnggota;
      return b.urutanTanggal - a.urutanTanggal;
    });
  }, [roleScopedPimpinan, tabFilter, wilayahFilter, searchQuery, sortBy]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkVerify = async () => {
    for (const id of selectedIds) {
      await updateStatusVerifikasi(id, "Terverifikasi");
    }
    showToast(`${selectedIds.length} unit berhasil diverifikasi.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.length;
    for (const id of selectedIds) {
      await deletePimpinan(id);
    }
    showToast(`${count} unit pimpinan dihapus.`);
    setSelectedIds([]);
  };

  const openEditModal = (unit: PimpinanItem) => {
    setEditTarget(unit);
    setEditNama(unit.nama);
    setEditKetua(unit.pengurus[0]?.nama || "");
    setEditAnggota(unit.jumlahAnggota);
    setEditPeriode(unit.periode);
    setEditInduk(unit.pimpinanInduk);
    setEditKecamatan(unit.kecamatan);
    setEditStatus(unit.statusVerifikasi);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    const updatedPengurus = [...editTarget.pengurus];
    if (editKetua.trim()) {
      const inisial = editKetua
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      if (updatedPengurus.length > 0) {
        updatedPengurus[0] = {
          ...updatedPengurus[0],
          nama: editKetua,
          inisial: inisial || "IP",
        };
      } else {
        updatedPengurus.push({
          nama: editKetua,
          jabatan: "Ketua Umum",
          inisial: inisial || "IP",
        });
      }
    }

    await updatePimpinan(editTarget.id, {
      nama: editNama,
      jumlahAnggota: Number(editAnggota) || 0,
      periode: editPeriode,
      pimpinanInduk: editInduk,
      kecamatan: editKecamatan,
      statusVerifikasi: editStatus,
      pengurus: updatedPengurus,
      jumlahPengurus: updatedPengurus.length,
    });
    setEditModalOpen(false);
    showToast(`Data ${editNama} diperbarui.`);
  };

  const handleCreatePimpinan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim()) return;

    const countPrefix = newTingkatan === "Cabang" ? "PC" : "PR";
    const kodeNumber = String(pimpinanList.length + 1).padStart(3, "0");

    const pengurusBaru = newKetua
      ? [
          {
            nama: newKetua,
            jabatan: "Ketua Umum",
            inisial: newKetua
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
          },
        ]
      : [];

    await addPimpinan({
      kode: `${countPrefix}-${kodeNumber}`,
      nama: newNama,
      tingkatan: newTingkatan,
      labelTingkatan:
        newTingkatan === "Cabang" ? "Pimpinan Cabang" : "Pimpinan Ranting",
      pimpinanInduk:
        newTingkatan === "Cabang"
          ? "PD IPM Kota Yogyakarta"
          : newInduk.trim() || "PC IPM",
      kecamatan: newKecamatan.trim() || "-",
      kabupatenKota: "Kota Yogyakarta",
      provinsi: "DI Yogyakarta",
      periode: newPeriode || "2025-2027",
      jumlahAnggota: Number(newAnggota) || 0,
      jumlahPengurus: pengurusBaru.length,
      jumlahRantingDinaungi: newTingkatan === "Cabang" ? 0 : undefined,
      statusVerifikasi: "Terverifikasi",
      tagline: "",
      deskripsi: "",
      alamatSekretariat: newAlamat || "-",
      email: newEmail || "-",
      kelengkapan: {
        identitasWilayah: Boolean(newKecamatan),
        susunanPengurus: pengurusBaru.length > 0,
        informasiKontak: Boolean(newEmail),
        dokumenPendukung: false,
      },
      pengurus: pengurusBaru,
    });

    setNewNama("");
    setNewKetua("");
    setNewAnggota("");
    setNewKecamatan("");
    setNewInduk("");
    setNewAlamat("");
    setNewEmail("");
    setAddModalOpen(false);
    showToast(`Data ${newNama} berhasil ditambahkan.`);
  };

  const handleExportData = () => {
    if (filteredList.length === 0) return;
    const jsonContent = JSON.stringify(filteredList, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pimpinan-ipm-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data berhasil diekspor.");
  };

  return (
    <AdminShell breadcrumb="Data Pimpinan">
      <div className="space-y-5">
        {/* TOAST NOTIFICATION */}
        {toastMsg && (
          <div
            role="status"
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-ipm-dark text-white text-xs font-semibold shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* CLEAN MINIMALIST HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-ipm-border">
          <div>
            <h1 className="text-2xl font-bold text-ipm-dark tracking-tight">
              Data Pimpinan
            </h1>
            <p className="text-xs text-ipm-muted mt-0.5">
              PD IPM Kota Yogyakarta
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-surface shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-ipm-gold" />
              <span>Impor</span>
            </button>
            <button
              type="button"
              onClick={handleExportData}
              disabled={filteredList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-surface disabled:opacity-40 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-ipm-gold" />
              <span>Ekspor</span>
            </button>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pimpinan</span>
            </button>
          </div>
        </div>

        {/* SLEEK FILTER TOOLBAR - SINGLE CLEAN ROW */}
        <div className="bg-white rounded-2xl border border-ipm-border p-3.5 shadow-xs space-y-3">
          {/* Row 1: Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-ipm-surface border border-ipm-border">
              {(
                [
                  { key: "Semua", label: `Semua (${totalCount})` },
                  { key: "Cabang", label: `Cabang (${cabangCount})` },
                  { key: "Ranting", label: `Ranting (${rantingCount})` },
                  { key: "Menunggu", label: `Menunggu (${waitingCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setTabFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    tabFilter === tab.key
                      ? "bg-white text-ipm-dark shadow-xs border border-ipm-border"
                      : "text-ipm-muted hover:text-ipm-dark"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-ipm-muted">
                  {selectedIds.length} dipilih
                </span>
                <button
                  type="button"
                  onClick={handleBulkVerify}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100"
                >
                  Verifikasi
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          {/* Row 2: Search & Dropdowns in One Horizontal Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-ipm-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pimpinan..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-ipm-surface border border-ipm-border text-ipm-dark placeholder:text-ipm-muted focus:bg-white focus:border-ipm-gold focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ipm-muted hover:text-ipm-dark"
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={wilayahFilter}
              onChange={(e) => setWilayahFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 text-xs rounded-xl bg-ipm-surface border border-ipm-border font-medium text-ipm-dark focus:bg-white"
            >
              {wilayahList.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "terbaru" | "nama" | "anggota")}
              className="w-full sm:w-36 px-3 py-2 text-xs rounded-xl bg-ipm-surface border border-ipm-border font-medium text-ipm-dark focus:bg-white"
            >
              <option value="terbaru">Terbaru</option>
              <option value="nama">Nama (A-Z)</option>
              <option value="anggota">Anggota</option>
            </select>
          </div>
        </div>

        {/* FULL-WIDTH CLEAN TABLE (No awkward side panels cutting off the view) */}
        <div className="bg-white rounded-2xl border border-ipm-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-ipm-surface border-b border-ipm-border text-ipm-muted uppercase text-[11px] font-semibold">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredList.length > 0 &&
                        selectedIds.length === filteredList.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-ipm-border"
                    />
                  </th>
                  <th className="py-3 px-4">Pimpinan</th>
                  <th className="py-3 px-3">Tingkat</th>
                  <th className="py-3 px-3">Wilayah</th>
                  <th className="py-3 px-3">Ketua</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ipm-border">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center text-ipm-muted space-y-2">
                      <p className="font-semibold text-ipm-dark text-sm">
                        Belum ada data pimpinan di database
                      </p>
                      <p className="text-xs max-w-sm mx-auto">
                        Klik tombol di bawah untuk menambahkan data Pimpinan Cabang atau Ranting pertama Anda.
                      </p>
                      <button
                        type="button"
                        onClick={() => setAddModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Pimpinan</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => {
                    const ketuaNama = item.pengurus[0]?.nama || "-";
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-ipm-surface/70 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelectRow(item.id)}
                            className="w-4 h-4 rounded border-ipm-border"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setInspectItem(item)}
                            className="font-semibold text-ipm-dark hover:text-ipm-gold text-left flex items-center gap-1 group"
                          >
                            <span>{item.nama}</span>
                            <ArrowUpRight className="w-3 h-3 text-ipm-muted opacity-50 group-hover:opacity-100" />
                          </button>
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
                        <td className="py-3 px-3">
                          <p className="font-medium text-ipm-dark">{ketuaNama}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
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
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {item.statusVerifikasi !== "Terverifikasi" && (
                              <button
                                type="button"
                                onClick={() => updateStatusVerifikasi(item.id, "Terverifikasi")}
                                className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700"
                              >
                                Verifikasi
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              title="Edit"
                              className="p-1.5 rounded-lg border border-ipm-border text-ipm-dark hover:bg-ipm-surface"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePimpinan(item.id)}
                              title="Hapus"
                              className="p-1.5 rounded-lg border border-ipm-border text-ipm-muted hover:text-red-600 hover:bg-ipm-surface"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-ipm-border bg-ipm-surface text-xs text-ipm-muted flex items-center justify-between">
            <span>
              Menampilkan {filteredList.length} dari {totalCount} unit pimpinan
            </span>
            <Link
              href="/admin/profil-pimpinan"
              className="font-semibold text-ipm-gold hover:underline"
            >
              Update Profil &amp; Pengurus →
            </Link>
          </div>
        </div>
      </div>

      {/* DETAIL INSPECT DRAWER (Slide-over on demand) */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-ipm-border">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-ipm-gold text-xs font-semibold">
                  {inspectItem.tingkatan} • {inspectItem.kode}
                </span>
                <button
                  type="button"
                  onClick={() => setInspectItem(null)}
                  className="p-1.5 text-ipm-muted hover:text-ipm-dark rounded-lg hover:bg-ipm-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h2 className="text-lg font-bold text-ipm-dark">{inspectItem.nama}</h2>
                <p className="text-xs text-ipm-muted mt-0.5">
                  Induk: {inspectItem.pimpinanInduk}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-ipm-surface border border-ipm-border">
                  <p className="text-ipm-muted">Ketua Umum</p>
                  <p className="font-semibold text-ipm-dark mt-0.5">
                    {inspectItem.pengurus[0]?.nama || "-"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-ipm-surface border border-ipm-border">
                  <p className="text-ipm-muted">Anggota</p>
                  <p className="font-semibold text-ipm-dark mt-0.5">
                    {inspectItem.jumlahAnggota} orang
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-ipm-surface border border-ipm-border">
                  <p className="text-ipm-muted">Kecamatan</p>
                  <p className="font-semibold text-ipm-dark mt-0.5">
                    {inspectItem.kecamatan}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-ipm-surface border border-ipm-border">
                  <p className="text-ipm-muted">Periode</p>
                  <p className="font-semibold text-ipm-dark mt-0.5">
                    {inspectItem.periode}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-ipm-dark">Status Verifikasi</p>
                <div className="flex gap-2">
                  {(["Terverifikasi", "Menunggu"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updateStatusVerifikasi(inspectItem.id, st);
                        setInspectItem({ ...inspectItem, statusVerifikasi: st });
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                        inspectItem.statusVerifikasi === st
                          ? "bg-ipm-gold text-white border-ipm-gold"
                          : "bg-white text-ipm-dark border-ipm-border hover:bg-ipm-surface"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-ipm-border flex items-center justify-between gap-3">
              <Link
                href={`/direktori/${inspectItem.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ipm-gold hover:underline"
              >
                <span>Halaman Publik</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  const target = inspectItem;
                  setInspectItem(null);
                  openEditModal(target);
                }}
                className="px-4 py-2 rounded-xl bg-ipm-gold text-white font-semibold text-xs hover:bg-ipm-gold-hover"
              >
                Edit Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-ipm-border max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ipm-dark">Edit Pimpinan</h2>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-ipm-muted hover:text-ipm-dark hover:bg-ipm-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ipm-dark">Nama Pimpinan</label>
                <input
                  type="text"
                  required
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ipm-dark">Ketua Umum</label>
                  <input
                    type="text"
                    value={editKetua}
                    onChange={(e) => setEditKetua(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ipm-dark">Jumlah Anggota</label>
                  <input
                    type="number"
                    min={0}
                    value={editAnggota}
                    onChange={(e) => setEditAnggota(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ipm-dark">Kecamatan</label>
                  <input
                    type="text"
                    value={editKecamatan}
                    onChange={(e) => setEditKecamatan(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ipm-dark">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as StatusVerifikasi)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  >
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Menunggu">Menunggu</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-ipm-border font-semibold hover:bg-ipm-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-ipm-gold text-white font-semibold hover:bg-ipm-gold-hover"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAMBAH MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-ipm-border max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ipm-dark">Tambah Pimpinan</h2>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-ipm-muted hover:text-ipm-dark hover:bg-ipm-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePimpinan} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ipm-dark">Nama Pimpinan</label>
                <input
                  type="text"
                  required
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  placeholder="Contoh: PR IPM SMA Muhammadiyah 1 Yogyakarta"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ipm-dark">Tingkatan</label>
                  <select
                    value={newTingkatan}
                    onChange={(e) => setNewTingkatan(e.target.value as TingkatanPimpinan)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  >
                    <option value="Cabang">Cabang</option>
                    <option value="Ranting">Ranting</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-ipm-dark">Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={newKecamatan}
                    onChange={(e) => setNewKecamatan(e.target.value)}
                    placeholder="Gondokusuman"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  />
                </div>
              </div>

              {newTingkatan === "Ranting" && (
                <div>
                  <label className="font-semibold text-ipm-dark">Cabang Induk</label>
                  <input
                    type="text"
                    value={newInduk}
                    onChange={(e) => setNewInduk(e.target.value)}
                    placeholder="PC IPM Gondokusuman"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ipm-dark">Ketua Umum</label>
                  <input
                    type="text"
                    value={newKetua}
                    onChange={(e) => setNewKetua(e.target.value)}
                    placeholder="Nama Ketua"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ipm-dark">Anggota</label>
                  <input
                    type="number"
                    min={0}
                    value={newAnggota}
                    onChange={(e) => setNewAnggota(e.target.value)}
                    placeholder="0"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ipm-border bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-ipm-border font-semibold hover:bg-ipm-surface"
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
          </div>
        </div>
      )}

      {/* IMPOR MODAL */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-ipm-border max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ipm-dark">Impor Data Pimpinan</h2>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="p-1 rounded-lg text-ipm-muted hover:text-ipm-dark hover:bg-ipm-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Tempelkan data JSON atau CSV..."
              className="w-full p-3 rounded-xl border border-ipm-border font-mono text-xs"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-ipm-border font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!importText.trim() || isImporting}
                onClick={async () => {
                  try {
                    setIsImporting(true);
                    const parsed = JSON.parse(importText);
                    const batch = Array.isArray(parsed) ? parsed : [parsed];
                    await importPimpinanBatch(batch);
                    setIsImporting(false);
                    setImportModalOpen(false);
                    setImportText("");
                    showToast(`${batch.length} pimpinan berhasil diimpor.`);
                  } catch {
                    setIsImporting(false);
                    showToast("Format JSON tidak valid.");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-ipm-gold text-white font-semibold disabled:opacity-40"
              >
                {isImporting ? "Mengimpor..." : "Mulai Impor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
