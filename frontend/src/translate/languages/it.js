const messages = {
  it: {
    translations: {
      common: {
        search: 'Cerca',
        edit: 'Modifica',
        delete: 'Elimina',
        cancel: 'Annulla',
        save: 'Salva',
        confirm: 'Conferma',
        close: 'Chiudi',
        error: 'Errore',
        success: 'Successo',
        actions: 'Azioni',
        add: 'Aggiungi',
        name: 'Nome',
        email: 'Email',
        phone: 'Telefono',
        company: 'Azienda',
        user: 'Utente',
        connection: 'Connessione',
        queue: 'Coda',
        contact: 'Contatto',
        messages: 'Messaggi',
        chats: 'Chat',
        spyChat: 'Spia Conversazione',
        closeChat: 'Chiudi Chat',
        remove: 'Rimuovi',
      },
      signup: {
        title: 'Registrati',
        toasts: {
          success: 'Utente creato con successo! Effettua il login!!!',
          fail: "Errore nella creazione dell'utente. Verifica i dati inseriti.",
        },
        form: {
          name: 'Nome',
          email: 'Email',
          password: 'Password',
        },
        buttons: {
          submit: 'Registrati',
          login: 'Hai già un account? Accedi!',
        },
      },
      login: {
        title: 'Accesso',
        form: {
          email: 'Email',
          password: 'Password',
        },
        buttons: {
          submit: 'Accedi',
          register: 'Non hai un account? Registrati!',
        },
      },
      companies: {
        title: 'Registra Azienda',
        form: {
          name: "Nome dell'Azienda",
          plan: 'Piano',
          token: 'Token',
          submit: 'Registrati',
          success: 'Azienda creata con successo!',
        },
      },
      auth: {
        toasts: {
          success: 'Accesso effettuato con successo!',
        },
        token: 'Token',
      },
      dashboard: {
        charts: {
          perDay: {
            title: 'Interazioni di oggi: ',
          },
        },
      },
      connections: {
        title: 'Connessioni',
        toasts: {
          deleted: 'Connessione con WhatsApp eliminata con successo!',
        },
        confirmationModal: {
          deleteTitle: 'Elimina',
          deleteMessage: 'Sei sicuro? Questa azione non può essere annullata.',
          disconnectTitle: 'Disconnetti',
          disconnectMessage:
            'Sei sicuro? Dovrai scansionare nuovamente il QR Code.',
        },
        buttons: {
          add: 'Aggiungi WhatsApp',
          disconnect: 'Disconnetti',
          tryAgain: 'Riprova',
          qrcode: 'QR CODE',
          newQr: 'Nuovo QR CODE',
          connecting: 'Connessione in corso',
        },
        toolTips: {
          disconnected: {
            title: "Errore nell'avvio della sessione di WhatsApp",
            content:
              'Assicurati che il tuo telefono sia connesso a Internet e riprova, oppure richiedi un nuovo QR Code',
          },
          qrcode: {
            title: 'In attesa della scansione del QR Code',
            content:
              "Clicca sul pulsante 'QR CODE' e scansiona il QR Code con il tuo telefono per avviare la sessione",
          },
          connected: {
            title: 'Connessione stabilita!',
          },
          timeout: {
            title: 'Connessione con il telefono persa',
            content:
              "Assicurati che il tuo telefono sia connesso a Internet e che WhatsApp sia aperto, oppure clicca sul pulsante 'Disconnetti' per ottenere un nuovo QR Code",
          },
        },
        table: {
          name: 'Nome',
          status: 'Stato',
          lastUpdate: 'Ultimo aggiornamento',
          default: 'Predefinito',
          actions: 'Azioni',
          session: 'Sessione',
        },
      },
      internalChat: {
        title: 'Chat Interno',
      },
      whatsappModal: {
        title: {
          add: 'Aggiungi WhatsApp',
          edit: 'Modifica WhatsApp',
        },
        form: {
          name: 'Nome',
          default: 'Predefinito',
        },
        buttons: {
          okAdd: 'Aggiungi',
          okEdit: 'Salva',
          cancel: 'Annulla',
        },
        success: 'WhatsApp salvato con successo.',
        token: {
          copied: 'Token copiato negli appunti',
        },
      },
      qrCode: {
        message: 'Scansiona QR',
      },
      contacts: {
        title: 'Contatti',
        toasts: {
          deleted: 'Contatto eliminato con successo!',
        },
        searchPlaceholder: 'Cerca...',
        confirmationModal: {
          deleteTitle: 'Elimina',
          importTitlte: 'Importa contatti',
          deleteMessage:
            'Sei sicuro di voler eliminare questo contatto? Tutte le interazioni correlate saranno perse.',
          importMessage: 'Vuoi importare tutti i contatti dal telefono?',
        },
        buttons: {
          import: 'Importa Contatti',
          add: 'Aggiungi Contatto',
        },
        table: {
          name: 'Nome',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Azioni',
        },
      },
      contactModal: {
        title: {
          add: 'Aggiungi contatto',
          edit: 'Modifica contatto',
        },
        form: {
          mainInfo: 'Dati del contatto',
          extraInfo: 'Informazioni aggiuntive',
          name: 'Nome',
          number: 'Numero di WhatsApp',
          email: 'Email',
          extraName: 'Nome del campo',
          extraValue: 'Valore',
          disableBot: 'Disabilita chatbot',
        },
        buttons: {
          addExtraInfo: 'Aggiungi informazione',
          okAdd: 'Aggiungi',
          okEdit: 'Salva',
          cancel: 'Annulla',
        },
        success: 'Contatto salvato con successo.',
      },
      queueModal: {
        title: {
          add: 'Aggiungi coda',
          edit: 'Modifica coda',
        },
        form: {
          name: 'Nome',
          color: 'Colore',
          greetingMessage: 'Messaggio di benvenuto',
          complationMessage: 'Messaggio di completamento',
          outOfHoursMessage: 'Messaggio fuori orario',
          ratingMessage: 'Messaggio di valutazione',
          transferMessage: 'Messaggio di trasferimento',
          token: 'Token',
        },
        buttons: {
          okAdd: 'Aggiungi',
          okEdit: 'Salva',
          cancel: 'Annulla',
          attach: 'Allega File',
        },
        serviceHours: {
          dayWeek: 'Giorno della settimana',
          startTimeA: 'Ora Iniziale - Turno A',
          endTimeA: 'Ora Finale - Turno A',
          startTimeB: 'Ora Iniziale - Turno B',
          endTimeB: 'Ora Finale - Turno B',
          monday: 'Lunedì',
          tuesday: 'Martedì',
          wednesday: 'Mercoledì',
          thursday: 'Giovedì',
          friday: 'Venerdì',
          saturday: 'Sabato',
          sunday: 'Domenica',
        },
      },
      userModal: {
        title: {
          add: 'Aggiungi utente',
          edit: 'Modifica utente',
        },
        form: {
          name: 'Nome',
          email: 'Email',
          password: 'Password',
          profile: 'Profilo',
        },
        buttons: {
          okAdd: 'Aggiungi',
          okEdit: 'Salva',
          cancel: 'Annulla',
        },
        success: 'Utente salvato con successo.',
      },
      scheduleModal: {
        title: {
          error: 'Errore di Invio',
          schedule: 'Programma messaggio',
        },
        status: {
          pending: 'In attesa',
          sent: 'Inviato',
          erro: 'Errore',
        },
        validation: {
          bodyMin: 'Messaggio troppo corto',
          required: 'Obbligatorio',
          minTime: "L'orario deve essere di almeno 5 minuti dopo ora",
        },
        form: {
          body: 'Messaggio',
          sendAt: 'Invia alle',
          saveMessage: 'Salva come modello',
          contactPlaceholder: 'Contatto',
          whatsappPlaceholder: 'WhatsApp',
        },
        buttons: {
          cancel: 'Annulla',
          okAdd: 'Aggiungi',
          okEdit: 'Salva',
        },
        success: 'Programmazione salvata con successo!',
      },
      tagModal: {
        title: {
          add: 'Nuova Tag',
          edit: 'Modifica Tag',
          addKanban: 'Nuova Lane',
          editKanban: 'Modifica Lane',
        },
        form: {
          name: 'Nome',
          color: 'Colore',
          kanban: 'Kanban',
        },
        buttons: {
          okAdd: 'Aggiungi',
          okEdit: 'Salva',
          cancel: 'Annulla',
        },
        success: 'Tag salvata con successo.',
        successKanban: 'Lane salvata con successo.',
      },
      chat: {
        noTicketMessage: 'Seleziona un ticket per iniziare a conversare.',
      },
      uploads: {
        titles: {
          titleUploadMsgDragDrop: 'TRASCINA E RILASCIA I FILE NEL CAMPO SOTTO',
          titleFileList: 'Lista dei file',
        },
      },
      ticketsManager: {
        buttons: {
          newTicket: 'Nuovo',
        },
      },
      ticketsQueueSelect: {
        placeholder: 'Code',
      },
      tickets: {
        toasts: {
          deleted: 'Il ticket su cui stavi lavorando è stato eliminato.',
        },
        notification: {
          message: 'Messaggio da',
        },
        tabs: {
          open: { title: 'Aperti' },
          closed: { title: 'Risoltos' },
          groups: { title: 'Gruppi' },
          search: { title: 'Ricerca' },
        },
        status: {
          closed: 'CHIUSO',
        },
        tooltips: {
          closeConversation: 'Chiudi Conversazione',
        },
        search: {
          placeholder: 'Cerca ticket e messaggi',
        },
        buttons: {
          showAll: 'Tutti',
        },
      },
      transferTicketModal: {
        title: 'Trasferisci Ticket',
        fieldLabel: 'Digita per cercare utenti',
        fieldQueueLabel: 'Trasferisci alla coda',
        fieldQueuePlaceholder: 'Seleziona una coda',
        noOptions: 'Nessun utente trovato con questo nome',
        buttons: {
          ok: 'Trasferisci',
          cancel: 'Annulla',
        },
      },
      ticketsList: {
        pendingHeader: 'In attesa',
        assignedHeader: 'In gestione',
        noTicketsTitle: 'Niente qui!',
        noTicketsMessage:
          'Nessun ticket trovato con questo stato o termine di ricerca',
        buttons: {
          accept: 'Accetta',
        },
      },
      newTicketModal: {
        title: 'Crea Ticket',
        fieldLabel: 'Digita per cercare il contatto',
        add: 'Aggiungi',
        buttons: {
          ok: 'Salva',
          cancel: 'Annulla',
        },
      },
      mainDrawer: {
        listItems: {
          dashboard: 'Dashboard',
          connections: 'Connessioni',
          tickets: 'Interazioni',
          quickMessages: 'Risposte Rapide',
          contacts: 'Contatti',
          queues: 'Code & Chatbot',
          tags: 'Tag',
          administration: 'Amministrazione',
          service: 'Servizio',
          users: 'Utenti',
          settings: 'Impostazioni',
          helps: 'Aiuto',
          messagesAPI: 'API',
          schedules: 'Pianificazioni',
          campaigns: 'Campagne',
          annoucements: 'Informazioni',
          chats: 'Chat Interna',
          financeiro: 'Finanziario',
          logout: 'Esci',
          management: 'Gestione',
          kanban: 'Kanban',
          leads: 'Lead',
          todoList: 'Lista delle Attività',
          savia: 'Savia',
          listing: 'Elenco',
          contactLists: 'Liste di Contatti',
          configurations: 'Configurazioni',
        },
        appBar: {
          i18n: {
            language: 'Italiano',
            language_short: 'IT',
          },
          user: {
            profile: 'Profilo',
            darkmode: 'Modalità scura',
            lightmode: 'Modalità chiara',
            language: 'Seleziona lingua',
            about: 'Informazioni',
            logout: 'Esci',
          },
        },
      },
      messagesAPI: {
        title: 'API',
        textMessage: {
          number: 'Numero',
          body: 'Messaggio',
          token: 'Token registrato',
        },
        mediaMessage: {
          number: 'Numero',
          body: 'Nome del file',
          media: 'File',
          token: 'Token registrato',
        },
      },
      notifications: {
        noTickets: 'Nessuna notifica.',
      },
      quickMessages: {
        title: 'Risposte Rapide',
        buttons: {
          add: 'Nuova Risposta',
        },
        dialog: {
          title: 'Messaggio Rapido',
          shortcode: 'Scorciatoia',
          message: 'Risposta',
          buttons: {
            cancel: 'Annulla',
            save: 'Salva',
          },
        },
      },
      kanban: {
        title: 'Kanban',
        searchPlaceholder: 'Cerca',
        subMenus: {
          list: 'Pannello',
          tags: 'Lanes',
        },
      },
      tagsKanban: {
        title: 'Lanes',
        laneDefault: 'Aperto',
        confirmationModal: {
          deleteTitle: 'Sei sicuro di voler eliminare questa Lane?',
          deleteMessage: 'Questa azione non può essere annullata.',
        },
        table: {
          name: 'Nome',
          color: 'Colore',
          tickets: 'Tickets',
          actions: 'Azioni',
        },
        buttons: {
          add: 'Nuova Lane',
        },
        toasts: {
          deleted: 'Lane eliminata con successo.',
        },
      },
      contactLists: {
        title: 'Liste di Contatti',
        table: {
          name: 'Nome',
          contacts: 'Contatti',
          actions: 'Azioni',
        },
        buttons: {
          add: 'Nuova Lista',
        },
        dialog: {
          name: 'Nome',
          company: 'Azienda',
          okEdit: 'Modifica',
          okAdd: 'Aggiungi',
          add: 'Aggiungi',
          edit: 'Modifica',
          cancel: 'Annulla',
        },
        confirmationModal: {
          deleteTitle: 'Elimina',
          deleteMessage: 'Questa azione non può essere annullata.',
        },
        toasts: {
          deleted: 'Registro eliminato',
          created: 'Registro creato',
        },
      },
      contactListItems: {
        title: 'Contatti',
        searchPlaceholder: 'Cerca',
        buttons: {
          add: 'Nuovo',
          lists: 'Liste',
          import: 'Importa',
        },
        dialog: {
          name: 'Nome',
          number: 'Numero',
          whatsapp: 'WhatsApp',
          email: 'Email',
          okEdit: 'Modifica',
          okAdd: 'Aggiungi',
          add: 'Aggiungi',
          edit: 'Modifica',
          cancel: 'Annulla',
        },
        table: {
          name: 'Nome',
          number: 'Numero',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Azioni',
        },
        confirmationModal: {
          deleteTitle: 'Elimina',
          deleteMessage: 'Questa azione non può essere annullata.',
          importMessage: 'Vuoi importare i contatti da questo foglio?',
          importTitlte: 'Importa',
        },
        toasts: {
          deleted: 'Registro eliminato',
        },
      },
      campaigns: {
        title: 'Campagne',
        searchPlaceholder: 'Cerca',
        buttons: {
          add: 'Nuova Campagna',
          contactLists: 'Liste di Contatti',
        },
        table: {
          name: 'Nome',
          whatsapp: 'Connessione',
          contactList: 'Lista di Contatti',
          status: 'Stato',
          scheduledAt: 'Pianificazione',
          completedAt: 'Completata',
          confirmation: 'Conferma',
          actions: 'Azioni',
        },
        dialog: {
          new: 'Nuova Campagna',
          update: 'Modifica Campagna',
          readonly: 'Solo Visualizzazione',
          form: {
            name: 'Nome',
            message1: 'Messaggio 1',
            message2: 'Messaggio 2',
            message3: 'Messaggio 3',
            message4: 'Messaggio 4',
            message5: 'Messaggio 5',
            confirmationMessage1: 'Messaggio di Conferma 1',
            confirmationMessage2: 'Messaggio di Conferma 2',
            confirmationMessage3: 'Messaggio di Conferma 3',
            confirmationMessage4: 'Messaggio di Conferma 4',
            confirmationMessage5: 'Messaggio di Conferma 5',
            messagePlaceholder: 'Contenuto del messaggio',
            whatsapp: 'Connessione',
            status: 'Stato',
            scheduledAt: 'Pianificazione',
            confirmation: 'Conferma',
            contactList: 'Lista di Contatti',
          },
          buttons: {
            add: 'Aggiungi',
            edit: 'Aggiorna',
            okadd: 'Ok',
            cancel: 'Annulla Invii',
            restart: 'Riavvia Invii',
            close: 'Chiudi',
            attach: 'Allega File',
          },
        },
        confirmationModal: {
          deleteTitle: 'Elimina',
          deleteMessage: 'Questa azione non può essere annullata.',
        },
        toasts: {
          success: 'Operazione completata con successo',
          cancel: 'Campagna annullata',
          restart: 'Campagna riavviata',
          deleted: 'Registro eliminato',
        },
      },
      announcements: {
        title: 'Informazioni',
        searchPlaceholder: 'Cerca',
        buttons: {
          add: 'Nuova Informazione',
          contactLists: 'Liste di Informazioni',
        },
        table: {
          priority: 'Priorità',
          title: 'Titolo',
          text: 'Testo',
          mediaName: 'File',
          status: 'Stato',
          actions: 'Azioni',
        },
        dialog: {
          edit: 'Modifica Informazione',
          add: 'Nuova Informazione',
          update: 'Modifica Informazione',
          readonly: 'Solo Visualizzazione',
          form: {
            priority: 'Priorità',
            title: 'Titolo',
            text: 'Testo',
            mediaPath: 'File',
            status: 'Stato',
          },
          buttons: {
            add: 'Aggiungi',
            edit: 'Aggiorna',
            okadd: 'Ok',
            cancel: 'Annulla',
            close: 'Chiudi',
            attach: 'Allega File',
          },
        },
        confirmationModal: {
          deleteTitle: 'Elimina',
          deleteMessage: 'Questa azione non può essere annullata.',
        },
        toasts: {
          success: 'Operazione completata con successo',
          deleted: 'Registro eliminato',
        },
      },
      campaignsConfig: {
        title: 'Configurazioni Campagne',
        intervals: 'Intervalli',
        messageInterval: 'Intervallo tra messaggi',
        longerIntervalAfter: 'Intervallo più lungo dopo',
        greaterInterval: 'Intervallo maggiore',
        noInterval: 'Nessun intervallo',
        notDefined: 'Non definito',
        seconds: 'secondi',
        messages: 'messaggi',
        addVariable: 'Aggiungi Variabile',
        saveSettings: 'Salva Impostazioni',
        shortcode: 'Codice',
        content: 'Contenuto',
        variables: 'Variabili',
      },
      queues: {
        title: 'Code & Chatbot',
        table: {
          name: 'Nome',
          color: 'Colore',
          greeting: 'Messaggio di benvenuto',
          actions: 'Azioni',
        },
        buttons: {
          add: 'Aggiungi coda',
        },
        confirmationModal: {
          deleteTitle: 'Elimina',
          deleteMessage:
            'Sei sicuro? Questa azione non può essere annullata! Le interazioni di questa coda continueranno ad esistere, ma non avranno più nessuna coda assegnata.',
        },
      },
      queueSelect: {
        inputLabel: 'Code',
      },
      users: {
        title: 'Utenti',
        table: {
          name: 'Nome',
          email: 'Email',
          profile: 'Profilo',
          actions: 'Azioni',
        },
        buttons: {
          add: 'Aggiungi utente',
        },
        toasts: {
          deleted: 'Utente eliminato con successo.',
        },
        confirmationModal: {
          deleteTitle: 'Elimina',
          deleteMessage:
            "Tutti i dati dell'utente saranno persi. Le interazioni aperte di questo utente saranno spostate nella coda.",
        },
      },
      helps: {
        title: 'Centro di Aiuto',
      },
      about: {
        aboutthe: 'Informazioni su',
        copyright: '© 2024 - Funzionante con ticketz',
        buttonclose: 'Chiudi',
        title: 'Informazioni su ticketz',
        abouttitle: 'Origine e miglioramenti',
        aboutdetail:
          'Il ticketz è derivato indirettamente dal progetto Whaticket con miglioramenti condivisi dagli sviluppatori del sistema EquipeChat attraverso il canale VemFazer su YouTube, successivamente migliorati da Claudemir Todo Bom',
        aboutauthorsite: "Sito dell'autore",
        aboutwhaticketsite: 'Sito della comunità Whaticket su Github',
        aboutvemfazersite: 'Sito del canale Vem Fazer su Github',
        Options: {
          title: 'Opzioni',
        },
        Companies: {
          title: 'Aziende',
        },
        schedules: {
          title: 'Orari',
        },
        Plans: {
          title: 'Piani',
        },
        Help: {
          title: 'Aiuto',
        },
        Whitelabel: {
          title: 'Whitelabel',
        },
        PaymentGateways: {
          title: 'Gateway di pagamento',
        },
      },
      messagesList: {
        header: {
          assignedTo: 'Assegnato a:',
          buttons: {
            return: 'Ritorna',
            resolve: 'Risolvi',
            reopen: 'Riapri',
            accept: 'Accetta',
          },
        },
      },
      messagesInput: {
        placeholderOpen: 'Digita un messaggio',
        placeholderClosed:
          'Riapri o accetta questo ticket per inviare un messaggio.',
        signMessage: 'Firma',
        replying: 'Rispondendo',
        editing: 'Modificando',
      },
      message: {
        edited: 'Modificata',
      },
      contactDrawer: {
        header: 'Dati del contatto',
        buttons: {
          edit: 'Modifica contatto',
        },
        extraInfo: 'Altre informazioni',
      },
      ticketOptionsMenu: {
        schedule: 'Pianificazione',
        delete: 'Elimina',
        transfer: 'Trasferisci',
        registerAppointment: 'Osservazioni del Contatto',
        appointmentsModal: {
          title: 'Osservazioni del Contatto',
          textarea: 'Osservazione',
          placeholder: 'Inserisci qui le informazioni che desideri registrare',
        },
        confirmationModal: {
          title: 'Elimina il ticket del contatto',
          message:
            'Attenzione! Tutti i messaggi relativi al ticket saranno persi.',
        },
        buttons: {
          delete: 'Elimina',
          cancel: 'Annulla',
        },
      },
      confirmationModal: {
        buttons: {
          confirm: 'Ok',
          cancel: 'Annulla',
        },
      },
      messageOptionsMenu: {
        delete: 'Elimina',
        edit: 'Modifica',
        history: 'Cronologia',
        reply: 'Rispondi',
        confirmationModal: {
          title: 'Eliminare il messaggio?',
          message: 'Questa azione non può essere annullata.',
        },
      },
      messageHistoryModal: {
        close: 'Chiudi',
        title: 'Cronologia delle modifiche del messaggio',
      },
      presence: {
        unavailable: 'Non disponibile',
        available: 'Disponibile',
        composing: 'Sta scrivendo...',
        recording: 'Sta registrando...',
        paused: 'In pausa',
      },
      privacyModal: {
        title: 'Modifica Privacy di WhatsApp',
        buttons: {
          cancel: 'Annulla',
          okEdit: 'Salva',
        },
        form: {
          menu: {
            all: 'Tutti',
            none: 'Nessuno',
            contacts: 'I miei contatti',
            contact_blacklist: 'Contatti selezionati',
            match_last_seen: 'Simile a Ultimo Visto',
            known: 'Conosciuti',
            disable: 'Disattivata',
            hrs24: '24 Ore',
            dias7: '7 Giorni',
            dias90: '90 Giorni',
          },
          readreceipts: 'Per aggiornare la privacy delle ricevute di lettura',
          profile: 'Per aggiornare la privacy della foto del profilo',
          status: 'Per aggiornare la privacy degli stati',
          online: 'Per aggiornare la privacy online',
          last: "Per aggiornare la privacy dell'Ultimo Visto",
          groupadd: 'Per aggiornare la privacy di Aggiunta ai gruppi',
          calladd: 'Per aggiornare la privacy di Aggiunta alle chiamate',
          disappearing: 'Per aggiornare la Modalità di Scomparsa Predefinita',
        },
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP: 'Deve esserci almeno un WhatsApp predefinito.',
        ERR_NO_DEF_WAPP_FOUND:
          'Nessun WhatsApp predefinito trovato. Controlla la pagina delle connessioni.',
        ERR_WAPP_NOT_INITIALIZED:
          'Questa sessione di WhatsApp non è stata inizializzata. Controlla la pagina delle connessioni.',
        ERR_WAPP_CHECK_CONTACT:
          'Impossibile verificare il contatto di WhatsApp. Controlla la pagina delle connessioni',
        ERR_WAPP_INVALID_CONTACT: 'Questo non è un numero di WhatsApp valido.',
        ERR_WAPP_DOWNLOAD_MEDIA:
          'Impossibile scaricare i media da WhatsApp. Controlla la pagina delle connessioni.',
        ERR_INVALID_CREDENTIALS:
          'Errore di autenticazione. Per favore, riprova.',
        ERR_SENDING_WAPP_MSG:
          "Errore nell'invio del messaggio di WhatsApp. Controlla la pagina delle connessioni.",
        ERR_DELETE_WAPP_MSG: 'Impossibile eliminare il messaggio di WhatsApp.',
        ERR_EDITING_WAPP_MSG:
          'Impossibile modificare il messaggio di WhatsApp.',
        ERR_OTHER_OPEN_TICKET:
          'Esiste già un ticket aperto per questo contatto.',
        ERR_SESSION_EXPIRED: 'Sessione scaduta. Per favore, accedi di nuovo.',
        ERR_USER_CREATION_DISABLED:
          "La creazione dell'utente è stata disabilitata dall'amministratore.",
        ERR_NO_PERMISSION: 'Non hai il permesso di accedere a questa funzione.',
        ERR_DUPLICATED_CONTACT: 'Esiste già un contatto con questo numero.',
        ERR_NO_SETTING_FOUND: 'Nessuna impostazione trovata con questo ID.',
        ERR_NO_CONTACT_FOUND: 'Nessun contatto trovato con questo ID.',
        ERR_NO_TICKET_FOUND: 'Nessun ticket trovato con questo ID.',
        ERR_NO_USER_FOUND: 'Nessun utente trovato con questo ID.',
        ERR_NO_WAPP_FOUND: 'Nessun WhatsApp trovato con questo ID.',
        ERR_CREATING_MESSAGE:
          'Errore nella creazione del messaggio nel database.',
        ERR_CREATING_TICKET: 'Errore nella creazione del ticket nel database.',
        ERR_FETCH_WAPP_MSG:
          'Errore nel recupero del messaggio su WhatsApp, potrebbe essere troppo vecchio.',
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          'Questo colore è già in uso, scegline un altro.',
        ERR_WAPP_GREETING_REQUIRED:
          'Il messaggio di benvenuto è obbligatorio quando ci sono più code.',
      },
      ticketz: {
        registration: {
          header: 'Registrati nella base utenti di Ticketz',
          description:
            'Compila i campi sottostanti per registrarti nella base utenti di Ticketz e ricevere aggiornamenti sul progetto.',
          name: 'Nome',
          country: 'Paese',
          phoneNumber: 'Numero di WhatsApp',
          submit: 'Registrati',
        },
        support: {
          title: 'Supporta il progetto Ticketz Open Source',
          mercadopagotitle: 'Carta di Credito',
          recurringbrl: 'Donazione ricorrente in R$',
          paypaltitle: 'Carta di Credito',
          international: 'Internazionale in US$',
        },
      },
      interactions: {
        toasts: {
          created: 'Interazione creata con successo',
        },
        buttons: {
          add: 'Aggiungi Interazione',
        },
        types: {
          note: 'Nota',
          email: 'E-mail',
          message: 'Messaggio',
          file: 'File',
        },
        categories: {
          internal_note: 'Nota Interna',
          customer_communication: 'Comunicazione Cliente',
          system: 'Sistema',
        },
        dialog: {
          add: 'Aggiungi Interazione',
        },
        form: {
          type: 'Tipo',
          category: 'Categoria',
          notes: 'Note',
        },
      },
      leads: {
        title: 'Lead',
        searchPlaceholder: 'Cerca lead',
        notFound: 'Lead non trovato',
        buttons: {
          add: 'Nuovo Lead',
          save: 'Salva',
          cancel: 'Annulla',
        },
        views: {
          board: 'Bacheca',
          list: 'Lista',
        },
        tabs: {
          basic: 'Base',
          contact: 'Contatto',
          financial: 'Finanziario',
          tags: 'Tag',
          notes: 'Note',
        },
        modal: {
          add: {
            title: 'Nuovo Lead',
          },
          edit: {
            title: 'Modifica Lead',
          },
          form: {
            contact: 'Contatto',
            stage: 'Fase',
            temperature: 'Temperatura',
            source: 'Fonte',
            expectedValue: 'Valore Atteso',
            probability: 'Probabilità (%)',
            expectedClosingDate: 'Data di Chiusura Prevista',
            assignedTo: 'Assegnato a',
            notes: 'Note',
            selectUser: 'Seleziona utente',
          },
        },
        dialog: {
          new: 'Nuovo Lead',
          edit: 'Modifica Lead',
          addTag: 'Aggiungi Tag',
        },
        form: {
          name: 'Nome',
          title: 'Titolo',
          titleHelper: 'Breve descrizione del lead',
          description: 'Descrizione',
          temperature: 'Temperatura',
          status: 'Stato',
          pipeline: 'Pipeline',
          contact: 'Contatto',
          column: 'Colonna',
          assignedTo: 'Assegnato a',
          unassigned: 'Non assegnato',
          source: 'Fonte',
          expectedValue: 'Valore Atteso',
          currency: 'Valuta',
          probability: 'Probabilità (%)',
          probabilityHelper: "Probabilità di chiusura dell'affare (0-100%)",
          expectedClosingDate: 'Data di Chiusura Prevista',
          tags: 'Tag',
          addTag: 'Aggiungi Tag',
          tag: 'Tag',
          customFields: 'Campi Personalizzati',
          customFieldName: 'Inserisci il nome del campo personalizzato',
          addCustomField: 'Aggiungi Campo Personalizzato',
          notes: 'Note',
        },
        table: {
          lead: 'Lead',
          contact: 'Contatto',
          status: 'Stato',
          pipeline: 'Pipeline',
          column: 'Colonna',
          temperature: 'Temperatura',
          tags: 'Tag',
          financial: 'Finanziario',
          assignedTo: 'Assegnato a',
          actions: 'Azioni',
          unassigned: 'Non assegnato',
        },
        sections: {
          contact: 'Informazioni di Contatto',
          financial: 'Informazioni Finanziarie',
          tags: 'Tag',
          customFields: 'Campi Personalizzati',
          notes: 'Note',
        },
        fields: {
          contact: 'Contatto',
          phone: 'Telefono',
          email: 'E-mail',
          source: 'Fonte',
          assignedTo: 'Assegnato a',
          expectedValue: 'Valore Atteso',
          probability: 'Probabilità',
          expectedClosingDate: 'Data di Chiusura Prevista',
        },
        status: {
          new: 'Nuovo',
          contacted: 'Contattato',
          follow_up: 'Follow-up',
          proposal: 'Proposta',
          negotiation: 'Negoziazione',
          qualified: 'Qualificato',
          unqualified: 'Non qualificato',
          converted: 'Convertito',
          lost: 'Perso',
          closed_won: 'Chiuso Vinto',
          closed_lost: 'Chiuso Perso',
        },
        pipeline: {
          default: 'Predefinito',
          sales: 'Vendite',
          support: 'Supporto',
          onboarding: 'Onboarding',
        },
        temperature: {
          hot: 'Caldo',
          warm: 'Tiepido',
          cold: 'Freddo',
        },
        timeline: {
          title: 'Cronologia',
          empty: 'Nessuna interazione trovata',
        },
        toasts: {
          created: 'Lead creato con successo',
          updated: 'Lead aggiornato con successo',
          deleted: 'Lead eliminato con successo',
          contactRequired: 'Il contatto è obbligatorio',
          tagAdded: 'Tag aggiunto con successo',
          tagRemoved: 'Tag rimosso con successo',
        },
        validation: {
          name: {
            required: 'Il nome è obbligatorio',
          },
          title: {
            max: 'Il titolo deve avere al massimo 255 caratteri',
          },
          contact: {
            required: 'Il contatto è obbligatorio',
          },
          column: {
            required: 'La colonna è obbligatoria',
          },
          temperature: {
            required: 'La temperatura è obbligatoria',
          },
          status: {
            required: 'Lo stato è obbligatorio',
          },
          pipeline: {
            required: 'Il pipeline è obbligatorio',
          },
          source: {
            required: 'La fonte è obbligatoria',
          },
          currency: {
            required: 'La valuta è obbligatoria',
          },
          probability: {
            min: 'La probabilità deve essere almeno 0',
            max: 'La probabilità deve essere al massimo 100',
          },
        },
        leadColumns: {
          buttons: {
            add: 'Nuova Colonna',
            save: 'Salva',
            cancel: 'Annulla',
          },
          dialog: {
            new: 'Nuova Colonna',
            edit: 'Modifica Colonna',
          },
          modal: {
            add: {
              title: 'Nuova Colonna',
            },
            edit: {
              title: 'Modifica Colonna',
            },
            form: {
              name: 'Nome',
              color: 'Colore',
            },
          },
          toasts: {
            created: 'Colonna creata con successo',
            updated: 'Colonna aggiornata con successo',
            deleted: 'Colonna eliminata con successo',
          },
        },
      },
      todoList: {
        title: 'Lista delle Attività',
        newTask: 'Nuova attività',
        add: 'Aggiungi',
        save: 'Salva',
        edit: 'Modifica',
        delete: 'Elimina',
        noTasks: 'Nessuna attività trovata',
        taskPlaceholder: 'Inserisci una nuova attività',
        lastUpdate: 'Ultimo aggiornamento',
        taskRequired: "Il testo dell'attività è obbligatorio",
      },
      settings: {
        group: {
          general: 'Generale',
          timeouts: 'Timeout',
          officeHours: 'Orari di ufficio',
          groups: 'Gruppi',
          confidenciality: 'Riservatezza',
          api: 'API',
          externalServices: 'Servizi esterni',
          serveradmin: 'Amministrazione del server',
        },
        success: 'Impostazioni salvate con successo.',
        copiedToClipboard: 'Copiato negli appunti',
        title: 'Impostazioni',
        chatbotTicketTimeout: 'Timeout del chatbot (minuti)',
        chatbotTicketTimeoutAction: 'Azione del timeout del chatbot',
        settings: {
          userCreation: {
            name: 'Creazione utente',
            options: {
              enabled: 'Abilitato',
              disabled: 'Disabilitato',
            },
          },
        },
        validations: {
          title: 'Valutazioni',
          options: {
            enabled: 'Abilitato',
            disabled: 'Disabilitato',
          },
        },
        OfficeManagement: {
          title: 'Gestione ufficio',
          options: {
            disabled: 'Disabilitato',
            ManagementByDepartment: 'Gestione per coda',
            ManagementByCompany: 'Gestione per azienda',
          },
        },
        outOfHoursAction: {
          title: 'Azione fuori orario',
          options: {
            pending: 'Lasciare in attesa',
            closed: 'Chiudere il ticket',
          },
        },
        IgnoreGroupMessages: {
          title: 'Ignora messaggi di gruppo',
          options: {
            enabled: 'Abilitato',
            disabled: 'Disabilitato',
          },
        },
        soundGroupNotifications: {
          title: 'Notifiche sonore di gruppo',
          options: {
            enabled: 'Abilitato',
            disabled: 'Disabilitato',
          },
        },
        groupsTab: {
          title: 'Scheda Gruppi',
          options: {
            enabled: 'Abilitato',
            disabled: 'Disabilitato',
          },
        },
        VoiceAndVideoCalls: {
          title: 'Chiamate vocali e video',
          options: {
            enabled: 'Ignora',
            disabled: 'Informa indisponibilità',
          },
        },
        AutomaticChatbotOutput: {
          title: 'Uscita automatica del chatbot',
          options: {
            enabled: 'Abilitato',
            disabled: 'Disabilitato',
          },
        },
        ShowNumericEmoticons: {
          title: 'Mostra emoticon numeriche nella coda',
          options: {
            enabled: 'Abilitato',
            disabled: 'Disabilitato',
          },
        },
        QuickMessages: {
          title: 'Messaggi rapidi',
          options: {
            enabled: 'Per azienda',
            disabled: 'Per utente',
          },
        },
        AllowRegistration: {
          title: 'Consenti registrazione',
          options: {
            enabled: 'Abilitato',
            disabled: 'Disabilitato',
          },
        },
        FileUploadLimit: {
          title: 'Limite di caricamento file (MB)',
        },
        FileDownloadLimit: {
          title: 'Limite di download file (MB)',
        },
        messageVisibility: {
          title: 'Visibilità del messaggio',
          options: {
            respectMessageQueue: 'Rispetta la coda del messaggio',
            respectTicketQueue: 'Rispetta la coda del ticket',
          },
        },
        keepQueueAndUser: {
          title: 'Mantieni coda e utente nel ticket chiuso',
          options: {
            enabled: 'Abilitato',
            disabled: 'Disabilitato',
          },
        },
        GracePeriod: {
          title: 'Periodo di grazia dopo la scadenza (giorni)',
        },
        ticketAcceptedMessage: {
          title: 'Messaggio di ticket accettato',
          placeholder: 'Inserisci qui il tuo messaggio di ticket accettato',
        },
        transferMessage: {
          title: 'Messaggio di trasferimento',
          placeholder: 'Inserisci qui il tuo messaggio di trasferimento',
        },
        mustacheVariables: {
          title: 'Variabili disponibili:',
        },
        WelcomeGreeting: {
          greetings: 'Ciao',
          welcome: 'Benvenuto a',
          expirationTime: 'Attivo fino a',
        },
        Options: {
          title: 'Opzioni',
        },
        Companies: {
          title: 'Aziende',
        },
        schedules: {
          title: 'Programmi',
        },
        Plans: {
          title: 'Piani',
        },
        Help: {
          title: 'Aiuto',
        },
        Whitelabel: {
          title: 'Whitelabel',
        },
        PaymentGateways: {
          title: 'Gateway di pagamento',
        },
        AIProvider: {
          title: 'Servizio IA',
        },
        AudioTranscriptions: {
          title: 'Trascrizione audio',
        },
        TagsMode: {
          title: 'Modalità tag',
          options: {
            ticket: 'Ticket',
            contact: 'Contatto',
            both: 'Ticket e Contatto',
          },
        },
        schedulesUpdated: 'Programmi aggiornati con successo.',
        operationUpdated: 'Operazione aggiornata con successo.',
        paymentGateway: 'Gateway di pagamento',
        none: 'Nessuno',
        owenPayments: 'Owen Payments 💎',
        efi: 'Efí',
        apiToken: 'Token API',
        aiKey: 'Chiave IA',
        defaultAppName: 'Ticketz',
        ratingsTimeout: 'Timeout per valutazione (minuti)',
        noQueueTimeout: 'Timeout per ticket senza coda (minuti)',
        noQueueTimeoutAction: 'Azione per timeout di ticket senza coda',
        openTicketTimeout: 'Timeout per ticket in corso (minuti)',
        openTicketTimeoutAction: 'Azione per timeout di ticket aperto',
        autoReopenTimeout: 'Timeout per riapertura automatica (minuti)',
        close: 'Chiudere',
        returnToQueue: 'Ritornare alla coda',
        officeHours: 'Orari di ufficio',
        officeManagement: 'Gestione ufficio',
        managementByQueue: 'Gestione per coda',
        managementByCompany: 'Gestione per azienda',
        groups: 'Gruppi',
        ignoreGroupMessages: 'Ignora messaggi di gruppo',
        groupSoundNotifications: 'Notifiche sonore di gruppo',
        groupsTab: 'Scheda Gruppi',
        confidentiality: 'Riservatezza',
        messageVisibility: 'Visibilità del messaggio',
        respectMessageQueue: 'Rispetta la coda del messaggio',
        respectTicketQueue: 'Rispetta la coda del ticket',
        keepQueueAndUser: 'Mantieni coda e utente',
        api: 'API',
        outOfHoursAction: 'Azione fuori orario',
        leaveAsPending: 'Lasciare in attesa',
        enabled: 'Abilitato',
        disabled: 'Disabilitato',
        // Form fields
        name: 'Nome',
        email: 'Email',
        phone: 'Telefono',
        company: 'Azienda',
        plan: 'Piano',
        campaigns: 'Campagne',
        status: 'Stato',
        createdAt: 'Creato il',
        dueDate: 'Data di scadenza',
        value: 'Valore',
        users: 'Utenti',
        connections: 'Connessioni',
        queues: 'Code',
        public: 'Pubblico',
        yes: 'Sì',
        no: 'No',
        active: 'Attivo',
        inactive: 'Inattivo',
        // Plan management
        planName: 'Nome Piano',
        planValue: 'Valore Piano',
        planUsers: 'Utenti Piano',
        planConnections: 'Connessioni Piano',
        planQueues: 'Code Piano',
        planPublic: 'Piano Pubblico',
        // Campaign management
        campaignTitle: 'Titolo Campagna',
        campaignCode: 'Codice Campagna',
        campaignDescription: 'Descrizione Campagna',
        campaignEnabled: 'Campagna Abilitata',
        campaignDisabled: 'Campagna Disabilitata',
        // User management
        userName: 'Nome Utente',
        userEmail: 'Email Utente',
        userPhone: 'Telefono Utente',
        userCompany: 'Azienda Utente',
        userPlan: 'Piano Utente',
        // Whitelabel
        primaryColorLight: 'Colore primario chiaro',
        primaryColorDark: 'Colore primario scuro',
        appLogoLight: 'Logo app chiaro',
        appLogoDark: 'Logo app scuro',
        appName: 'Nome app',
        appFavicon: 'Favicon app',
        logoSvgHint: 'Preferire SVG e rapporto 28:10',
        faviconSvgHint: 'Preferire immagine SVG quadrata o PNG 512x512',
        // Buttons
        clear: 'Cancella',
        save: 'Salva',
        cancel: 'Annulla',
        edit: 'Modifica',
        delete: 'Elimina',
        add: 'Aggiungi',
        // Date format
        dateFormat: 'dd/mm/yyyy',
        // Recurrence
        recurrence: 'Ricorrenza',
        // Contact lists
        contactLists: 'Liste Contatti',
        // Settings
        settings: 'Impostazioni',
        // Navigation
        listing: 'Elenco',
        // System description
        systemDescription: 'ticketz chat based ticket system',
      },
      ticketMessagesDialog: {
        buttons: {
          close: 'Chiudi',
        },
      },
    },
  },
};

export { messages };
