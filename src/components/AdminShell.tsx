"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Network,
  Users,
  Newspaper,
  CalendarDays,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Building2,
  Database,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useIPMData } from "@/context/IPMDataContext";

interface AdminShellProps {
  breadcrumb: string;
  children: React.ReactNode;
}

export function AdminShell({ breadcrumb, children }: AdminShellProps) {
  const pathname = usePathname();
  const {
    adminUser,
    akunUsers,
    currentUser,
    switchAccount,
    pimpinanList,
    supabaseStatus,
    supabaseUrl,
    isLoadingDB,
    logout,
    connectSupabase,
    refreshDatabase,
    syncAllToSupabase,
  } = useIPMData();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(
    supabaseUrl || "https://imucshhraalggwojatgh.supabase.co"
  );
  const [inputKey, setInputKey] = useState(
    "sb_publishable_Dip1Fa-UzeGf16zhtlR4ag_PVZbmpjv"
  );
  const [dbMessage, setDbMessage] = useState("");

  const isUserAdmin =
    Boolean(currentUser.id && currentUser.email) &&
    ["admin_utama", "admin_cabang", "admin_ranting"].includes(
      currentUser.role
    );

  const menungguCount = pimpinanList.filter(
    (p) => p.statusVerifikasi === "Menunggu"
  ).length;

  const adminAccounts = akunUsers.filter((u) => u.role !== "anggota");
  const selectableAccounts =
    adminAccounts.length > 0 ? adminAccounts : [currentUser];

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/profil-pimpinan",
      label:
        adminUser.role === "admin_ranting"
          ? "Profil Ranting Saya"
          : adminUser.role === "admin_cabang"
          ? "Profil Cabang Saya"
          : "Update Profil Pimpinan",
      icon: Building2,
    },
    {
      href: "/admin/pimpinan",
      label:
        adminUser.role === "admin_cabang"
          ? "Ranting Naungan"
          : "Data Pimpinan",
      icon: Network,
      badge: menungguCount > 0 ? String(menungguCount) : undefined,
    },
    {
      href: "/admin/anggota",
      label: "Data & Akun Anggota",
      icon: Users,
    },
    {
      href: "/berita",
      label: "Berita & Artikel",
      icon: Newspaper,
    },
    {
      href: "/agenda",
      label: "Agenda & Kegiatan",
      icon: CalendarDays,
    },
  ];

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) return;
    setDbMessage("Menghubungkan ke proyek Supabase...");
    const ok = await connectSupabase(inputUrl, inputKey);
    if (ok) {
      setDbMessage("Terhubung ke database Supabase! Data telah dimuat langsung dari database.");
    } else {
      setDbMessage(
        "Kredensial disimpan. Pastikan tabel pada supabase/schema.sql sudah dijalankan di SQL Editor Supabase."
      );
    }
  };

  // Guard: Jika bukan akun admin (misal akun anggota atau belum login)
  if (!isUserAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ipm-surface p-4 sm:p-6 text-ipm-dark">
        <div className="max-w-md w-full bg-white border border-ipm-border rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-ipm-gold-soft border border-ipm-gold flex items-center justify-center mx-auto text-ipm-gold-badge">
            <ShieldAlert className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-ipm-dark tracking-tight">
              Akses Dibatasi
            </h1>
            <p className="text-xs sm:text-sm text-ipm-muted leading-relaxed">
              {currentUser.role === "anggota" && currentUser.email
                ? `Akun Anda (${currentUser.nama}) terdaftar sebagai Anggota Pelajar. Halaman pengelolaan ini hanya dapat diakses oleh Admin Ranting, Cabang, atau Daerah.`
                : "Halaman ini khusus untuk Pengelola Pimpinan IPM. Silakan masuk menggunakan email akun admin yang telah disediakan."}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {currentUser.role === "anggota" && (
              <Link
                href="/anggota"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs hover:bg-ipm-gold-hover transition-colors"
              >
                <span>Buka Portal Anggota</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/admin/login"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-surface transition-colors"
            >
              <span>Masuk Akun Pengelola</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-medium text-ipm-muted hover:text-ipm-dark py-1"
            >
              Kembali ke Beranda Publik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-ipm-surface text-ipm-dark">
      {/* Desktop Left Sidebar */}
      <aside
        aria-label="Navigasi Ruang Kerja Admin"
        className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white text-ipm-dark border-r border-ipm-border justify-between p-5"
      >
        <div className="space-y-6">
          {/* Brand Logo: PD IPM Ruang Pengelola with Official Logo */}
          <div className="flex items-center gap-3 px-1">
            <img
              src="/images/logo-ipm-jogja-trimmed.png"
              alt="Logo IPM Jogja"
              className="h-8 w-auto object-contain"
            />
            <span className="h-5 w-px bg-ipm-border" aria-hidden="true" />
            <div className="text-xs leading-tight">
              <p className="font-semibold text-ipm-dark">PD IPM Kota Yogyakarta</p>
              <p className="text-ipm-muted">{adminUser.peran}</p>
            </div>
          </div>

          {/* Role Indicator / Switcher */}
          {selectableAccounts.length > 1 ? (
            <div className="rounded-xl bg-ipm-surface border border-ipm-border p-3 space-y-2">
              <label
                htmlFor="role-switcher-select"
                className="block text-[11px] font-semibold uppercase tracking-wider text-ipm-muted"
              >
                Ganti Akun Pengelola
              </label>
              <select
                id="role-switcher-select"
                value={currentUser.id}
                onChange={(e) => switchAccount(e.target.value)}
                className="w-full px-2.5 py-2 min-h-[40px] rounded-lg bg-white border border-ipm-border text-xs font-semibold text-ipm-dark"
              >
                {selectableAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.labelPeran.replace("Admin Pimpinan ", "Admin ")} •{" "}
                    {acc.pimpinanNama || acc.wilayah}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="px-3 py-2.5 rounded-xl bg-ipm-surface border border-ipm-border flex items-center justify-between text-xs">
              <span className="font-semibold text-ipm-dark">{adminUser.peran}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Aktif
              </span>
            </div>
          )}

          {/* Main Navigation */}
          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-ipm-muted">
              Menu Pengelolaan
            </p>
            <nav aria-label="Menu Admin" className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm transition-colors ${
                      active
                        ? "bg-ipm-gold text-white font-semibold"
                        : "text-ipm-muted font-normal hover:bg-ipm-surface hover:text-ipm-dark"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          active
                            ? "bg-white text-ipm-gold"
                            : "bg-ipm-gold-soft text-ipm-gold-badge"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Profile & Public Links */}
        <div className="space-y-3 pt-4 border-t border-ipm-border">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ipm-gold text-white font-semibold text-xs shrink-0">
              {adminUser.inisial}
            </span>
            <div className="text-xs leading-tight min-w-0">
              <p className="font-semibold text-ipm-dark truncate">
                {adminUser.nama}
              </p>
              <p className="text-ipm-muted truncate">{adminUser.peran}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[42px] rounded-xl bg-ipm-surface text-xs font-medium text-ipm-dark hover:bg-ipm-gold-tint border border-ipm-border transition-colors"
            >
              <span>Web Publik</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-ipm-gold-deep" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[42px] rounded-xl bg-white text-xs font-medium text-ipm-muted hover:text-ipm-dark border border-ipm-border transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Utility Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-ipm-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((v) => !v)}
              aria-label="Buka navigasi admin"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-ipm-border text-ipm-dark hover:bg-ipm-surface"
            >
              {mobileSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <nav aria-label="Breadcrumb Admin" className="text-xs sm:text-sm">
              <span className="text-ipm-muted font-normal">Workspace</span>
              <span className="mx-2 text-ipm-muted">/</span>
              <span className="font-semibold text-ipm-dark">{breadcrumb}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => refreshDatabase()}
              title="Muat ulang data dari Supabase"
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-white border border-ipm-border text-xs font-medium text-ipm-dark hover:bg-ipm-surface transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-ipm-gold-deep ${
                  isLoadingDB ? "animate-spin" : ""
                }`}
                aria-hidden="true"
              />
              <span className="hidden md:inline">Refresh DB</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInputUrl(
                  supabaseUrl || "https://imucshhraalggwojatgh.supabase.co"
                );
                setDbMessage("");
                setDbModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-xl bg-ipm-surface border border-ipm-border text-xs font-medium text-ipm-dark hover:border-ipm-gold transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-ipm-gold-deep" aria-hidden="true" />
              <span className="hidden sm:inline">
                {supabaseStatus === "connected"
                  ? "Supabase Terhubung"
                  : supabaseStatus === "schema_missing"
                  ? "Supabase: Buat Tabel SQL"
                  : "Database Supabase"}
              </span>
            </button>

            <Link
              href="/anggota"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-white border border-ipm-border text-xs font-medium text-ipm-dark hover:bg-ipm-surface"
            >
              <span>Portal Anggota</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-ipm-gold-deep" aria-hidden="true" />
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-white text-ipm-dark px-4 py-4 space-y-3 border-b border-ipm-border">
            <div className="pb-2 border-b border-ipm-border space-y-1.5">
              <label
                htmlFor="mobile-role-switcher"
                className="block text-[11px] font-semibold uppercase tracking-wider text-ipm-muted"
              >
                Peran Aktif (Supabase)
              </label>
              <select
                id="mobile-role-switcher"
                value={currentUser.id}
                onChange={(e) => {
                  switchAccount(e.target.value);
                  setMobileSidebarOpen(false);
                }}
                className="w-full px-3 py-2 min-h-[42px] rounded-lg bg-ipm-surface border border-ipm-border text-xs font-semibold text-ipm-dark"
              >
                {selectableAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.labelPeran} • {acc.pimpinanNama || acc.wilayah}
                  </option>
                ))}
              </select>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 min-h-[44px] rounded-xl text-sm ${
                    active
                      ? "bg-ipm-gold text-white font-semibold"
                      : "text-ipm-muted hover:bg-ipm-surface hover:text-ipm-dark"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-ipm-gold-soft text-ipm-gold-badge">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Workspace Page Body */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* SUPABASE CONNECTION MODAL */}
      {dbModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="supabase-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-2xl border border-ipm-border max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-ipm-gold text-white">
                  <Database className="w-4 h-4" aria-hidden="true" />
                </span>
                <div>
                  <h2
                    id="supabase-modal-title"
                    className="text-base font-semibold text-ipm-dark"
                  >
                    Konfigurasi Database Supabase
                  </h2>
                  <p className="text-xs text-ipm-muted">
                    Status:{" "}
                    {supabaseStatus === "connected"
                      ? "Terhubung ke Supabase PostgreSQL (imucshhraalggwojatgh)"
                      : supabaseStatus === "schema_missing"
                      ? "API Terhubung • Menunggu Eksekusi Tabel SQL (supabase/schema.sql)"
                      : "Menghubungkan ke Database Supabase"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDbModalOpen(false)}
                aria-label="Tutup pengaturan database"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-ipm-border hover:bg-ipm-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl bg-ipm-surface border border-ipm-border p-3.5 text-xs text-ipm-muted space-y-2 leading-relaxed">
              <p className="font-semibold text-ipm-dark">
                Proyek: <code>imucshhraalggwojatgh.supabase.co</code>
              </p>
              <p>
                Seluruh tabel <code>pimpinan</code>, <code>anggota</code>,{" "}
                <code>akun_users</code>, <code>berita</code>,{" "}
                <code>agenda</code>, dan <code>aktivitas_admin</code> dihubungkan
                langsung ke Supabase PostgreSQL tanpa data dummy.
              </p>
            </div>

            {dbMessage && (
              <div className="p-3.5 rounded-xl bg-ipm-gold-tint border border-ipm-gold text-xs font-medium text-ipm-dark flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ipm-gold-badge shrink-0" />
                <span>{dbMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveSupabase} className="space-y-3">
              <div>
                <label
                  htmlFor="sb-url"
                  className="block text-xs font-semibold text-ipm-dark mb-1"
                >
                  Supabase Project URL
                </label>
                <input
                  id="sb-url"
                  type="url"
                  required
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="sb-key"
                  className="block text-xs font-semibold text-ipm-dark mb-1"
                >
                  Supabase Publishable / Anon Key
                </label>
                <input
                  id="sb-key"
                  type="text"
                  required
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="sb_publishable_..."
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border font-mono text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await syncAllToSupabase();
                    setDbMessage(
                      ok
                        ? "Data berhasil dimuat ulang dari tabel Supabase!"
                        : "Tabel belum ditemukan di database. Pastikan supabase/schema.sql telah dijalankan."
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-ipm-surface border border-ipm-border text-xs font-semibold text-ipm-dark hover:bg-ipm-gold-tint"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Muat Ulang dari Supabase</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDbModalOpen(false)}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-xs font-semibold"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                  >
                    Simpan &amp; Hubungkan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
