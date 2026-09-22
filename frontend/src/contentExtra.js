export const extra = {
  id: {
    dashCsv: "Unduh Data CSV",
    qrModuleCta: "Buka Modul Orang Tua & Anak",
    gallery: {
      overline: "Galeri Digital Karyaku",
      title: "Sketsa-sketsa Rafa.",
      desc: "Visualisasi ruang isolasi emosional dari naskah film — digambar ulang sebagai seni garis yang melukis dirinya sendiri saat Anda menggulir.",
      items: [
        {
          tag: "Sosok Terbelenggu",
          title: "Terbelenggu Ekspektasi",
          desc: "Jeruji aturan sosial tentang definisi kekuatan seorang pria.",
        },
        {
          tag: "Bermulut Terkunci",
          title: "Suara yang Terkunci",
          desc: "Dogma kuno bahwa anak laki-laki dilarang cengeng dan mengeluh.",
        },
        {
          tag: "Gerbang Ruang Dialog",
          title: "Titik Balik",
          desc: "Fajar hangat yang mulai menyinari kamar gelap setelah penerimaan tulus sang Ayah.",
        },
      ],
    },
    remedies: {
      title: "Peta Perbaikan",
      note: "Dimensi yang perlu perhatian — beserta cara mengatasinya, langkah demi langkah.",
      allGood: "Semua dimensi tampak sehat — pertahankan ritme ini dan teruslah saling mendengar.",
      parent: {
        warmth: {
          label: "Membangun kehangatan",
          steps: [
            "Mulai hari dengan satu kalimat apresiasi yang spesifik, bukan basa-basi",
            "Tiru bahasanya: jika ia bercerita lewat gambar atau musik, masuklah lewat sana",
          ],
        },
        hostility: {
          label: "Meredam ledakan emosi",
          steps: [
            "Saat emosi naik, jeda 10 detik dan turunkan volume suara sebelum bicara",
            "Ganti bentakan dengan pertanyaan: \u201CApa yang terjadi?\u201D bukan \u201CKenapa kamu begitu?\u201D",
          ],
        },
        indifference: {
          label: "Menghadirkan diri",
          steps: [
            "Blokir 15 menit di kalender setiap hari bertuliskan namanya — tanpa ponsel",
            "Tanyakan satu detail kecil: temannya, gambarnya, atau lagu yang ia dengarkan hari ini",
          ],
        },
        rejection: {
          label: "Menerima tanpa syarat",
          steps: [
            "Pisahkan anak dari prestasinya: ucapkan bangga tanpa embel-embel nilai",
            "Katakan minggu ini: \u201CAyah/Ibu sayang kamu, apa pun yang terjadi.\u201D",
          ],
        },
      },
      son: {
        warmth: {
          label: "Merawat kehangatan",
          steps: [
            "Balas pelukan atau pujian itu dengan cerita — kehangatan tumbuh dua arah",
            "Ingat momen itu saat kamu ragu: kamu berharga",
          ],
        },
        hostility: {
          label: "Menghadapi bentakan",
          steps: [
            "Saat dibentak, tarik napas — reaksinya tentang emosinya, bukan tentang nilai dirimu",
            "Pilih waktu tenang untuk bilang: \u201CAku sedih kalau dibentak. Bisa bicara baik-baik?\u201D",
          ],
        },
        indifference: {
          label: "Saat merasa tak terlihat",
          steps: [
            "Tawarkan cerita lebih dulu: \u201CAyah/Bu, ada yang mau aku ceritakan sebentar\u201D",
            "Kalau tetap tak didengar, cari telinga lain: guru BK, kakak, atau kerabat",
          ],
        },
        rejection: {
          label: "Saat merasa jadi beban",
          steps: [
            "Tulis ini: perasaan itu nyata, tapi bukan fakta — kamu bukan beban",
            "Ceritakan perasaan ini ke orang dewasa tepercaya; kamu berhak dibantu",
          ],
        },
      },
    },
    module: {
      overline: "Modul Dialog",
      title: "Tujuh hari membuka kembali ruang.",
      desc: "Tujuh hari percakapan kecil untuk membangun kembali ruang bicara antara orang tua dan anak. Centang setiap hari yang selesai, lalu unduh modul ini untuk dibawa ke meja makan.",
      download: "Unduh Modul (PDF)",
      progress: (n) => `${n} dari 7 hari selesai`,
      day: (n) => `Hari ${n}`,
      forParent: "Untuk Orang Tua",
      forSon: "Untuk Anak",
      mark: "Tandai selesai",
      done: "Selesai",
      together: "Bersama",
      days: [
        {
          theme: "Membuka Pintu",
          parent: "Tanyakan satu hal tentang harinya, lalu dengarkan sampai selesai tanpa menasihati.",
          son: "Ceritakan satu hal kecil dari harimu — apa pun itu.",
        },
        {
          theme: "Bahasa Emosi",
          parent: "Sebutkan satu perasaan yang kamu lihat darinya hari ini, tanpa menghakimi: \u201CKamu tampak lelah\u2026\u201D",
          son: "Coba beri nama perasaanmu hari ini: senang, cemas, bangga, atau lelah?",
        },
        {
          theme: "Tanpa Pembanding",
          parent: "Seharian penuh tanpa kalimat pembanding. Ganti setiap dorongan membandingkan dengan pertanyaan.",
          son: "Tulis satu hal yang kamu sukai dari dirimu sendiri.",
        },
        {
          theme: "Ruang untuk Menangis",
          parent: "Katakan padanya: \u201CMenangis itu manusiawi. Ayah/Ibu juga pernah menangis.\u201D",
          son: "Izinkan dirimu merasakan hari ini — tanpa meminta maaf.",
        },
        {
          theme: "Apresiasi Kecil",
          parent: "Puji usahanya hari ini, bukan hasilnya.",
          son: "Ucapkan terima kasih untuk satu hal yang dilakukan orang tuamu.",
        },
        {
          theme: "Cerita Masa Kecil",
          parent: "Ceritakan satu kegagalanmu saat remaja dan apa yang kamu pelajari darinya.",
          son: "Tanyakan satu hal tentang masa remaja ayah atau ibumu.",
        },
        {
          theme: "Janji Ruang",
          parent: "Duduklah berdua dan sepakati satu ritual mingguan: makan bersama, jalan sore, atau sekadar mengobrol.",
          son: "Duduklah berdua dan sepakati satu ritual mingguan: makan bersama, jalan sore, atau sekadar mengobrol.",
        },
      ],
    },
  },
  en: {
    dashCsv: "Download CSV Data",
    qrModuleCta: "Open the Parent & Son Module",
    gallery: {
      overline: "My Digital Gallery",
      title: "Rafa's sketches.",
      desc: "Visualizations of emotional isolation from the film's script — redrawn as line art that draws itself as you scroll.",
      items: [
        {
          tag: "Sosok Terbelenggu",
          title: "Shackled by Expectations",
          desc: "The bars of social rules about what a man's strength is supposed to mean.",
        },
        {
          tag: "Bermulut Terkunci",
          title: "A Locked Voice",
          desc: "The old dogma that boys are forbidden to be fragile or to complain.",
        },
        {
          tag: "Gerbang Ruang Dialog",
          title: "The Turning Point",
          desc: "A warm dawn beginning to light the dark room after a father's sincere acceptance.",
        },
      ],
    },
    remedies: {
      title: "The Repair Map",
      note: "Dimensions that need attention — with step-by-step ways to address them.",
      allGood: "Every dimension looks healthy — keep this rhythm and keep listening to each other.",
      parent: {
        warmth: {
          label: "Rebuilding warmth",
          steps: [
            "Start the day with one specific appreciation, not small talk",
            "Mirror his language: if he speaks through drawings or music, enter through there",
          ],
        },
        hostility: {
          label: "Cooling the flare-ups",
          steps: [
            "When anger rises, pause for 10 seconds and lower your voice before speaking",
            "Replace yelling with a question: \u201CWhat happened?\u201D instead of \u201CWhy are you like this?\u201D",
          ],
        },
        indifference: {
          label: "Showing up",
          steps: [
            "Block 15 minutes in your calendar every day with his name on it — no phone",
            "Ask one small detail: his friend, his drawing, or the song he played today",
          ],
        },
        rejection: {
          label: "Accepting without conditions",
          steps: [
            "Separate the child from the achievement: say you're proud with no grades attached",
            "Say this week: \u201CI love you, no matter what.\u201D",
          ],
        },
      },
      son: {
        warmth: {
          label: "Keeping the warmth alive",
          steps: [
            "Answer that hug or praise with a story — warmth grows both ways",
            "Remember that moment when you doubt yourself: you matter",
          ],
        },
        hostility: {
          label: "Facing the yelling",
          steps: [
            "When yelled at, breathe — their reaction is about their emotions, not your worth",
            "Pick a calm moment to say: \u201CIt hurts when I'm yelled at. Can we talk calmly?\u201D",
          ],
        },
        indifference: {
          label: "When you feel invisible",
          steps: [
            "Offer the story first: \u201CDad/Mom, there's something I want to tell you quickly\u201D",
            "If you're still unheard, find another ear: a school counselor, a sibling, or a relative",
          ],
        },
        rejection: {
          label: "When you feel like a burden",
          steps: [
            "Write this down: that feeling is real, but it is not a fact — you are not a burden",
            "Tell a trusted adult about this feeling; you deserve help",
          ],
        },
      },
    },
    module: {
      overline: "Dialogue Module",
      title: "Seven days to reopen the room.",
      desc: "Seven days of small conversations to rebuild the talking space between parent and son. Check off each completed day, then download this module to bring to the dinner table.",
      download: "Download Module (PDF)",
      progress: (n) => `${n} of 7 days completed`,
      day: (n) => `Day ${n}`,
      forParent: "For Parents",
      forSon: "For Sons",
      mark: "Mark as done",
      done: "Done",
      together: "Together",
      days: [
        {
          theme: "Opening the Door",
          parent: "Ask one thing about his day, then listen all the way through without advising.",
          son: "Share one small thing from your day — anything at all.",
        },
        {
          theme: "Emotional Language",
          parent: "Name one feeling you noticed in him today, without judging: \u201CYou look tired\u2026\u201D",
          son: "Try naming your feeling today: happy, anxious, proud, or tired?",
        },
        {
          theme: "No Comparisons",
          parent: "One full day without comparing sentences. Replace every urge to compare with a question.",
          son: "Write down one thing you like about yourself.",
        },
        {
          theme: "Room to Cry",
          parent: "Tell him: \u201CCrying is human. I've cried too.\u201D",
          son: "Allow yourself to feel today — without apologizing.",
        },
        {
          theme: "Small Appreciation",
          parent: "Praise his effort today, not the result.",
          son: "Thank your parents for one thing they did.",
        },
        {
          theme: "Childhood Stories",
          parent: "Share one failure from your teenage years and what you learned from it.",
          son: "Ask one thing about your dad's or mom's teenage years.",
        },
        {
          theme: "The Ruang Promise",
          parent: "Sit together and agree on one weekly ritual: a meal, an evening walk, or simply talking.",
          son: "Sit together and agree on one weekly ritual: a meal, an evening walk, or simply talking.",
        },
      ],
    },
  },
};
