import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  PimpinanItem,
  AnggotaItem,
  BeritaItem,
  AgendaItem,
  AktivitasAdmin,
  AkunUser,
} from "@/data/ipm-data";

const STORAGE_CONFIG_KEY = "ipm_supabase_config_v1";

export interface SupabaseRuntimeConfig {
  url: string;
  anonKey: string;
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = "";

export function getSupabaseConfig(): SupabaseRuntimeConfig {
  const envUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://imucshhraalggwojatgh.supabase.co";
  const envKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_Dip1Fa-UzeGf16zhtlR4ag_PVZbmpjv";

  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SupabaseRuntimeConfig;
        if (parsed.url && parsed.anonKey) {
          return parsed;
        }
      }
    } catch {
      // ignore storage read error
    }
  }

  return {
    url: envUrl,
    anonKey: envKey,
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      STORAGE_CONFIG_KEY,
      JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
    );
    cachedClient = null;
    cachedConfigKey = "";
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(
    url &&
      anonKey &&
      url.startsWith("http") &&
      !url.includes("your-project-id")
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (
    !url ||
    !anonKey ||
    !url.startsWith("http") ||
    url.includes("your-project-id")
  ) {
    return null;
  }

  const key = `${url}::${anonKey}`;
  if (!cachedClient || cachedConfigKey !== key) {
    cachedClient = createClient(url, anonKey);
    cachedConfigKey = key;
  }
  return cachedClient;
}

export function pimpinanToRow(item: PimpinanItem) {
  return {
    id: item.id,
    slug: item.slug,
    kode: item.kode,
    nama: item.nama,
    tingkatan: item.tingkatan,
    label_tingkatan: item.labelTingkatan,
    kecamatan: item.kecamatan,
    kabupaten_kota: item.kabupatenKota,
    provinsi: item.provinsi,
    pimpinan_induk: item.pimpinanInduk,
    pimpinan_induk_slug: item.pimpinanIndukSlug || null,
    jumlah_ranting_dinaungi: item.jumlahRantingDinaungi || 0,
    jumlah_anggota: item.jumlahAnggota,
    jumlah_pengurus: item.jumlahPengurus,
    periode: item.periode,
    status_verifikasi: item.statusVerifikasi,
    tanggal_diperbarui: item.tanggalDiperbarui,
    urutan_tanggal: item.urutanTanggal,
    tagline: item.tagline,
    deskripsi: item.deskripsi,
    alamat_sekretariat: item.alamatSekretariat,
    email: item.email,
    kelengkapan: item.kelengkapan,
    pengurus: item.pengurus,
  };
}

export function rowToPimpinan(row: Record<string, unknown>): PimpinanItem {
  return {
    id: String(row.id),
    slug: String(row.slug),
    kode: String(row.kode),
    nama: String(row.nama),
    tingkatan: row.tingkatan as PimpinanItem["tingkatan"],
    labelTingkatan: row.label_tingkatan as PimpinanItem["labelTingkatan"],
    kecamatan: String(row.kecamatan),
    kabupatenKota: String(row.kabupaten_kota),
    provinsi: String(row.provinsi),
    pimpinanInduk: String(row.pimpinan_induk),
    pimpinanIndukSlug: row.pimpinan_induk_slug
      ? String(row.pimpinan_induk_slug)
      : undefined,
    jumlahRantingDinaungi: Number(row.jumlah_ranting_dinaungi || 0),
    jumlahAnggota: Number(row.jumlah_anggota || 0),
    jumlahPengurus: Number(row.jumlah_pengurus || 0),
    periode: String(row.periode),
    statusVerifikasi: row.status_verifikasi as PimpinanItem["statusVerifikasi"],
    tanggalDiperbarui: String(row.tanggal_diperbarui),
    urutanTanggal: Number(row.urutan_tanggal || 20261107),
    tagline: String(row.tagline || ""),
    deskripsi: String(row.deskripsi || ""),
    alamatSekretariat: String(row.alamat_sekretariat || ""),
    email: String(row.email || ""),
    kelengkapan: (row.kelengkapan as PimpinanItem["kelengkapan"]) || {
      identitasWilayah: true,
      susunanPengurus: true,
      informasiKontak: true,
      dokumenPendukung: false,
    },
    pengurus: (row.pengurus as PimpinanItem["pengurus"]) || [],
  };
}

export function anggotaToRow(item: AnggotaItem) {
  return {
    id: item.id,
    nba: item.nba,
    nama: item.nama,
    email: item.email,
    telepon: item.telepon,
    kelas_angkatan: item.kelasAngkatan,
    ranting_slug: item.rantingSlug,
    ranting_nama: item.rantingNama,
    cabang_nama: item.cabangNama,
    bidang_minat: item.bidangMinat,
    status_keanggotaan: item.statusKeanggotaan,
    tanggal_bergabung: item.tanggalBergabung,
    bio: item.bio,
    agenda_diikuti: item.agendaDiikuti,
  };
}

export function rowToAnggota(row: Record<string, unknown>): AnggotaItem {
  return {
    id: String(row.id),
    nba: String(row.nba),
    nama: String(row.nama),
    email: String(row.email),
    telepon: String(row.telepon || ""),
    kelasAngkatan: String(row.kelas_angkatan || "Kelas XI"),
    rantingSlug: String(row.ranting_slug),
    rantingNama: String(row.ranting_nama),
    cabangNama: String(row.cabang_nama),
    bidangMinat: String(row.bidang_minat || "Literasi & Keilmuan"),
    statusKeanggotaan:
      (row.status_keanggotaan as AnggotaItem["statusKeanggotaan"]) || "Aktif",
    tanggalBergabung: String(row.tanggal_bergabung || "7 Nov 2026"),
    bio: String(row.bio || ""),
    agendaDiikuti: (row.agenda_diikuti as string[]) || [],
  };
}

export function beritaToRow(item: BeritaItem) {
  return {
    id: item.id,
    slug: item.slug,
    judul: item.judul,
    ringkasan: item.ringkasan,
    isi: item.isi,
    kategori: item.kategori,
    tanggal: item.tanggal,
    penulis: item.penulis,
    waktu_baca: item.waktuBaca,
    gambar: item.gambar,
    unggulan: Boolean(item.unggulan),
    ranting_terkait_slug: item.rantingTerkaitSlug || null,
  };
}

export function rowToBerita(row: Record<string, unknown>): BeritaItem {
  return {
    id: String(row.id),
    slug: String(row.slug),
    judul: String(row.judul),
    ringkasan: String(row.ringkasan || ""),
    isi: Array.isArray(row.isi)
      ? (row.isi as string[])
      : [String(row.ringkasan || "")],
    kategori:
      (row.kategori as BeritaItem["kategori"]) || "Organisasi",
    tanggal: String(row.tanggal || ""),
    penulis: String(row.penulis || ""),
    waktuBaca: String(row.waktu_baca || "3 menit baca"),
    gambar: String(
      row.gambar ||
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
    ),
    unggulan: Boolean(row.unggulan),
    rantingTerkaitSlug: row.ranting_terkait_slug
      ? String(row.ranting_terkait_slug)
      : undefined,
  };
}

export function agendaToRow(item: AgendaItem) {
  return {
    id: item.id,
    slug: item.slug,
    judul: item.judul,
    deskripsi: item.deskripsi,
    tanggal_hari: item.tanggalHari,
    bulan_tahun: item.bulanTahun,
    bulan_filter: item.bulanFilter,
    waktu_lengkap: item.waktuLengkap,
    jam: item.jam,
    lokasi: item.lokasi,
    wilayah: item.wilayah,
    penyelenggara: item.penyelenggara,
    penyelenggara_slug: item.penyelenggaraSlug,
    status: item.status,
    info_pendaftaran: item.infoPendaftaran,
    unggulan: Boolean(item.unggulan),
    gambar: item.gambar || null,
  };
}

export function rowToAgenda(row: Record<string, unknown>): AgendaItem {
  return {
    id: String(row.id),
    slug: String(row.slug),
    judul: String(row.judul),
    deskripsi: String(row.deskripsi || ""),
    tanggalHari: String(row.tanggal_hari || "01"),
    bulanTahun: String(row.bulan_tahun || "NOV 2026"),
    bulanFilter: String(row.bulan_filter || "November 2026"),
    waktuLengkap: String(row.waktu_lengkap || ""),
    jam: String(row.jam || ""),
    lokasi: String(row.lokasi || ""),
    wilayah: String(row.wilayah || ""),
    penyelenggara: String(row.penyelenggara || ""),
    penyelenggaraSlug: String(row.penyelenggara_slug || ""),
    status:
      (row.status as AgendaItem["status"]) || "Pendaftaran dibuka",
    infoPendaftaran: String(row.info_pendaftaran || ""),
    unggulan: Boolean(row.unggulan),
    gambar: row.gambar ? String(row.gambar) : undefined,
  };
}

export function aktivitasToRow(item: AktivitasAdmin) {
  return {
    id: item.id,
    inisial: item.inisial,
    nama: item.nama,
    aksi: item.aksi,
    waktu: item.waktu,
  };
}

export function rowToAktivitas(row: Record<string, unknown>): AktivitasAdmin {
  return {
    id: String(row.id),
    inisial: String(row.inisial || "IP"),
    nama: String(row.nama || ""),
    aksi: String(row.aksi || ""),
    waktu: String(row.waktu || ""),
  };
}

export function akunToRow(item: AkunUser) {
  const row: Record<string, unknown> = {
    id: item.id,
    nama: item.nama,
    email: item.email,
    role: item.role,
    label_peran: item.labelPeran,
    inisial: item.inisial,
    wilayah: item.wilayah,
    pimpinan_slug: item.pimpinanSlug || null,
    pimpinan_nama: item.pimpinanNama || null,
    anggota_id: item.anggotaId || null,
  };
  if (item.password) {
    row.password = item.password;
  }
  return row;
}

export function rowToAkun(row: Record<string, unknown>): AkunUser {
  return {
    id: String(row.id),
    nama: String(row.nama),
    email: String(row.email),
    role: (row.role as AkunUser["role"]) || "admin_ranting",
    labelPeran: String(row.label_peran || "Pengelola IPM"),
    inisial: String(row.inisial || "IP"),
    wilayah: String(row.wilayah || ""),
    pimpinanSlug: row.pimpinan_slug ? String(row.pimpinan_slug) : undefined,
    pimpinanNama: row.pimpinan_nama ? String(row.pimpinan_nama) : undefined,
    anggotaId: row.anggota_id ? String(row.anggota_id) : undefined,
    password: row.password ? String(row.password) : undefined,
  };
}


