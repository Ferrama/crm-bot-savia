const messages = {
  fr: {
    translations: {
      common: {
        search: 'Rechercher',
        edit: 'Éditer',
        delete: 'Supprimer',
        cancel: 'Annuler',
        save: 'Enregistrer',
        confirm: 'Confirmer',
        close: 'Fermer',
        error: 'Erreur',
        success: 'Succès',
        actions: 'Actions',
        add: 'Ajouter',
        name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        company: 'Entreprise',
        user: 'Utilisateur',
        connection: 'Connexion',
        queue: "File d'attente",
        contact: 'Contact',
        messages: 'Messages',
        chats: 'Chats',
        spyChat: 'Espionner la Conversation',
        closeChat: 'Fermer le Chat',
        remove: 'Supprimer',
      },
      signup: {
        title: "S'inscrire",
        toasts: {
          success: 'Utilisateur créé avec succès ! Connectez-vous !!!',
          fail: "Erreur lors de la création de l'utilisateur. Vérifiez les informations fournies.",
        },
        form: {
          name: 'Nom',
          email: 'Email',
          password: 'Mot de passe',
        },
        buttons: {
          submit: "S'inscrire",
          login: 'Vous avez déjà un compte ? Connectez-vous !',
        },
      },
      login: {
        title: 'Connexion',
        form: {
          email: 'Email',
          password: 'Mot de passe',
        },
        buttons: {
          submit: 'Se connecter',
          register: "Vous n'avez pas de compte ? Inscrivez-vous !",
        },
      },
      companies: {
        title: 'Enregistrer une entreprise',
        form: {
          name: "Nom de l'entreprise",
          plan: 'Plan',
          token: 'Jeton',
          submit: 'Enregistrer',
          success: 'Entreprise créée avec succès !',
        },
      },
      auth: {
        toasts: {
          success: 'Connexion réussie !',
        },
        token: 'Jeton',
      },
      dashboard: {
        charts: {
          perDay: {
            title: "Interventions aujourd'hui : ",
          },
        },
      },
      connections: {
        title: 'Connexions',
        toasts: {
          deleted: 'Connexion avec WhatsApp supprimée avec succès !',
        },
        confirmationModal: {
          deleteTitle: 'Supprimer',
          deleteMessage: 'Êtes-vous sûr ? Cette action est irréversible.',
          disconnectTitle: 'Déconnecter',
          disconnectMessage:
            'Êtes-vous sûr ? Vous devrez scanner à nouveau le QR Code.',
        },
        buttons: {
          add: 'Ajouter WhatsApp',
          disconnect: 'Déconnecter',
          tryAgain: 'Réessayer',
          qrcode: 'QR CODE',
          newQr: 'Nouveau QR CODE',
          connecting: 'Connexion en cours',
        },
        toolTips: {
          disconnected: {
            title: 'Échec de la connexion à WhatsApp',
            content:
              'Assurez-vous que votre téléphone est connecté à Internet et réessayez, ou demandez un nouveau QR Code',
          },
          qrcode: {
            title: 'En attente de la lecture du QR Code',
            content:
              "Cliquez sur le bouton 'QR CODE' et scannez le QR Code avec votre téléphone pour démarrer la session",
          },
          connected: {
            title: 'Connexion établie !',
          },
          timeout: {
            title: 'Connexion avec le téléphone perdue',
            content:
              "Assurez-vous que votre téléphone est connecté à Internet et que WhatsApp est ouvert, ou cliquez sur le bouton 'Déconnecter' pour obtenir un nouveau QR Code",
          },
        },
        table: {
          name: 'Nom',
          status: 'Statut',
          lastUpdate: 'Dernière mise à jour',
          default: 'Par défaut',
          actions: 'Actions',
          session: 'Session',
        },
      },
      internalChat: {
        title: 'Chat Interne',
        new: 'Nouveau',
        edit: 'Modifier',
        delete: 'Supprimer',
        close: 'Fermer',
        save: 'Enregistrer',
        chat: 'Chat',
        titlePlaceholder: 'Titre',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce chat ?',
        confirmDeleteMessage: 'Cette action ne peut pas être annulée.',
        noChats: 'Aucun chat trouvé',
        noMessages: 'Aucun message trouvé',
        typeMessage: 'Tapez un message',
        messages: 'Messages',
        chats: 'Chats',
        spyChat: 'Espionner la Conversation',
        closeChat: 'Fermer le Chat',
        acceptChat: 'Accepter le Chat',
        chatbot: 'Chatbot',
        queue: "File d'attente",
        noQueue: "Aucune file d'attente",
        assignedTo: 'Assigné à',
        lastMessage: 'Dernier message',
        newMessage: 'Nouveau message',
        unreadMessages: 'Messages non lus',
        closed: 'FERMÉ',
        pending: 'EN ATTENTE',
        open: 'OUVERT',
        conversation: 'Conversation',
        location: 'Localisation',
        clickToViewLocation: 'Cliquez pour voir la localisation',
        download: 'Télécharger',
        noRecords: 'Aucun enregistrement',
        dialog: {
          title: 'Conversation',
          titleLabel: 'Titre',
          titlePlaceholder: 'Titre',
          close: 'Fermer',
          save: 'Enregistrer',
          fillTitle: 'Veuillez remplir le titre de la conversation.',
          selectUser: 'Veuillez sélectionner au moins un utilisateur.',
        },
        tabs: {
          chats: 'Chats',
          messages: 'Messages',
        },
        presence: {
          composing: "En train d'écrire...",
          recording: "En train d'enregistrer...",
          available: 'Disponible',
          unavailable: 'Indisponible',
        },
      },
      whatsappModal: {
        title: {
          add: 'Ajouter WhatsApp',
          edit: 'Modifier WhatsApp',
        },
        form: {
          name: 'Nom',
          default: 'Par défaut',
        },
        buttons: {
          okAdd: 'Ajouter',
          okEdit: 'Enregistrer',
          cancel: 'Annuler',
        },
        success: 'WhatsApp enregistré avec succès.',
      },
      qrCode: {
        message: 'Scanner QR',
      },
      contacts: {
        title: 'Contacts',
        toasts: {
          deleted: 'Contact supprimé avec succès !',
        },
        searchPlaceholder: 'Rechercher...',
        confirmationModal: {
          deleteTitle: 'Supprimer',
          importTitlte: 'Importer des contacts',
          deleteMessage:
            'Êtes-vous sûr de vouloir supprimer ce contact ? Toutes les interventions associées seront perdues.',
          importMessage:
            'Voulez-vous importer tous les contacts du téléphone ?',
        },
        buttons: {
          import: 'Importer des Contacts',
          add: 'Ajouter un Contact',
        },
        table: {
          name: 'Nom',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Actions',
        },
      },
      contactModal: {
        title: {
          add: 'Ajouter un contact',
          edit: 'Modifier le contact',
        },
        form: {
          mainInfo: 'Informations du contact',
          extraInfo: 'Informations supplémentaires',
          name: 'Nom',
          number: 'Numéro WhatsApp',
          email: 'Email',
          extraName: 'Nom du champ',
          extraValue: 'Valeur',
          disableBot: 'Désactiver le chatbot',
        },
        buttons: {
          addExtraInfo: 'Ajouter une information',
          okAdd: 'Ajouter',
          okEdit: 'Enregistrer',
          cancel: 'Annuler',
        },
        success: 'Contact enregistré avec succès.',
      },
      queueModal: {
        title: {
          add: "Ajouter une file d'attente",
          edit: "Modifier la file d'attente",
        },
        form: {
          name: 'Nom',
          color: 'Couleur',
          greetingMessage: 'Message de bienvenue',
          complationMessage: 'Message de fin',
          outOfHoursMessage: "Message hors des heures d'ouverture",
          ratingMessage: "Message d'évaluation",
          transferMessage: 'Message de transfert',
          token: 'Jeton',
        },
        buttons: {
          okAdd: 'Ajouter',
          okEdit: 'Enregistrer',
          cancel: 'Annuler',
          attach: 'Joindre un fichier',
        },
        serviceHours: {
          dayWeek: 'Jour de la semaine',
          startTimeA: 'Heure de début - Période A',
          endTimeA: 'Heure de fin - Période A',
          startTimeB: 'Heure de début - Période B',
          endTimeB: 'Heure de fin - Période B',
          monday: 'Lundi',
          tuesday: 'Mardi',
          wednesday: 'Mercredi',
          thursday: 'Jeudi',
          friday: 'Vendredi',
          saturday: 'Samedi',
          sunday: 'Dimanche',
        },
      },
      userModal: {
        title: {
          add: 'Ajouter un utilisateur',
          edit: "Modifier l'utilisateur",
        },
        form: {
          name: 'Nom',
          email: 'Email',
          password: 'Mot de passe',
          profile: 'Profil',
        },
        buttons: {
          okAdd: 'Ajouter',
          okEdit: 'Enregistrer',
          cancel: 'Annuler',
        },
        success: 'Utilisateur enregistré avec succès.',
      },
      scheduleModal: {
        title: {
          error: "Erreur d'envoi",
          schedule: 'Planifier le message',
        },
        status: {
          pending: 'En attente',
          sent: 'Envoyé',
          erro: 'Erreur',
        },
        validation: {
          bodyMin: 'Message trop court',
          required: 'Obligatoire',
          minTime: "L'heure doit être d'au moins 5 minutes après maintenant",
        },
        form: {
          body: 'Message',
          sendAt: 'Envoyer à',
          saveMessage: 'Sauvegarder comme modèle',
          contactPlaceholder: 'Contact',
          whatsappPlaceholder: 'WhatsApp',
        },
        buttons: {
          cancel: 'Annuler',
          okAdd: 'Ajouter',
          okEdit: 'Enregistrer',
        },
        success: 'Programmation enregistrée avec succès !',
      },
      tagModal: {
        title: {
          add: 'Nouvelle Étiquette',
          edit: 'Modifier Étiquette',
          addKanban: 'Nouvelle Lane',
          editKanban: 'Modifier Lane',
        },
        form: {
          name: 'Nom',
          color: 'Couleur',
          kanban: 'Kanban',
        },
        buttons: {
          okAdd: 'Ajouter',
          okEdit: 'Enregistrer',
          cancel: 'Annuler',
        },
        success: 'Étiquette enregistrée avec succès.',
        successKanban: 'Lane enregistrée avec succès.',
      },
      chat: {
        noTicketMessage: 'Sélectionnez un ticket pour commencer à discuter.',
      },
      uploads: {
        titles: {
          titleUploadMsgDragDrop:
            'GLISSEZ ET DÉPOSEZ LES FICHIERS DANS LE CHAMP CI-DESSOUS',
          titleFileList: 'Liste des fichiers',
        },
      },
      ticketsManager: {
        buttons: {
          newTicket: 'Nouveau',
        },
      },
      ticketsQueueSelect: {
        placeholder: "Files d'attente",
      },
      tickets: {
        toasts: {
          deleted: 'Le ticket sur lequel vous travailliez a été supprimé.',
        },
        notification: {
          message: 'Message de',
        },
        tabs: {
          open: { title: 'Ouverts' },
          closed: { title: 'Résolus' },
          groups: { title: 'Groupes' },
          search: { title: 'Recherche' },
        },
        status: {
          closed: 'FERMÉ',
        },
        tooltips: {
          closeConversation: 'Fermer la Conversation',
        },
        search: {
          placeholder: 'Rechercher des tickets et des messages',
        },
        buttons: {
          showAll: 'Tous',
        },
      },
      transferTicketModal: {
        title: 'Transférer le Ticket',
        fieldLabel: 'Tapez pour rechercher des utilisateurs',
        fieldQueueLabel: "Transférer à la file d'attente",
        fieldQueuePlaceholder: "Sélectionnez une file d'attente",
        noOptions: 'Aucun utilisateur trouvé avec ce nom',
        buttons: {
          ok: 'Transférer',
          cancel: 'Annuler',
        },
      },
      ticketsList: {
        pendingHeader: 'En attente',
        assignedHeader: 'En cours',
        noTicketsTitle: 'Rien ici !',
        noTicketsMessage:
          'Aucune intervention trouvée avec ce statut ou ce terme de recherche',
        buttons: {
          accept: 'Accepter',
        },
      },
      newTicketModal: {
        title: 'Créer un Ticket',
        fieldLabel: 'Tapez pour rechercher le contact',
        add: 'Ajouter',
        buttons: {
          ok: 'Enregistrer',
          cancel: 'Annuler',
        },
      },
      mainDrawer: {
        listItems: {
          dashboard: 'Tableau de bord',
          connections: 'Connexions',
          tickets: 'Interventions',
          quickMessages: 'Réponses Rapides',
          contacts: 'Contacts',
          queues: "Files d'attente & Chatbot",
          tags: 'Étiquettes',
          administration: 'Administration',
          service: 'Service',
          users: 'Utilisateurs',
          settings: 'Paramètres',
          helps: 'Aide',
          messagesAPI: 'API',
          schedules: 'Planifications',
          campaigns: 'Campagnes',
          annoucements: 'Annonces',
          chats: 'Chat Interne',
          financeiro: 'Financier',
          logout: 'Déconnexion',
          management: 'Gestion',
          kanban: 'Kanban',
          leads: 'Leads',
          todoList: 'Liste de Tâches',
          savia: 'Savia',
          listing: 'Liste',
          contactLists: 'Listes de Contacts',
          configurations: 'Configurations',
        },
        appBar: {
          i18n: {
            language: 'Français',
            language_short: 'FR',
          },
          user: {
            profile: 'Profil',
            darkmode: 'Mode sombre',
            lightmode: 'Mode clair',
            language: 'Sélectionner la langue',
            about: 'À propos',
            logout: 'Déconnexion',
          },
        },
      },
      messagesAPI: {
        title: 'API',
        textMessage: {
          number: 'Numéro',
          body: 'Message',
          token: 'Jeton enregistré',
        },
        mediaMessage: {
          number: 'Numéro',
          body: 'Nom du fichier',
          media: 'Fichier',
          token: 'Jeton enregistré',
        },
      },
      notifications: {
        noTickets: 'Aucune notification.',
      },
      quickMessages: {
        title: 'Réponses Rapides',
        buttons: {
          add: 'Nouvelle Réponse',
        },
        dialog: {
          title: 'Message Rapide',
          shortcode: 'Raccourci',
          message: 'Réponse',
          buttons: {
            cancel: 'Annuler',
            save: 'Enregistrer',
          },
        },
      },
      kanban: {
        title: 'Kanban',
        searchPlaceholder: 'Recherche',
        subMenus: {
          list: 'Tableau',
          tags: 'Lanes',
        },
      },
      tagsKanban: {
        title: 'Lanes',
        laneDefault: 'Ouvert',
        confirmationModal: {
          deleteTitle: 'Êtes-vous sûr de vouloir supprimer cette Lane ?',
          deleteMessage: 'Cette action est irréversible.',
        },
        table: {
          name: 'Nom',
          color: 'Couleur',
          tickets: 'Tickets',
          actions: 'Actions',
        },
        buttons: {
          add: 'Nouvelle Lane',
        },
        toasts: {
          deleted: 'Lane supprimée avec succès.',
        },
      },
      contactLists: {
        title: 'Listes de Contacts',
        table: {
          name: 'Nom',
          contacts: 'Contacts',
          actions: 'Actions',
        },
        buttons: {
          add: 'Nouvelle Liste',
        },
        dialog: {
          name: 'Nom',
          company: 'Entreprise',
          okEdit: 'Modifier',
          okAdd: 'Ajouter',
          add: 'Ajouter',
          edit: 'Modifier',
          cancel: 'Annuler',
        },
        confirmationModal: {
          deleteTitle: 'Supprimer',
          deleteMessage: 'Cette action est irréversible.',
        },
        toasts: {
          deleted: 'Enregistrement supprimé',
          created: 'Enregistrement créé',
        },
      },
      contactListItems: {
        title: 'Contacts',
        searchPlaceholder: 'Recherche',
        buttons: {
          add: 'Nouveau',
          lists: 'Listes',
          import: 'Importer',
        },
        dialog: {
          name: 'Nom',
          number: 'Numéro',
          whatsapp: 'WhatsApp',
          email: 'Email',
          okEdit: 'Modifier',
          okAdd: 'Ajouter',
          add: 'Ajouter',
          edit: 'Modifier',
          cancel: 'Annuler',
        },
        table: {
          name: 'Nom',
          number: 'Numéro',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Actions',
        },
        confirmationModal: {
          deleteTitle: 'Supprimer',
          deleteMessage: 'Cette action est irréversible.',
          importMessage: 'Voulez-vous importer les contacts de cette feuille ?',
          importTitlte: 'Importer',
        },
        toasts: {
          deleted: 'Enregistrement supprimé',
        },
      },
      campaigns: {
        title: 'Campagnes',
        searchPlaceholder: 'Recherche',
        buttons: {
          add: 'Nouvelle Campagne',
          contactLists: 'Listes de Contacts',
        },
        table: {
          name: 'Nom',
          whatsapp: 'Connexion',
          contactList: 'Liste de Contacts',
          status: 'Statut',
          scheduledAt: 'Planification',
          completedAt: 'Complétée',
          confirmation: 'Confirmation',
          actions: 'Actions',
        },
        dialog: {
          new: 'Nouvelle Campagne',
          update: 'Modifier Campagne',
          readonly: 'Lecture seule',
          form: {
            name: 'Nom',
            message1: 'Message 1',
            message2: 'Message 2',
            message3: 'Message 3',
            message4: 'Message 4',
            message5: 'Message 5',
            confirmationMessage1: 'Message de Confirmation 1',
            confirmationMessage2: 'Message de Confirmation 2',
            confirmationMessage3: 'Message de Confirmation 3',
            confirmationMessage4: 'Message de Confirmation 4',
            confirmationMessage5: 'Message de Confirmation 5',
            messagePlaceholder: 'Contenu du message',
            whatsapp: 'Connexion',
            status: 'Statut',
            scheduledAt: 'Planification',
            confirmation: 'Confirmation',
            contactList: 'Liste de Contacts',
          },
          buttons: {
            add: 'Ajouter',
            edit: 'Mettre à jour',
            okadd: 'Ok',
            cancel: 'Annuler les Envois',
            restart: 'Redémarrer les Envois',
            close: 'Fermer',
            attach: 'Joindre un Fichier',
          },
        },
        confirmationModal: {
          deleteTitle: 'Supprimer',
          deleteMessage: 'Cette action est irréversible.',
        },
        toasts: {
          success: 'Opération réussie',
          cancel: 'Campagne annulée',
          restart: 'Campagne redémarrée',
          deleted: 'Enregistrement supprimé',
        },
      },
      announcements: {
        title: 'Annonces',
        searchPlaceholder: 'Recherche',
        buttons: {
          add: 'Nouvelle Annonce',
          contactLists: "Listes d'Annonces",
        },
        table: {
          priority: 'Priorité',
          title: 'Titre',
          text: 'Texte',
          mediaName: 'Fichier',
          status: 'Statut',
          actions: 'Actions',
        },
        dialog: {
          edit: 'Modifier Annonce',
          add: 'Nouvelle Annonce',
          update: 'Mettre à jour Annonce',
          readonly: 'Lecture seule',
          form: {
            priority: 'Priorité',
            title: 'Titre',
            text: 'Texte',
            mediaPath: 'Fichier',
            status: 'Statut',
          },
          buttons: {
            add: 'Ajouter',
            edit: 'Mettre à jour',
            okadd: 'Ok',
            cancel: 'Annuler',
            close: 'Fermer',
            attach: 'Joindre un Fichier',
          },
        },
        confirmationModal: {
          deleteTitle: 'Supprimer',
          deleteMessage: 'Cette action est irréversible.',
        },
        toasts: {
          success: 'Opération réussie',
          deleted: 'Enregistrement supprimé',
        },
      },
      campaignsConfig: {
        title: 'Configurations des Campagnes',
        intervals: 'Intervalles',
        messageInterval: 'Intervalle entre messages',
        longerIntervalAfter: 'Intervalle plus long après',
        greaterInterval: 'Intervalle plus long',
        noInterval: 'Aucun intervalle',
        notDefined: 'Non défini',
        seconds: 'secondes',
        messages: 'messages',
        addVariable: 'Ajouter Variable',
        saveSettings: 'Enregistrer les paramètres',
        shortcode: 'Code',
        content: 'Contenu',
        variables: 'Variables',
      },
      queues: {
        title: "Files d'attente & Chatbot",
        table: {
          name: 'Nom',
          color: 'Couleur',
          greeting: 'Message de bienvenue',
          actions: 'Actions',
        },
        buttons: {
          add: "Ajouter une file d'attente",
        },
        confirmationModal: {
          deleteTitle: 'Supprimer',
          deleteMessage:
            "Êtes-vous sûr ? Cette action est irréversible ! Les interventions de cette file d'attente continueront d'exister, mais n'auront plus de file d'attente attribuée.",
        },
      },
      queueSelect: {
        inputLabel: "Files d'attente",
      },
      users: {
        title: 'Utilisateurs',
        table: {
          name: 'Nom',
          email: 'Email',
          profile: 'Profil',
          actions: 'Actions',
        },
        buttons: {
          add: 'Ajouter un utilisateur',
        },
        toasts: {
          deleted: 'Utilisateur supprimé avec succès.',
        },
        confirmationModal: {
          deleteTitle: 'Supprimer',
          deleteMessage:
            "Toutes les données de l'utilisateur seront perdues. Les interventions ouvertes de cet utilisateur seront déplacées vers la file d'attente.",
        },
      },
      helps: {
        title: "Centre d'Aide",
      },
      about: {
        aboutthe: 'À propos de',
        copyright: '© 2024 - Fonctionne avec ticketz',
        buttonclose: 'Fermer',
        title: 'À propos de ticketz',
        abouttitle: 'Origine et améliorations',
        aboutdetail:
          'Le ticketz est dérivé indirectement du projet Whaticket avec des améliorations partagées par les développeurs du système EquipeChat via la chaîne VemFazer sur YouTube, puis améliorées par Claudemir Todo Bom',
        aboutauthorsite: "Site de l'auteur",
        aboutwhaticketsite: 'Site de la communauté Whaticket sur Github',
        aboutvemfazersite: 'Site de la chaîne Vem Fazer sur Github',
        licenseheading: 'Licence Open Source',
        licensedetail:
          "Le ticketz est sous licence GNU Affero General Public License version 3, ce qui signifie que tout utilisateur ayant accès à cette application a le droit d'accéder au code source. Plus d'informations dans les liens ci-dessous :",
        licensefulltext: 'Texte complet de la licence',
        licensesourcecode: 'Code source de ticketz',
      },
      schedules: {
        title: 'Planifications',
        confirmationModal: {
          deleteTitle:
            'Êtes-vous sûr de vouloir supprimer cette Planification ?',
          deleteMessage: 'Cette action est irréversible.',
        },
        table: {
          contact: 'Contact',
          body: 'Message',
          sendAt: 'Date de Planification',
          sentAt: "Date d'Envoi",
          status: 'Statut',
          actions: 'Actions',
        },
        buttons: {
          add: 'Nouvelle Planification',
        },
        toasts: {
          deleted: 'Planification supprimée avec succès.',
        },
      },
      tags: {
        title: 'Étiquettes',
        confirmationModal: {
          deleteTitle: 'Êtes-vous sûr de vouloir supprimer cette Étiquette ?',
          deleteMessage: 'Cette action est irréversible.',
        },
        table: {
          name: 'Nom',
          color: 'Couleur',
          tickets: 'Enregistrements',
          actions: 'Actions',
          id: 'Id',
          kanban: 'Kanban',
        },
        buttons: {
          add: 'Nouvelle Étiquette',
        },
        toasts: {
          deleted: 'Étiquette supprimée avec succès.',
        },
      },
      settings: {
        group: {
          general: 'Général',
          timeouts: "Délais d'attente",
          officeHours: 'Heures de bureau',
          groups: 'Groupes',
          confidenciality: 'Confidentialité',
          api: 'API',
          externalServices: 'Services externes',
          serveradmin: 'Administration du serveur',
        },
        success: 'Paramètres enregistrés avec succès.',
        copiedToClipboard: 'Copié dans le presse-papiers',
        title: 'Paramètres',
        chatbotTicketTimeout: "Délai d'attente du chatbot (minutes)",
        chatbotTicketTimeoutAction: "Action du délai d'attente du chatbot",
        settings: {
          userCreation: {
            name: "Création d'utilisateur",
            options: {
              enabled: 'Activé',
              disabled: 'Désactivé',
            },
          },
        },
        validations: {
          title: 'Évaluations',
          options: {
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
        OfficeManagement: {
          title: 'Gestion de bureau',
          options: {
            disabled: 'Désactivé',
            ManagementByDepartment: "Gestion par file d'attente",
            ManagementByCompany: 'Gestion par entreprise',
          },
        },
        outOfHoursAction: {
          title: 'Action hors des heures',
          options: {
            pending: 'Laisser en attente',
            closed: 'Fermer le ticket',
          },
        },
        IgnoreGroupMessages: {
          title: 'Ignorer les messages de groupe',
          options: {
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
        soundGroupNotifications: {
          title: 'Notifications sonores de groupe',
          options: {
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
        groupsTab: {
          title: 'Onglet Groupes',
          options: {
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
        VoiceAndVideoCalls: {
          title: 'Appels vocaux et vidéo',
          options: {
            enabled: 'Ignorer',
            disabled: "Informer l'indisponibilité",
          },
        },
        AutomaticChatbotOutput: {
          title: 'Sortie automatique du chatbot',
          options: {
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
        ShowNumericEmoticons: {
          title: 'Afficher les émojis numériques dans la file',
          options: {
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
        QuickMessages: {
          title: 'Messages rapides',
          options: {
            enabled: 'Par entreprise',
            disabled: 'Par utilisateur',
          },
        },
        AllowRegistration: {
          title: "Autoriser l'inscription",
          options: {
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
        FileUploadLimit: {
          title: 'Limite de téléchargement de fichiers (MB)',
        },
        FileDownloadLimit: {
          title: 'Limite de téléchargement de fichiers (MB)',
        },
        messageVisibility: {
          title: 'Visibilité du message',
          options: {
            respectMessageQueue: 'Respecter la file du message',
            respectTicketQueue: 'Respecter la file du ticket',
          },
        },
        keepQueueAndUser: {
          title: "Conserver la file et l'utilisateur dans le ticket fermé",
          options: {
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
        GracePeriod: {
          title: 'Période de grâce après expiration (jours)',
        },
        ticketAcceptedMessage: {
          title: 'Message de ticket accepté',
          placeholder: 'Entrez votre message de ticket accepté ici',
        },
        transferMessage: {
          title: 'Message de transfert',
          placeholder: 'Entrez votre message de transfert ici',
        },
        mustacheVariables: {
          title: 'Variables disponibles :',
        },
        WelcomeGreeting: {
          greetings: 'Bonjour',
          welcome: 'Bienvenue à',
          expirationTime: "Actif jusqu'à",
        },
        Options: {
          title: 'Options',
        },
        Companies: {
          title: 'Entreprises',
        },
        schedules: {
          title: 'Horaires',
        },
        Plans: {
          title: 'Plans',
        },
        Help: {
          title: 'Aide',
        },
        Whitelabel: {
          title: 'Whitelabel',
        },
        PaymentGateways: {
          title: 'Passerelles de paiement',
        },
        AIProvider: {
          title: "Service d'IA",
        },
        AudioTranscriptions: {
          title: 'Transcription audio',
        },
        TagsMode: {
          title: 'Mode des étiquettes',
          options: {
            ticket: 'Ticket',
            contact: 'Contact',
            both: 'Ticket et Contact',
          },
        },
        schedulesUpdated: 'Horaires mis à jour avec succès.',
        operationUpdated: 'Opération mise à jour avec succès.',
        paymentGateway: 'Passerelle de paiement',
        none: 'Aucun',
        owenPayments: 'Owen Payments 💎',
        efi: 'Efí',
        apiToken: 'Jeton API',
        aiKey: 'Clé IA',
        defaultAppName: 'Ticketz',
        // Timeout settings
        ratingsTimeout: "Délai d'attente pour évaluation (minutes)",
        noQueueTimeout: "Délai d'attente pour ticket sans file (minutes)",
        noQueueTimeoutAction: "Action pour délai d'attente de ticket sans file",
        openTicketTimeout: "Délai d'attente pour ticket en cours (minutes)",
        openTicketTimeoutAction: "Action pour délai d'attente de ticket ouvert",
        autoReopenTimeout:
          "Délai d'attente pour réouverture automatique (minutes)",
        // Actions
        returnToQueue: 'Retourner à la file',
        // Office hours
        officeHours: 'Heures de bureau',
        officeManagement: 'Gestion de bureau',
        managementByQueue: "Gestion par file d'attente",
        managementByCompany: 'Gestion par entreprise',
        // Groups
        groups: 'Groupes',
        ignoreGroupMessages: 'Ignorer les messages de groupe',
        groupSoundNotifications: 'Notifications sonores de groupe',
        // Confidentiality
        confidentiality: 'Confidentialité',
        respectMessageQueue: 'Respecter la file du message',
        respectTicketQueue: 'Respecter la file du ticket',
        // API
        api: 'API',
        // Out of hours
        leaveAsPending: 'Laisser en attente',
        // Enabled/Disabled
        enabled: 'Activé',
        disabled: 'Désactivé',
        // Form fields
        name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        company: 'Entreprise',
        plan: 'Plan',
        campaigns: 'Campagnes',
        status: 'Statut',
        createdAt: 'Créé le',
        dueDate: "Date d'échéance",
        value: 'Valeur',
        users: 'Utilisateurs',
        connections: 'Connexions',
        queues: "Files d'attente",
        public: 'Public',
        yes: 'Oui',
        no: 'Non',
        active: 'Actif',
        inactive: 'Inactif',
        // Plan management
        planName: 'Nom du Plan',
        planValue: 'Valeur du Plan',
        planUsers: 'Utilisateurs du Plan',
        planConnections: 'Connexions du Plan',
        planQueues: 'Files du Plan',
        planPublic: 'Plan Public',
        // Campaign management
        campaignTitle: 'Titre de Campagne',
        campaignCode: 'Code de Campagne',
        campaignDescription: 'Description de Campagne',
        campaignEnabled: 'Campagne Activée',
        campaignDisabled: 'Campagne Désactivée',
        // User management
        userName: "Nom d'Utilisateur",
        userEmail: "Email d'Utilisateur",
        userPhone: "Téléphone d'Utilisateur",
        userCompany: "Entreprise d'Utilisateur",
        userPlan: "Plan d'Utilisateur",
        // Whitelabel
        primaryColorLight: 'Couleur primaire claire',
        primaryColorDark: 'Couleur primaire sombre',
        appLogoLight: "Logo de l'application clair",
        appLogoDark: "Logo de l'application sombre",
        appName: "Nom de l'application",
        appFavicon: "Favicon de l'application",
        logoSvgHint: 'Préférer SVG et ratio 28:10',
        faviconSvgHint: 'Préférer image SVG carrée ou PNG 512x512',
        // Buttons
        clear: 'Effacer',
        save: 'Enregistrer',
        cancel: 'Annuler',
        edit: 'Modifier',
        delete: 'Supprimer',
        add: 'Ajouter',
        // Date format
        dateFormat: 'dd/mm/yyyy',
        // Recurrence
        recurrence: 'Récurrence',
        // Contact lists
        contactLists: 'Listes de Contacts',
        // Navigation
        listing: 'Liste',
        // System description
        systemDescription: 'ticketz chat based ticket system',
      },
      messagesList: {
        header: {
          assignedTo: 'Attribué à :',
          buttons: {
            return: 'Retourner',
            resolve: 'Résoudre',
            reopen: 'Rouvrir',
            accept: 'Accepter',
          },
        },
      },
      messagesInput: {
        placeholderOpen: 'Tapez un message',
        placeholderClosed:
          'Rouvrez ou acceptez ce ticket pour envoyer un message.',
        signMessage: 'Signer',
        replying: 'Répondre',
        editing: 'Modifier',
      },
      message: {
        edited: 'Modifié',
      },
      contactDrawer: {
        header: 'Informations du contact',
        buttons: {
          edit: 'Modifier le contact',
        },
        extraInfo: 'Autres informations',
      },
      ticketOptionsMenu: {
        schedule: 'Planification',
        delete: 'Supprimer',
        transfer: 'Transférer',
        registerAppointment: 'Observations du Contact',
        appointmentsModal: {
          title: 'Observations du Contact',
          textarea: 'Observation',
          placeholder:
            'Insérez ici les informations que vous souhaitez enregistrer',
        },
        confirmationModal: {
          title: 'Supprimer le ticket du contact',
          message:
            'Attention ! Tous les messages liés au ticket seront perdus.',
        },
        buttons: {
          delete: 'Supprimer',
          cancel: 'Annuler',
        },
      },
      confirmationModal: {
        buttons: {
          confirm: 'Ok',
          cancel: 'Annuler',
        },
      },
      messageOptionsMenu: {
        delete: 'Supprimer',
        edit: 'Modifier',
        history: 'Historique',
        reply: 'Répondre',
        confirmationModal: {
          title: 'Supprimer le message ?',
          message: 'Cette action est irréversible.',
        },
      },
      messageHistoryModal: {
        close: 'Fermer',
        title: 'Historique des modifications du message',
      },
      presence: {
        unavailable: 'Indisponible',
        available: 'Disponible',
        composing: 'En train de taper...',
        recording: "En train d'enregistrer...",
        paused: 'En pause',
      },
      privacyModal: {
        title: 'Modifier la Confidentialité de WhatsApp',
        buttons: {
          cancel: 'Annuler',
          okEdit: 'Enregistrer',
        },
        form: {
          menu: {
            all: 'Tous',
            none: 'Personne',
            contacts: 'Mes contacts',
            contact_blacklist: 'Contacts sélectionnés',
            match_last_seen: 'Similaire à Vu en dernier',
            known: 'Connu',
            disable: 'Désactivé',
            hrs24: '24 Heures',
            dias7: '7 Jours',
            dias90: '90 Jours',
          },
          readreceipts:
            'Pour mettre à jour la confidentialité des accusés de lecture',
          profile:
            'Pour mettre à jour la confidentialité de la photo de profil',
          status: 'Pour mettre à jour la confidentialité des statuts',
          online: 'Pour mettre à jour la confidentialité en ligne',
          last: 'Pour mettre à jour la confidentialité du Dernier Vu',
          groupadd:
            "Pour mettre à jour la confidentialité de l'ajout aux groupes",
          calladd:
            "Pour mettre à jour la confidentialité de l'ajout aux appels",
          disappearing: 'Pour mettre à jour le Mode Disparition par Défaut',
        },
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP:
          'Il doit y avoir au moins un WhatsApp par défaut.',
        ERR_NO_DEF_WAPP_FOUND:
          'Aucun WhatsApp par défaut trouvé. Vérifiez la page des connexions.',
        ERR_WAPP_NOT_INITIALIZED:
          "Cette session WhatsApp n'a pas été initialisée. Vérifiez la page des connexions.",
        ERR_WAPP_CHECK_CONTACT:
          'Impossible de vérifier le contact WhatsApp. Vérifiez la page des connexions',
        ERR_WAPP_INVALID_CONTACT: "Ce n'est pas un numéro WhatsApp valide.",
        ERR_WAPP_DOWNLOAD_MEDIA:
          'Impossible de télécharger les médias de WhatsApp. Vérifiez la page des connexions.',
        ERR_INVALID_CREDENTIALS:
          "Erreur d'authentification. Veuillez réessayer.",
        ERR_SENDING_WAPP_MSG:
          "Erreur lors de l'envoi du message WhatsApp. Vérifiez la page des connexions.",
        ERR_DELETE_WAPP_MSG: 'Impossible de supprimer le message WhatsApp.',
        ERR_EDITING_WAPP_MSG: 'Impossible de modifier le message WhatsApp.',
        ERR_OTHER_OPEN_TICKET: 'Il y a déjà un ticket ouvert pour ce contact.',
        ERR_SESSION_EXPIRED: 'Session expirée. Veuillez vous reconnecter.',
        ERR_USER_CREATION_DISABLED:
          "La création d'utilisateur a été désactivée par l'administrateur.",
        ERR_NO_PERMISSION:
          "Vous n'avez pas la permission d'accéder à cette fonctionnalité.",
        ERR_DUPLICATED_CONTACT: 'Il existe déjà un contact avec ce numéro.',
        ERR_NO_SETTING_FOUND: 'Aucun paramètre trouvé avec cet ID.',
        ERR_NO_CONTACT_FOUND: 'Aucun contact trouvé avec cet ID.',
        ERR_NO_TICKET_FOUND: 'Aucun ticket trouvé avec cet ID.',
        ERR_NO_USER_FOUND: 'Aucun utilisateur trouvé avec cet ID.',
        ERR_NO_WAPP_FOUND: 'Aucun WhatsApp trouvé avec cet ID.',
        ERR_CREATING_MESSAGE:
          'Erreur lors de la création du message dans la base de données.',
        ERR_CREATING_TICKET:
          'Erreur lors de la création du ticket dans la base de données.',
        ERR_FETCH_WAPP_MSG:
          'Erreur lors de la récupération du message sur WhatsApp, il est peut-être trop ancien.',
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          'Cette couleur est déjà utilisée, choisissez-en une autre.',
        ERR_WAPP_GREETING_REQUIRED:
          "Le message de bienvenue est obligatoire lorsqu'il y a plus d'une file d'attente.",
      },
      ticketz: {
        registration: {
          header: "Inscrivez-vous à la base d'utilisateurs de Ticketz",
          description:
            "Remplissez les champs ci-dessous pour vous inscrire à la base d'utilisateurs de Ticketz et recevoir des nouvelles sur le projet.",
          name: 'Nom',
          country: 'Pays',
          phoneNumber: 'Numéro WhatsApp',
          submit: "S'inscrire",
        },
        support: {
          title: 'Soutenez le projet Ticketz Open Source',
          mercadopagotitle: 'Carte de Crédit',
          recurringbrl: 'Don récurrent en R$',
          paypaltitle: 'Carte de Crédit',
          international: 'International en US$',
        },
      },
      interactions: {
        toasts: {
          created: 'Interaction créée avec succès',
        },
        buttons: {
          add: 'Ajouter une Interaction',
        },
        types: {
          note: 'Note',
          email: 'E-mail',
          message: 'Message',
          file: 'Fichier',
        },
        categories: {
          internal_note: 'Note Interne',
          customer_communication: 'Communication Client',
          system: 'Système',
        },
        dialog: {
          add: 'Ajouter une Interaction',
        },
        form: {
          type: 'Type',
          category: 'Catégorie',
          notes: 'Notes',
        },
      },
      leads: {
        title: 'Pistes',
        searchPlaceholder: 'Rechercher des pistes',
        notFound: 'Piste non trouvée',
        buttons: {
          add: 'Nouvelle Piste',
          save: 'Enregistrer',
          cancel: 'Annuler',
        },
        views: {
          board: 'Tableau',
          list: 'Liste',
        },
        tabs: {
          basic: 'Basique',
          contact: 'Contact',
          financial: 'Financier',
          tags: 'Étiquettes',
          notes: 'Notes',
        },
        modal: {
          add: {
            title: 'Nouvelle Piste',
          },
          edit: {
            title: 'Modifier la Piste',
          },
          form: {
            contact: 'Contact',
            stage: 'Étape',
            temperature: 'Température',
            source: 'Source',
            expectedValue: 'Valeur Attendue',
            probability: 'Probabilité (%)',
            expectedClosingDate: 'Date de Clôture Prévue',
            assignedTo: 'Assigné à',
            notes: 'Notes',
            selectUser: 'Sélectionner un utilisateur',
          },
        },
        dialog: {
          new: 'Nouvelle Piste',
          edit: 'Modifier la Piste',
          addTag: 'Ajouter une Étiquette',
        },
        form: {
          name: 'Nom',
          title: 'Titre',
          titleHelper: 'Brève description de la piste',
          description: 'Description',
          temperature: 'Température',
          status: 'Statut',
          pipeline: 'Pipeline',
          contact: 'Contact',
          column: 'Colonne',
          assignedTo: 'Assigné à',
          unassigned: 'Non assigné',
          source: 'Source',
          expectedValue: 'Valeur Attendue',
          currency: 'Devise',
          probability: 'Probabilité (%)',
          probabilityHelper: "Probabilité de conclure l'affaire (0-100%)",
          expectedClosingDate: 'Date de Clôture Prévue',
          tags: 'Étiquettes',
          addTag: 'Ajouter une Étiquette',
          tag: 'Étiquette',
          customFields: 'Champs Personnalisés',
          customFieldName: 'Entrez le nom du champ personnalisé',
          addCustomField: 'Ajouter un Champ Personnalisé',
          notes: 'Notes',
        },
        table: {
          lead: 'Piste',
          contact: 'Contact',
          status: 'Statut',
          pipeline: 'Pipeline',
          column: 'Colonne',
          temperature: 'Température',
          tags: 'Étiquettes',
          financial: 'Financier',
          assignedTo: 'Assigné à',
          actions: 'Actions',
          unassigned: 'Non assigné',
        },
        sections: {
          contact: 'Informations de Contact',
          financial: 'Informations Financières',
          tags: 'Étiquettes',
          customFields: 'Champs Personnalisés',
          notes: 'Notes',
        },
        fields: {
          contact: 'Contact',
          phone: 'Téléphone',
          email: 'E-mail',
          source: 'Source',
          assignedTo: 'Assigné à',
          expectedValue: 'Valeur Attendue',
          probability: 'Probabilité',
          expectedClosingDate: 'Date de Clôture Prévue',
        },
        status: {
          new: 'Nouveau',
          contacted: 'Contacté',
          follow_up: 'Suivi',
          proposal: 'Proposition',
          negotiation: 'Négociation',
          qualified: 'Qualifié',
          unqualified: 'Non qualifié',
          converted: 'Converti',
          lost: 'Perdu',
          closed_won: 'Fermé Gagné',
          closed_lost: 'Fermé Perdu',
        },
        pipeline: {
          default: 'Par défaut',
          sales: 'Ventes',
          support: 'Support',
          onboarding: 'Intégration',
        },
        temperature: {
          hot: 'Chaud',
          warm: 'Tiède',
          cold: 'Froid',
        },
        timeline: {
          title: 'Chronologie',
          empty: 'Aucune interaction trouvée',
        },
        toasts: {
          created: 'Piste créée avec succès',
          updated: 'Piste mise à jour avec succès',
          deleted: 'Piste supprimée avec succès',
          contactRequired: 'Le contact est requis',
          tagAdded: 'Étiquette ajoutée avec succès',
          tagRemoved: 'Étiquette supprimée avec succès',
        },
        validation: {
          name: {
            required: 'Le nom est requis',
          },
          title: {
            max: 'Le titre doit avoir au maximum 255 caractères',
          },
          contact: {
            required: 'Le contact est requis',
          },
          column: {
            required: 'La colonne est requise',
          },
          temperature: {
            required: 'La température est requise',
          },
          status: {
            required: 'Le statut est requis',
          },
          pipeline: {
            required: 'Le pipeline est requis',
          },
          source: {
            required: 'La source est requise',
          },
          currency: {
            required: 'La devise est requise',
          },
          probability: {
            min: 'La probabilité doit être au moins 0',
            max: 'La probabilité doit être au maximum 100',
          },
        },
        leadColumns: {
          buttons: {
            add: 'Nouvelle Colonne',
            save: 'Enregistrer',
            cancel: 'Annuler',
          },
          dialog: {
            new: 'Nouvelle Colonne',
            edit: 'Modifier la Colonne',
          },
          modal: {
            add: {
              title: 'Nouvelle Colonne',
            },
            edit: {
              title: 'Modifier la Colonne',
            },
            form: {
              name: 'Nom',
              color: 'Couleur',
            },
          },
          toasts: {
            created: 'Colonne créée avec succès',
            updated: 'Colonne mise à jour avec succès',
            deleted: 'Colonne supprimée avec succès',
          },
        },
      },
      ticketMessagesDialog: {
        buttons: {
          close: 'Fermer',
        },
      },
    },
  },
};

export { messages };
