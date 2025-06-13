const messages = {
  de: {
    translations: {
      common: {
        search: 'Suchen',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        cancel: 'Abbrechen',
        save: 'Speichern',
        confirm: 'Bestätigen',
        close: 'Schließen',
        error: 'Fehler',
        success: 'Erfolg',
        actions: 'Aktionen',
        add: 'Hinzufügen',
        name: 'Name',
        email: 'E-Mail',
        phone: 'Telefon',
        company: 'Unternehmen',
        connection: 'Verbindung',
        queue: 'Warteschlange',
        contact: 'Kontakt',
        remove: 'Entfernen',
      },
      signup: {
        title: 'Registrieren',
        toasts: {
          success: 'Benutzer erfolgreich erstellt! Bitte einloggen!!!',
          fail: 'Fehler beim Erstellen des Benutzers. Überprüfen Sie die angegebenen Daten.',
        },
        form: {
          name: 'Name',
          email: 'Email',
          password: 'Passwort',
        },
        buttons: {
          submit: 'Registrieren',
          login: 'Haben Sie bereits ein Konto? Einloggen!',
        },
      },
      login: {
        title: 'Anmelden',
        form: {
          email: 'Email',
          password: 'Passwort',
        },
        buttons: {
          submit: 'Einloggen',
          register: 'Noch kein Konto? Registrieren!',
        },
      },
      companies: {
        title: 'Unternehmen registrieren',
        form: {
          name: 'Name des Unternehmens',
          plan: 'Plan',
          token: 'Token',
          submit: 'Registrieren',
          success: 'Unternehmen erfolgreich erstellt!',
        },
      },
      auth: {
        toasts: {
          success: 'Erfolgreich eingeloggt!',
        },
        token: 'Token',
      },
      dashboard: {
        charts: {
          perDay: {
            title: 'Heutige Interaktionen: ',
          },
        },
      },
      connections: {
        title: 'Verbindungen',
        toasts: {
          deleted: 'Verbindung mit WhatsApp erfolgreich gelöscht!',
        },
        confirmationModal: {
          deleteTitle: 'Löschen',
          deleteMessage:
            'Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.',
          disconnectTitle: 'Trennen',
          disconnectMessage:
            'Sind Sie sicher? Sie müssen den QR-Code erneut scannen.',
        },
        buttons: {
          add: 'WhatsApp hinzufügen',
          disconnect: 'Trennen',
          tryAgain: 'Erneut versuchen',
          qrcode: 'QR CODE',
          newQr: 'Neuer QR CODE',
          connecting: 'Verbinden',
        },
        toolTips: {
          disconnected: {
            title: 'Fehler beim Starten der WhatsApp-Sitzung',
            content:
              'Stellen Sie sicher, dass Ihr Telefon mit dem Internet verbunden ist, und versuchen Sie es erneut, oder fordern Sie einen neuen QR-Code an',
          },
          qrcode: {
            title: 'Warten auf QR-Code-Scan',
            content:
              "Klicken Sie auf die Schaltfläche 'QR CODE' und scannen Sie den QR-Code mit Ihrem Telefon, um die Sitzung zu starten",
          },
          connected: {
            title: 'Verbindung hergestellt!',
          },
          timeout: {
            title: 'Verbindung zum Telefon verloren',
            content:
              "Stellen Sie sicher, dass Ihr Telefon mit dem Internet verbunden ist und WhatsApp geöffnet ist, oder klicken Sie auf die Schaltfläche 'Trennen', um einen neuen QR-Code zu erhalten",
          },
        },
        table: {
          name: 'Name',
          status: 'Status',
          lastUpdate: 'Letztes Update',
          default: 'Standard',
          actions: 'Aktionen',
          session: 'Sitzung',
        },
      },
      internalChat: {
        title: 'Interner Chat',
        new: 'Neu',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        close: 'Schließen',
        save: 'Speichern',
        chat: 'Chat',
        titlePlaceholder: 'Titel',
        confirmDelete: 'Sind Sie sicher, dass Sie diesen Chat löschen möchten?',
        confirmDeleteMessage:
          'Diese Aktion kann nicht rückgängig gemacht werden.',
        noChats: 'Keine Chats gefunden',
        noMessages: 'Keine Nachrichten gefunden',
        typeMessage: 'Nachricht eingeben',
        messages: 'Nachrichten',
        chats: 'Chats',
        spyChat: 'Konversation überwachen',
        closeChat: 'Chat schließen',
        acceptChat: 'Chat akzeptieren',
        chatbot: 'Chatbot',
        queue: 'Warteschlange',
        noQueue: 'Keine Warteschlange',
        assignedTo: 'Zugewiesen an',
        lastMessage: 'Letzte Nachricht',
        newMessage: 'Neue Nachricht',
        unreadMessages: 'Ungelesene Nachrichten',
        closed: 'GESCHLOSSEN',
        pending: 'AUSSTEHEND',
        open: 'OFFEN',
        conversation: 'Unterhaltung',
        location: 'Standort',
        clickToViewLocation: 'Klicken Sie, um den Standort anzuzeigen',
        download: 'Herunterladen',
        noRecords: 'Keine Aufzeichnungen',
        dialog: {
          title: 'Unterhaltung',
          titleLabel: 'Titel',
          titlePlaceholder: 'Titel',
          close: 'Schließen',
          save: 'Speichern',
          fillTitle: 'Bitte füllen Sie den Titel der Unterhaltung aus.',
          selectUser: 'Bitte wählen Sie mindestens einen Benutzer aus.',
        },
        tabs: {
          chats: 'Chats',
          messages: 'Nachrichten',
        },
        presence: {
          composing: 'Schreibt...',
          recording: 'Nimmt auf...',
          available: 'Verfügbar',
          unavailable: 'Nicht verfügbar',
        },
      },
      whatsappModal: {
        title: {
          add: 'WhatsApp hinzufügen',
          edit: 'WhatsApp bearbeiten',
        },
        form: {
          name: 'Name',
          default: 'Standard',
        },
        buttons: {
          okAdd: 'Hinzufügen',
          okEdit: 'Speichern',
          cancel: 'Abbrechen',
        },
        success: 'WhatsApp erfolgreich gespeichert.',
      },
      qrCode: {
        message: 'QR scannen',
      },
      contacts: {
        title: 'Kontakte',
        toasts: {
          deleted: 'Kontakt erfolgreich gelöscht!',
        },
        searchPlaceholder: 'Suchen...',
        confirmationModal: {
          deleteTitle: 'Löschen',
          importTitlte: 'Kontakte importieren',
          deleteMessage:
            'Sind Sie sicher, dass Sie diesen Kontakt löschen möchten? Alle zugehörigen Interaktionen gehen verloren.',
          importMessage: 'Möchten Sie alle Kontakte vom Telefon importieren?',
        },
        buttons: {
          import: 'Kontakte importieren',
          add: 'Kontakt hinzufügen',
        },
        table: {
          name: 'Name',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Aktionen',
        },
      },
      contactModal: {
        title: {
          add: 'Kontakt hinzufügen',
          edit: 'Kontakt bearbeiten',
        },
        form: {
          mainInfo: 'Kontaktdaten',
          extraInfo: 'Zusätzliche Informationen',
          name: 'Name',
          number: 'WhatsApp-Nummer',
          email: 'Email',
          extraName: 'Feldname',
          extraValue: 'Wert',
          disableBot: 'Chatbot deaktivieren',
        },
        buttons: {
          addExtraInfo: 'Information hinzufügen',
          okAdd: 'Hinzufügen',
          okEdit: 'Speichern',
          cancel: 'Abbrechen',
        },
        success: 'Kontakt erfolgreich gespeichert.',
      },
      queueModal: {
        title: {
          add: 'Warteschlange hinzufügen',
          edit: 'Warteschlange bearbeiten',
        },
        form: {
          name: 'Name',
          color: 'Farbe',
          greetingMessage: 'Begrüßungsnachricht',
          complationMessage: 'Abschlussnachricht',
          outOfHoursMessage: 'Nachricht außerhalb der Geschäftszeiten',
          ratingMessage: 'Bewertungsnachricht',
          transferMessage: 'Übertragungsnachricht',
          token: 'Token',
        },
        buttons: {
          okAdd: 'Hinzufügen',
          okEdit: 'Speichern',
          cancel: 'Abbrechen',
          attach: 'Datei anhängen',
        },
        serviceHours: {
          dayWeek: 'Wochentag',
          startTimeA: 'Startzeit - Schicht A',
          endTimeA: 'Endzeit - Schicht A',
          startTimeB: 'Startzeit - Schicht B',
          endTimeB: 'Endzeit - Schicht B',
          monday: 'Montag',
          tuesday: 'Dienstag',
          wednesday: 'Mittwoch',
          thursday: 'Donnerstag',
          friday: 'Freitag',
          saturday: 'Samstag',
          sunday: 'Sonntag',
        },
      },
      userModal: {
        title: {
          add: 'Benutzer hinzufügen',
          edit: 'Benutzer bearbeiten',
        },
        form: {
          name: 'Name',
          email: 'Email',
          password: 'Passwort',
          profile: 'Profil',
        },
        buttons: {
          okAdd: 'Hinzufügen',
          okEdit: 'Speichern',
          cancel: 'Abbrechen',
        },
        success: 'Benutzer erfolgreich gespeichert.',
      },
      scheduleModal: {
        title: {
          error: 'Sendefehler',
          schedule: 'Nachricht planen',
        },
        status: {
          pending: 'Ausstehend',
          sent: 'Gesendet',
          erro: 'Fehler',
        },
        validation: {
          bodyMin: 'Nachricht zu kurz',
          required: 'Erforderlich',
          minTime: 'Die Zeit muss mindestens 5 Minuten nach jetzt sein',
        },
        form: {
          body: 'Nachricht',
          sendAt: 'Senden um',
          saveMessage: 'Als Vorlage speichern',
          contactPlaceholder: 'Kontakt',
          whatsappPlaceholder: 'WhatsApp',
        },
        buttons: {
          cancel: 'Abbrechen',
          okAdd: 'Hinzufügen',
          okEdit: 'Speichern',
        },
        success: 'Planung erfolgreich gespeichert!',
      },
      tagModal: {
        title: {
          add: 'Neues Tag',
          edit: 'Tag bearbeiten',
          addKanban: 'Neue Lane',
          editKanban: 'Lane bearbeiten',
        },
        form: {
          name: 'Name',
          color: 'Farbe',
          kanban: 'Kanban',
        },
        buttons: {
          okAdd: 'Hinzufügen',
          okEdit: 'Speichern',
          cancel: 'Abbrechen',
        },
        success: 'Tag erfolgreich gespeichert.',
        successKanban: 'Lane erfolgreich gespeichert.',
      },
      chat: {
        noTicketMessage: 'Wählen Sie ein Ticket, um zu chatten.',
      },
      uploads: {
        titles: {
          titleUploadMsgDragDrop: 'DATEIEN HIERHIN ZIEHEN UND ABLEGEN',
          titleFileList: 'Dateiliste',
        },
      },
      ticketsManager: {
        buttons: {
          newTicket: 'Neu',
        },
      },
      ticketsQueueSelect: {
        placeholder: 'Warteschlangen',
      },
      tickets: {
        toasts: {
          deleted: 'Das Ticket, an dem Sie gearbeitet haben, wurde gelöscht.',
        },
        notification: {
          message: 'Nachricht von',
        },
        tabs: {
          open: { title: 'Offen' },
          closed: { title: 'Geschlossen' },
          groups: { title: 'Gruppen' },
          search: { title: 'Suche' },
        },
        status: {
          closed: 'GESCHLOSSEN',
        },
        tooltips: {
          closeConversation: 'Konversation Schließen',
        },
        search: {
          placeholder: 'Nach Tickets und Nachrichten suchen',
        },
        buttons: {
          showAll: 'Alle',
        },
      },
      transferTicketModal: {
        title: 'Ticket übertragen',
        fieldLabel: 'Benutzer suchen',
        fieldQueueLabel: 'In Warteschlange übertragen',
        fieldQueuePlaceholder: 'Wählen Sie eine Warteschlange',
        noOptions: 'Kein Benutzer mit diesem Namen gefunden',
        buttons: {
          ok: 'Übertragen',
          cancel: 'Abbrechen',
        },
      },
      ticketsList: {
        pendingHeader: 'Wartend',
        assignedHeader: 'In Bearbeitung',
        noTicketsTitle: 'Nichts hier!',
        noTicketsMessage:
          'Keine Tickets mit diesem Status oder Suchbegriff gefunden',
        buttons: {
          accept: 'Akzeptieren',
        },
      },
      newTicketModal: {
        title: 'Ticket erstellen',
        fieldLabel: 'Kontakt suchen',
        add: 'Hinzufügen',
        buttons: {
          ok: 'Speichern',
          cancel: 'Abbrechen',
        },
      },
      mainDrawer: {
        listItems: {
          dashboard: 'Dashboard',
          connections: 'Verbindungen',
          tickets: 'Tickets',
          quickMessages: 'Schnellantworten',
          contacts: 'Kontakte',
          queues: 'Warteschlangen & Chatbot',
          tags: 'Tags',
          administration: 'Verwaltung',
          service: 'Service',
          users: 'Benutzer',
          settings: 'Einstellungen',
          helps: 'Hilfe',
          messagesAPI: 'API',
          schedules: 'Planungen',
          campaigns: 'Kampagnen',
          annoucements: 'Ankündigungen',
          chats: 'Nachrichten',
          financeiro: 'Finanzen',
          logout: 'Abmelden',
          management: 'Management',
          kanban: 'Kanban',
          leads: 'Leads',
          todoList: 'Aufgabenliste',
          spyChat: 'Konversation überwachen',
          closeChat: 'Chat schließen',
          savia: 'Savia',
          listing: 'Auflistung',
          contactLists: 'Kontaktlisten',
          configurations: 'Konfigurationen',
        },
        appBar: {
          i18n: {
            language: 'Deutsch',
            language_short: 'DE',
          },
          user: {
            profile: 'Profil',
            darkmode: 'Dunkelmodus',
            lightmode: 'Hellmodus',
            language: 'Sprache auswählen',
            about: 'Über',
            logout: 'Abmelden',
          },
        },
      },
      messagesAPI: {
        title: 'API',
        textMessage: {
          number: 'Nummer',
          body: 'Nachricht',
          token: 'Registrierter Token',
        },
        mediaMessage: {
          number: 'Nummer',
          body: 'Dateiname',
          media: 'Datei',
          token: 'Registrierter Token',
        },
      },
      notifications: {
        noTickets: 'Keine Benachrichtigungen.',
      },
      quickMessages: {
        title: 'Schnellantworten',
        buttons: {
          add: 'Neue Antwort',
        },
        dialog: {
          shortcode: 'Abkürzung',
          message: 'Antwort',
        },
      },
      kanban: {
        title: 'Kanban',
        searchPlaceholder: 'Suche',
        subMenus: {
          list: 'Tafel',
          tags: 'Lanes',
        },
      },
      tagsKanban: {
        title: 'Lanes',
        laneDefault: 'Offen',
        confirmationModal: {
          deleteTitle: 'Sind Sie sicher, dass Sie diese Lane löschen möchten?',
          deleteMessage: 'Diese Aktion kann nicht rückgängig gemacht werden.',
        },
        table: {
          name: 'Name',
          color: 'Farbe',
          tickets: 'Tickets',
          actions: 'Aktionen',
        },
        buttons: {
          add: 'Neue Lane',
        },
        toasts: {
          deleted: 'Lane erfolgreich gelöscht.',
        },
      },
      contactLists: {
        title: 'Kontaktlisten',
        table: {
          name: 'Name',
          contacts: 'Kontakte',
          actions: 'Aktionen',
        },
        buttons: {
          add: 'Neue Liste',
        },
        dialog: {
          name: 'Name',
          company: 'Unternehmen',
          okEdit: 'Bearbeiten',
          okAdd: 'Hinzufügen',
          add: 'Hinzufügen',
          edit: 'Bearbeiten',
          cancel: 'Abbrechen',
        },
        confirmationModal: {
          deleteTitle: 'Löschen',
          deleteMessage: 'Diese Aktion kann nicht rückgängig gemacht werden.',
        },
        toasts: {
          deleted: 'Eintrag gelöscht',
          created: 'Eintrag erstellt',
        },
      },
      contactListItems: {
        title: 'Kontakte',
        searchPlaceholder: 'Suche',
        buttons: {
          add: 'Neu',
          lists: 'Listen',
          import: 'Importieren',
        },
        dialog: {
          name: 'Name',
          number: 'Nummer',
          whatsapp: 'WhatsApp',
          email: 'Email',
          okEdit: 'Bearbeiten',
          okAdd: 'Hinzufügen',
          add: 'Hinzufügen',
          edit: 'Bearbeiten',
          cancel: 'Abbrechen',
        },
        table: {
          name: 'Name',
          number: 'Nummer',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Aktionen',
        },
        confirmationModal: {
          deleteTitle: 'Löschen',
          deleteMessage: 'Diese Aktion kann nicht rückgängig gemacht werden.',
          importMessage:
            'Möchten Sie die Kontakte aus dieser Tabelle importieren?',
          importTitlte: 'Importieren',
        },
        toasts: {
          deleted: 'Eintrag gelöscht',
        },
      },
      campaigns: {
        title: 'Kampagnen',
        searchPlaceholder: 'Suche',
        buttons: {
          add: 'Neue Kampagne',
          contactLists: 'Kontaktlisten',
        },
        table: {
          name: 'Name',
          whatsapp: 'Verbindung',
          contactList: 'Kontaktliste',
          status: 'Status',
          scheduledAt: 'Planung',
          completedAt: 'Abgeschlossen',
          confirmation: 'Bestätigung',
          actions: 'Aktionen',
        },
        dialog: {
          new: 'Neue Kampagne',
          update: 'Kampagne bearbeiten',
          readonly: 'Nur Lesen',
          form: {
            name: 'Name',
            message1: 'Nachricht 1',
            message2: 'Nachricht 2',
            message3: 'Nachricht 3',
            message4: 'Nachricht 4',
            message5: 'Nachricht 5',
            confirmationMessage1: 'Bestätigungsnachricht 1',
            confirmationMessage2: 'Bestätigungsnachricht 2',
            confirmationMessage3: 'Bestätigungsnachricht 3',
            confirmationMessage4: 'Bestätigungsnachricht 4',
            confirmationMessage5: 'Bestätigungsnachricht 5',
            messagePlaceholder: 'Nachrichteninhalt',
            whatsapp: 'Verbindung',
            status: 'Status',
            scheduledAt: 'Planung',
            confirmation: 'Bestätigung',
            contactList: 'Kontaktliste',
          },
          buttons: {
            add: 'Hinzufügen',
            edit: 'Aktualisieren',
            okadd: 'Ok',
            cancel: 'Sendungen abbrechen',
            restart: 'Sendungen neu starten',
            close: 'Schließen',
            attach: 'Datei anhängen',
          },
        },
        confirmationModal: {
          deleteTitle: 'Löschen',
          deleteMessage: 'Diese Aktion kann nicht rückgängig gemacht werden.',
        },
        toasts: {
          success: 'Operation erfolgreich',
          cancel: 'Kampagne abgebrochen',
          restart: 'Kampagne neu gestartet',
          deleted: 'Eintrag gelöscht',
        },
      },
      announcements: {
        title: 'Ankündigungen',
        searchPlaceholder: 'Suche',
        buttons: {
          add: 'Neue Ankündigung',
          contactLists: 'Ankündigungslisten',
        },
        table: {
          priority: 'Priorität',
          title: 'Titel',
          text: 'Text',
          mediaName: 'Datei',
          status: 'Status',
          actions: 'Aktionen',
        },
        dialog: {
          edit: 'Ankündigung bearbeiten',
          add: 'Neue Ankündigung',
          update: 'Ankündigung aktualisieren',
          readonly: 'Nur Lesen',
          form: {
            priority: 'Priorität',
            title: 'Titel',
            text: 'Text',
            mediaPath: 'Datei',
            status: 'Status',
          },
          buttons: {
            add: 'Hinzufügen',
            edit: 'Aktualisieren',
            okadd: 'Ok',
            cancel: 'Abbrechen',
            close: 'Schließen',
            attach: 'Datei anhängen',
          },
        },
        confirmationModal: {
          deleteTitle: 'Löschen',
          deleteMessage: 'Diese Aktion kann nicht rückgängig gemacht werden.',
        },
        toasts: {
          success: 'Operation erfolgreich',
          deleted: 'Eintrag gelöscht',
        },
      },
      campaignsConfig: {
        title: 'Kampagnenkonfigurationen',
        intervals: 'Intervalle',
        messageInterval: 'Nachrichtenintervall',
        longerIntervalAfter: 'Längeres Intervall nach',
        greaterInterval: 'Größeres Intervall',
        noInterval: 'Kein Intervall',
        notDefined: 'Nicht definiert',
        seconds: 'Sekunden',
        messages: 'Nachrichten',
        addVariable: 'Variable hinzufügen',
        saveSettings: 'Einstellungen speichern',
        shortcode: 'Kurzcode',
        content: 'Inhalt',
        variables: 'Variablen',
      },
      queues: {
        title: 'Warteschlangen & Chatbot',
        table: {
          name: 'Name',
          color: 'Farbe',
          greeting: 'Begrüßungsnachricht',
          actions: 'Aktionen',
        },
        buttons: {
          add: 'Warteschlange hinzufügen',
        },
        confirmationModal: {
          deleteTitle: 'Löschen',
          deleteMessage:
            'Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden! Die Interaktionen dieser Warteschlange bleiben bestehen, haben jedoch keine zugewiesene Warteschlange mehr.',
        },
      },
      queueSelect: {
        inputLabel: 'Warteschlangen',
      },
      users: {
        title: 'Benutzer',
        table: {
          name: 'Name',
          email: 'Email',
          profile: 'Profil',
          actions: 'Aktionen',
        },
        buttons: {
          add: 'Benutzer hinzufügen',
        },
        toasts: {
          deleted: 'Benutzer erfolgreich gelöscht.',
        },
        confirmationModal: {
          deleteTitle: 'Löschen',
          deleteMessage:
            'Alle Benutzerdaten gehen verloren. Die offenen Tickets dieses Benutzers werden in die Warteschlange verschoben.',
        },
      },
      helps: {
        title: 'Hilfezentrum',
      },
      about: {
        aboutthe: 'Über',
        copyright: '© 2024 - Betrieben mit ticketz',
        buttonclose: 'Schließen',
        title: 'Über ticketz',
        abouttitle: 'Ursprung und Verbesserungen',
        aboutdetail:
          'Ticketz ist indirekt vom Whaticket-Projekt abgeleitet, mit Verbesserungen, die von den Entwicklern des EquipeChat-Systems über den YouTube-Kanal VemFazer geteilt wurden, und später von Claudemir Todo Bom verbessert wurden',
        aboutauthorsite: 'Website des Autors',
        aboutwhaticketsite: 'Website der Whaticket-Community auf Github',
        aboutvemfazersite: 'Website des Vem Fazer-Kanals auf Github',
        licenseheading: 'Open-Source-Lizenz',
        licensedetail:
          'Ticketz ist unter der GNU Affero General Public License Version 3 lizenziert, was bedeutet, dass jeder Benutzer, der Zugriff auf diese Anwendung hat, das Recht hat, auf den Quellcode zuzugreifen. Weitere Informationen finden Sie in den folgenden Links:',
        licensefulltext: 'Vollständiger Lizenztext',
        licensesourcecode: 'Quellcode von ticketz',
      },
      schedules: {
        title: 'Planungen',
        confirmationModal: {
          deleteTitle:
            'Sind Sie sicher, dass Sie diese Planung löschen möchten?',
          deleteMessage: 'Diese Aktion kann nicht rückgängig gemacht werden.',
        },
        table: {
          contact: 'Kontakt',
          body: 'Nachricht',
          sendAt: 'Planungsdatum',
          sentAt: 'Sendedatum',
          status: 'Status',
          actions: 'Aktionen',
        },
        buttons: {
          add: 'Neue Planung',
        },
        toasts: {
          deleted: 'Planung erfolgreich gelöscht.',
        },
      },
      tags: {
        title: 'Tags',
        confirmationModal: {
          deleteTitle: 'Sind Sie sicher, dass Sie dieses Tag löschen möchten?',
          deleteMessage: 'Diese Aktion kann nicht rückgängig gemacht werden.',
        },
        table: {
          name: 'Name',
          color: 'Farbe',
          tickets: 'Einträge',
          actions: 'Aktionen',
          id: 'Id',
          kanban: 'Kanban',
        },
        buttons: {
          add: 'Neues Tag',
        },
        toasts: {
          deleted: 'Tag erfolgreich gelöscht.',
        },
      },
      settings: {
        group: {
          general: 'Allgemein',
          timeouts: 'Timeouts',
          officeHours: 'Bürozeiten',
          groups: 'Gruppen',
          confidenciality: 'Vertraulichkeit',
          api: 'API',
          externalServices: 'Externe Dienste',
          serveradmin: 'Server-Administration',
        },
        success: 'Einstellungen erfolgreich gespeichert.',
        copiedToClipboard: 'In die Zwischenablage kopiert',
        title: 'Einstellungen',
        chatbotTicketTimeout: 'Chatbot-Timeout (Minuten)',
        chatbotTicketTimeoutAction: 'Chatbot-Timeout-Aktion',
        settings: {
          userCreation: {
            name: 'Benutzererstellung',
            options: {
              enabled: 'Aktiviert',
              disabled: 'Deaktiviert',
            },
          },
        },
        validations: {
          title: 'Bewertungen',
          options: {
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
          },
        },
        OfficeManagement: {
          title: 'Büroverwaltung',
          options: {
            disabled: 'Deaktiviert',
            ManagementByDepartment: 'Verwaltung nach Warteschlange',
            ManagementByCompany: 'Verwaltung nach Unternehmen',
          },
        },
        outOfHoursAction: {
          title: 'Aktion außerhalb der Geschäftszeiten',
          options: {
            pending: 'Als ausstehend belassen',
            closed: 'Ticket schließen',
          },
        },
        IgnoreGroupMessages: {
          title: 'Gruppennachrichten ignorieren',
          options: {
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
          },
        },
        soundGroupNotifications: {
          title: 'Gruppen-Sound-Benachrichtigungen',
          options: {
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
          },
        },
        groupsTab: {
          title: 'Gruppen-Tab',
          options: {
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
          },
        },
        VoiceAndVideoCalls: {
          title: 'Sprach- und Videoanrufe',
          options: {
            enabled: 'Ignorieren',
            disabled: 'Nichtverfügbarkeit melden',
          },
        },
        AutomaticChatbotOutput: {
          title: 'Automatischer Chatbot-Ausgang',
          options: {
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
          },
        },
        ShowNumericEmoticons: {
          title: 'Numerische Emoticons in der Warteschlange anzeigen',
          options: {
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
          },
        },
        QuickMessages: {
          title: 'Schnelle Nachrichten',
          options: {
            enabled: 'Nach Unternehmen',
            disabled: 'Nach Benutzer',
          },
        },
        AllowRegistration: {
          title: 'Registrierung erlauben',
          options: {
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
          },
        },
        FileUploadLimit: {
          title: 'Datei-Upload-Limit (MB)',
        },
        FileDownloadLimit: {
          title: 'Datei-Download-Limit (MB)',
        },
        messageVisibility: {
          title: 'Nachrichtensichtbarkeit',
          options: {
            respectMessageQueue: 'Nachrichtenwarteschlange respektieren',
            respectTicketQueue: 'Ticketwarteschlange respektieren',
          },
        },
        keepQueueAndUser: {
          title: 'Warteschlange und Benutzer im geschlossenen Ticket behalten',
          options: {
            enabled: 'Aktiviert',
            disabled: 'Deaktiviert',
          },
        },
        GracePeriod: {
          title: 'Karenzzeit nach Ablauf (Tage)',
        },
        ticketAcceptedMessage: {
          title: 'Ticket angenommen Nachricht',
          placeholder: 'Geben Sie hier Ihre Ticket angenommen Nachricht ein',
        },
        transferMessage: {
          title: 'Übertragungsnachricht',
          placeholder: 'Geben Sie hier Ihre Übertragungsnachricht ein',
        },
        mustacheVariables: {
          title: 'Verfügbare Variablen:',
        },
        WelcomeGreeting: {
          greetings: 'Hallo',
          welcome: 'Willkommen bei',
          expirationTime: 'Aktiv bis',
        },
        Options: {
          title: 'Optionen',
        },
        Companies: {
          title: 'Unternehmen',
        },
        schedules: {
          title: 'Zeitpläne',
        },
        Plans: {
          title: 'Pläne',
        },
        Help: {
          title: 'Hilfe',
        },
        Whitelabel: {
          title: 'Whitelabel',
        },
        PaymentGateways: {
          title: 'Zahlungsgateways',
        },
        AIProvider: {
          title: 'KI-Service',
        },
        AudioTranscriptions: {
          title: 'Audio-Transkription',
        },
        TagsMode: {
          title: 'Tags-Modus',
          options: {
            ticket: 'Ticket',
            contact: 'Kontakt',
            both: 'Ticket und Kontakt',
          },
        },
        schedulesUpdated: 'Zeitpläne erfolgreich aktualisiert.',
        operationUpdated: 'Vorgang erfolgreich aktualisiert.',
        paymentGateway: 'Zahlungsgateway',
        none: 'Keine',
        owenPayments: 'Owen Payments 💎',
        efi: 'Efí',
        apiToken: 'API-Token',
        aiKey: 'KI-Schlüssel',
        defaultAppName: 'Ticketz',
        ratingsTimeout: 'Bewertungs-Timeout (Minuten)',
        noQueueTimeout: 'Keine-Warteschlange-Timeout (Minuten)',
        noQueueTimeoutAction: 'Keine-Warteschlange-Timeout-Aktion',
        openTicketTimeout: 'Offenes-Ticket-Timeout (Minuten)',
        openTicketTimeoutAction: 'Offenes-Ticket-Timeout-Aktion',
        autoReopenTimeout: 'Auto-Wiedereröffnung-Timeout (Minuten)',
        close: 'Schließen',
        returnToQueue: 'Zur Warteschlange zurückkehren',
        officeHours: 'Bürozeiten',
        officeManagement: 'Büroverwaltung',
        managementByQueue: 'Verwaltung nach Warteschlange',
        managementByCompany: 'Verwaltung nach Unternehmen',
        groups: 'Gruppen',
        ignoreGroupMessages: 'Gruppennachrichten ignorieren',
        groupSoundNotifications: 'Gruppen-Sound-Benachrichtigungen',
        confidentiality: 'Vertraulichkeit',
        respectMessageQueue: 'Nachrichtenwarteschlange respektieren',
        respectTicketQueue: 'Ticketwarteschlange respektieren',
        api: 'API',
        leaveAsPending: 'Als ausstehend belassen',
        enabled: 'Aktiviert',
        disabled: 'Deaktiviert',
        // Form fields
        name: 'Name',
        email: 'E-Mail',
        phone: 'Telefon',
        company: 'Unternehmen',
        plan: 'Plan',
        campaigns: 'Kampagnen',
        status: 'Status',
        createdAt: 'Erstellt am',
        dueDate: 'Fälligkeitsdatum',
        value: 'Wert',
        users: 'Benutzer',
        connections: 'Verbindungen',
        queues: 'Warteschlangen',
        public: 'Öffentlich',
        yes: 'Ja',
        no: 'Nein',
        active: 'Aktiv',
        inactive: 'Inaktiv',
        // Plan management
        planName: 'Plan Name',
        planValue: 'Plan Wert',
        planUsers: 'Plan Benutzer',
        planConnections: 'Plan Verbindungen',
        planQueues: 'Plan Warteschlangen',
        planPublic: 'Plan Öffentlich',
        // Campaign management
        campaignTitle: 'Kampagnen Titel',
        campaignCode: 'Kampagnen Code',
        campaignDescription: 'Kampagnen Beschreibung',
        campaignEnabled: 'Kampagne Aktiviert',
        campaignDisabled: 'Kampagne Deaktiviert',
        // User management
        userName: 'Benutzer Name',
        userEmail: 'Benutzer E-Mail',
        userPhone: 'Benutzer Telefon',
        userCompany: 'Benutzer Unternehmen',
        userPlan: 'Benutzer Plan',
        // Whitelabel
        primaryColorLight: 'Primärfarbe hell',
        primaryColorDark: 'Primärfarbe dunkel',
        appLogoLight: 'App Logo hell',
        appLogoDark: 'App Logo dunkel',
        appName: 'App Name',
        appFavicon: 'App Favicon',
        logoSvgHint: 'SVG und 28:10 Seitenverhältnis bevorzugen',
        faviconSvgHint: 'Quadratisches SVG-Bild oder 512x512 PNG bevorzugen',
        // Buttons
        clear: 'Löschen',
        save: 'Speichern',
        cancel: 'Abbrechen',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        add: 'Hinzufügen',
        // Date format
        dateFormat: 'dd/mm/yyyy',
        // Recurrence
        recurrence: 'Wiederholung',
        // Contact lists
        contactLists: 'Kontaktlisten',
        // Navigation
        listing: 'Auflistung',
        // System description
        systemDescription: 'ticketz chat based ticket system',
      },
      messagesList: {
        header: {
          assignedTo: 'Zugewiesen an:',
          buttons: {
            return: 'Zurückkehren',
            resolve: 'Lösen',
            reopen: 'Wieder öffnen',
            accept: 'Akzeptieren',
          },
        },
      },
      messagesInput: {
        placeholderOpen: 'Nachricht eingeben',
        placeholderClosed:
          'Öffnen oder akzeptieren Sie dieses Ticket, um eine Nachricht zu senden.',
        signMessage: 'Signieren',
        replying: 'Antworten',
        editing: 'Bearbeiten',
      },
      message: {
        edited: 'Bearbeitet',
      },
      contactDrawer: {
        header: 'Kontaktdaten',
        buttons: {
          edit: 'Kontakt bearbeiten',
        },
        extraInfo: 'Weitere Informationen',
      },
      ticketOptionsMenu: {
        schedule: 'Planung',
        delete: 'Löschen',
        transfer: 'Übertragen',
        registerAppointment: 'Kontaktbeobachtungen',
        appointmentsModal: {
          title: 'Kontaktbeobachtungen',
          textarea: 'Beobachtung',
          placeholder:
            'Geben Sie hier die Informationen ein, die Sie registrieren möchten',
        },
        confirmationModal: {
          title: 'Ticket des Kontakts löschen',
          message:
            'Achtung! Alle Nachrichten im Zusammenhang mit dem Ticket gehen verloren.',
        },
        buttons: {
          delete: 'Löschen',
          cancel: 'Abbrechen',
        },
      },
      confirmationModal: {
        buttons: {
          confirm: 'Ok',
          cancel: 'Abbrechen',
        },
      },
      messageOptionsMenu: {
        delete: 'Löschen',
        edit: 'Bearbeiten',
        history: 'Verlauf',
        reply: 'Antworten',
        confirmationModal: {
          title: 'Nachricht löschen?',
          message: 'Diese Aktion kann nicht rückgängig gemacht werden.',
        },
      },
      messageHistoryModal: {
        close: 'Schließen',
        title: 'Nachrichtenbearbeitungsverlauf',
      },
      presence: {
        unavailable: 'Nicht verfügbar',
        available: 'Verfügbar',
        composing: 'Schreibt...',
        recording: 'Nimmt auf...',
        paused: 'Pausiert',
      },
      privacyModal: {
        title: 'WhatsApp-Datenschutz bearbeiten',
        buttons: {
          cancel: 'Abbrechen',
          okEdit: 'Speichern',
        },
        form: {
          menu: {
            all: 'Alle',
            none: 'Niemand',
            contacts: 'Meine Kontakte',
            contact_blacklist: 'Ausgewählte Kontakte',
            match_last_seen: 'Ähnlich wie Zuletzt gesehen',
            known: 'Bekannt',
            disable: 'Deaktiviert',
            hrs24: '24 Stunden',
            dias7: '7 Tage',
            dias90: '90 Tage',
          },
          readreceipts:
            'Um den Datenschutz der Lesebestätigungen zu aktualisieren',
          profile: 'Um den Datenschutz des Profilbilds zu aktualisieren',
          status: 'Um den Datenschutz der Statusmeldungen zu aktualisieren',
          online: 'Um den Online-Datenschutz zu aktualisieren',
          last: 'Um den Datenschutz des Zuletzt gesehen zu aktualisieren',
          groupadd:
            'Um den Datenschutz der Gruppenhinzufügung zu aktualisieren',
          calladd: 'Um den Datenschutz der Anrufhinzufügung zu aktualisieren',
          disappearing:
            'Um den Standardmodus für verschwindende Nachrichten zu aktualisieren',
        },
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP:
          'Es muss mindestens ein Standard-WhatsApp geben.',
        ERR_NO_DEF_WAPP_FOUND:
          'Kein Standard-WhatsApp gefunden. Überprüfen Sie die Verbindungsseite.',
        ERR_WAPP_NOT_INITIALIZED:
          'Diese WhatsApp-Sitzung wurde nicht initialisiert. Überprüfen Sie die Verbindungsseite.',
        ERR_WAPP_CHECK_CONTACT:
          'WhatsApp-Kontakt konnte nicht überprüft werden. Überprüfen Sie die Verbindungsseite',
        ERR_WAPP_INVALID_CONTACT: 'Dies ist keine gültige WhatsApp-Nummer.',
        ERR_WAPP_DOWNLOAD_MEDIA:
          'Medien von WhatsApp konnten nicht heruntergeladen werden. Überprüfen Sie die Verbindungsseite.',
        ERR_INVALID_CREDENTIALS:
          'Authentifizierungsfehler. Bitte versuchen Sie es erneut.',
        ERR_SENDING_WAPP_MSG:
          'Fehler beim Senden der WhatsApp-Nachricht. Überprüfen Sie die Verbindungsseite.',
        ERR_DELETE_WAPP_MSG: 'WhatsApp-Nachricht konnte nicht gelöscht werden.',
        ERR_EDITING_WAPP_MSG:
          'WhatsApp-Nachricht konnte nicht bearbeitet werden.',
        ERR_OTHER_OPEN_TICKET:
          'Es gibt bereits ein offenes Ticket für diesen Kontakt.',
        ERR_SESSION_EXPIRED: 'Sitzung abgelaufen. Bitte erneut einloggen.',
        ERR_USER_CREATION_DISABLED:
          'Die Benutzererstellung wurde vom Administrator deaktiviert.',
        ERR_NO_PERMISSION:
          'Sie haben keine Berechtigung, auf diese Funktion zuzugreifen.',
        ERR_DUPLICATED_CONTACT:
          'Es gibt bereits einen Kontakt mit dieser Nummer.',
        ERR_NO_SETTING_FOUND: 'Keine Einstellung mit dieser ID gefunden.',
        ERR_NO_CONTACT_FOUND: 'Kein Kontakt mit dieser ID gefunden.',
        ERR_NO_TICKET_FOUND: 'Kein Ticket mit dieser ID gefunden.',
        ERR_NO_USER_FOUND: 'Kein Benutzer mit dieser ID gefunden.',
        ERR_NO_WAPP_FOUND: 'Kein WhatsApp mit dieser ID gefunden.',
        ERR_CREATING_MESSAGE:
          'Fehler beim Erstellen der Nachricht in der Datenbank.',
        ERR_CREATING_TICKET:
          'Fehler beim Erstellen des Tickets in der Datenbank.',
        ERR_FETCH_WAPP_MSG:
          'Fehler beim Abrufen der Nachricht auf WhatsApp, möglicherweise ist sie zu alt.',
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          'Diese Farbe wird bereits verwendet, wählen Sie eine andere.',
        ERR_WAPP_GREETING_REQUIRED:
          'Die Begrüßungsnachricht ist erforderlich, wenn es mehr als eine Warteschlange gibt.',
      },
      ticketz: {
        registration: {
          header: 'Registrieren Sie sich in der Ticketz-Benutzerdatenbank',
          description:
            'Füllen Sie die folgenden Felder aus, um sich in der Ticketz-Benutzerdatenbank zu registrieren und Neuigkeiten über das Projekt zu erhalten.',
          name: 'Name',
          country: 'Land',
          phoneNumber: 'WhatsApp-Nummer',
          submit: 'Registrieren',
        },
        support: {
          title: 'Unterstützen Sie das Ticketz Open Source-Projekt',
          mercadopagotitle: 'Kreditkarte',
          recurringbrl: 'Wiederkehrende Spende in R$',
          paypaltitle: 'Kreditkarte',
          international: 'International in US$',
        },
      },
      interactions: {
        toasts: {
          created: 'Interaktion erfolgreich erstellt',
        },
        buttons: {
          add: 'Interaktion hinzufügen',
        },
        types: {
          note: 'Notiz',
          email: 'E-Mail',
          message: 'Nachricht',
          file: 'Datei',
        },
        categories: {
          internal_note: 'Interne Notiz',
          customer_communication: 'Kundenkommunikation',
          system: 'System',
        },
        dialog: {
          add: 'Interaktion hinzufügen',
        },
        form: {
          type: 'Typ',
          category: 'Kategorie',
          notes: 'Notizen',
        },
      },
      leads: {
        title: 'Leads',
        searchPlaceholder: 'Leads suchen',
        notFound: 'Lead nicht gefunden',
        buttons: {
          add: 'Neuer Lead',
          save: 'Speichern',
          cancel: 'Abbrechen',
        },
        views: {
          board: 'Board',
          list: 'Liste',
        },
        tabs: {
          basic: 'Grundlegend',
          contact: 'Kontakt',
          financial: 'Finanziell',
          tags: 'Tags',
          notes: 'Notizen',
        },
        modal: {
          add: {
            title: 'Neuer Lead',
          },
          edit: {
            title: 'Lead bearbeiten',
          },
          form: {
            contact: 'Kontakt',
            stage: 'Phase',
            temperature: 'Temperatur',
            source: 'Quelle',
            expectedValue: 'Erwarteter Wert',
            probability: 'Wahrscheinlichkeit (%)',
            expectedClosingDate: 'Erwartetes Abschlussdatum',
            assignedTo: 'Zugewiesen an',
            notes: 'Notizen',
            selectUser: 'Benutzer auswählen',
          },
        },
        dialog: {
          new: 'Neuer Lead',
          edit: 'Lead bearbeiten',
          addTag: 'Tag hinzufügen',
        },
        form: {
          name: 'Name',
          title: 'Titel',
          titleHelper: 'Kurze Beschreibung des Leads',
          description: 'Beschreibung',
          temperature: 'Temperatur',
          status: 'Status',
          pipeline: 'Pipeline',
          contact: 'Kontakt',
          column: 'Spalte',
          assignedTo: 'Zugewiesen an',
          unassigned: 'Nicht zugewiesen',
          source: 'Quelle',
          expectedValue: 'Erwarteter Wert',
          currency: 'Währung',
          probability: 'Wahrscheinlichkeit (%)',
          probabilityHelper: 'Wahrscheinlichkeit des Abschlusses (0-100%)',
          expectedClosingDate: 'Erwartetes Abschlussdatum',
          tags: 'Tags',
          addTag: 'Tag hinzufügen',
          tag: 'Tag',
          customFields: 'Benutzerdefinierte Felder',
          customFieldName: 'Benutzerdefinierten Feldnamen eingeben',
          addCustomField: 'Benutzerdefiniertes Feld hinzufügen',
          notes: 'Notizen',
        },
        table: {
          lead: 'Lead',
          contact: 'Kontakt',
          status: 'Status',
          pipeline: 'Pipeline',
          column: 'Spalte',
          temperature: 'Temperatur',
          tags: 'Tags',
          financial: 'Finanziell',
          assignedTo: 'Zugewiesen an',
          actions: 'Aktionen',
          unassigned: 'Nicht zugewiesen',
        },
        sections: {
          contact: 'Kontaktinformationen',
          financial: 'Finanzinformationen',
          tags: 'Tags',
          customFields: 'Benutzerdefinierte Felder',
          notes: 'Notizen',
        },
        fields: {
          contact: 'Kontakt',
          phone: 'Telefon',
          email: 'E-Mail',
          source: 'Quelle',
          assignedTo: 'Zugewiesen an',
          expectedValue: 'Erwarteter Wert',
          probability: 'Wahrscheinlichkeit',
          expectedClosingDate: 'Erwartetes Abschlussdatum',
        },
        status: {
          new: 'Neu',
          contacted: 'Kontaktiert',
          follow_up: 'Nachfassung',
          proposal: 'Angebot',
          negotiation: 'Verhandlung',
          qualified: 'Qualifiziert',
          unqualified: 'Nicht qualifiziert',
          converted: 'Konvertiert',
          lost: 'Verloren',
          closed_won: 'Geschlossen Gewonnen',
          closed_lost: 'Geschlossen Verloren',
        },
        pipeline: {
          default: 'Standard',
          sales: 'Vertrieb',
          support: 'Support',
          onboarding: 'Onboarding',
        },
        temperature: {
          hot: 'Heiß',
          warm: 'Warm',
          cold: 'Kalt',
        },
        timeline: {
          title: 'Zeitleiste',
          empty: 'Keine Interaktionen gefunden',
        },
        toasts: {
          created: 'Lead erfolgreich erstellt',
          updated: 'Lead erfolgreich aktualisiert',
          deleted: 'Lead erfolgreich gelöscht',
          contactRequired: 'Kontakt ist erforderlich',
          tagAdded: 'Tag erfolgreich hinzugefügt',
          tagRemoved: 'Tag erfolgreich entfernt',
        },
        validation: {
          name: {
            required: 'Name ist erforderlich',
          },
          title: {
            max: 'Titel darf maximal 255 Zeichen haben',
          },
          contact: {
            required: 'Kontakt ist erforderlich',
          },
          column: {
            required: 'Spalte ist erforderlich',
          },
          temperature: {
            required: 'Temperatur ist erforderlich',
          },
          status: {
            required: 'Status ist erforderlich',
          },
          pipeline: {
            required: 'Pipeline ist erforderlich',
          },
          source: {
            required: 'Quelle ist erforderlich',
          },
          currency: {
            required: 'Währung ist erforderlich',
          },
          probability: {
            min: 'Wahrscheinlichkeit muss mindestens 0 sein',
            max: 'Wahrscheinlichkeit muss maximal 100 sein',
          },
        },
        leadColumns: {
          buttons: {
            add: 'Neue Spalte',
            save: 'Speichern',
            cancel: 'Abbrechen',
          },
          dialog: {
            new: 'Neue Spalte',
            edit: 'Spalte bearbeiten',
          },
          modal: {
            add: {
              title: 'Neue Spalte',
            },
            edit: {
              title: 'Spalte bearbeiten',
            },
            form: {
              name: 'Name',
              color: 'Farbe',
            },
          },
          toasts: {
            created: 'Spalte erfolgreich erstellt',
            updated: 'Spalte erfolgreich aktualisiert',
            deleted: 'Spalte erfolgreich gelöscht',
          },
        },
      },
      todoList: {
        title: 'Aufgabenliste',
        newTask: 'Neue Aufgabe',
        add: 'Hinzufügen',
        save: 'Speichern',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        noTasks: 'Keine Aufgaben gefunden',
        taskPlaceholder: 'Neue Aufgabe eingeben',
        lastUpdate: 'Letzte Aktualisierung',
        taskRequired: 'Aufgabentext ist erforderlich',
      },
      ticketMessagesDialog: {
        buttons: {
          close: 'Schließen',
        },
      },
    },
  },
};

export { messages };
