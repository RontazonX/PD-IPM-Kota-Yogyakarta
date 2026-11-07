"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, UserCheck, Shield, LogIn, LogOut } from "lucide-react";
import { useIPMData } from "@/context/IPMDataContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tentang", label: "Tentang IPM" },
  { href: "/direktori", label: "Direktori" },
  { href: "/berita", label: "Berita" },
  { href: "/agenda", label: "Agenda" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const { currentUser, isLoggedIn, isAdmin, logout } = useIPMData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-ipm-border">
      {/* Main Minimalist White Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Identity: PD IPM Kota Yogyakarta with Official Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-2"
          aria-label="Beranda PD IPM Kota Yogyakarta"
        >
          <img
            src="/images/logo-ipm-jogja-trimmed.png"
            alt="Logo IPM Jogja"
            className="h-9 sm:h-10 w-auto object-contain"
          />
          <span className="h-6 w-px bg-ipm-border" aria-hidden="true" />
          <span className="text-xs leading-tight text-ipm-dark">
            <span className="font-bold text-ipm-dark block">PD IPM Kota Yogyakarta</span>
            <span className="text-ipm-muted text-[11px] block">Ikatan Pelajar Muhammadiyah</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-4 py-2.5 min-h-[44px] inline-flex items-center text-sm transition-colors rounded-lg ${
                  active
                    ? "text-ipm-dark font-semibold"
                    : "text-ipm-muted font-normal hover:text-ipm-dark hover:bg-ipm-surface"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-ipm-gold"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Single Unified Action: Masuk / Portal */}
        <div className="hidden md:flex items-center gap-2.5">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs hover:bg-ipm-gold-hover transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dashboard Admin</span>
                </Link>
              ) : (
                <Link
                  href="/anggota"
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs hover:bg-ipm-gold-hover transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Portal Anggota ({currentUser.nama.split(" ")[0]})</span>
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                title="Keluar dari akun"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-medium text-ipm-muted hover:text-ipm-dark hover:bg-ipm-surface transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden xl:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs hover:bg-ipm-gold-hover transition-colors"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>Masuk / Daftar</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button (44x44px minimum target) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-ipm-border text-ipm-dark hover:bg-ipm-surface"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Navigasi Seluler"
          className="md:hidden bg-white border-b border-ipm-border px-4 pt-2 pb-5 space-y-1.5"
        >
          {NAV_LINKS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between px-4 py-3 min-h-[44px] rounded-lg text-sm ${
                  active
                    ? "bg-ipm-gold-tint text-ipm-dark font-semibold border border-ipm-gold"
                    : "text-ipm-muted font-normal hover:bg-ipm-surface hover:text-ipm-dark"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2">
            {isLoggedIn ? (
              <div className="space-y-2">
                {isAdmin ? (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs"
                  >
                    <Shield className="w-4 h-4" aria-hidden="true" />
                    <span>Dashboard Admin ({currentUser.nama})</span>
                  </Link>
                ) : (
                  <Link
                    href="/anggota"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs"
                  >
                    <UserCheck className="w-4 h-4" aria-hidden="true" />
                    <span>Portal Anggota ({currentUser.nama})</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-white border border-ipm-border text-ipm-muted font-semibold text-xs hover:text-ipm-dark"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Masuk / Daftar Akun</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
