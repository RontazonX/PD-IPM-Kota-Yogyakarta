"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Save,
  Plus,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  Users,
  MapPin,
  Mail,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { useIPMData } from "@/context/IPMDataContext";
import { PengurusMember, StatusVerifikasi, TingkatanPimpinan } from "@/data/ipm-data";

export default function UpdateProfilPimpinanPage() {
  const { pimpinanList, adminUser, addPimpinan, updatePimpinan } = useIPMData();

  const isSuperAdmin = adminUser.role === "admin_utama";

  const accessiblePimpinan = pimpinanList.filter((p) => {
    // Admin Utama Daerah memiliki akses penuh ke SELURUH pimpinan (Daerah, Cabang, dan Ranting)
    if (isSuperAdmin) return true;
    if (adminUser.role === "admin_ranting" && adminUser.pimpinanSlug) {
      return p.slug === adminUser.pimpinanSlug;
    }
    if (adminUser.role === "admin_cabang" && adminUser.pimpinanSlug) {
      return (
        p.slug === adminUser.pimpinanSlug ||
        p.pimpinanIndukSlug === adminUser.pimpinanSlug ||
        p.pimpinanInduk === adminUser.pimpinanNama
      );
    }
    return true;
  });

  const defaultSelected =
    accessiblePimpinan.find((p) => p.slug === adminUser.pimpinanSlug) ||
    accessiblePimpinan[0] ||
    pimpinanList[0] ||
    null;

  const [selectedId, setSelectedId] = useState<string>(defaultSelected?.id || "__new__");

  // Mendukung parameter URL ?id=... atau ?slug=... untuk langsung membuka pimpinan tertentu
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get("id");
      const querySlug = params.get("slug");
      if (queryId) {
        const found = pimpinanList.find((p) => p.id === queryId);
        if (found) setSelectedId(found.id);
      } else if (querySlug) {
        const found = pimpinanList.find((p) => p.slug === querySlug);
        if (found) setSelectedId(found.id);
      }
    }
  }, [pimpinanList]);

  const activePimpinan =
    selectedId === "__new__"
      ? null
      : pimpinanList.find((p) => p.id === selectedId) || defaultSelected || null;

  const [tingkatan, setTingkatan] = useState<TingkatanPimpinan>(
    adminUser.role === "admin_cabang" ? "Cabang" : "Ranting"
  );
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [periode, setPeriode] = useState("2025-2027");
  const [kecamatan, setKecamatan] = useState("");
  const [kabupatenKota, setKabupatenKota] = useState("Kota Yogyakarta");
  const [provinsi, setProvinsi] = useState("DI Yogyakarta");
  const [pimpinanInduk, setPimpinanInduk] = useState("");
  const [jumlahAnggota, setJumlahAnggota] = useState(0);
  const [tagline, setTagline] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [alamatSekretariat, setAlamatSekretariat] = useState("");
  const [email, setEmail] = useState("");
  const [statusVerifikasi, setStatusVerifikasi] =
    useState<StatusVerifikasi>("Terverifikasi");
  const [kelengkapan, setKelengkapan] = useState({
    identitasWilayah: true,
    susunanPengurus: true,
    informasiKontak: true,
    dokumenPendukung: false,
  });
  const [pengurus, setPengurus] = useState<PengurusMember[]>([]);

  const [namaPengurusBaru, setNamaPengurusBaru] = useState("");
  const [jabatanPengurusBaru, setJabatanPengurusBaru] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const target =
      pimpinanList.find((p) => p.slug === adminUser.pimpinanSlug) ||
      pimpinanList[0];
    if (target && selectedId === "__new__" && pimpinanList.length > 0) {
      setSelectedId(target.id);
    }
  }, [adminUser.pimpinanSlug, pimpinanList, selectedId]);

  useEffect(() => {
    if (activePimpinan) {
      setTingkatan(activePimpinan.tingkatan);
      setNama(activePimpinan.nama);
      setKode(activePimpinan.kode);
      setPeriode(activePimpinan.periode);
      setKecamatan(activePimpinan.kecamatan);
      setKabupatenKota(activePimpinan.kabupatenKota);
      setProvinsi(activePimpinan.provinsi);
      setPimpinanInduk(activePimpinan.pimpinanInduk);
      setJumlahAnggota(activePimpinan.jumlahAnggota);
      setTagline(activePimpinan.tagline);
      setDeskripsi(activePimpinan.deskripsi);
      setAlamatSekretariat(activePimpinan.alamatSekretariat);
      setEmail(activePimpinan.email);
      setStatusVerifikasi(activePimpinan.statusVerifikasi);
      setKelengkapan(activePimpinan.kelengkapan);
      setPengurus(activePimpinan.pengurus);
    } else {
      setTingkatan(adminUser.role === "admin_cabang" ? "Cabang" : "Ranting");
      setNama(adminUser.pimpinanNama || "");
      setKode("");
      setPeriode("2025-2027");
      setKecamatan(adminUser.wilayah || "");
      setKabupatenKota("Kota Yogyakarta");
      setProvinsi("DI Yogyakarta");
      setPimpinanInduk("");
      setJumlahAnggota(0);
      setTagline("");
      setDeskripsi("");
      setAlamatSekretariat("");
      setEmail(adminUser.email || "");
      setStatusVerifikasi("Terverifikasi");
      setKelengkapan({
        identitasWilayah: true,
        susunanPengurus: true,
        informasiKontak: true,
        dokumenPendukung: false,
      });
      setPengurus([]);
    }
  }, [activePimpinan, adminUser]);

  const handleAddPengurus = () => {
    if (!namaPengurusBaru.trim() || !jabatanPengurusBaru.trim()) return;
    const inisial = namaPengurusBaru
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setPengurus((prev) => [
      ...prev,
      {
        inisial: inisial || "IP",
        nama: namaPengurusBaru.trim(),
        jabatan: jabatanPengurusBaru.trim(),
      },
    ]);
    setNamaPengurusBaru("");
    setJabatanPengurusBaru("");
  };

  const handleRemovePengurus = (idx: number) => {
    setPengurus((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    if (activePimpinan) {
      await updatePimpinan(activePimpinan.id, {
        tingkatan,
        labelTingkatan:
          tingkatan === "Cabang" ? "Pimpinan Cabang" : "Pimpinan Ranting",
        nama: nama.trim(),
        kode: kode.trim(),
        periode: periode.trim(),
        kecamatan: kecamatan.trim(),
        kabupatenKota: kabupatenKota.trim(),
        provinsi: provinsi.trim(),
        pimpinanInduk: pimpinanInduk.trim(),
        jumlahAnggota: Number(jumlahAnggota) || 0,
        tagline: tagline.trim(),
        deskripsi: deskripsi.trim(),
        alamatSekretariat: alamatSekretariat.trim(),
        email: email.trim(),
        statusVerifikasi,
        kelengkapan,
        pengurus,
      });
    } else {
      const created = await addPimpinan({
        kode:
          kode.trim() ||
          `${tingkatan === "Cabang" ? "PC" : "PR"}-${Date.now().toString().slice(-4)}`,
        nama: nama.trim(),
        tingkatan,
        labelTingkatan:
          tingkatan === "Cabang" ? "Pimpinan Cabang" : "Pimpinan Ranting",
        kecamatan: kecamatan.trim() || "Wilayah",
        kabupatenKota: kabupatenKota.trim() || "Kota Yogyakarta",
        provinsi: provinsi.trim() || "DI Yogyakarta",
        pimpinanInduk:
          pimpinanInduk.trim() ||
          (tingkatan === "Cabang" ? "PD IPM" : "PC IPM"),
        jumlahRantingDinaungi: 0,
        jumlahAnggota: Number(jumlahAnggota) || 0,
        jumlahPengurus: pengurus.length,
        periode: periode.trim() || "2025-2027",
        statusVerifikasi,
        tagline: tagline.trim(),
        deskripsi: deskripsi.trim(),
        alamatSekretariat: alamatSekretariat.trim(),
        email: email.trim(),
        kelengkapan,
        pengurus,
      });
      setSelectedId(created.id);
    }

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  };

  return (
    <AdminShell
      breadcrumb={
        adminUser.role === "admin_ranting"
          ? "Update Profil Ranting"
          : adminUser.role === "admin_cabang"
          ? "Update Profil Cabang"
          : "Update Profil Pimpinan"
      }
    >
      <div className="space-y-6 max-w-5xl">
        {/* Header & Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-ipm-dark tracking-tight">
              {activePimpinan
                ? `Update Profil ${activePimpinan.labelTingkatan}`
                : "Buat Profil Pimpinan Baru di Database"}
            </h1>
            <p className="text-xs sm:text-sm text-ipm-muted">
              Simpan dan perbarui identitas, deskripsi kegiatan, kontak sekretariat, serta susunan pengurus langsung ke database Supabase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setSelectedId("__new__")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-ipm-surface border border-ipm-border text-xs font-semibold text-ipm-dark hover:border-ipm-gold"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Buat Pimpinan Baru</span>
            </button>
            {activePimpinan && (
              <Link
                href={`/direktori/${activePimpinan.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-xs font-semibold text-ipm-dark hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors"
              >
                <span>Lihat Halaman Publik</span>
                <ArrowUpRight className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {/* Selector if there are existing Pimpinan records */}
        {pimpinanList.length > 0 && (
          <div className="rounded-2xl bg-white border border-ipm-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ipm-gold text-white shrink-0">
                <Building2 className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <label
                  htmlFor="select-pimpinan-target"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Pilih Pimpinan di Database
                </label>
                <p className="text-xs text-ipm-muted">
                  Pilih pimpinan yang ingin diperbarui atau pilih &ldquo;+ Buat Pimpinan Baru&rdquo;.
                </p>
              </div>
            </div>

            <select
              id="select-pimpinan-target"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl bg-ipm-surface border border-ipm-border text-xs sm:text-sm font-semibold text-ipm-dark sm:w-80"
            >
              {(accessiblePimpinan.length > 0 ? accessiblePimpinan : pimpinanList).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} ({p.tingkatan})
                </option>
              ))}
              <option value="__new__">+ Buat Pimpinan Baru di Database</option>
            </select>
          </div>
        )}

        {savedNotice && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-ipm-gold-soft border border-ipm-gold text-sm font-semibold text-ipm-dark flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-ipm-gold-badge shrink-0" />
              <span>
                Profil <strong>{nama}</strong> berhasil disimpan ke database Supabase!
              </span>
            </div>
            {activePimpinan && (
              <Link
                href={`/direktori/${activePimpinan.slug}`}
                className="text-xs font-semibold text-ipm-gold-badge underline shrink-0"
              >
                Buka profil publik →
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. IDENTITAS & WILAYAH */}
          <div className="rounded-2xl bg-white border border-ipm-border p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-ipm-border pb-4">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                <h2 className="text-base font-semibold text-ipm-dark">
                  Identitas &amp; Struktur Organisasi
                </h2>
              </div>
              <select
                aria-label="Tingkatan Pimpinan"
                value={tingkatan}
                onChange={(e) => setTingkatan(e.target.value as TingkatanPimpinan)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-ipm-gold-tint text-ipm-gold-badge border border-ipm-gold/60"
              >
                <option value="Ranting">Ranting</option>
                <option value="Cabang">Cabang</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label
                  htmlFor="prof-nama"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Nama Pimpinan
                </label>
                <input
                  id="prof-nama"
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: PR IPM SMA Muhammadiyah 1 / PC IPM Gondokusuman"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="prof-kode"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Kode Pimpinan
                </label>
                <input
                  id="prof-kode"
                  type="text"
                  required
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="Contoh: PR-YK-001"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="prof-kecamatan"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Wilayah / Kecamatan
                </label>
                <input
                  id="prof-kecamatan"
                  type="text"
                  required
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  placeholder="Nama kecamatan"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="prof-induk"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  {tingkatan === "Ranting"
                    ? "Pimpinan Cabang Induk"
                    : "Pimpinan Daerah Induk"}
                </label>
                <input
                  id="prof-induk"
                  type="text"
                  required
                  value={pimpinanInduk}
                  onChange={(e) => setPimpinanInduk(e.target.value)}
                  placeholder={
                    tingkatan === "Ranting"
                      ? "Contoh: PC IPM Gondokusuman"
                      : "Contoh: PD IPM Kota Yogyakarta"
                  }
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="prof-periode"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    Periode
                  </label>
                  <input
                    id="prof-periode"
                    type="text"
                    required
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="prof-anggota"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    Jumlah Anggota
                  </label>
                  <input
                    id="prof-anggota"
                    type="number"
                    min={0}
                    required
                    value={jumlahAnggota}
                    onChange={(e) => setJumlahAnggota(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. PROFIL, TAGLINE, DAN KONTAK SEKRETARIAT */}
          <div className="rounded-2xl bg-white border border-ipm-border p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-ipm-border pb-4">
              <Mail className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
              <h2 className="text-base font-semibold text-ipm-dark">
                Deskripsi Gerakan &amp; Kontak Sekretariat
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="prof-tagline"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Tagline / Semboyan Pimpinan
                </label>
                <input
                  id="prof-tagline"
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Contoh: Belajar memimpin, berani berkarya."
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="prof-deskripsi"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Deskripsi Profil &amp; Fokus Kegiatan
                </label>
                <textarea
                  id="prof-deskripsi"
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan profil ranting/cabang dan fokus program..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ipm-border text-sm text-ipm-dark"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="prof-alamat"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    Alamat Sekretariat / Sekolah
                  </label>
                  <input
                    id="prof-alamat"
                    type="text"
                    value={alamatSekretariat}
                    onChange={(e) => setAlamatSekretariat(e.target.value)}
                    placeholder="Alamat lengkap sekretariat"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="prof-email"
                    className="block text-xs font-semibold text-ipm-dark"
                  >
                    Email Resmi Pimpinan
                  </label>
                  <input
                    id="prof-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@ipm.or.id"
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm text-ipm-dark"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. SUSUNAN PENGURUS PIMPINAN */}
          <div className="rounded-2xl bg-white border border-ipm-border p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-ipm-border pb-4">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-ipm-gold-deep" aria-hidden="true" />
                <h2 className="text-base font-semibold text-ipm-dark">
                  Susunan Pengurus ({pengurus.length} Pengurus)
                </h2>
              </div>
              <span className="text-xs text-ipm-muted">Periode {periode}</span>
            </div>

            {pengurus.length === 0 ? (
              <p className="text-xs text-ipm-muted">
                Belum ada pengurus yang ditambahkan. Isi nama dan jabatan di bawah lalu klik Tambah.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pengurus.map((org, index) => (
                  <div
                    key={`${org.nama}-${index}`}
                    className="p-3.5 rounded-xl bg-ipm-surface border border-ipm-border flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ipm-gold text-white font-semibold text-xs shrink-0">
                        {org.inisial.toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ipm-dark truncate">
                          {org.nama}
                        </p>
                        <p className="text-[11px] text-ipm-muted truncate">
                          {org.jabatan}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePengurus(index)}
                      aria-label={`Hapus pengurus ${org.nama}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-ipm-muted hover:text-[#9B2C2C] hover:bg-white transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Pengurus Row */}
            <div className="pt-2 border-t border-ipm-border grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5 space-y-1">
                <label
                  htmlFor="new-pengurus-nama"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Nama Pengurus Baru
                </label>
                <input
                  id="new-pengurus-nama"
                  type="text"
                  value={namaPengurusBaru}
                  onChange={(e) => setNamaPengurusBaru(e.target.value)}
                  placeholder="Nama lengkap pengurus"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                />
              </div>

              <div className="sm:col-span-5 space-y-1">
                <label
                  htmlFor="new-pengurus-jabatan"
                  className="block text-xs font-semibold text-ipm-dark"
                >
                  Jabatan / Bidang
                </label>
                <input
                  id="new-pengurus-jabatan"
                  type="text"
                  value={jabatanPengurusBaru}
                  onChange={(e) => setJabatanPengurusBaru(e.target.value)}
                  placeholder="Contoh: Ketua Umum / Sekretaris Umum"
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddPengurus}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-ipm-surface border border-ipm-border text-xs font-semibold text-ipm-dark hover:border-ipm-gold hover:bg-ipm-gold-tint transition-colors"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. KELENGKAPAN DOKUMEN & SIMPAN */}
          <div className="rounded-2xl bg-white border border-ipm-border p-6 space-y-4">
            <h2 className="text-base font-semibold text-ipm-dark">
              Checklist Kelengkapan Profil Pimpinan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-ipm-surface border border-ipm-border font-medium text-ipm-dark">
                <input
                  type="checkbox"
                  checked={kelengkapan.identitasWilayah}
                  onChange={(e) =>
                    setKelengkapan({
                      ...kelengkapan,
                      identitasWilayah: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-ipm-gold"
                />
                <span>Identitas &amp; Wilayah</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-ipm-surface border border-ipm-border font-medium text-ipm-dark">
                <input
                  type="checkbox"
                  checked={kelengkapan.susunanPengurus}
                  onChange={(e) =>
                    setKelengkapan({
                      ...kelengkapan,
                      susunanPengurus: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-ipm-gold"
                />
                <span>Susunan Pengurus</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-ipm-surface border border-ipm-border font-medium text-ipm-dark">
                <input
                  type="checkbox"
                  checked={kelengkapan.informasiKontak}
                  onChange={(e) =>
                    setKelengkapan({
                      ...kelengkapan,
                      informasiKontak: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-ipm-gold"
                />
                <span>Informasi Kontak</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-ipm-surface border border-ipm-border font-medium text-ipm-dark">
                <input
                  type="checkbox"
                  checked={kelengkapan.dokumenPendukung}
                  onChange={(e) =>
                    setKelengkapan({
                      ...kelengkapan,
                      dokumenPendukung: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded accent-ipm-gold"
                />
                <span>SK &amp; Dokumen Pendukung</span>
              </label>
            </div>

            <div className="pt-3 border-t border-ipm-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="status-verif-select"
                  className="text-xs font-semibold text-ipm-dark"
                >
                  Status Verifikasi:
                </label>
                <select
                  id="status-verif-select"
                  value={statusVerifikasi}
                  onChange={(e) =>
                    setStatusVerifikasi(e.target.value as StatusVerifikasi)
                  }
                  className="px-3 py-2 min-h-[40px] rounded-xl bg-ipm-surface border border-ipm-border text-xs font-semibold text-ipm-dark"
                >
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Menunggu">Menunggu</option>
                  <option value="Draf">Draf</option>
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-xl bg-ipm-gold text-white font-semibold text-sm hover:bg-ipm-gold-hover transition-colors"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>
                  {activePimpinan
                    ? "Simpan Perubahan ke Database"
                    : "Buat & Simpan Pimpinan ke Database"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
