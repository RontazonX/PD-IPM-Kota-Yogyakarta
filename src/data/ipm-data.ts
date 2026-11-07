export type TingkatanPimpinan = "Cabang" | "Ranting";
export type StatusVerifikasi = "Terverifikasi" | "Menunggu" | "Draf";

export interface PengurusMember {
  inisial: string;
  nama: string;
  jabatan: string;
}

export interface PimpinanItem {
  id: string;
  slug: string;
  kode: string;
  nama: string;
  tingkatan: TingkatanPimpinan;
  labelTingkatan: "Pimpinan Cabang" | "Pimpinan Ranting";
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  pimpinanInduk: string;
  pimpinanIndukSlug?: string;
  jumlahRantingDinaungi?: number;
  jumlahAnggota: number;
  jumlahPengurus: number;
  periode: string;
  statusVerifikasi: StatusVerifikasi;
  tanggalDiperbarui: string;
  urutanTanggal: number;
  tagline: string;
  deskripsi: string;
  alamatSekretariat: string;
  email: string;
  kelengkapan: {
    identitasWilayah: boolean;
    susunanPengurus: boolean;
    informasiKontak: boolean;
    dokumenPendukung: boolean;
  };
  pengurus: PengurusMember[];
}

export interface BeritaItem {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  isi: string[];
  kategori: "Organisasi" | "Literasi" | "Kaderisasi" | "Aksi pelajar" | "Inspirasi";
  tanggal: string;
  penulis: string;
  waktuBaca: string;
  gambar: string;
  unggulan?: boolean;
  rantingTerkaitSlug?: string;
}

export interface AgendaItem {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  tanggalHari: string;
  bulanTahun: string;
  bulanFilter: string;
  waktuLengkap: string;
  jam: string;
  lokasi: string;
  wilayah: string;
  penyelenggara: string;
  penyelenggaraSlug: string;
  status: "Pendaftaran dibuka" | "Segera hadir" | "Selesai";
  infoPendaftaran: string;
  unggulan?: boolean;
  gambar?: string;
}

export interface AktivitasAdmin {
  id: string;
  inisial: string;
  nama: string;
  aksi: string;
  waktu: string;
}

export type RoleAkun = "admin_utama" | "admin_cabang" | "admin_ranting" | "anggota";

export interface AkunUser {
  id: string;
  nama: string;
  email: string;
  role: RoleAkun;
  labelPeran: string;
  inisial: string;
  wilayah: string;
  pimpinanSlug?: string;
  pimpinanNama?: string;
  anggotaId?: string;
  password?: string;
}

export interface AnggotaItem {
  id: string;
  nba: string;
  nama: string;
  email: string;
  telepon: string;
  kelasAngkatan: string;
  rantingSlug: string;
  rantingNama: string;
  cabangNama: string;
  bidangMinat: string;
  statusKeanggotaan: "Aktif" | "Menunggu Verifikasi" | "Alumni";
  tanggalBergabung: string;
  bio: string;
  agendaDiikuti: string[];
}

export const INITIAL_PIMPINAN_DATA: PimpinanItem[] = [];
export const BERITA_DATA: BeritaItem[] = [];
export const AGENDA_DATA: AgendaItem[] = [];
export const INITIAL_AKTIVITAS_ADMIN: AktivitasAdmin[] = [];
export const INITIAL_AKUN_USERS: AkunUser[] = [];
export const INITIAL_ANGGOTA_DATA: AnggotaItem[] = [];
