"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  X,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { useIPMData } from "@/context/IPMDataContext";
import { BeritaItem } from "@/data/ipm-data";

const KATEGORI_LIST = [
  "Semua",
  "Organisasi",
  "Literasi",
  "Kaderisasi",
  "Aksi pelajar",
  "Inspirasi",
] as const;

export default function BeritaPage() {
  const { beritaList, addBerita, deleteBerita, isLoadingDB } = useIPMData();

  const [selectedKategori, setSelectedKategori] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<BeritaItem | null>(null);
  const [kirimModalOpen, setKirimModalOpen] = useState(false);
  const [kirimJudul, setKirimJudul] = useState("");
  const [kirimKategori, setKirimKategori] = useState<BeritaItem["kategori"]>("Literasi");
  const [kirimPenulis, setKirimPenulis] = useState("");
  const [kirimGambar, setKirimGambar] = useState("");
  const [kirimIsi, setKirimIsi] = useState("");
  const [kirimSukses, setKirimSukses] = useState(false);

  const featuredArticle = beritaList.find((b) => b.unggulan) || beritaList[0] || null;

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return beritaList.filter((b) => {
      if (selectedKategori !== "Semua" && b.kategori !== selectedKategori) {
        return false;
      }
      if (q) {
        const matchTitle = b.judul.toLowerCase().includes(q);
        const matchSummary = b.ringkasan.toLowerCase().includes(q);
        const matchCat = b.kategori.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchCat) return false;
      }
      return true;
    });
  }, [beritaList, selectedKategori, searchQuery]);

  const handleSubmitKarya = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kirimJudul.trim() || !kirimIsi.trim()) return;
    const paragraphs = kirimIsi
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    await addBerita(
      kirimJudul.trim(),
      kirimKategori,
      paragraphs[0] || kirimIsi.trim(),
      kirimPenulis.trim() || undefined,
      paragraphs,
      kirimGambar.trim() || undefined
    );
    setKirimSukses(true);
    setKirimJudul("");
    setKirimPenulis("");
    setKirimGambar("");
    setKirimIsi("");
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
              <span className="text-ipm-dark font-semibold">Berita &amp; artikel</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-deep">
                    KABAR &amp; CERITA • PD IPM KOTA YOGYAKARTA
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-semibold text-ipm-dark tracking-tight">
                  Cerita yang menggerakkan kita.
                </h1>
                <p className="text-base sm:text-lg text-ipm-muted max-w-2xl">
                  Dari ruang kelas hingga ruang gerakan. Ikuti liputan kegiatan, kabar cabang, ranting, dan gagasan pelajar berkemajuan se-Kota Yogyakarta.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setKirimModalOpen(true);
                  setKirimSukses(false);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs sm:text-sm font-semibold hover:bg-ipm-gold-hover transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Terbitkan Berita</span>
              </button>
            </div>
          </div>
        </section>

        {/* EDITORIAL BODY */}
        <section className="bg-white py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* FEATURED ARTICLE BANNER */}
            {featuredArticle && (
              <div className="rounded-2xl overflow-hidden bg-white text-ipm-dark border border-ipm-border grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-6 bg-ipm-surface">
                  <img
                    src={featuredArticle.gambar}
                    alt={featuredArticle.judul}
                    width={660}
                    height={420}
                    fetchPriority="high"
                    className="w-full h-full aspect-[660/420] object-cover"
                  />
                </div>

                <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-4">
                  <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-ipm-gold-tint border border-ipm-gold/50">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ipm-gold-badge">
                      TERBARU
                    </span>
                  </div>

                  <p className="text-xs font-medium uppercase tracking-wider text-ipm-muted">
                    {featuredArticle.kategori.toUpperCase()} •{" "}
                    {featuredArticle.tanggal.toUpperCase()}
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-semibold text-ipm-dark leading-tight tracking-tight">
                    {featuredArticle.judul}
                  </h2>

                  <p className="text-sm sm:text-base text-ipm-muted leading-relaxed">
                    {featuredArticle.ringkasan}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveArticle(featuredArticle)}
                      className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs sm:text-sm hover:bg-ipm-gold-hover transition-colors"
                    >
                      <span>Baca cerita</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="text-xs font-medium text-ipm-muted">
                      {featuredArticle.penulis} • {featuredArticle.waktuBaca}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SEARCH & CATEGORY FILTER */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-semibold text-ipm-dark tracking-tight">
                  Daftar berita &amp; artikel ({filteredArticles.length})
                </h2>

                <div className="relative w-full sm:w-80">
                  <label htmlFor="berita-search" className="sr-only">
                    Cari berita atau artikel
                  </label>
                  <Search
                    className="w-4 h-4 text-ipm-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="berita-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berita atau artikel..."
                    className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-sm text-ipm-dark placeholder:text-ipm-muted/75"
                  />
                </div>
              </div>

              <div
                role="tablist"
                aria-label="Kategori berita dan artikel"
                className="flex flex-wrap items-center gap-2"
              >
                {KATEGORI_LIST.map((kat) => {
                  const active = selectedKategori === kat;
                  return (
                    <button
                      key={kat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedKategori(kat)}
                      className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                        active
                          ? "bg-ipm-gold text-white"
                          : "bg-white text-ipm-muted border border-ipm-border hover:text-ipm-dark hover:bg-ipm-surface"
                      }`}
                    >
                      {kat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ARTICLE GRID / EMPTY STATE */}
            {isLoadingDB ? (
              <div className="rounded-2xl bg-ipm-surface border border-ipm-border p-10 text-center">
                <p className="text-sm font-medium text-ipm-muted">
                  Memuat berita dari database Supabase...
                </p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div
                role="status"
                className="rounded-2xl bg-ipm-surface border border-ipm-border p-10 text-center space-y-3"
              >
                <p className="text-lg font-semibold text-ipm-dark">
                  {beritaList.length === 0
                    ? "Belum ada berita di database"
                    : "Tidak ada artikel yang sesuai dengan filter Anda"}
                </p>
                <p className="text-xs text-ipm-muted max-w-md mx-auto">
                  {beritaList.length === 0
                    ? "Klik tombol Terbitkan Berita untuk menambahkan artikel pertama ke database Supabase."
                    : `Kata kunci "${searchQuery}" pada kategori ${selectedKategori} belum memiliki artikel.`}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  {beritaList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedKategori("Semua");
                      }}
                      className="px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-ipm-border text-ipm-dark text-xs font-semibold"
                    >
                      Tampilkan semua artikel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setKirimModalOpen(true);
                      setKirimSukses(false);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white text-xs font-semibold hover:bg-ipm-gold-hover"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Terbitkan Berita Baru</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    className="rounded-2xl bg-white border border-ipm-border overflow-hidden flex flex-col justify-between hover:border-ipm-gold transition-colors group"
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
                          <button
                            type="button"
                            onClick={() => setActiveArticle(art)}
                            className="text-left hover:underline"
                          >
                            {art.judul}
                          </button>
                        </h3>
                        <p className="text-xs text-ipm-muted line-clamp-2">
                          {art.ringkasan}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-ipm-muted">
                      <span>{art.penulis}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => deleteBerita(art.id)}
                          aria-label={`Hapus artikel ${art.judul}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#FFF5F5] text-ipm-muted hover:text-[#9B2C2C]"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveArticle(art)}
                          aria-label={`Baca artikel ${art.judul}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-ipm-gold-tint text-ipm-gold-deep"
                        >
                          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reader-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl border border-ipm-border max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-xl my-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-ipm-gold-soft text-ipm-gold-badge">
                  {activeArticle.kategori} • {activeArticle.tanggal}
                </span>
                <h2
                  id="reader-modal-title"
                  className="text-xl sm:text-2xl font-semibold text-ipm-dark"
                >
                  {activeArticle.judul}
                </h2>
                <p className="text-xs text-ipm-muted">
                  {activeArticle.penulis} • {activeArticle.waktuBaca}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Tutup artikel"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-ipm-border hover:bg-ipm-surface shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <img
              src={activeArticle.gambar}
              alt={activeArticle.judul}
              width={660}
              height={360}
              className="w-full h-auto aspect-[16/9] object-cover rounded-xl border border-ipm-border"
            />

            <div className="space-y-3 text-sm sm:text-base text-ipm-dark leading-relaxed">
              {activeArticle.isi.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-3 border-t border-ipm-border flex justify-between items-center">
              <button
                type="button"
                onClick={async () => {
                  await deleteBerita(activeArticle.id);
                  setActiveArticle(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9B2C2C] hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hapus berita</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs"
              >
                Tutup bacaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TERBITKAN BERITA MODAL */}
      {kirimModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kirim-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-2xl border border-ipm-border max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="kirim-modal-title" className="text-lg font-semibold text-ipm-dark">
                Terbitkan Berita ke Database
              </h2>
              <button
                type="button"
                onClick={() => setKirimModalOpen(false)}
                aria-label="Tutup formulir redaksi"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-ipm-border hover:bg-ipm-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {kirimSukses ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-ipm-gold-soft border border-ipm-gold text-xs font-medium text-ipm-dark flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-ipm-gold-badge shrink-0" />
                  <span>
                    Berita berhasil disimpan ke database Supabase!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setKirimModalOpen(false)}
                  className="w-full py-2.5 min-h-[44px] rounded-xl bg-ipm-gold text-white font-semibold text-xs"
                >
                  Lihat di Daftar Berita
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitKarya} className="space-y-3">
                <div>
                  <label
                    htmlFor="kirim-judul"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Judul Berita / Artikel
                  </label>
                  <input
                    id="kirim-judul"
                    type="text"
                    required
                    value={kirimJudul}
                    onChange={(e) => setKirimJudul(e.target.value)}
                    placeholder="Judul berita..."
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="kirim-kategori"
                      className="block text-xs font-semibold text-ipm-dark mb-1"
                    >
                      Kategori
                    </label>
                    <select
                      id="kirim-kategori"
                      value={kirimKategori}
                      onChange={(e) =>
                        setKirimKategori(e.target.value as BeritaItem["kategori"])
                      }
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm bg-white"
                    >
                      <option value="Literasi">Literasi</option>
                      <option value="Organisasi">Organisasi</option>
                      <option value="Kaderisasi">Kaderisasi</option>
                      <option value="Aksi pelajar">Aksi pelajar</option>
                      <option value="Inspirasi">Inspirasi</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="kirim-penulis"
                      className="block text-xs font-semibold text-ipm-dark mb-1"
                    >
                      Penulis / Pimpinan
                    </label>
                    <input
                      id="kirim-penulis"
                      type="text"
                      value={kirimPenulis}
                      onChange={(e) => setKirimPenulis(e.target.value)}
                      placeholder="Nama penulis / ranting"
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="kirim-gambar"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    URL Gambar Sampul (Opsional)
                  </label>
                  <input
                    id="kirim-gambar"
                    type="url"
                    value={kirimGambar}
                    onChange={(e) => setKirimGambar(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="kirim-isi"
                    className="block text-xs font-semibold text-ipm-dark mb-1"
                  >
                    Isi Berita
                  </label>
                  <textarea
                    id="kirim-isi"
                    rows={4}
                    required
                    value={kirimIsi}
                    onChange={(e) => setKirimIsi(e.target.value)}
                    placeholder="Tuliskan isi berita atau laporan kegiatan..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ipm-border text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setKirimModalOpen(false)}
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
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}
