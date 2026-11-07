"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  CheckCircle2,
  X,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { useIPMData } from "@/context/IPMDataContext";

export default function AdminAnggotaPage() {
  const {
    anggotaList,
    pimpinanList,
    adminUser,
    registerAnggota,
    deleteAnggota,
    verifyAnggotaStatus,
  } = useIPMData();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [rantingFilter, setRantingFilter] = useState<string>("Semua");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const rantingOptions = useMemo(
    () => pimpinanList.filter((p) => p.tingkatan === "Ranting"),
    [pimpinanList]
  );

  // Add Member Form
  const [namaBaru, setNamaBaru] = useState("");
  const [emailBaru, setEmailBaru] = useState("");
  const [teleponBaru, setTeleponBaru] = useState("");
  const [kelasBaru, setKelasBaru] = useState("");
  const [rantingSlugBaru, setRantingSlugBaru] = useState("");
  const [rantingNamaManual, setRantingNamaManual] = useState("");
  const [cabangNamaManual, setCabangNamaManual] = useState("");
  const [minatBaru, setMinatBaru] = useState("Literasi & Keilmuan");

  const scopedAnggota = useMemo(() => {
    return anggotaList.filter((a) => {
      if (adminUser.role === "admin_ranting" && adminUser.pimpinanSlug) {
        if (a.rantingSlug !== adminUser.pimpinanSlug) return false;
      }
      if (adminUser.role === "admin_cabang" && adminUser.pimpinanNama) {
        if (a.cabangNama !== adminUser.pimpinanNama) return false;
      }
      if (statusFilter !== "Semua" && a.statusKeanggotaan !== statusFilter) {
        return false;
      }
      if (rantingFilter !== "Semua" && a.rantingSlug !== rantingFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNama = a.nama.toLowerCase().includes(q);
        const matchNba = a.nba.toLowerCase().includes(q);
        const matchEmail = a.email.toLowerCase().includes(q);
        const matchRanting = a.rantingNama.toLowerCase().includes(q);
        if (!matchNama && !matchNba && !matchEmail && !matchRanting) return false;
      }
      return true;
    });
  }, [anggotaList, adminUser, statusFilter, rantingFilter, searchQuery]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBaru.trim() || !emailBaru.trim()) return;
    const selectedRanting = rantingOptions.find((r) => r.slug === rantingSlugBaru);
    await registerAnggota({
      nama: namaBaru,
      email: emailBaru,
      telepon: teleponBaru || "-",
      kelasAngkatan: kelasBaru || "-",
      rantingSlug:
        selectedRanting?.slug ||
        (rantingNamaManual
          ? rantingNamaManual
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : "ranting-ipm"),
      rantingNamaManual: selectedRanting?.nama || rantingNamaManual || "PR IPM",
      cabangNamaManual:
        selectedRanting?.pimpinanInduk || cabangNamaManual || "PC IPM",
      bidangMinat: minatBaru,
      bio: `Anggota di ${
        selectedRanting?.nama || rantingNamaManual || "Ranting IPM"
      }.`,
    });
    setNamaBaru("");
    setEmailBaru("");
    setTeleponBaru("");
    setKelasBaru("");
    setRantingNamaManual("");
    setCabangNamaManual("");
    setAddModalOpen(false);
  };

  return (
    <AdminShell breadcrumb="Data & Akun Anggota">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
              Data &amp; Akun Anggota Pelajar
            </h1>
            <p className="text-xs sm:text-sm text-ipm-muted">
              {adminUser.role === "admin_ranting"
                ? `Kelola akun anggota yang terdaftar pada ${adminUser.pimpinanNama} di Supabase.`
                : adminUser.role === "admin_cabang"
                ? `Kelola akun anggota dari seluruh ranting di bawah ${adminUser.pimpinanNama} di Supabase.`
                : "Kelola seluruh akun anggota pelajar, Nomor Baku Anggota (NBA), dan status verifikasi langsung di database Supabase."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/anggota"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-surface"
            >
              <span>Buka Portal Anggota</span>
              <ArrowUpRight className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => {
                if (rantingOptions.length > 0 && !rantingSlugBaru) {
                  setRantingSlugBaru(rantingOptions[0].slug);
                }
                setAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs sm:text-sm hover:bg-ipm-gold-hover transition-colors"
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              <span>Tambah Akun Anggota</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl bg-white border border-ipm-border p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-5 space-y-1">
            <label
              htmlFor="search-anggota"
              className="block text-xs font-semibold text-ipm-dark"
            >
              Cari Anggota
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="search-anggota"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama, Nomor Anggota (NBA), atau email..."
                className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-1">
            <label
              htmlFor="filter-ranting-anggota"
              className="block text-xs font-semibold text-ipm-dark"
            >
              Pimpinan Ranting
            </label>
            <select
              id="filter-ranting-anggota"
              value={rantingFilter}
              onChange={(e) => setRantingFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark"
            >
              <option value="Semua">Semua Ranting</option>
              {rantingOptions.map((r) => (
                <option key={r.id} value={r.slug}>
                  {r.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3 space-y-1">
            <label
              htmlFor="filter-status-anggota"
              className="block text-xs font-semibold text-ipm-dark"
            >
              Status Keanggotaan
            </label>
            <select
              id="filter-status-anggota"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark"
            >
              <option value="Semua">Semua</option>
              <option value="Aktif">Aktif</option>
              <option value="Menunggu Verifikasi">Menunggu</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white border border-ipm-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ipm-surface border-b border-ipm-border text-[11px] font-semibold uppercase tracking-wider text-ipm-muted">
                  <th className="py-3.5 px-5">Nama</th>
                  <th className="py-3.5 px-4">Ranting</th>
                  <th className="py-3.5 px-4">Kelas</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ipm-border text-xs">
                {scopedAnggota.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 px-6 text-center text-ipm-muted"
                    >
                      Belum ada data anggota pada tabel <code>anggota</code> di
                      database Supabase. Klik{" "}
                      <strong>Tambah Akun Anggota</strong> untuk mendaftarkan
                      anggota baru.
                    </td>
                  </tr>
                ) : (
                  scopedAnggota.map((ang) => (
                    <tr
                      key={ang.id}
                      className="hover:bg-ipm-surface transition-colors"
                    >
                      <td className="py-4 px-5 align-middle">
                        <p className="font-semibold text-ipm-dark text-sm">
                          {ang.nama}
                        </p>
                        <p className="text-[11px] text-ipm-muted mt-0.5">
                          NBA: {ang.nba} • {ang.email}
                        </p>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <p className="font-semibold text-ipm-dark">
                          {ang.rantingNama}
                        </p>
                        <p className="text-[11px] text-ipm-muted">
                          {ang.cabangNama}
                        </p>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <p className="font-medium text-ipm-dark">
                          {ang.kelasAngkatan}
                        </p>
                        <p className="text-[11px] text-ipm-muted">
                          {ang.bidangMinat}
                        </p>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            ang.statusKeanggotaan === "Aktif"
                              ? "bg-ipm-gold text-white"
                              : ang.statusKeanggotaan === "Menunggu Verifikasi"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-ipm-surface text-ipm-muted border border-ipm-border"
                          }`}
                        >
                          {ang.statusKeanggotaan === "Menunggu Verifikasi" ? "Menunggu" : ang.statusKeanggotaan}
                        </span>
                      </td>
                      <td className="py-4 px-5 align-middle text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {ang.statusKeanggotaan === "Menunggu Verifikasi" && (
                            <button
                              type="button"
                              onClick={() =>
                                verifyAnggotaStatus(ang.id, "Aktif")
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl bg-ipm-gold text-white font-semibold text-xs hover:bg-ipm-gold-hover"
                            >
                              <CheckCircle2
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                              <span>Verifikasi</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteAnggota(ang.id)}
                            title="Hapus anggota dari database"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[38px] rounded-xl border border-ipm-border text-ipm-muted hover:text-ipm-dark hover:bg-ipm-surface text-xs font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {addModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-anggota-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-2xl border border-ipm-border max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2
                id="add-anggota-title"
                className="text-lg font-semibold text-ipm-dark"
              >
                Tambah Akun Anggota ke Supabase
              </h2>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                aria-label="Tutup dialog"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-ipm-border hover:bg-ipm-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label
                  htmlFor="ang-nama"
                  className="block text-xs font-semibold text-ipm-dark mb-1"
                >
                  Nama Lengkap Pelajar
                </label>
                <input
                  id="ang-nama"
                  type="text"
                  required
                  value={namaBaru}
                  onChange={(e) => setNamaBaru(e.target.value)}
                  placeholder="Masukkan nama lengkap pelajar"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="ang-email"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Email Akun
                  </label>
                  <input
                    id="ang-email"
                    type="email"
                    required
                    value={emailBaru}
                    onChange={(e) => setEmailBaru(e.target.value)}
                    placeholder="nama@ipm.or.id"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ang-telp"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    id="ang-telp"
                    type="text"
                    value={teleponBaru}
                    onChange={(e) => setTeleponBaru(e.target.value)}
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
              </div>

              {rantingOptions.length > 0 ? (
                <div>
                  <label
                    htmlFor="ang-ranting"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Pilih Pimpinan Ranting (Dari Database)
                  </label>
                  <select
                    id="ang-ranting"
                    value={rantingSlugBaru}
                    onChange={(e) => setRantingSlugBaru(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm bg-white"
                  >
                    {rantingOptions.map((r) => (
                      <option key={r.id} value={r.slug}>
                        {r.nama} ({r.pimpinanInduk})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="ang-ranting-manual"
                      className="block text-xs font-semibold text-ipm-dark mb-1"
                    >
                      Nama Pimpinan Ranting
                    </label>
                    <input
                      id="ang-ranting-manual"
                      type="text"
                      required
                      value={rantingNamaManual}
                      onChange={(e) => setRantingNamaManual(e.target.value)}
                      placeholder="PR IPM SMA ..."
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ang-cabang-manual"
                      className="block text-xs font-semibold text-ipm-dark mb-1"
                    >
                      Nama Pimpinan Cabang
                    </label>
                    <input
                      id="ang-cabang-manual"
                      type="text"
                      required
                      value={cabangNamaManual}
                      onChange={(e) => setCabangNamaManual(e.target.value)}
                      placeholder="PC IPM ..."
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="ang-kelas"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Kelas &amp; Angkatan
                  </label>
                  <input
                    id="ang-kelas"
                    type="text"
                    value={kelasBaru}
                    onChange={(e) => setKelasBaru(e.target.value)}
                    placeholder="Kelas XI • Angkatan 2025"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ang-minat"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Bidang Minat
                  </label>
                  <select
                    id="ang-minat"
                    value={minatBaru}
                    onChange={(e) => setMinatBaru(e.target.value)}
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
    </AdminShell>
  );
}
