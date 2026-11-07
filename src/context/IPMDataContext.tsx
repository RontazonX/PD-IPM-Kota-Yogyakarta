"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  PimpinanItem,
  BeritaItem,
  AgendaItem,
  AktivitasAdmin,
  StatusVerifikasi,
  AkunUser,
  AnggotaItem,
  RoleAkun,
} from "@/data/ipm-data";
import {
  getSupabaseClient,
  isSupabaseConfigured,
  saveSupabaseConfig,
  getSupabaseConfig,
  pimpinanToRow,
  rowToPimpinan,
  anggotaToRow,
  rowToAnggota,
  beritaToRow,
  rowToBerita,
  agendaToRow,
  rowToAgenda,
  aktivitasToRow,
  rowToAktivitas,
  akunToRow,
  rowToAkun,
} from "@/lib/supabase";

interface IPMDataContextValue {
  pimpinanList: PimpinanItem[];
  beritaList: BeritaItem[];
  agendaList: AgendaItem[];
  aktivitasList: AktivitasAdmin[];
  anggotaList: AnggotaItem[];
  akunUsers: AkunUser[];
  currentUser: AkunUser;
  currentAnggota: AnggotaItem | null;
  isLoadingDB: boolean;
  supabaseStatus: "local_cache" | "connecting" | "connected" | "schema_missing" | "error";
  supabaseUrl: string;
  adminUser: {
    nama: string;
    email: string;
    peran: string;
    role: RoleAkun;
    inisial: string;
    wilayah: string;
    pimpinanSlug?: string;
    pimpinanNama?: string;
  };
  isLoggedIn: boolean;
  isAdmin: boolean;
  isAnggota: boolean;
  logout: () => void;
  loginUnified: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; role?: RoleAkun; error?: string }>;
  refreshDatabase: () => Promise<boolean>;
  switchAccount: (accountId: string) => void;
  loginWithEmail: (
    email: string,
    roleOverride?: RoleAkun,
    pimpinanSlugOverride?: string,
    namaOverride?: string,
    wilayahOverride?: string,
    newPimpinanNama?: string
  ) => Promise<AkunUser>;
  addPimpinan: (
    item: Omit<PimpinanItem, "id" | "slug" | "urutanTanggal" | "tanggalDiperbarui">
  ) => Promise<PimpinanItem>;
  updatePimpinan: (id: string, updates: Partial<PimpinanItem>) => Promise<void>;
  deletePimpinan: (id: string) => Promise<void>;
  updateStatusVerifikasi: (id: string, status: StatusVerifikasi) => Promise<void>;
  importPimpinanBatch: (items: PimpinanItem[]) => Promise<void>;
  addBerita: (
    judul: string,
    kategori: BeritaItem["kategori"],
    ringkasan: string,
    penulisOverride?: string,
    isiParagraf?: string[],
    gambarUrl?: string
  ) => Promise<void>;
  deleteBerita: (id: string) => Promise<void>;
  addAgenda: (
    judul: string,
    tanggalHari: string,
    bulanTahun: string,
    lokasi: string,
    penyelenggara: string,
    deskripsi?: string,
    jam?: string,
    wilayah?: string
  ) => Promise<void>;
  deleteAgenda: (id: string) => Promise<void>;
  registerAnggota: (input: {
    nama: string;
    email: string;
    telepon: string;
    kelasAngkatan: string;
    rantingSlug: string;
    rantingNamaManual?: string;
    cabangNamaManual?: string;
    bidangMinat: string;
    bio: string;
  }) => Promise<AnggotaItem>;
  updateAnggota: (id: string, updates: Partial<AnggotaItem>) => Promise<void>;
  deleteAnggota: (id: string) => Promise<void>;
  verifyAnggotaStatus: (id: string, status: AnggotaItem["statusKeanggotaan"]) => Promise<void>;
  toggleAgendaAnggota: (anggotaId: string, agendaId: string) => Promise<void>;
  connectSupabase: (url: string, anonKey: string) => Promise<boolean>;
  syncAllToSupabase: () => Promise<boolean>;
}

const SESSION_USER_KEY = "ipm_session_active_user_id";
const LEGACY_DUMMY_KEYS = [
  "ipm_db_pimpinan_v2",
  "ipm_db_anggota_v2",
  "ipm_db_berita_v2",
  "ipm_db_agenda_v2",
  "ipm_db_aktivitas_v2",
  "ipm_db_akun_v2",
  "ipm_db_current_user_id_v2",
];

const GUEST_USER: AkunUser = {
  id: "",
  nama: "Tamu",
  email: "",
  role: "anggota",
  labelPeran: "Pengunjung",
  inisial: "TM",
  wilayah: "",
};

const IPMDataContext = createContext<IPMDataContextValue | undefined>(undefined);

export function IPMDataProvider({ children }: { children: React.ReactNode }) {
  const [pimpinanList, setPimpinanList] = useState<PimpinanItem[]>([]);
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);
  const [aktivitasList, setAktivitasList] = useState<AktivitasAdmin[]>([]);
  const [anggotaList, setAnggotaList] = useState<AnggotaItem[]>([]);
  const [akunUsers, setAkunUsers] = useState<AkunUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isLoadingDB, setIsLoadingDB] = useState<boolean>(true);
  const [supabaseStatus, setSupabaseStatus] = useState<
    "local_cache" | "connecting" | "connected" | "schema_missing" | "error"
  >("connecting");
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");

  const refreshDatabase = useCallback(async () => {
    const cfg = getSupabaseConfig();
    setSupabaseUrl(cfg.url || "");
    if (!isSupabaseConfigured()) {
      setSupabaseStatus("error");
      setIsLoadingDB(false);
      return false;
    }

    const client = getSupabaseClient();
    if (!client) {
      setSupabaseStatus("error");
      setIsLoadingDB(false);
      return false;
    }

    setSupabaseStatus("connecting");
    setIsLoadingDB(true);
    try {
      const [pimpRes, angRes, akunRes, berRes, agRes, aktRes] = await Promise.all([
        client.from("pimpinan").select("*").order("urutan_tanggal", { ascending: false }),
        client.from("anggota").select("*").order("created_at", { ascending: false }),
        client.from("akun_users").select("*").order("created_at", { ascending: true }),
        client.from("berita").select("*").order("created_at", { ascending: false }),
        client.from("agenda").select("*").order("created_at", { ascending: false }),
        client.from("aktivitas_admin").select("*").order("created_at", { ascending: false }).limit(20),
      ]);

      if (pimpRes.error) {
        if (
          pimpRes.error.code === "PGRST205" ||
          pimpRes.error.message?.includes("Could not find the table")
        ) {
          setSupabaseStatus("schema_missing");
        } else {
          setSupabaseStatus("error");
        }
        setIsLoadingDB(false);
        return false;
      }

      setPimpinanList(
        (pimpRes.data || []).map((r) => rowToPimpinan(r as Record<string, unknown>))
      );
      setAnggotaList(
        (angRes.data || []).map((r) => rowToAnggota(r as Record<string, unknown>))
      );
      setAkunUsers(
        (akunRes.data || []).map((r) => rowToAkun(r as Record<string, unknown>))
      );
      setBeritaList(
        (berRes.data || []).map((r) => rowToBerita(r as Record<string, unknown>))
      );
      setAgendaList(
        (agRes.data || []).map((r) => rowToAgenda(r as Record<string, unknown>))
      );
      setAktivitasList(
        (aktRes.data || []).map((r) => rowToAktivitas(r as Record<string, unknown>))
      );

      setSupabaseStatus("connected");
      setIsLoadingDB(false);
      return true;
    } catch {
      setSupabaseStatus("error");
      setIsLoadingDB(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Hapus seluruh cache dummy lama dari localStorage
        LEGACY_DUMMY_KEYS.forEach((k) => window.localStorage.removeItem(k));
        const savedSessionUserId = window.localStorage.getItem(SESSION_USER_KEY);
        if (savedSessionUserId) {
          setCurrentUserId(savedSessionUserId);
        }
      } catch {
        // ignore storage error
      }
    }
    refreshDatabase();
  }, [refreshDatabase]);

  useEffect(() => {
    if (typeof window === "undefined" || !currentUserId) return;
    try {
      window.localStorage.setItem(SESSION_USER_KEY, currentUserId);
    } catch {
      // ignore
    }
  }, [currentUserId]);

  const currentUser: AkunUser =
    (currentUserId && akunUsers.find((u) => u.id === currentUserId)) ||
    GUEST_USER;

  const isLoggedIn = Boolean(currentUser.id && currentUser.email);
  const isAdmin =
    isLoggedIn &&
    ["admin_utama", "admin_cabang", "admin_ranting"].includes(
      currentUser.role
    );
  const isAnggota = isLoggedIn && currentUser.role === "anggota";

  const currentAnggota: AnggotaItem | null =
    (isLoggedIn && currentUser.email
      ? anggotaList.find(
          (a) =>
            (currentUser.anggotaId && a.id === currentUser.anggotaId) ||
            a.email.toLowerCase() === currentUser.email.toLowerCase()
        )
      : null) || null;

  const logout = () => {
    setCurrentUserId("");
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(SESSION_USER_KEY);
      } catch {
        // ignore
      }
    }
  };

  const loginUnified: IPMDataContextValue["loginUnified"] = async (
    email,
    password
  ) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      return { success: false, error: "Mohon masukkan alamat email Anda." };
    }

    // 1. Cek apakah ada di tabel akun_users
    const existing = akunUsers.find(
      (u) => u.email.toLowerCase() === normalized
    );
    if (existing) {
      // Verifikasi kata sandi jika diatur
      const expectedPassword =
        existing.password ||
        (normalized === "mikailivan851@gmail.com" ? "1234@" : undefined);
      if (expectedPassword && password && password !== expectedPassword) {
        return { success: false, error: "Kata sandi yang Anda masukkan salah." };
      }

      setCurrentUserId(existing.id);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(SESSION_USER_KEY, existing.id);
        } catch {
          // ignore
        }
      }
      await logAktivitas(`Masuk ke sistem: ${existing.nama} (${existing.labelPeran})`);
      return { success: true, role: existing.role };
    }

    // 2. Jika email adalah admin resmi (admin@ipm.or.id, mikailivan851@gmail.com) dan belum terdaftar di akun_users
    const isMasterAdminEmail =
      normalized === "admin@ipm.or.id" ||
      normalized === "sekretariat@ipm.or.id" ||
      normalized === "mikailivan851@gmail.com";

    if (isMasterAdminEmail) {
      if (normalized === "mikailivan851@gmail.com" && password && password !== "1234@") {
        return { success: false, error: "Kata sandi yang Anda masukkan salah." };
      }

      const rootAdmin: AkunUser = {
        id: `usr-admin-${normalized === "mikailivan851@gmail.com" ? "mikail" : Date.now()}`,
        nama:
          normalized === "mikailivan851@gmail.com"
            ? "Mikail Ivan"
            : "Administrator Daerah",
        email: normalized,
        role: "admin_utama",
        labelPeran: "Admin Utama Daerah",
        inisial: normalized === "mikailivan851@gmail.com" ? "MI" : "AD",
        wilayah: "Kota Yogyakarta",
        pimpinanNama: "PD IPM Kota Yogyakarta",
        password: normalized === "mikailivan851@gmail.com" ? "1234@" : undefined,
      };

      const client = getSupabaseClient();
      if (client) {
        await client.from("akun_users").upsert(akunToRow(rootAdmin));
      }

      setAkunUsers((prev) => [rootAdmin, ...prev]);
      setCurrentUserId(rootAdmin.id);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(SESSION_USER_KEY, rootAdmin.id);
        } catch {
          // ignore
        }
      }
      await logAktivitas(`Inisialisasi akun Administrator: ${rootAdmin.nama}`);
      return { success: true, role: "admin_utama" };
    }

    // 3. Cek apakah email terdaftar di tabel anggota
    const foundAnggota = anggotaList.find(
      (a) => a.email.toLowerCase() === normalized
    );
    if (foundAnggota) {
      const userAnggota: AkunUser = {
        id: `usr-${Date.now()}`,
        nama: foundAnggota.nama,
        email: foundAnggota.email,
        role: "anggota",
        labelPeran: "Anggota Pelajar IPM",
        inisial:
          foundAnggota.nama
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "AG",
        wilayah: foundAnggota.cabangNama,
        pimpinanSlug: foundAnggota.rantingSlug,
        pimpinanNama: foundAnggota.rantingNama,
        anggotaId: foundAnggota.id,
      };

      const client = getSupabaseClient();
      if (client) {
        await client.from("akun_users").upsert(akunToRow(userAnggota));
      }

      setAkunUsers((prev) => [...prev, userAnggota]);
      setCurrentUserId(userAnggota.id);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(SESSION_USER_KEY, userAnggota.id);
        } catch {
          // ignore
        }
      }
      await logAktivitas(`Masuk ke sistem: Anggota Pelajar ${foundAnggota.nama}`);
      return { success: true, role: "anggota" };
    }

    // 4. Jika tidak ditemukan: tolak
    return {
      success: false,
      error:
        "Email belum terdaftar di sistem. Jika Anda anggota pelajar baru, silakan gunakan tab 'Daftar Akun Anggota'. Untuk akun pengelola ranting/cabang, hubungi Administrator IPM.",
    };
  };

  const adminUser = {
    nama: currentUser.nama,
    email: currentUser.email,
    peran: currentUser.labelPeran,
    role: currentUser.role,
    inisial: currentUser.inisial,
    wilayah: currentUser.wilayah,
    pimpinanSlug: currentUser.pimpinanSlug,
    pimpinanNama: currentUser.pimpinanNama,
  };

  const logAktivitas = async (aksi: string, actor?: { inisial: string; nama: string }) => {
    const baru: AktivitasAdmin = {
      id: `akt-${Date.now()}`,
      inisial: actor?.inisial || currentUser.inisial || "IP",
      nama: actor?.nama || currentUser.nama || "Admin",
      aksi,
      waktu: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setAktivitasList((prev) => [baru, ...prev.slice(0, 19)]);

    const client = getSupabaseClient();
    if (client) {
      await client.from("aktivitas_admin").insert(aktivitasToRow(baru));
    }
  };

  const switchAccount = (accountId: string) => {
    const found = akunUsers.find((u) => u.id === accountId);
    if (found) {
      setCurrentUserId(found.id);
    }
  };

  const addPimpinan: IPMDataContextValue["addPimpinan"] = async (item) => {
    const slug = item.nama
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const baru: PimpinanItem = {
      ...item,
      id: `${item.tingkatan === "Cabang" ? "pc" : "pr"}-${Date.now()}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      tanggalDiperbarui: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      urutanTanggal: Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
    };

    const client = getSupabaseClient();
    if (client) {
      await client.from("pimpinan").upsert(pimpinanToRow(baru));
    }

    setPimpinanList((prev) => [baru, ...prev]);
    await logAktivitas(`Menambahkan ${baru.nama} ke database`);
    return baru;
  };

  const loginWithEmail: IPMDataContextValue["loginWithEmail"] = async (
    email,
    roleOverride,
    pimpinanSlugOverride,
    namaOverride,
    wilayahOverride,
    newPimpinanNama
  ) => {
    const normalized = email.trim().toLowerCase();
    const client = getSupabaseClient();

    let targetSlug = pimpinanSlugOverride;
    let targetPimpinan = pimpinanList.find((p) => p.slug === targetSlug);

    // Jika Admin Ranting / Cabang membuat Pimpinan baru langsung saat login/registrasi
    if (
      !targetPimpinan &&
      newPimpinanNama &&
      newPimpinanNama.trim() &&
      (roleOverride === "admin_ranting" || roleOverride === "admin_cabang")
    ) {
      const isCabang = roleOverride === "admin_cabang";
      const createdPimp = await addPimpinan({
        kode: `${isCabang ? "PC" : "PR"}-${Date.now().toString().slice(-4)}`,
        nama: newPimpinanNama.trim(),
        tingkatan: isCabang ? "Cabang" : "Ranting",
        labelTingkatan: isCabang ? "Pimpinan Cabang" : "Pimpinan Ranting",
        kecamatan: wilayahOverride?.trim() || "Wilayah Utama",
        kabupatenKota: "Kota Yogyakarta",
        provinsi: "DI Yogyakarta",
        pimpinanInduk: isCabang ? "PD IPM" : "PC IPM",
        jumlahRantingDinaungi: 0,
        jumlahAnggota: 0,
        jumlahPengurus: 1,
        periode: "2025-2027",
        statusVerifikasi: "Terverifikasi",
        tagline: "",
        deskripsi: "",
        alamatSekretariat: "",
        email: normalized,
        kelengkapan: {
          identitasWilayah: true,
          susunanPengurus: false,
          informasiKontak: true,
          dokumenPendukung: false,
        },
        pengurus: namaOverride
          ? [
              {
                inisial: namaOverride
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
                nama: namaOverride.trim(),
                jabatan: "Ketua Umum",
              },
            ]
          : [],
      });
      targetPimpinan = createdPimp;
      targetSlug = createdPimp.slug;
    }

    const existing = akunUsers.find((u) => u.email.toLowerCase() === normalized);
    const role: RoleAkun = roleOverride || existing?.role || "admin_ranting";
    const labelMap: Record<RoleAkun, string> = {
      admin_utama: "Admin Utama Daerah",
      admin_cabang: "Admin Pimpinan Cabang",
      admin_ranting: "Admin Pimpinan Ranting",
      anggota: "Anggota Pelajar IPM",
    };

    const rawName =
      namaOverride?.trim() ||
      existing?.nama ||
      normalized
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const inisial =
      rawName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "IP";

    const akunRecord: AkunUser = {
      id: existing?.id || `usr-${Date.now()}`,
      nama: rawName,
      email: normalized,
      role,
      labelPeran: labelMap[role],
      inisial,
      wilayah:
        wilayahOverride?.trim() ||
        targetPimpinan?.kecamatan ||
        existing?.wilayah ||
        "Kota Yogyakarta",
      pimpinanSlug: targetPimpinan?.slug || targetSlug || existing?.pimpinanSlug,
      pimpinanNama:
        targetPimpinan?.nama ||
        newPimpinanNama?.trim() ||
        existing?.pimpinanNama ||
        (role === "admin_utama" ? "PD IPM" : undefined),
      anggotaId: existing?.anggotaId,
    };

    if (client) {
      await client.from("akun_users").upsert(akunToRow(akunRecord));
    }

    setAkunUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === akunRecord.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = akunRecord;
        return copy;
      }
      return [...prev, akunRecord];
    });
    setCurrentUserId(akunRecord.id);
    return akunRecord;
  };

  const updatePimpinan: IPMDataContextValue["updatePimpinan"] = async (id, updates) => {
    const existing = pimpinanList.find((p) => p.id === id);
    if (!existing) return;

    const updatedRecord: PimpinanItem = {
      ...existing,
      ...updates,
      jumlahPengurus: updates.pengurus
        ? updates.pengurus.length
        : updates.jumlahPengurus ?? existing.jumlahPengurus,
      tanggalDiperbarui: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      urutanTanggal: Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
    };

    const client = getSupabaseClient();
    if (client) {
      await client.from("pimpinan").upsert(pimpinanToRow(updatedRecord));
    }

    setPimpinanList((prev) => prev.map((p) => (p.id === id ? updatedRecord : p)));
    await logAktivitas(`Memperbarui data profil ${updatedRecord.nama}`);
  };

  const deletePimpinan: IPMDataContextValue["deletePimpinan"] = async (id) => {
    const target = pimpinanList.find((p) => p.id === id);
    const client = getSupabaseClient();
    if (client) {
      await client.from("pimpinan").delete().eq("id", id);
    }
    setPimpinanList((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      await logAktivitas(`Menghapus data ${target.nama} dari database`);
    }
  };

  const updateStatusVerifikasi: IPMDataContextValue["updateStatusVerifikasi"] = async (
    id,
    status
  ) => {
    await updatePimpinan(id, { statusVerifikasi: status });
  };

  const importPimpinanBatch: IPMDataContextValue["importPimpinanBatch"] = async (items) => {
    if (items.length === 0) return;
    const client = getSupabaseClient();
    if (client) {
      await client.from("pimpinan").upsert(items.map(pimpinanToRow));
    }
    await refreshDatabase();
    await logAktivitas(`Mengimpor ${items.length} data pimpinan ke database`);
  };

  const addBerita: IPMDataContextValue["addBerita"] = async (
    judul,
    kategori,
    ringkasan,
    penulisOverride,
    isiParagraf,
    gambarUrl
  ) => {
    const slug = `${judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${Date.now().toString().slice(-4)}`;
    const baru: BeritaItem = {
      id: `berita-${Date.now()}`,
      slug,
      judul,
      ringkasan,
      isi:
        isiParagraf && isiParagraf.length > 0
          ? isiParagraf
          : [ringkasan],
      kategori,
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      penulis: penulisOverride || currentUser.pimpinanNama || currentUser.nama,
      waktuBaca: "3 menit baca",
      gambar:
        gambarUrl?.trim() ||
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
      rantingTerkaitSlug: currentUser.pimpinanSlug,
    };

    const client = getSupabaseClient();
    if (client) {
      await client.from("berita").upsert(beritaToRow(baru));
    }

    setBeritaList((prev) => [baru, ...prev]);
    await logAktivitas(`Menerbitkan berita: ${judul}`);
  };

  const deleteBerita: IPMDataContextValue["deleteBerita"] = async (id) => {
    const target = beritaList.find((b) => b.id === id);
    const client = getSupabaseClient();
    if (client) {
      await client.from("berita").delete().eq("id", id);
    }
    setBeritaList((prev) => prev.filter((b) => b.id !== id));
    if (target) {
      await logAktivitas(`Menghapus berita: ${target.judul}`);
    }
  };

  const addAgenda: IPMDataContextValue["addAgenda"] = async (
    judul,
    tanggalHari,
    bulanTahun,
    lokasi,
    penyelenggara,
    deskripsi,
    jam,
    wilayah
  ) => {
    const slug = `${judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${Date.now().toString().slice(-4)}`;
    const baru: AgendaItem = {
      id: `agenda-${Date.now()}`,
      slug,
      judul,
      deskripsi:
        deskripsi?.trim() ||
        `Agenda kegiatan pelajar yang diselenggarakan oleh ${penyelenggara} bertempat di ${lokasi}.`,
      tanggalHari,
      bulanTahun: bulanTahun.toUpperCase(),
      bulanFilter: bulanTahun,
      waktuLengkap: `${tanggalHari} ${bulanTahun}`,
      jam: jam?.trim() || "08.00 - 12.00 WIB",
      lokasi,
      wilayah: wilayah?.trim() || currentUser.wilayah || "Kota Yogyakarta",
      penyelenggara,
      penyelenggaraSlug: currentUser.pimpinanSlug || "",
      status: "Pendaftaran dibuka",
      infoPendaftaran: "Terbuka untuk kader & pelajar",
    };

    const client = getSupabaseClient();
    if (client) {
      await client.from("agenda").upsert(agendaToRow(baru));
    }

    setAgendaList((prev) => [baru, ...prev]);
    await logAktivitas(`Menambahkan agenda: ${judul}`);
  };

  const deleteAgenda: IPMDataContextValue["deleteAgenda"] = async (id) => {
    const target = agendaList.find((a) => a.id === id);
    const client = getSupabaseClient();
    if (client) {
      await client.from("agenda").delete().eq("id", id);
    }
    setAgendaList((prev) => prev.filter((a) => a.id !== id));
    if (target) {
      await logAktivitas(`Menghapus agenda: ${target.judul}`);
    }
  };

  const registerAnggota: IPMDataContextValue["registerAnggota"] = async (input) => {
    const ranting = pimpinanList.find((p) => p.slug === input.rantingSlug);
    const rantingNama =
      ranting?.nama || input.rantingNamaManual?.trim() || "Pimpinan Ranting IPM";
    const cabangNama =
      ranting?.pimpinanInduk || input.cabangNamaManual?.trim() || "Pimpinan Cabang IPM";
    const rantingSlug =
      ranting?.slug ||
      input.rantingSlug ||
      rantingNama
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const randomNum = String(Math.floor(1000 + Math.random() * 9000));
    const baru: AnggotaItem = {
      id: `ang-${Date.now()}`,
      nba: `12.01.${new Date().getFullYear()}.${randomNum}`,
      nama: input.nama.trim(),
      email: input.email.trim().toLowerCase(),
      telepon: input.telepon.trim(),
      kelasAngkatan: input.kelasAngkatan.trim(),
      rantingSlug,
      rantingNama,
      cabangNama,
      bidangMinat: input.bidangMinat,
      statusKeanggotaan: "Menunggu Verifikasi",
      tanggalBergabung: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      bio: input.bio.trim() || `Anggota pelajar di ${rantingNama}.`,
      agendaDiikuti: [],
    };

    const inisial = baru.nama
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const userBaru: AkunUser = {
      id: `usr-${Date.now()}`,
      nama: baru.nama,
      email: baru.email,
      role: "anggota",
      labelPeran: "Anggota Pelajar IPM",
      inisial: inisial || "AG",
      wilayah: ranting?.kecamatan || cabangNama,
      pimpinanSlug: baru.rantingSlug,
      pimpinanNama: baru.rantingNama,
      anggotaId: baru.id,
    };

    const client = getSupabaseClient();
    if (client) {
      await Promise.all([
        client.from("anggota").upsert(anggotaToRow(baru)),
        client.from("akun_users").upsert(akunToRow(userBaru)),
      ]);
    }

    setAnggotaList((prev) => [baru, ...prev]);
    setAkunUsers((prev) => [...prev, userBaru]);
    setCurrentUserId(userBaru.id);

    await logAktivitas(`Registrasi akun anggota baru: ${baru.nama} (${baru.rantingNama})`, {
      inisial: userBaru.inisial,
      nama: baru.nama,
    });

    return baru;
  };

  const updateAnggota: IPMDataContextValue["updateAnggota"] = async (id, updates) => {
    const existing = anggotaList.find((a) => a.id === id);
    if (!existing) return;

    let rantingNama = updates.rantingNama || existing.rantingNama;
    let cabangNama = updates.cabangNama || existing.cabangNama;
    if (updates.rantingSlug && updates.rantingSlug !== existing.rantingSlug) {
      const foundRanting = pimpinanList.find((p) => p.slug === updates.rantingSlug);
      if (foundRanting) {
        rantingNama = foundRanting.nama;
        cabangNama = foundRanting.pimpinanInduk;
      }
    }

    const updatedRecord: AnggotaItem = {
      ...existing,
      ...updates,
      rantingNama,
      cabangNama,
    };

    const client = getSupabaseClient();
    if (client) {
      await client.from("anggota").upsert(anggotaToRow(updatedRecord));
    }

    setAnggotaList((prev) => prev.map((a) => (a.id === id ? updatedRecord : a)));
  };

  const deleteAnggota: IPMDataContextValue["deleteAnggota"] = async (id) => {
    const target = anggotaList.find((a) => a.id === id);
    const client = getSupabaseClient();
    if (client) {
      await client.from("anggota").delete().eq("id", id);
    }
    setAnggotaList((prev) => prev.filter((a) => a.id !== id));
    if (target) {
      await logAktivitas(`Menghapus data anggota ${target.nama} dari database`);
    }
  };

  const verifyAnggotaStatus: IPMDataContextValue["verifyAnggotaStatus"] = async (
    id,
    status
  ) => {
    await updateAnggota(id, { statusKeanggotaan: status });
    const target = anggotaList.find((a) => a.id === id);
    if (target) {
      await logAktivitas(`Memperbarui status keanggotaan ${target.nama} menjadi ${status}`);
    }
  };

  const toggleAgendaAnggota: IPMDataContextValue["toggleAgendaAnggota"] = async (
    anggotaId,
    agendaId
  ) => {
    const target = anggotaList.find((a) => a.id === anggotaId);
    if (!target) return;
    const exists = target.agendaDiikuti.includes(agendaId);
    const nextList = exists
      ? target.agendaDiikuti.filter((x) => x !== agendaId)
      : [...target.agendaDiikuti, agendaId];
    await updateAnggota(anggotaId, { agendaDiikuti: nextList });
  };

  const connectSupabase: IPMDataContextValue["connectSupabase"] = async (url, anonKey) => {
    saveSupabaseConfig(url, anonKey);
    return await refreshDatabase();
  };

  const syncAllToSupabase: IPMDataContextValue["syncAllToSupabase"] = async () => {
    return await refreshDatabase();
  };

  return (
    <IPMDataContext.Provider
      value={{
        pimpinanList,
        beritaList,
        agendaList,
        aktivitasList,
        anggotaList,
        akunUsers,
        currentUser,
        currentAnggota,
        isLoggedIn,
        isAdmin,
        isAnggota,
        logout,
        loginUnified,
        isLoadingDB,
        supabaseStatus,
        supabaseUrl,
        adminUser,
        refreshDatabase,
        switchAccount,
        loginWithEmail,
        addPimpinan,
        updatePimpinan,
        deletePimpinan,
        updateStatusVerifikasi,
        importPimpinanBatch,
        addBerita,
        deleteBerita,
        addAgenda,
        deleteAgenda,
        registerAnggota,
        updateAnggota,
        deleteAnggota,
        verifyAnggotaStatus,
        toggleAgendaAnggota,
        connectSupabase,
        syncAllToSupabase,
      }}
    >
      {children}
    </IPMDataContext.Provider>
  );
}

export function useIPMData() {
  const ctx = useContext(IPMDataContext);
  if (!ctx) {
    throw new Error("useIPMData harus digunakan di dalam IPMDataProvider");
  }
  return ctx;
}
