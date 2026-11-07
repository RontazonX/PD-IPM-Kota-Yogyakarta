# DESIGN.md - Ikatan Pelajar Muhammadiyah (IPM) Digital Workspace & Direktori

## Identity & Purpose
- **Product**: Website Organisasi & Ruang Pengelolaan Data Pimpinan (Cabang & Ranting) Ikatan Pelajar Muhammadiyah (IPM).
- **Source of Truth**: Figma file `36OnNeVdbBQZcZYaXFuH5H` (9 frames) combined with explicit user direction:
  1. Replace green brand color with **`#F4BE38`**.
  2. Use **Poppins** as the primary typeface.
  3. Adopt a **minimalist, clean** visual language with generous whitespace, crisp `#FFFFFF` / `#FAFAFA` surfaces, delicate `1px` borders (`#E5E7EB`), and restrained, purposeful `#F4BE38` accents.
- **Design Read**: Reading this as: Organizational Portal, Directory & Admin Workspace for IPM Students and Branch Administrators, in a minimalist and clean editorial language with Poppins typography, dial `ENERGY 1 / RHYTHM 2 / MOTION 1`.
- **Dial**: `ENERGY 1 / RHYTHM 2 / MOTION 1`

## Palette & Contrast Decisions (R-01, R-25, R-29, R-31)
1. **Clean Canvas (`#FFFFFF` & `#FAFAFA`, border `#E5E7EB`)**: Keeps the interface airy, calm, and uncluttered so content and data tables remain the focal point.
2. **Primary Brand Accent (`#F4BE38`, hover `#E2AC26`)**: Used as a deliberate focal accent on primary CTAs, active navigation indicators, progress bars, and brand markers, paired with `#111827` text (**10.35:1** contrast).
3. **Typography & Hierarchy (`#111827` primary text, `#4B5563` secondary text, `#6B4C06` high-contrast gold label text)**: All text pairings exceed WCAG AA (from **7.24:1** to **17.74:1**).

## Typography & Layout Reasons (R-05, R-06, R-11, R-12, R-14, R-31)
- **Typeface (`Poppins` 400, 500, 600, 700 via self-hosted `@fontsource/poppins`)**: Requested explicitly by the user; geometric clarity suits minimalist headlines, clean navigation, and structured directory cards without third-party network blocking.
- **Minimalist Elevation (`R-12`)**: Cards sit flat on the canvas with `1px` `#E5E7EB` borders and subtle border transitions on hover instead of heavy drop shadows or full-bleed colored blocks.
- **Section Rhythm (`RHYTHM 2`)**: Alternates clean white and `#FAFAFA` sections with varied editorial grids, directory lists, and asymmetric split layouts.
