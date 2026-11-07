import React from "react";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-ipm-surface text-ipm-dark border-t border-ipm-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-ipm-jogja-trimmed.png"
                alt="Logo IPM Jogja"
                className="h-10 w-auto object-contain"
              />
              <span className="h-6 w-px bg-ipm-border" aria-hidden="true" />
              <span className="text-xs leading-tight text-ipm-dark">
                <span className="font-bold text-ipm-dark block">PD IPM Kota Yogyakarta</span>
                <span className="text-ipm-muted text-[11px] block">Ikatan Pelajar Muhammadiyah</span>
              </span>
            </div>
            <p className="text-sm text-ipm-muted leading-relaxed max-w-sm">
              Portal resmi Pimpinan Daerah Ikatan Pelajar Muhammadiyah Kota Yogyakarta. Menghubungkan dan membina seluruh Pimpinan Cabang dan Pimpinan Ranting se-Kota Yogyakarta.
            </p>
            <p className="text-xs font-medium text-ipm-gold-deep">
              Pelajar berkemajuan • Berilmu, berakhlak, berdampak
            </p>
          </div>

          {/* Column 2: Jelajahi */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ipm-dark">
              Jelajahi
            </h2>
            <ul className="space-y-1.5 text-sm text-ipm-muted">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Tentang IPM
                </Link>
              </li>
              <li>
                <Link
                  href="/direktori"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Direktori Pimpinan
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Berita &amp; Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/agenda"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Agenda &amp; Kegiatan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Ruang Gerak & Akun */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ipm-dark">
              Layanan &amp; Akun
            </h2>
            <ul className="space-y-1.5 text-sm text-ipm-muted">
              <li>
                <Link
                  href="/anggota"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Portal Akun Anggota
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Login Admin Ranting &amp; Cabang
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/profil-pimpinan"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Update Profil Pimpinan
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang#kontak-organisasi"
                  className="inline-flex items-center min-h-[36px] hover:text-ipm-dark transition-colors"
                >
                  Kontak Sekretariat
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ipm-dark">
              Sekretariat PD IPM Kota Yogyakarta
            </h2>
            <ul className="space-y-2 text-sm text-ipm-muted">
              <li className="break-all">sekretariat@ipm.or.id</li>
              <li>Pusat Dakwah Muhammadiyah Kota Yogyakarta</li>
              <li>Kota Yogyakarta, DI Yogyakarta</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-ipm-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-ipm-muted">
          <p>© 2026 PD IPM Kota Yogyakarta • Pimpinan Daerah Ikatan Pelajar Muhammadiyah Kota Yogyakarta</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/admin/login"
              className="hover:text-ipm-dark transition-colors min-h-[36px] inline-flex items-center"
            >
              Masuk / Akun
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
