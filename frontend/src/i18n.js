const questionsId = [
  { dimension: "warmth", text: "Saya sering memeluk atau memberikan pujian hangat ketika anak saya berhasil melakukan sesuatu." },
  { dimension: "hostility", text: "Saya mudah hilang kesabaran dan membentak anak ketika dia melakukan kesalahan kecil." },
  { dimension: "indifference", text: "Saya merasa terlalu lelah untuk mendengarkan cerita keseharian anak saya." },
  { dimension: "rejection", text: "Kadang saya merasa anak saya hanya menjadi beban dalam hidup saya." },
  { dimension: "warmth", text: "Saya berusaha meluangkan waktu khusus setiap minggu hanya untuk mengobrol berdua dengan anak." },
  { dimension: "hostility", text: "Saya menuntut anak laki-laki saya untuk selalu kuat dan melarangnya menangis." },
  { dimension: "indifference", text: "Saya jarang mengetahui apa yang dirasakan atau digambar oleh anak saya di kamarnya." },
  { dimension: "rejection", text: "Saya merasa sulit untuk bersikap ramah atau menunjukkan rasa sayang secara fisik kepada anak." },
  { dimension: "warmth", text: "Ketika anak saya sedih, saya mendengarkan tanpa langsung menyalahkan atau menceramahi." },
  { dimension: "hostility", text: "Saya sering membandingkan anak saya dengan anak lain yang tampak lebih maskulin atau sukses." },
  { dimension: "indifference", text: "Saya menganggap masalah emosional anak remaja sebagai hal yang berlebihan atau cari perhatian." },
  { dimension: "warmth", text: "Saya siap belajar memahami bahasa emosi baru yang ditunjukkan oleh anak saya." },
];

const questionsEn = [
  { dimension: "warmth", text: "I often hug or give warm praise when my child accomplishes something." },
  { dimension: "hostility", text: "I easily lose my patience and yell at my child over minor mistakes." },
  { dimension: "indifference", text: "I feel too exhausted to listen to my child's daily stories." },
  { dimension: "rejection", text: "Sometimes I feel my child is just a burden in my life." },
  { dimension: "warmth", text: "I make an effort to spend dedicated one-on-one time chatting with my child every week." },
  { dimension: "hostility", text: "I demand my son to always be strong and forbid him from crying." },
  { dimension: "indifference", text: "I rarely know what my child is feeling or drawing in his room." },
  { dimension: "rejection", text: "I find it difficult to be affectionate or show physical love to my child." },
  { dimension: "warmth", text: "When my child is sad, I listen without immediately blaming or lecturing." },
  { dimension: "hostility", text: "I often compare my child to others who seem more masculine or successful." },
  { dimension: "indifference", text: "I view my adolescent child's emotional issues as exaggeration or attention-seeking." },
  { dimension: "warmth", text: "I am ready to learn to understand the new emotional language shown by my child." },
];

export const content = {
  id: {
    nav: {
      manifesto: "Manifesto",
      film: "Film",
      test: "Tes Refleksi",
      team: "Tim",
      cta: "Mulai Tes",
    },
    hero: {
      overline: "LIDM 2026 · Divisi Video Digital Pendidikan",
      lines: ["Suara yang tak terdengar", "di balik kata", "\u201Claki-laki harus kuat\u201D."],
      subtitle:
        "Rafa, 17 tahun, melukis perasaannya karena tak pernah diajari cara mengucapkannya. Project Ruang menghadirkan ruang aman bagi ayah dan anak untuk kembali berbicara — karena mendengar adalah bentuk cinta tertinggi.",
      ctaPrimary: "Mulai Tes Refleksi",
      ctaSecondary: "Tonton Film",
      scroll: "gulir untuk menjelajah",
      imageAlt: "Kehangatan ayah dan anak",
    },
    manifesto: {
      overline: "Manifesto",
      title: "Mengapa Ruang harus ada.",
      chapters: [
        {
          num: "01",
          title: "Krisis yang sunyi.",
          body: "Satu dari tiga remaja Indonesia mengalami masalah kesehatan mental (I-NAMHS, 2022). Namun hanya 2,6% yang menjangkau layanan psikologis. Sisanya menyimpan badainya sendirian — di kamar, di balik pintu.",
          stats: [
            { value: "1/3", label: "remaja Indonesia mengalami masalah kesehatan mental" },
            { value: "2,6%", label: "yang mendapat akses layanan psikologis" },
          ],
          image: "https://images.pexels.com/photos/9127835/pexels-photo-9127835.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        },
        {
          num: "02",
          title: "\u201CAnak laki-laki tidak boleh menangis.\u201D",
          body: "Tujuh dari sepuluh kasus bunuh diri di Indonesia terjadi pada laki-laki. Tuntutan maskulinitas memaksa remaja memendam emosi — hingga mereka lupa caranya berkata jujur, dan ayah lupa caranya bertanya.",
          stats: [{ value: "70%", label: "kasus bunuh diri di Indonesia dialami laki-laki" }],
        },
        {
          num: "03",
          title: "Sebuah ruang untuk bertemu.",
          body: "Project Ruang memadukan film sinematik 15 adegan dan tes refleksi digital berbasis psikologi (IPARTheory). Dari layar ke hati, dari hati ke meja makan — sebuah perjalanan: menonton, berefleksi, berdialog, lalu bertindak.",
          stats: [
            { value: "15", label: "adegan sinematik pemicu empati" },
            { value: "12", label: "pertanyaan refleksi berbasis IPARTheory" },
          ],
          image: "https://images.pexels.com/photos/8298201/pexels-photo-8298201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        },
      ],
    },
    film: {
      overline: "Film Sinematik · 15 Adegan",
      title: "Ketika sebuah gambar bersuara.",
      synopsis:
        "Rafa (17) menuangkan emosinya ke atas kertas gambar karena tekanan maskulinitas merampas ruang bicaranya. Hingga sang ayah menemukan Project Ruang — dan perlahan memahami bahwa mendengarkan adalah dukungan terbesar yang bisa ia berikan kepada putranya.",
      logline:
        "\u201CKetika tekanan maskulinitas merampas ruang seorang remaja untuk didengar, sebuah platform digital bernama Project Ruang menjadi katalis perubahan.\u201D",
      chips: ["Video Digital Pendidikan", "LIDM 2026", "Storytelling Interaktif"],
      note: "Film lengkap tersedia di YouTube",
    },
    test: {
      overline: "Tes Refleksi Orang Tua",
      title: "Seberapa terbuka ruang di rumah Anda?",
      desc: "12 pertanyaan reflektif berbasis Interpersonal Acceptance-Rejection Theory (IPARTheory). Bukan diagnosis klinis — melainkan cermin jujur untuk memulai percakapan dengan anak Anda.",
      start: "Mulai Berefleksi",
      countText: (n) => `${n} orang tua telah berefleksi di Ruang`,
      questionOf: (i) => `Pertanyaan ${i} dari 12`,
      back: "Kembali",
      scale: ["Tidak Pernah", "Jarang", "Sering", "Selalu"],
      questions: questionsId,
      resultOverline: "Hasil Refleksi Anda",
      dimensions: {
        warmth: "Kehangatan & Kasih Sayang",
        hostility: "Permusuhan & Agresi",
        indifference: "Ketidakpedulian",
        rejection: "Penolakan Samar",
      },
      insights: {
        warmth: {
          high: "Kehangatan Anda benar-benar dirasakan oleh anak.",
          low: "Anak mungkin sedang merindukan pelukan dan pujian Anda.",
        },
        hostility: {
          high: "Bentakan dan tuntutan mungkin menutup cerita anak.",
          low: "Anak relatif aman dari ledakan emosi Anda.",
        },
        indifference: {
          high: "Kesibukan mungkin membuat anak merasa tak terlihat.",
          low: "Anda cukup hadir dalam kesehariannya.",
        },
        rejection: {
          high: "Anak mungkin merasa diterima hanya jika memenuhi harapan.",
          low: "Anak merasa diterima apa adanya.",
        },
      },
      levels: {
        warm: {
          title: "Ruang yang Hangat",
          desc: "Kehangatan Anda hadir dan dirasakan. Anak Anda kemungkinan besar merasa diterima dan aman untuk bercerita. Pertahankan — dan teruslah mendengarkan.",
          advice: [
            "Luangkan 15 menit sehari tanpa layar hanya untuk mengobrol",
            "Tanyakan perasaannya, bukan hanya prestasinya",
            "Ucapkan terima kasih saat ia berani jujur",
          ],
        },
        fading: {
          title: "Ruang yang Mulai Samar",
          desc: "Ada kehangatan, tetapi jarak mulai tumbuh perlahan — mungkin karena lelah, tuntutan, atau kebiasaan lama. Ini titik terbaik untuk berubah.",
          advice: [
            "Minggu ini, dengarkan satu ceritanya sampai selesai tanpa menasihati",
            "Hentikan satu kalimat pembanding (\u201Canak orang lain\u2026\u201D)",
            "Tonton film Project Ruang bersama, lalu tanyakan pendapatnya",
          ],
        },
        silent: {
          title: "Ruang yang Sunyi",
          desc: "Jawaban Anda mengisyaratkan anak mungkin sedang merasa tidak sepenuhnya diterima. Ini bukan vonis — ini undangan untuk memulai satu percakapan kecil malam ini.",
          advice: [
            "Mulai dari hal kecil: duduk di sampingnya tanpa agenda apa pun",
            "Akui satu kesalahan Anda kepadanya — kerendahan hati membuka pintu",
            "Pertimbangkan berbicara dengan psikolog atau konselor keluarga",
          ],
        },
      },
      adviceTitle: "Langkah kecil untuk malam ini",
      disclaimer:
        "Tes ini adalah alat refleksi dan edukasi berbasis konstruk psikologis — bukan diagnosis klinis. Jika Anda atau anak Anda membutuhkan bantuan, hubungi psikolog profesional atau layanan kesehatan jiwa terdekat.",
      retake: "Ulangi Tes",
      watchFilm: "Tonton Filmnya",
    },
    marquee: [
      "Mendengar adalah bentuk cinta tertinggi",
      "Ruang bicara tanpa penghakiman",
      "Anak laki-laki juga boleh rapuh",
      "Pelukan berbicara lebih keras daripada ceramah",
      "Setiap anak berhak didengar",
    ],
    team: {
      overline: "Tim Kami",
      title: "Empat mahasiswa, satu ruang.",
      desc: "Tim di balik Project Ruang untuk Lomba Inovasi Digital Mahasiswa (LIDM) 2026.",
      advisorLabel: "Dosen Pembimbing",
      members: [
        { name: "Shelly Alfidenia", role: "Ketua Tim", focus: "Digital Storytelling & Produksi", nim: "24043140" },
        { name: "Aji Sulaksana", role: "Creative Director", focus: "Sinematografi & Seni Visual", nim: "22136003" },
        { name: "Egazia Evanggelis", role: "Peneliti", focus: "Riset Psikologis & Penulisan Naskah", nim: "22027016" },
        { name: "Falyanzuril Ihsan", role: "Technical Lead", focus: "Pengalaman Web & Media Interaktif", nim: "22349025" },
      ],
      advisor: { name: "Dr. Lailatur Rahmi, S.Pd, M.Pd", focus: "Bimbingan Akademik & Media Pendidikan" },
    },
    footer: {
      tagline: "Ruang untuk setiap suara yang belum sempat didengar.",
      lidmLine: "Lomba Inovasi Digital Mahasiswa 2026 · Divisi Video Digital Pendidikan",
      theme: "\u201CLiterasi Digital Terbina, Talenta Indonesia Berdampak Nyata\u201D",
      explore: "Jelajahi",
      copy: "\u00A9 2026 Project Ruang. Untuk generasi yang berani merasa.",
    },
  },
  en: {
    nav: {
      manifesto: "Manifesto",
      film: "Film",
      test: "Reflection Test",
      team: "Team",
      cta: "Take the Test",
    },
    hero: {
      overline: "LIDM 2026 · Educational Digital Video Division",
      lines: ["The voices that go", "unheard behind", "\u201Cboys must be strong\u201D."],
      subtitle:
        "Rafa, 17, paints what he feels because he was never taught how to say it. Project Ruang creates a safe space for fathers and sons to talk again — because listening is the highest form of love.",
      ctaPrimary: "Start the Reflection Test",
      ctaSecondary: "Watch the Film",
      scroll: "scroll to explore",
      imageAlt: "A warm father and son moment",
    },
    manifesto: {
      overline: "The Manifesto",
      title: "Why Ruang must exist.",
      chapters: [
        {
          num: "01",
          title: "A silent crisis.",
          body: "One in three Indonesian adolescents experiences mental health issues (I-NAMHS, 2022). Yet only 2.6% reach psychological services. The rest weather the storm alone — in their rooms, behind closed doors.",
          stats: [
            { value: "1/3", label: "of Indonesian adolescents face mental health issues" },
            { value: "2.6%", label: "ever reach psychological support services" },
          ],
          image: "https://images.pexels.com/photos/9127835/pexels-photo-9127835.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        },
        {
          num: "02",
          title: "\u201CReal boys don't cry.\u201D",
          body: "Seven out of ten suicide cases in Indonesia are male. Masculinity pressure forces teenagers to bury their emotions — until they forget how to speak honestly, and fathers forget how to ask.",
          stats: [{ value: "70%", label: "of suicide cases in Indonesia are male" }],
        },
        {
          num: "03",
          title: "A space to meet.",
          body: "Project Ruang combines a 15-scene cinematic film with a psychology-based digital reflection test (IPARTheory). From screen to heart, from heart to the dinner table — a journey: watch, reflect, dialogue, act.",
          stats: [
            { value: "15", label: "cinematic empathy-trigger scenes" },
            { value: "12", label: "IPARTheory-based reflection questions" },
          ],
          image: "https://images.pexels.com/photos/8298201/pexels-photo-8298201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        },
      ],
    },
    film: {
      overline: "Cinematic Film · 15 Scenes",
      title: "When a drawing speaks.",
      synopsis:
        "Rafa (17) pours his emotions onto drawing paper because masculinity pressure has stolen his space to speak. Until his father discovers Project Ruang — and slowly understands that listening is the greatest support he can offer his son.",
      logline:
        "\u201CWhen masculinity pressure robs a teenage boy of his space to be heard, a digital platform called Project Ruang becomes the catalyst for change.\u201D",
      chips: ["Educational Digital Video", "LIDM 2026", "Interactive Storytelling"],
      note: "Full film available on YouTube",
    },
    test: {
      overline: "The Parent Reflection Test",
      title: "How open is the space in your home?",
      desc: "12 reflective questions grounded in the Interpersonal Acceptance-Rejection Theory (IPARTheory). Not a clinical diagnosis — an honest mirror to start a conversation with your child.",
      start: "Begin Reflecting",
      countText: (n) => `${n} parents have reflected in Ruang`,
      questionOf: (i) => `Question ${i} of 12`,
      back: "Back",
      scale: ["Never", "Rarely", "Often", "Almost Always"],
      questions: questionsEn,
      resultOverline: "Your Reflection Result",
      dimensions: {
        warmth: "Warmth & Affection",
        hostility: "Hostility & Aggression",
        indifference: "Indifference & Neglect",
        rejection: "Undifferentiated Rejection",
      },
      insights: {
        warmth: {
          high: "Your warmth is genuinely felt by your child.",
          low: "Your child may be missing your hugs and praise.",
        },
        hostility: {
          high: "Anger and demands may be closing your child's stories.",
          low: "Your child is relatively safe from emotional outbursts.",
        },
        indifference: {
          high: "Busyness may be making your child feel invisible.",
          low: "You are fairly present in his daily life.",
        },
        rejection: {
          high: "Your child may feel accepted only when meeting expectations.",
          low: "Your child feels accepted as he is.",
        },
      },
      levels: {
        warm: {
          title: "A Warm Space",
          desc: "Your warmth is present and felt. Your child most likely feels accepted and safe opening up. Keep it up — and keep listening.",
          advice: [
            "Spend 15 screen-free minutes a day just talking",
            "Ask about his feelings, not only his grades",
            "Say thank you when he dares to be honest",
          ],
        },
        fading: {
          title: "A Fading Space",
          desc: "There is warmth, but distance is quietly growing — from exhaustion, demands, or old habits. This is the best moment to change.",
          advice: [
            "This week, listen to one of his stories to the end without lecturing",
            "Drop one comparing sentence (\u201Cother kids\u2026\u201D) from your vocabulary",
            "Watch the Project Ruang film together, then ask what he thinks",
          ],
        },
        silent: {
          title: "A Silent Room",
          desc: "Your answers suggest your child may not feel fully accepted right now. This is not a verdict — it is an invitation to start one small conversation tonight.",
          advice: [
            "Start small: sit beside him with no agenda at all",
            "Admit one mistake of yours to him — humility opens doors",
            "Consider talking to a family psychologist or counselor",
          ],
        },
      },
      adviceTitle: "Small steps for tonight",
      disclaimer:
        "This test is a reflective and educational tool based on psychological constructs — not a clinical diagnosis. If you or your child needs help, please reach out to a professional psychologist or a nearby mental health service.",
      retake: "Retake the Test",
      watchFilm: "Watch the Film",
    },
    marquee: [
      "Listening is the highest form of love",
      "A space to talk without judgment",
      "Boys are allowed to be fragile too",
      "A hug speaks louder than a lecture",
      "Every child deserves to be heard",
    ],
    team: {
      overline: "Our Team",
      title: "Four students, one space.",
      desc: "The team behind Project Ruang for the 2026 Student Digital Innovation Competition (LIDM).",
      advisorLabel: "Academic Advisor",
      members: [
        { name: "Shelly Alfidenia", role: "Team Leader", focus: "Digital Storytelling & Production", nim: "24043140" },
        { name: "Aji Sulaksana", role: "Creative Director", focus: "Cinematography & Visual Arts", nim: "22136003" },
        { name: "Egazia Evanggelis", role: "Researcher", focus: "Psychological Research & Scriptwriting", nim: "22027016" },
        { name: "Falyanzuril Ihsan", role: "Technical Lead", focus: "Web Experience & Interactive Media", nim: "22349025" },
      ],
      advisor: { name: "Dr. Lailatur Rahmi, S.Pd, M.Pd", focus: "Academic Guidance & Educational Media" },
    },
    footer: {
      tagline: "A space for every voice yet to be heard.",
      lidmLine: "Student Digital Innovation Competition (LIDM) 2026 · Educational Digital Video Division",
      theme: "\u201CLiterasi Digital Terbina, Talenta Indonesia Berdampak Nyata\u201D",
      explore: "Explore",
      copy: "\u00A9 2026 Project Ruang. For a generation brave enough to feel.",
    },
  },
};
