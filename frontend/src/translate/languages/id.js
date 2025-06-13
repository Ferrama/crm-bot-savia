const messages = {
  id: {
    translations: {
      common: {
        search: 'Cari',
        edit: 'Edit',
        delete: 'Hapus',
        cancel: 'Batal',
        save: 'Simpan',
        confirm: 'Konfirmasi',
        close: 'Tutup',
        error: 'Kesalahan',
        success: 'Sukses',
        actions: 'Aksi',
        add: 'Tambah',
        name: 'Nama',
        email: 'Email',
        phone: 'Telepon',
        company: 'Perusahaan',
        connection: 'Koneksi',
        queue: 'Antrian',
        contact: 'Kontak',
        remove: 'Hapus',
      },
      signup: {
        title: 'Daftar',
        toasts: {
          success: 'Pengguna berhasil dibuat! Masuk sekarang!',
          fail: 'Kesalahan saat membuat pengguna. Periksa data yang diberikan.',
        },
        form: {
          name: 'Nama',
          email: 'Email',
          password: 'Kata Sandi',
        },
        buttons: {
          submit: 'Daftar',
          login: 'Sudah punya akun? Masuk!',
        },
      },
      login: {
        title: 'Masuk',
        form: {
          email: 'Email',
          password: 'Kata Sandi',
        },
        buttons: {
          submit: 'Masuk',
          register: 'Belum punya akun? Daftar!',
        },
      },
      companies: {
        title: 'Daftar Perusahaan',
        form: {
          name: 'Nama Perusahaan',
          plan: 'Paket',
          token: 'Token',
          submit: 'Daftar',
          success: 'Perusahaan berhasil dibuat!',
        },
      },
      auth: {
        toasts: {
          success: 'Login berhasil!',
        },
        token: 'Token',
      },
      dashboard: {
        charts: {
          perDay: {
            title: 'Interaksi Hari Ini: ',
          },
        },
      },
      connections: {
        title: 'Koneksi',
        toasts: {
          deleted: 'Koneksi WhatsApp berhasil dihapus!',
        },
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage:
            'Apakah Anda yakin? Tindakan ini tidak bisa dibatalkan.',
          disconnectTitle: 'Putuskan Koneksi',
          disconnectMessage:
            'Apakah Anda yakin? Anda perlu memindai Kode QR lagi.',
        },
        buttons: {
          add: 'Tambah WhatsApp',
          disconnect: 'Putuskan',
          tryAgain: 'Coba Lagi',
          qrcode: 'KODE QR',
          newQr: 'Kode QR Baru',
          connecting: 'Menghubungkan',
        },
        toolTips: {
          disconnected: {
            title: 'Gagal memulai sesi WhatsApp',
            content:
              'Pastikan ponsel Anda terhubung ke internet dan coba lagi, atau minta Kode QR baru.',
          },
          qrcode: {
            title: 'Menunggu pemindaian Kode QR',
            content:
              "Klik tombol 'KODE QR' dan pindai Kode QR dengan ponsel Anda untuk memulai sesi.",
          },
          connected: {
            title: 'Koneksi berhasil!',
          },
          timeout: {
            title: 'Koneksi ke ponsel telah terputus',
            content:
              "Pastikan ponsel Anda terhubung ke internet dan WhatsApp terbuka, atau klik 'Putuskan' untuk mendapatkan Kode QR baru.",
          },
          refresh: 'Muat ulang',
          disconnect: 'Putuskan',
          scan: 'Pindai',
          newQr: 'Kode QR Baru',
          retry: 'Coba Lagi',
        },
        table: {
          name: 'Nama',
          status: 'Status',
          lastUpdate: 'Pembaruan Terakhir',
          default: 'Default',
          actions: 'Aksi',
          session: 'Sesi',
        },
      },
      internalChat: {
        title: 'Obrolan Internal',
        new: 'Baru',
        edit: 'Edit',
        delete: 'Hapus',
        close: 'Tutup',
        save: 'Simpan',
        chat: 'Obrolan',
        titlePlaceholder: 'Judul',
        confirmDelete: 'Apakah Anda yakin ingin menghapus obrolan ini?',
        confirmDeleteMessage: 'Tindakan ini tidak dapat dibatalkan.',
        noChats: 'Tidak ada obrolan ditemukan',
        noMessages: 'Tidak ada pesan ditemukan',
        typeMessage: 'Ketik pesan',
        messages: 'Pesan',
        chats: 'Obrolan',
        spyChat: 'Mata-matai Percakapan',
        closeChat: 'Tutup Obrolan',
        acceptChat: 'Terima Obrolan',
        chatbot: 'Chatbot',
        queue: 'Antrian',
        noQueue: 'Tidak ada antrian',
        assignedTo: 'Ditugaskan ke',
        lastMessage: 'Pesan terakhir',
        newMessage: 'Pesan baru',
        unreadMessages: 'Pesan belum dibaca',
        closed: 'DITUTUP',
        pending: 'MENUNGGU',
        open: 'TERBUKA',
        conversation: 'Percakapan',
        location: 'Lokasi',
        clickToViewLocation: 'Klik untuk melihat lokasi',
        download: 'Unduh',
        noRecords: 'Tidak ada catatan',
        dialog: {
          title: 'Percakapan',
          titleLabel: 'Judul',
          titlePlaceholder: 'Judul',
          close: 'Tutup',
          save: 'Simpan',
          fillTitle: 'Silakan isi judul percakapan.',
          selectUser: 'Silakan pilih setidaknya satu pengguna.',
        },
        tabs: {
          chats: 'Obrolan',
          messages: 'Pesan',
        },
        presence: {
          composing: 'Mengetik...',
          recording: 'Merekam...',
          available: 'Tersedia',
          unavailable: 'Tidak tersedia',
        },
      },
      whatsappModal: {
        title: {
          add: 'Tambah WhatsApp',
          edit: 'Edit WhatsApp',
        },
        form: {
          name: 'Nama',
          default: 'Default',
        },
        buttons: {
          okAdd: 'Tambah',
          okEdit: 'Simpan',
          cancel: 'Batal',
        },
        success: 'WhatsApp berhasil disimpan.',
      },
      qrCode: {
        message: 'Pindai QR',
      },
      contacts: {
        title: 'Kontak',
        toasts: {
          deleted: 'Kontak berhasil dihapus!',
        },
        searchPlaceholder: 'Cari...',
        confirmationModal: {
          deleteTitle: 'Hapus',
          importTitlte: 'Impor Kontak',
          deleteMessage:
            'Apakah Anda yakin ingin menghapus kontak ini? Semua interaksi terkait akan hilang.',
          importMessage:
            'Apakah Anda ingin mengimpor semua kontak dari ponsel?',
        },
        buttons: {
          import: 'Impor Kontak',
          add: 'Tambah Kontak',
        },
        table: {
          name: 'Nama',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Aksi',
        },
      },
      contactModal: {
        title: {
          add: 'Tambah Kontak',
          edit: 'Edit Kontak',
        },
        form: {
          mainInfo: 'Informasi Kontak',
          extraInfo: 'Informasi Tambahan',
          name: 'Nama',
          number: 'Nomor WhatsApp',
          email: 'Email',
          extraName: 'Nama Bidang',
          extraValue: 'Nilai',
          disableBot: 'Nonaktifkan chatbot',
        },
        buttons: {
          addExtraInfo: 'Tambah Informasi',
          okAdd: 'Tambah',
          okEdit: 'Simpan',
          cancel: 'Batal',
        },
        success: 'Kontak berhasil disimpan.',
      },
      queueModal: {
        title: {
          add: 'Tambah Antrian',
          edit: 'Edit Antrian',
        },
        form: {
          name: 'Nama',
          color: 'Warna',
          greetingMessage: 'Pesan Sambutan',
          complationMessage: 'Pesan Penyelesaian',
          outOfHoursMessage: 'Pesan Di Luar Jam Kerja',
          ratingMessage: 'Pesan Penilaian',
          transferMessage: 'Pesan Transfer',
          token: 'Token',
        },
        outOfHoursAction: {
          title: 'Tindakan Di Luar Jam Kerja',
          options: {
            pending: 'Biarkan tertunda',
            closed: 'Tutup tiket',
          },
        },
        buttons: {
          okAdd: 'Tambah',
          okEdit: 'Simpan',
          cancel: 'Batal',
          attach: 'Lampirkan File',
        },
        serviceHours: {
          dayWeek: 'Hari dalam Minggu',
          startTimeA: 'Waktu Mulai - Shift A',
          endTimeA: 'Waktu Berakhir - Shift A',
          startTimeB: 'Waktu Mulai - Shift B',
          endTimeB: 'Waktu Berakhir - Shift B',
          monday: 'Senin',
          tuesday: 'Selasa',
          wednesday: 'Rabu',
          thursday: 'Kamis',
          friday: 'Jumat',
          saturday: 'Sabtu',
          sunday: 'Minggu',
        },
      },
      userModal: {
        title: {
          add: 'Tambah Pengguna',
          edit: 'Edit Pengguna',
        },
        form: {
          name: 'Nama',
          email: 'Email',
          password: 'Kata Sandi',
          profile: 'Profil',
        },
        buttons: {
          okAdd: 'Tambah',
          okEdit: 'Simpan',
          cancel: 'Batal',
        },
        success: 'Pengguna berhasil disimpan.',
      },
      scheduleModal: {
        title: {
          error: 'Kesalahan Pengiriman',
          schedule: 'Jadwalkan pesan',
        },
        status: {
          pending: 'Menunggu',
          sent: 'Terkirim',
          erro: 'Kesalahan',
        },
        validation: {
          bodyMin: 'Pesan terlalu pendek',
          required: 'Wajib diisi',
          minTime: 'Waktu harus minimal 5 menit setelah sekarang',
        },
        form: {
          body: 'Pesan',
          sendAt: 'Kirim pada',
          saveMessage: 'Simpan sebagai template',
          contactPlaceholder: 'Kontak',
          whatsappPlaceholder: 'WhatsApp',
        },
        buttons: {
          cancel: 'Batal',
          okAdd: 'Tambah',
          okEdit: 'Simpan',
        },
        success: 'Jadwal berhasil disimpan!',
      },
      tagModal: {
        title: {
          add: 'Tag Baru',
          edit: 'Edit Tag',
          addKanban: 'Lorong Baru',
          editKanban: 'Edit Lorong',
        },
        form: {
          name: 'Nama',
          color: 'Warna',
          kanban: 'Kanban',
        },
        buttons: {
          okAdd: 'Tambah',
          okEdit: 'Simpan',
          cancel: 'Batal',
        },
        success: 'Tag berhasil disimpan.',
        successKanban: 'Lorong berhasil disimpan.',
      },
      chat: {
        noTicketMessage: 'Pilih tiket untuk memulai percakapan.',
      },
      uploads: {
        titles: {
          titleUploadMsgDragDrop: 'SERET DAN LETAKKAN FILE DI KOLOM DI BAWAH',
          titleFileList: 'Daftar file(s)',
        },
      },
      ticketsManager: {
        buttons: {
          newTicket: 'Baru',
        },
      },
      ticketsQueueSelect: {
        placeholder: 'Antrian',
      },
      tickets: {
        toasts: {
          deleted: 'Tiket yang sedang Anda kerjakan telah dihapus.',
        },
        notification: {
          message: 'Pesan dari',
        },
        tabs: {
          open: { title: 'Terbuka' },
          closed: { title: 'Ditutup' },
          groups: { title: 'Grup' },
          search: { title: 'Cari' },
        },
        status: {
          closed: 'DITUTUP',
        },
        tooltips: {
          closeConversation: 'Tutup Percakapan',
        },
        search: {
          placeholder: 'Cari tiket dan pesan',
        },
        buttons: {
          showAll: 'Semua',
        },
      },
      transferTicketModal: {
        title: 'Transfer Tiket',
        fieldLabel: 'Ketik untuk mencari pengguna',
        fieldQueueLabel: 'Transfer ke antrian',
        fieldQueuePlaceholder: 'Pilih antrian',
        noOptions: 'Tidak ada pengguna yang ditemukan dengan nama itu',
        buttons: {
          ok: 'Transfer',
          cancel: 'Batal',
        },
      },
      ticketsList: {
        pendingHeader: 'Tertunda',
        assignedHeader: 'Ditugaskan',
        noTicketsTitle: 'Tidak ada apa-apa di sini!',
        noTicketsMessage:
          'Tidak ada tiket yang ditemukan dengan status ini atau istilah pencarian',
        buttons: {
          accept: 'Terima',
        },
      },
      newTicketModal: {
        title: 'Buat Tiket',
        fieldLabel: 'Cari kontak',
        add: 'Tambah',
        buttons: {
          ok: 'Simpan',
          cancel: 'Batal',
        },
      },
      mainDrawer: {
        listItems: {
          dashboard: 'Dasbor',
          connections: 'Koneksi',
          tickets: 'Tiket',
          quickMessages: 'Respon Cepat',
          contacts: 'Kontak',
          queues: 'Antrian',
          tags: 'Tags',
          administration: 'Administrasi',
          service: 'Service',
          users: 'Pengguna',
          settings: 'Pengaturan',
          helps: 'Bantuan',
          messagesAPI: 'API',
          schedules: 'Penjadwalan',
          campaigns: 'Kampanye',
          annoucements: 'Pengumuman',
          chats: 'Obrolan',
          financeiro: 'Finansial',
          logout: 'Logout',
          management: 'Management',
          kanban: 'Kanban',
          leads: 'Lead',
          todoList: 'Daftar Tugas',
          savia: 'Savia',
          listing: 'Daftar',
          contactLists: 'Daftar Kontak',
          configurations: 'Konfigurasi',
        },
        appBar: {
          i18n: {
            language: 'Indonesian',
            language_short: 'ID',
          },
          user: {
            profile: 'Profile',
            darkmode: 'Dark mode',
            lightmode: 'Light mode',
            language: 'Select language',
            about: 'About',
            logout: 'Keluar',
          },
        },
      },
      messagesAPI: {
        title: 'API',
        textMessage: {
          number: 'Nomor',
          body: 'Pesan',
          token: 'Token Terdaftar',
        },
        mediaMessage: {
          number: 'Nomor',
          body: 'Nama File',
          media: 'File',
          token: 'Token Terdaftar',
        },
      },
      notifications: {
        noTickets: 'Tidak ada notifikasi.',
      },
      quickMessages: {
        title: 'Respon Cepat',
        buttons: {
          add: 'Respon Baru',
        },
        dialog: {
          title: 'Pesan Cepat',
          shortcode: 'Pintasan',
          message: 'Respon',
          buttons: {
            cancel: 'Batal',
            save: 'Simpan',
          },
        },
      },
      kanban: {
        title: 'Kanban',
        searchPlaceholder: 'Cari',
        subMenus: {
          list: 'Panel',
          tags: 'Jalur',
        },
      },
      tagsKanban: {
        title: 'Jalur',
        laneDefault: 'Buka',
        confirmationModal: {
          deleteTitle: 'Apakah Anda yakin ingin menghapus Jalur ini?',
          deleteMessage: 'Tindakan ini tidak dapat dibatalkan.',
        },
        table: {
          name: 'Nama',
          color: 'Warna',
          tickets: 'Tiket',
          actions: 'Aksi',
        },
        buttons: {
          add: 'Jalur Baru',
        },
        toasts: {
          deleted: 'Jalur berhasil dihapus.',
        },
      },
      queues: {
        title: 'Antrian',
        table: {
          name: 'Nama',
          color: 'Warna',
          actions: 'Aksi',
        },
        buttons: {
          add: 'Daftar Baru',
        },
        dialog: {
          name: 'Nama',
          company: 'Perusahaan',
          okEdit: 'Edit',
          okAdd: 'Tambah',
          add: 'Tambah',
          edit: 'Edit',
          cancel: 'Batal',
        },
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage: 'Tindakan ini tidak dapat dibatalkan.',
        },
        toasts: {
          deleted: 'Data berhasil dihapus',
        },
      },
      contactLists: {
        title: 'Daftar Kontak',
        table: {
          name: 'Nama',
          contacts: 'Kontak',
          actions: 'Tindakan',
        },
        buttons: {
          add: 'Daftar Baru',
        },
        dialog: {
          name: 'Nama',
          company: 'Perusahaan',
          okEdit: 'Edit',
          okAdd: 'Tambah',
          add: 'Tambah',
          edit: 'Edit',
          cancel: 'Batal',
        },
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage: 'Tindakan ini tidak dapat dibatalkan.',
        },
        toasts: {
          deleted: 'Rekam dihapus',
          created: 'Rekam dibuat',
        },
      },
      contactListItems: {
        title: 'Kontak',
        searchPlaceholder: 'Cari',
        buttons: {
          add: 'Baru',
          lists: 'Daftar',
          import: 'Impor',
        },
        dialog: {
          name: 'Nama',
          number: 'Nomor',
          whatsapp: 'WhatsApp',
          email: 'Email',
          okEdit: 'Edit',
          okAdd: 'Tambah',
          add: 'Tambah',
          edit: 'Edit',
          cancel: 'Batal',
        },
        table: {
          name: 'Nama',
          number: 'Nomor',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Aksi',
        },
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage: 'Tindakan ini tidak dapat dibatalkan.',
          importMessage:
            'Apakah Anda ingin mengimpor kontak dari spreadsheet ini?',
          importTitlte: 'Impor',
        },
        toasts: {
          deleted: 'Data berhasil dihapus',
        },
      },
      campaigns: {
        title: 'Kampanye',
        searchPlaceholder: 'Cari',
        buttons: {
          add: 'Kampanye Baru',
          contactLists: 'Daftar Kontak',
        },
        table: {
          name: 'Nama',
          whatsapp: 'Koneksi',
          contactList: 'Daftar Kontak',
          status: 'Status',
          scheduledAt: 'Dijadwalkan',
          completedAt: 'Selesai',
          confirmation: 'Konfirmasi',
          actions: 'Aksi',
        },
        dialog: {
          new: 'Kampanye Baru',
          update: 'Edit Kampanye',
          readonly: 'Hanya-baca',
          form: {
            name: 'Nama',
            message1: 'Pesan 1',
            message2: 'Pesan 2',
            message3: 'Pesan 3',
            message4: 'Pesan 4',
            message5: 'Pesan 5',
            confirmationMessage1: 'Pesan Konfirmasi 1',
            confirmationMessage2: 'Pesan Konfirmasi 2',
            confirmationMessage3: 'Pesan Konfirmasi 3',
            confirmationMessage4: 'Pesan Konfirmasi 4',
            confirmationMessage5: 'Pesan Konfirmasi 5',
            messagePlaceholder: 'Isi Pesan',
            whatsapp: 'Koneksi',
            status: 'Status',
            scheduledAt: 'Dijadwalkan',
            confirmation: 'Konfirmasi',
            contactList: 'Daftar Kontak',
          },
          buttons: {
            add: 'Tambah',
            edit: 'Perbarui',
            okadd: 'Oke',
            cancel: 'Batalkan Pengiriman',
            restart: 'Mulai Ulang Pengiriman',
            close: 'Tutup',
            attach: 'Lampirkan File',
          },
        },
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage: 'Tindakan ini tidak dapat dibatalkan.',
        },
        toasts: {
          success: 'Operasi berhasil diselesaikan',
          cancel: 'Kampanye dibatalkan',
          restart: 'Kampanye dimulai ulang',
          deleted: 'Data berhasil dihapus',
        },
      },
      announcements: {
        title: 'Pengumuman',
        searchPlaceholder: 'Cari',
        buttons: {
          add: 'Pengumuman Baru',
          contactLists: 'Daftar Pengumuman',
        },
        table: {
          priority: 'Prioritas',
          title: 'Judul',
          text: 'Teks',
          mediaName: 'File',
          status: 'Status',
          actions: 'Aksi',
        },
        dialog: {
          edit: 'Edit Pengumuman',
          add: 'Pengumuman Baru',
          update: 'Edit Pengumuman',
          readonly: 'Hanya-baca',
          form: {
            priority: 'Prioritas',
            title: 'Judul',
            text: 'Teks',
            mediaPath: 'File',
            status: 'Status',
          },
          buttons: {
            add: 'Tambah',
            edit: 'Perbarui',
            okadd: 'Oke',
            cancel: 'Batal',
            close: 'Tutup',
            attach: 'Lampirkan File',
          },
        },
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage: 'Tindakan ini tidak dapat dibatalkan.',
        },
        toasts: {
          success: 'Operasi berhasil diselesaikan',
          deleted: 'Data berhasil dihapus',
        },
      },
      campaignsConfig: {
        title: 'Konfigurasi Kampanye',
        intervals: 'Interval',
        messageInterval: 'Interval pesan',
        longerIntervalAfter: 'Interval lebih lama setelah',
        greaterInterval: 'Interval lebih besar',
        noInterval: 'Tidak ada interval',
        notDefined: 'Tidak didefinisikan',
        seconds: 'detik',
        messages: 'pesan',
        addVariable: 'Tambah Variabel',
        saveSettings: 'Simpan Pengaturan',
        shortcode: 'Kode',
        content: 'Konten',
        variables: 'Variabel',
      },
      queues: {
        title: 'Antrian & Chatbot',
        table: {
          name: 'Nama',
          color: 'Warna',
          greeting: 'Pesan Sambutan',
          actions: 'Aksi',
        },
        buttons: {
          add: 'Tambah Antrian',
        },
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage:
            'Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan! Tiket dari antrian ini akan tetap ada tetapi tidak akan lagi ditugaskan ke antrian mana pun.',
        },
      },
      queueSelect: {
        inputLabel: 'Antrian',
      },
      users: {
        title: 'Pengguna',
        table: {
          name: 'Nama',
          email: 'Email',
          profile: 'Profil',
          actions: 'Aksi',
        },
        buttons: {
          add: 'Tambah Pengguna',
        },
        toasts: {
          deleted: 'Pengguna berhasil dihapus.',
        },
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage:
            'Semua data pengguna akan hilang. Tiket terbuka dari pengguna ini akan dipindahkan ke antrian.',
        },
      },
      helps: {
        title: 'Pusat Bantuan',
      },
      about: {
        aboutthe: 'Tentang',
        copyright: '� 2024 - Didukung oleh ticketz',
        buttonclose: 'Tutup',
        title: 'Tentang ticketz',
        abouttitle: 'Asal dan peningkatan',
        aboutdetail:
          'ticketz berasal secara tidak langsung dari proyek Whaticket dengan peningkatan yang dibagikan oleh para pengembang sistem EquipeChat melalui saluran VemFazer di YouTube, kemudian ditingkatkan oleh Claudemir Todo Bom',
        aboutauthorsite: 'Situs penulis',
        aboutwhaticketsite: 'Situs Komunitas Whaticket di Github',
        aboutvemfazersite: 'Situs saluran Vem Fazer di Github',
        licenseheading: 'Lisensi Sumber Terbuka',
        licensedetail:
          'ticketz dilisensikan di bawah GNU Affero General Public License versi 3, yang berarti bahwa setiap pengguna yang memiliki akses ke aplikasi ini berhak untuk mendapatkan akses ke kode sumbernya. Informasi lebih lanjut di tautan berikut:',
        licensefulltext: 'Teks lengkap lisensi',
        licensesourcecode: 'Kode sumber Ticketz',
      },
      schedules: {
        title: 'Jadwal',
        confirmationModal: {
          deleteTitle: 'Hapus',
          deleteMessage:
            'Apakah Anda yakin ingin menghapus kampanye ini? Tindakan ini tidak dapat dibatalkan.',
        },
        table: {
          contact: 'Kontak',
          body: 'Pesan',
          sendAt: 'Tanggal Penjadwalan',
          sentAt: 'Tanggal Pengiriman',
          status: 'Status',
          actions: 'Aksi',
        },
        buttons: {
          add: 'Jadwal Baru',
        },
        toasts: {
          deleted: 'Jadwal berhasil dihapus.',
        },
      },
      tags: {
        title: 'Tag',
        confirmationModal: {
          deleteTitle: 'Apakah Anda yakin ingin menghapus Tag ini?',
          deleteMessage: 'Tindakan ini tidak dapat dibatalkan.',
        },
        table: {
          name: 'Nama',
          color: 'Warna',
          tickets: 'Catatan',
          actions: 'Aksi',
          id: 'Id',
          kanban: 'Kanban',
        },
        buttons: {
          add: 'Tag Baru',
        },
        toasts: {
          deleted: 'Tag berhasil dihapus.',
        },
      },
      whitelabel: {
        primaryColorLight: 'Warna Utama Terang',
        primaryColorDark: 'Warna Utama Gelap',
        lightLogo: 'Logo aplikasi terang',
        darkLogo: 'Logo aplikasi gelap',
        favicon: 'Favicon logo aplikasi',
        appname: 'Nama aplikasi',
        logoHint: 'Prefer SVG dan aspek 28:10',
        faviconHint: 'Prefer gambar SVG persegi atau PNG 512x512',
      },
      settings: {
        group: {
          general: 'Umum',
          timeouts: 'Batas waktu',
          officeHours: 'Jam kantor',
          groups: 'Grup',
          confidenciality: 'Kerahasiaan',
          api: 'API',
          externalServices: 'Layanan eksternal',
          serveradmin: 'Administrasi server',
        },
        success: 'Pengaturan berhasil disimpan.',
        copiedToClipboard: 'Disalin ke clipboard',
        title: 'Pengaturan',
        chatbotTicketTimeout: 'Timeout chatbot (menit)',
        chatbotTicketTimeoutAction: 'Aksi timeout chatbot',
        settings: {
          userCreation: {
            name: 'Pembuatan pengguna',
            options: {
              enabled: 'Diaktifkan',
              disabled: 'Dinonaktifkan',
            },
          },
        },
        validations: {
          title: 'Penilaian',
          options: {
            enabled: 'Diaktifkan',
            disabled: 'Dinonaktifkan',
          },
        },
        OfficeManagement: {
          title: 'Manajemen kantor',
          options: {
            disabled: 'Dinonaktifkan',
            ManagementByDepartment: 'Manajemen per antrian',
            ManagementByCompany: 'Manajemen per perusahaan',
          },
        },
        outOfHoursAction: {
          title: 'Aksi di luar jam kerja',
          options: {
            pending: 'Biarkan sebagai tertunda',
            closed: 'Tutup tiket',
          },
        },
        IgnoreGroupMessages: {
          title: 'Abaikan pesan grup',
          options: {
            enabled: 'Diaktifkan',
            disabled: 'Dinonaktifkan',
          },
        },
        soundGroupNotifications: {
          title: 'Notifikasi suara grup',
          options: {
            enabled: 'Diaktifkan',
            disabled: 'Dinonaktifkan',
          },
        },
        groupsTab: {
          title: 'Tab Grup',
          options: {
            enabled: 'Diaktifkan',
            disabled: 'Dinonaktifkan',
          },
        },
        VoiceAndVideoCalls: {
          title: 'Panggilan suara dan video',
          options: {
            enabled: 'Abaikan',
            disabled: 'Informasikan ketidaktersediaan',
          },
        },
        AutomaticChatbotOutput: {
          title: 'Keluar chatbot otomatis',
          options: {
            enabled: 'Diaktifkan',
            disabled: 'Dinonaktifkan',
          },
        },
        ShowNumericEmoticons: {
          title: 'Tampilkan emotikon numerik di antrian',
          options: {
            enabled: 'Diaktifkan',
            disabled: 'Dinonaktifkan',
          },
        },
        QuickMessages: {
          title: 'Pesan cepat',
          options: {
            enabled: 'Per perusahaan',
            disabled: 'Per pengguna',
          },
        },
        AllowRegistration: {
          title: 'Izinkan pendaftaran',
          options: {
            enabled: 'Diaktifkan',
            disabled: 'Dinonaktifkan',
          },
        },
        FileUploadLimit: {
          title: 'Batas unggah file (MB)',
        },
        FileDownloadLimit: {
          title: 'Batas unduh file (MB)',
        },
        messageVisibility: {
          title: 'Visibilitas pesan',
          options: {
            respectMessageQueue: 'Hormati antrian pesan',
            respectTicketQueue: 'Hormati antrian tiket',
          },
        },
        keepQueueAndUser: {
          title: 'Pertahankan antrian dan pengguna di tiket tertutup',
          options: {
            enabled: 'Diaktifkan',
            disabled: 'Dinonaktifkan',
          },
        },
        GracePeriod: {
          title: 'Masa tenggang setelah kedaluwarsa (hari)',
        },
        ticketAcceptedMessage: {
          title: 'Pesan tiket diterima',
          placeholder: 'Masukkan pesan tiket diterima Anda di sini',
        },
        transferMessage: {
          title: 'Pesan transfer',
          placeholder: 'Masukkan pesan transfer Anda di sini',
        },
        mustacheVariables: {
          title: 'Variabel yang tersedia:',
        },
        WelcomeGreeting: {
          greetings: 'Halo',
          welcome: 'Selamat datang di',
          expirationTime: 'Aktif hingga',
        },
        Options: {
          title: 'Opsi',
        },
        Companies: {
          title: 'Perusahaan',
        },
        schedules: {
          title: 'Jadwal',
        },
        Plans: {
          title: 'Paket',
        },
        Help: {
          title: 'Bantuan',
        },
        Whitelabel: {
          title: 'Whitelabel',
        },
        PaymentGateways: {
          title: 'Gateway pembayaran',
        },
        AIProvider: {
          title: 'Layanan AI',
        },
        AudioTranscriptions: {
          title: 'Transkripsi audio',
        },
        TagsMode: {
          title: 'Mode tag',
          options: {
            ticket: 'Tiket',
            contact: 'Kontak',
            both: 'Tiket dan Kontak',
          },
        },
        schedulesUpdated: 'Jadwal berhasil diperbarui.',
        operationUpdated: 'Operasi berhasil diperbarui.',
        paymentGateway: 'Gateway pembayaran',
        none: 'Tidak ada',
        owenPayments: 'Owen Payments 💎',
        efi: 'Efí',
        apiToken: 'Token API',
        aiKey: 'Kunci AI',
        defaultAppName: 'Ticketz',
        // Timeout settings
        ratingsTimeout: 'Timeout penilaian (menit)',
        noQueueTimeout: 'Timeout tanpa antrian (menit)',
        noQueueTimeoutAction: 'Aksi timeout tanpa antrian',
        openTicketTimeout: 'Timeout tiket terbuka (menit)',
        openTicketTimeoutAction: 'Aksi timeout tiket terbuka',
        autoReopenTimeout: 'Timeout buka ulang otomatis (menit)',
        // Actions
        returnToQueue: 'Kembali ke antrian',
        // Office hours
        officeHours: 'Jam kantor',
        officeManagement: 'Manajemen kantor',
        managementByQueue: 'Manajemen per antrian',
        managementByCompany: 'Manajemen per perusahaan',
        // Groups
        groups: 'Grup',
        ignoreGroupMessages: 'Abaikan pesan grup',
        groupSoundNotifications: 'Notifikasi suara grup',
        groupsTab: 'Tab Grup',
        // Confidentiality
        confidentiality: 'Kerahasiaan',
        messageVisibility: 'Visibilitas pesan',
        respectMessageQueue: 'Hormati antrian pesan',
        respectTicketQueue: 'Hormati antrian tiket',
        keepQueueAndUser: 'Pertahankan antrian dan pengguna',
        // API
        api: 'API',
        // Out of hours
        outOfHoursAction: 'Aksi di luar jam kerja',
        leaveAsPending: 'Biarkan sebagai tertunda',
        // Enabled/Disabled
        enabled: 'Diaktifkan',
        disabled: 'Dinonaktifkan',
      },
      messagesList: {
        header: {
          assignedTo: 'Ditugaskan kepada:',
          buttons: {
            return: 'Kembali',
            resolve: 'Selesaikan',
            reopen: 'Buka Kembali',
            accept: 'Terima',
          },
        },
      },
      messagesInput: {
        placeholderOpen: 'Ketik pesan',
        placeholderClosed:
          'Buka kembali atau terima tiket ini untuk mengirim pesan.',
        signMessage: 'Tandatangani',
        replying: 'Membalas',
        editing: 'Mengedit',
      },
      message: {
        edited: 'Diedit',
        forwarded: 'Diteruskan',
      },

      contactDrawer: {
        header: 'Informasi Kontak',
        buttons: {
          edit: 'Edit Kontak',
        },
        extraInfo: 'Informasi lainnya',
      },
      ticketOptionsMenu: {
        schedule: 'Jadwal',
        delete: 'Hapus',
        transfer: 'Transfer',
        registerAppointment: 'Catatan Kontak',
        appointmentsModal: {
          title: 'Catatan Kontak',
          textarea: 'Catatan',
          placeholder: 'Masukkan informasi yang ingin Anda catat di sini',
        },
        confirmationModal: {
          title: 'Hapus tiket kontak',
          message:
            'Perhatian! Semua pesan yang terkait dengan tiket akan hilang.',
        },
        buttons: {
          delete: 'Hapus',
          cancel: 'Batal',
        },
      },
      confirmationModal: {
        buttons: {
          confirm: 'Oke',
          cancel: 'Batal',
        },
      },
      messageOptionsMenu: {
        delete: 'Hapus',
        edit: 'Edit',
        forward: 'Teruskan',
        history: 'Riwayat',
        reply: 'Balas',
        confirmationModal: {
          title: 'Hapus pesan?',
          message: 'Tindakan ini tidak dapat dibatalkan.',
        },
      },
      messageHistoryModal: {
        close: 'Tutup',
        title: 'Riwayat edit pesan',
      },
      presence: {
        unavailable: 'Tidak tersedia',
        available: 'Tersedia',
        composing: 'Menulis...',
        recording: 'Merekam...',
        paused: 'Jeda',
      },
      privacyModal: {
        title: 'Edit Privasi Whatsapp',
        buttons: {
          cancel: 'Membatalkan',
          okEdit: 'Menyimpan',
        },
        form: {
          menu: {
            all: 'Semua',
            none: 'Bukan siapa-siapa',
            contacts: 'Kontak saya',
            contact_blacklist: 'Kontak yang dipilih',
            match_last_seen: 'Pertandingan Terakhir Dilihat',
            known: 'Diketahui',
            disable: 'Dengan disabilitas',
            hrs24: '24 Jam',
            dias7: '7 Hari',
            dias90: '90 Hari',
          },
          readreceipts: 'Untuk memperbarui privasi Tanda Terima Baca',
          profile: 'Untuk memperbarui privasi Gambar Profil',
          status: 'Untuk memperbarui privasi Pesan',
          online: 'Untuk memperbarui Privasi Online',
          last: 'Untuk memperbarui privasi Terakhir terlihat',
          groupadd: 'Untuk memperbarui Grup Tambahkan privasi',
          calladd: 'Untuk memperbarui Panggilan Tambahkan privasi',
          disappearing: 'Untuk memperbarui Mode Hilang Default',
        },
      },
      backendErrors: {
        ERR_FORBIDDEN: 'Akses ditolak. Periksa izin Anda.',
        ERR_CHECK_NUMBER: 'Nomor ini tidak terdaftar di WhatsApp.',
        ERR_NO_OTHER_WHATSAPP: 'Harus ada setidaknya satu WhatsApp default.',
        ERR_NO_DEF_WAPP_FOUND:
          'Tidak ada WhatsApp default yang ditemukan. Periksa halaman koneksi.',
        ERR_WAPP_NOT_INITIALIZED:
          'Sesi WhatsApp ini belum diinisialisasi. Periksa halaman koneksi.',
        ERR_WAPP_CHECK_CONTACT:
          'Tidak dapat memeriksa kontak WhatsApp. Periksa halaman koneksi.',
        ERR_WAPP_INVALID_CONTACT: 'Ini bukan nomor WhatsApp yang valid.',
        ERR_WAPP_DOWNLOAD_MEDIA:
          'Tidak dapat mengunduh media dari WhatsApp. Periksa halaman koneksi.',
        ERR_INVALID_CREDENTIALS: 'Kesalahan autentikasi. Silakan coba lagi.',
        ERR_SENDING_WAPP_MSG:
          'Kesalahan mengirim pesan WhatsApp. Periksa halaman koneksi.',
        ERR_DELETE_WAPP_MSG: 'Tidak dapat menghapus pesan WhatsApp.',
        ERR_EDITING_WAPP_MSG: 'Tidak dapat mengedit pesan WhatsApp.',
        ERR_OTHER_OPEN_TICKET: 'Sudah ada tiket terbuka untuk kontak ini.',
        ERR_SESSION_EXPIRED: 'Sesi berakhir. Silakan masuk.',
        ERR_USER_CREATION_DISABLED:
          'Pembuatan pengguna telah dinonaktifkan oleh administrator.',
        ERR_NO_PERMISSION:
          'Anda tidak memiliki izin untuk mengakses sumber daya ini.',
        ERR_DUPLICATED_CONTACT: 'Kontak dengan nomor ini sudah ada.',
        ERR_NO_SETTING_FOUND: 'Tidak ada pengaturan ditemukan dengan ID ini.',
        ERR_NO_CONTACT_FOUND: 'Tidak ada kontak ditemukan dengan ID ini.',
        ERR_NO_TICKET_FOUND: 'Tidak ada tiket ditemukan dengan ID ini.',
        ERR_NO_USER_FOUND: 'Tidak ada pengguna ditemukan dengan ID ini.',
        ERR_NO_WAPP_FOUND: 'Tidak ada WhatsApp ditemukan dengan ID ini.',
        ERR_CREATING_MESSAGE: 'Kesalahan membuat pesan dalam basis data.',
        ERR_CREATING_TICKET: 'Kesalahan membuat tiket dalam basis data.',
        ERR_FETCH_WAPP_MSG:
          'Kesalahan mengambil pesan dari WhatsApp, mungkin terlalu lama.',
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          'Warna ini sudah digunakan, pilih yang lain.',
        ERR_WAPP_GREETING_REQUIRED:
          'Pesan sambutan wajib jika ada lebih dari satu antrian.',
      },
      ticketz: {
        registration: {
          header: 'Daftar di basis pengguna Ticketz',
          description:
            'Isi kolom di bawah ini untuk mendaftar di basis pengguna Ticketz dan menerima berita tentang proyek.',
          name: 'Nama',
          country: 'Negara',
          phoneNumber: 'Nomor Telepon',
          submit: 'Daftar',
        },
        support: {
          title: 'Dukung proyek Ticketz',
          mercadopagotitle: 'Kartu Kredit',
          recurringbrl: 'Donasi berulang dalam BRL',
          paypaltitle: 'Kartu Kredit',
          international: 'Donasi dalam USD',
        },
      },
      interactions: {
        toasts: {
          created: 'Interaksi berhasil dibuat',
        },
        buttons: {
          add: 'Tambah Interaksi',
        },
        types: {
          note: 'Catatan',
          email: 'E-mail',
          message: 'Pesan',
          file: 'File',
        },
        categories: {
          internal_note: 'Catatan Internal',
          customer_communication: 'Komunikasi Pelanggan',
          system: 'Sistem',
        },
        dialog: {
          add: 'Tambah Interaksi',
        },
        form: {
          type: 'Jenis',
          category: 'Kategori',
          notes: 'Catatan',
        },
      },
      leads: {
        title: 'Prospek',
        searchPlaceholder: 'Cari prospek',
        notFound: 'Prospek tidak ditemukan',
        buttons: {
          add: 'Prospek Baru',
          save: 'Simpan',
          cancel: 'Batal',
        },
        views: {
          board: 'Papan',
          list: 'Daftar',
        },
        tabs: {
          basic: 'Dasar',
          contact: 'Kontak',
          financial: 'Keuangan',
          tags: 'Tag',
          notes: 'Catatan',
        },
        modal: {
          add: {
            title: 'Prospek Baru',
          },
          edit: {
            title: 'Edit Prospek',
          },
          form: {
            contact: 'Kontak',
            stage: 'Tahap',
            temperature: 'Temperatur',
            source: 'Sumber',
            expectedValue: 'Nilai yang Diharapkan',
            probability: 'Probabilitas (%)',
            expectedClosingDate: 'Tanggal Penutupan yang Diharapkan',
            assignedTo: 'Ditugaskan ke',
            notes: 'Catatan',
            selectUser: 'Pilih pengguna',
          },
        },
        dialog: {
          new: 'Prospek Baru',
          edit: 'Edit Prospek',
          addTag: 'Tambah Tag',
        },
        form: {
          name: 'Nama',
          title: 'Judul',
          titleHelper: 'Deskripsi singkat prospek',
          description: 'Deskripsi',
          temperature: 'Temperatur',
          status: 'Status',
          pipeline: 'Pipeline',
          contact: 'Kontak',
          column: 'Kolom',
          assignedTo: 'Ditugaskan ke',
          unassigned: 'Tidak ditugaskan',
          source: 'Sumber',
          expectedValue: 'Nilai yang Diharapkan',
          currency: 'Mata Uang',
          probability: 'Probabilitas (%)',
          probabilityHelper: 'Probabilitas menutup kesepakatan (0-100%)',
          expectedClosingDate: 'Tanggal Penutupan yang Diharapkan',
          tags: 'Tag',
          addTag: 'Tambah Tag',
          tag: 'Tag',
          customFields: 'Bidang Kustom',
          customFieldName: 'Masukkan nama bidang kustom',
          addCustomField: 'Tambah Bidang Kustom',
          notes: 'Catatan',
        },
        table: {
          lead: 'Prospek',
          contact: 'Kontak',
          status: 'Status',
          pipeline: 'Pipeline',
          column: 'Kolom',
          temperature: 'Temperatur',
          tags: 'Tag',
          financial: 'Keuangan',
          assignedTo: 'Ditugaskan ke',
          actions: 'Tindakan',
          unassigned: 'Tidak ditugaskan',
        },
        sections: {
          contact: 'Informasi Kontak',
          financial: 'Informasi Keuangan',
          tags: 'Tag',
          customFields: 'Bidang Kustom',
          notes: 'Catatan',
        },
        fields: {
          contact: 'Kontak',
          phone: 'Telepon',
          email: 'E-mail',
          source: 'Sumber',
          assignedTo: 'Ditugaskan ke',
          expectedValue: 'Nilai yang Diharapkan',
          probability: 'Probabilitas',
          expectedClosingDate: 'Tanggal Penutupan yang Diharapkan',
        },
        status: {
          new: 'Baru',
          contacted: 'Dihubungi',
          follow_up: 'Tindak Lanjut',
          proposal: 'Proposal',
          negotiation: 'Negosiasi',
          qualified: 'Terkualifikasi',
          unqualified: 'Tidak Terkualifikasi',
          converted: 'Dikonversi',
          lost: 'Kalah',
          closed_won: 'Ditutup Menang',
          closed_lost: 'Ditutup Kalah',
        },
        pipeline: {
          default: 'Default',
          sales: 'Penjualan',
          support: 'Dukungan',
          onboarding: 'Onboarding',
        },
        temperature: {
          hot: 'Panas',
          warm: 'Hangat',
          cold: 'Dingin',
        },
        timeline: {
          title: 'Timeline',
          empty: 'Tidak ada interaksi ditemukan',
        },
        toasts: {
          created: 'Prospek berhasil dibuat',
          updated: 'Prospek berhasil diperbarui',
          deleted: 'Prospek berhasil dihapus',
          contactRequired: 'Kontak diperlukan',
          tagAdded: 'Tag berhasil ditambahkan',
          tagRemoved: 'Tag berhasil dihapus',
        },
        validation: {
          name: {
            required: 'Nama diperlukan',
          },
          title: {
            max: 'Judul harus maksimal 255 karakter',
          },
          contact: {
            required: 'Kontak diperlukan',
          },
          column: {
            required: 'Kolom diperlukan',
          },
          temperature: {
            required: 'Temperatur diperlukan',
          },
          status: {
            required: 'Status diperlukan',
          },
          pipeline: {
            required: 'Pipeline diperlukan',
          },
          source: {
            required: 'Sumber diperlukan',
          },
          currency: {
            required: 'Mata uang diperlukan',
          },
          probability: {
            min: 'Probabilitas harus minimal 0',
            max: 'Probabilitas harus maksimal 100',
          },
        },
        leadColumns: {
          buttons: {
            add: 'Kolom Baru',
            save: 'Simpan',
            cancel: 'Batal',
          },
          dialog: {
            new: 'Kolom Baru',
            edit: 'Edit Kolom',
          },
          modal: {
            add: {
              title: 'Kolom Baru',
            },
            edit: {
              title: 'Edit Kolom',
            },
            form: {
              name: 'Nama',
              color: 'Warna',
            },
          },
          toasts: {
            created: 'Kolom berhasil dibuat',
            updated: 'Kolom berhasil diperbarui',
            deleted: 'Kolom berhasil dihapus',
          },
        },
      },
      spyChat: 'Mata-matai Percakapan',
      closeChat: 'Tutup Obrolan',
      ticketMessagesDialog: {
        buttons: {
          close: 'Tutup',
        },
      },
    },
  },
};

export { messages };
