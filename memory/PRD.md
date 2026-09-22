# PRD — Project Ruang Landing Page

## Problem Statement (Original)
"Buat halaman pendaratan: buatkan saya website project ruang sesuai data di atas buat semenarik dan profesional mungkin agar bisa webnya di akses dengan mudah"
Sumber data: Proposal LIDM 2026 Divisi Video Digital Pendidikan (Project Ruang) + Blueprint Validasi Psikometri Project Ruang.

## User Personas
- Juri & publik LIDM 2026 yang menilai inovasi Project Ruang
- Orang tua (terutama ayah) remaja laki-laki yang ingin berefleksi
- Remaja laki-laki, pendidik, dan komunitas yang tersentuh kampanye

## Core Requirements (Static)
1. Landing page sinematik, profesional, mudah diakses, level Awwwards
2. Bilingual ID/EN dengan toggle
3. Tes Refleksi Orang Tua fungsional (12 pertanyaan, IPARTheory: Warmth, Hostility, Indifference, Undifferentiated Rejection) dengan hasil refleksi + saran aksi + disclaimer non-klinis
4. Embed film sinematik YouTube (https://www.youtube.com/watch?v=bcGpVvJwYKw)
5. Manifesto bercerita: krisis kesehatan mental remaja (1/3, 2,6%), 70% bunuh diri laki-laki, solusi Ruang
6. Showcase tim: Shelly Alfidenia, Aji Sulaksana, Egazia Evanggelis, Falyanzuril Ihsan, pembimbing Dr. Lailatur Rahmi, S.Pd, M.Pd

## Architecture
- Frontend: React 19 + Tailwind + framer-motion (masked line reveal hero, scroll reveals) + lenis (smooth scroll), Google Fonts (Cormorant Garamond, Outfit, JetBrains Mono)
- Backend: FastAPI `/api/reflection-results` (POST, simpan hasil anonim) + `/api/reflection-stats` (GET, jumlah partisipan)
- DB: MongoDB koleksi `reflection_results` (warmth/hostility/indifference/rejection/level/locale/timestamp)

## Implemented (2026-09-22, iterasi 2)
- Mode ganda Tes Refleksi: Orang Tua & Anak Laki-Laki (12 pertanyaan cermin per mode, hasil & saran disesuaikan per peran)
- Kartu Hasil Dibagikan: unduh PNG 1080×1350 (canvas, font Cormorant/Outfit/JetBrains Mono) langsung dari layar hasil
- Dashboard Validasi di /validasi: total responden, split Orang Tua vs Anak, distribusi tingkat koneksi, grafik batang rerata 4 dimensi IPARTheory per mode (recharts), tombol muat ulang
- QR Code CTA (qrcode.react) untuk layar bioskop/webinar → mengarah ke /?to=tes (auto-scroll ke tes)
- Instalasi Pohon Dialog: 5 daun interaktif berisi suara hati anak laki-laki
- Backend: field `mode` pada hasil + endpoint /api/reflection-stats mengembalikan agregat (levels, averages, parentAverages, sonAverages, modes)

## Implemented (2026-09-22, iterasi 1)
- Hero kinetik: masked line-by-line reveal, parallax mouse + scroll, partikel cahaya ambient
- Manifesto 3 bab bernomor dengan statistik besar dan foto ber-frame
- Section film: iframe YouTube dengan frame teatral, sinopsis, logline, chips
- Tes Refleksi: wizard 12 langkah, progress bar, guard anti double-advance, hasil 4 dimensi + 3 level (Hangat/Samar/Sunyi) + saran; hasil tersimpan ke backend
- Marquee editorial lambat (pause on hover)
- Section tim + kartu dosen pembimbing
- Footer konteks LIDM 2026 + link YouTube
- Toggle bahasa ID/EN di seluruh konten
- Judul & meta halaman diperbarui

## Verified
- curl: POST /api/reflection-results (dengan mode) → {"ok":true}; GET /api/reflection-stats → agregat lengkap (levels, averages, parentAverages, sonAverages, modes)
- Screenshot e2e: hero, manifesto, kuis 12 pertanyaan mode Orang Tua & Anak → hasil, unduh kartu PNG (terverifikasi visual), QR section, Pohon Dialog, toggle EN, iframe YouTube, tim, footer, dashboard /validasi

## Backlog
- P0: (kosong — inti selesai)
- P1: Galeri Digital karya Rafa (seperti situs referensi); ekspor CSV data dashboard untuk laporan validasi
- P2: Modul komunikasi Orang Tua & Anak yang bisa diunduh; forum/komunitas pengasuhan

## Next Tasks
1. Galeri digital karya Rafa (tiga sketsa: Terbelenggu Ekspektasi, Suara yang Terkunci, Titik Balik)
2. Ekspor CSV dari dashboard validasi untuk lampiran laporan LIDM
