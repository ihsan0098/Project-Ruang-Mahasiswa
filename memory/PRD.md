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

## Implemented (2026-09-22, iterasi 5)
- Moderasi forum: kiriman baru berstatus pending (tidak tampil publik), tombol Laporkan per cerita (auto-sembunyi setelah 3 laporan), halaman admin /moderasi berkunci (X-Admin-Key) dengan antrean persetujuan Setujui/Tolak, daftar cerita dilaporkan, dan kotak masuk pesan narahubung
- Narahubung & Bantuan: 3 hotline resmi (SEJIWA 119 ext. 8, Halo Kemenkes 1500-567, Into The Light Indonesia) + formulir pesan ke tim (tersimpan, tampil di /moderasi)
- Narasi siap ElevenLabs: backend otomatis memakai eleven_multilingual_v2 begitu ELEVENLABS_API_KEY diisi (fallback OpenAI "sage"); cache key menyertakan provider
- Kunci admin forum tercatat di /app/memory/test_credentials.md

## Implemented (2026-09-22, iterasi 4)
- Forum Komunitas: kirim cerita (nama opsional/anonim, maks 500 karakter), daftar cerita terbaru, reaksi "Peluk" (localStorage anti-ganda); backend /api/forum-posts + /hug
- Kirim Hasil Email: Resend managed (EMERGENT_EMAIL_KEY), template server-side bilingual dengan guardrail gate, rate limit 3 email/alamat/24 jam, hasil terkirim nyata (terverifikasi)
- Narasi Audio Daun: OpenAI TTS tts-1-hd voice "sage" via EMERGENT_LLM_KEY, teks server-side tetap (5 daun × 2 bahasa), cache Mongo (generate ~6s, cache ~0.2s)
- Dashboard: grafik "Tes per Hari · 7 Hari Terakhir" (byDay) + total responden besar; total juga tampil di intro tes

## Implemented (2026-09-22, iterasi 3)
- Galeri Digital Karyaku: 3 sketsa seni garis SVG (Terbelenggu Ekspektasi, Suara yang Terkunci, Titik Balik) dengan animasi self-drawing stroke saat scroll
- Peta Perbaikan di hasil tes: cara mengatasi spesifik per dimensi bermasalah (varian Orang Tua & Anak), bilingual
- Ekspor CSV: GET /api/reflection-export (text/csv, mode dinormalkan) + tombol unduh di dashboard
- Modul Dialog Orang Tua & Anak di /modul: 7 hari percakapan interaktif, progres tersimpan di localStorage, unduh via print-to-PDF dengan print stylesheet; ditautkan dari section QR

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
- P0: Isi ELEVENLABS_API_KEY di backend/.env untuk narasi Indonesia natural (user belum punya key saat diminta)
- P1: Tambahkan kontak narahubung asli tim (WA/email Shelly dkk.) ke section Narahubung — menunggu data dari user
- P2: Poster QR cetak PDF; notifikasi email ke tim saat ada pesan narahubung masuk

## Next Tasks
1. User mengirim API key ElevenLabs → aktifkan suara Indonesia natural
2. User mengirim kontak narahubung tim → tampilkan tombol WhatsApp/email langsung
