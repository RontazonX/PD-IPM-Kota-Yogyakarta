-- ============================================================================
-- SUPABASE POSTGRESQL SCHEMA UNTUK WEBSITE ORGANISASI IPM
-- Proyek: https://imucshhraalggwojatgh.supabase.co
-- Mencakup: Pimpinan (Cabang & Ranting), Anggota, Akun Multi-Role, Berita, Agenda
-- ============================================================================

-- 1. Tabel Pimpinan (Cabang & Ranting)
CREATE TABLE IF NOT EXISTS public.pimpinan (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  kode TEXT NOT NULL,
  nama TEXT NOT NULL,
  tingkatan TEXT NOT NULL CHECK (tingkatan IN ('Cabang', 'Ranting')),
  label_tingkatan TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  kabupaten_kota TEXT NOT NULL DEFAULT 'Kota Yogyakarta',
  provinsi TEXT NOT NULL DEFAULT 'DI Yogyakarta',
  pimpinan_induk TEXT NOT NULL,
  pimpinan_induk_slug TEXT,
  jumlah_ranting_dinaungi INTEGER DEFAULT 0,
  jumlah_anggota INTEGER DEFAULT 0,
  jumlah_pengurus INTEGER DEFAULT 0,
  periode TEXT NOT NULL DEFAULT '2025-2027',
  status_verifikasi TEXT NOT NULL DEFAULT 'Menunggu' CHECK (status_verifikasi IN ('Terverifikasi', 'Menunggu', 'Draf')),
  tanggal_diperbarui TEXT NOT NULL,
  urutan_tanggal INTEGER NOT NULL DEFAULT 20261107,
  tagline TEXT NOT NULL DEFAULT '',
  deskripsi TEXT NOT NULL DEFAULT '',
  alamat_sekretariat TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  kelengkapan JSONB NOT NULL DEFAULT '{"identitasWilayah": true, "susunanPengurus": true, "informasiKontak": true, "dokumenPendukung": false}'::jsonb,
  pengurus JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pimpinan_tingkatan ON public.pimpinan (tingkatan);
CREATE INDEX IF NOT EXISTS idx_pimpinan_status ON public.pimpinan (status_verifikasi);
CREATE INDEX IF NOT EXISTS idx_pimpinan_urutan_tanggal ON public.pimpinan (urutan_tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_pimpinan_induk_slug ON public.pimpinan (pimpinan_induk_slug);

-- 2. Tabel Anggota Pelajar IPM
CREATE TABLE IF NOT EXISTS public.anggota (
  id TEXT PRIMARY KEY,
  nba TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telepon TEXT NOT NULL DEFAULT '',
  kelas_angkatan TEXT NOT NULL DEFAULT 'Kelas XI',
  ranting_slug TEXT NOT NULL,
  ranting_nama TEXT NOT NULL,
  cabang_nama TEXT NOT NULL,
  bidang_minat TEXT NOT NULL DEFAULT 'Literasi & Keilmuan',
  status_keanggotaan TEXT NOT NULL DEFAULT 'Aktif' CHECK (status_keanggotaan IN ('Aktif', 'Menunggu Verifikasi', 'Alumni')),
  tanggal_bergabung TEXT NOT NULL DEFAULT '7 Nov 2026',
  bio TEXT NOT NULL DEFAULT '',
  agenda_diikuti JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anggota_ranting_slug ON public.anggota (ranting_slug);
CREATE INDEX IF NOT EXISTS idx_anggota_status ON public.anggota (status_keanggotaan);

-- 3. Tabel Akun Pengguna (Admin Utama, Admin Cabang, Admin Ranting, Anggota)
CREATE TABLE IF NOT EXISTS public.akun_users (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT DEFAULT '1234@',
  role TEXT NOT NULL CHECK (role IN ('admin_utama', 'admin_cabang', 'admin_ranting', 'anggota')),
  label_peran TEXT NOT NULL,
  inisial TEXT NOT NULL,
  wilayah TEXT NOT NULL,
  pimpinan_slug TEXT,
  pimpinan_nama TEXT,
  anggota_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_akun_users_role ON public.akun_users (role);
CREATE INDEX IF NOT EXISTS idx_akun_users_pimpinan_slug ON public.akun_users (pimpinan_slug);

-- 4. Tabel Berita & Artikel
CREATE TABLE IF NOT EXISTS public.berita (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  isi JSONB NOT NULL DEFAULT '[]'::jsonb,
  kategori TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  penulis TEXT NOT NULL,
  waktu_baca TEXT NOT NULL DEFAULT '4 menit baca',
  gambar TEXT NOT NULL,
  unggulan BOOLEAN NOT NULL DEFAULT FALSE,
  ranting_terkait_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_berita_kategori ON public.berita (kategori);

-- 5. Tabel Agenda & Kegiatan
CREATE TABLE IF NOT EXISTS public.agenda (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  tanggal_hari TEXT NOT NULL,
  bulan_tahun TEXT NOT NULL,
  bulan_filter TEXT NOT NULL,
  waktu_lengkap TEXT NOT NULL,
  jam TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  wilayah TEXT NOT NULL DEFAULT 'Kota Yogyakarta',
  penyelenggara TEXT NOT NULL,
  penyelenggara_slug TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pendaftaran dibuka', 'Segera hadir', 'Selesai')),
  info_pendaftaran TEXT NOT NULL,
  unggulan BOOLEAN NOT NULL DEFAULT FALSE,
  gambar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agenda_bulan_filter ON public.agenda (bulan_filter);
CREATE INDEX IF NOT EXISTS idx_agenda_penyelenggara_slug ON public.agenda (penyelenggara_slug);

-- 6. Tabel Log Aktivitas Pengelolaan
CREATE TABLE IF NOT EXISTS public.aktivitas_admin (
  id TEXT PRIMARY KEY,
  inisial TEXT NOT NULL,
  nama TEXT NOT NULL,
  aksi TEXT NOT NULL,
  waktu TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Berikan izin akses Data API ke role anon & authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.pimpinan,
  public.anggota,
  public.akun_users,
  public.berita,
  public.agenda,
  public.aktivitas_admin
TO anon, authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE public.pimpinan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anggota ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akun_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aktivitas_admin ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS idempoten untuk role anon & authenticated
DROP POLICY IF EXISTS "Allow public readwrite pimpinan" ON public.pimpinan;
CREATE POLICY "Allow public readwrite pimpinan"
  ON public.pimpinan FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public readwrite anggota" ON public.anggota;
CREATE POLICY "Allow public readwrite anggota"
  ON public.anggota FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public readwrite akun_users" ON public.akun_users;
CREATE POLICY "Allow public readwrite akun_users"
  ON public.akun_users FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public readwrite berita" ON public.berita;
CREATE POLICY "Allow public readwrite berita"
  ON public.berita FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public readwrite agenda" ON public.agenda;
CREATE POLICY "Allow public readwrite agenda"
  ON public.agenda FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public readwrite aktivitas_admin" ON public.aktivitas_admin;
CREATE POLICY "Allow public readwrite aktivitas_admin"
  ON public.aktivitas_admin FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
