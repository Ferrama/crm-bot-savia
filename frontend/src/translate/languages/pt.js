const messages = {
  pt: {
    translations: {
      common: {
        search: 'Buscar',
        edit: 'Editar',
        delete: 'Excluir',
        cancel: 'Cancelar',
        save: 'Salvar',
        confirm: 'Confirmar',
        close: 'Fechar',
        error: 'Erro',
        success: 'Sucesso',
        actions: 'Ações',
        add: 'Adicionar',
        name: 'Nome',
        email: 'Email',
        phone: 'Telefone',
        company: 'Empresa',
        user: 'Usuário',
        connection: 'Conexão',
        queue: 'Fila',
        contact: 'Contato',
        whatsappNumber: 'Número do Whatsapp',
        dueDate: 'Data de vencimento',
        copy: 'Copiar',
        paste: 'Colar',
        proceed: 'Prosseguir',
        enabled: 'Ativado',
        disabled: 'Desativado',
        noqueue: 'Sem fila',
        rating: 'Avaliação',
        transferTo: 'Transferir para',
        remove: 'Remover',
      },
      signup: {
        title: 'Cadastre-se',
        toasts: {
          success: 'Usuário criado com sucesso! Faça seu login!!!.',
          fail: 'Erro ao criar usuário. Verifique os dados informados.',
        },
        form: {
          name: 'Nome',
          email: 'Email',
          password: 'Senha',
        },
        buttons: {
          submit: 'Cadastrar',
          login: 'Já tem uma conta? Entre!',
        },
      },
      login: {
        title: 'Login',
        form: {
          email: 'Email',
          password: 'Senha',
        },
        buttons: {
          submit: 'Entrar',
          register: 'Não tem um conta? Cadastre-se!',
        },
      },
      companies: {
        title: 'Cadastrar Empresa',
        form: {
          name: 'Nome da Empresa',
          plan: 'Plano',
          token: 'Token',
          submit: 'Cadastrar',
          success: 'Empresa criada com sucesso!',
        },
      },
      auth: {
        toasts: {
          success: 'Login efetuado com sucesso!',
        },
        token: 'Token',
      },
      dashboard: {
        usersOnline: 'Usuários online',
        ticketsWaiting: 'Atendimentos aguardando',
        ticketsOpen: 'Atendimentos abertos',
        ticketsDone: 'Atendimentos resolvidos',
        totalTickets: 'Total de atendimentos',
        newContacts: 'Novos contatos',
        avgServiceTime: 'Tempo médio de atendimento',
        avgWaitTime: 'Tempo médio de espera',
        ticketsOnPeriod: 'Atendimentos no período',
        userCurrentStatus: 'Status (Atual)',
        filter: {
          period: 'Período',
          custom: 'Personalizado',
          last3days: 'Últimos 3 dias',
          last7days: 'Últimos 7 dias',
          last14days: 'Últimos 14 dias',
          last30days: 'Últimos 30 dias',
          last90days: 'Últimos 90 dias',
        },
        date: {
          start: 'Data inicial',
          end: 'Data final',
        },
        ticketCountersLabels: {
          created: 'Criado',
          closed: 'Fechado',
        },
      },
      connections: {
        title: 'Conexões',
        toasts: {
          deleted: 'Conexão com o WhatsApp excluída com sucesso!',
        },
        confirmationModal: {
          deleteTitle: 'Deletar',
          deleteMessage: 'Você tem certeza? Essa ação não pode ser revertida.',
          disconnectTitle: 'Desconectar',
          disconnectMessage:
            'Tem certeza? Você precisará ler o QR Code novamente.',
        },
        buttons: {
          add: 'Adicionar WhatsApp',
          disconnect: 'desconectar',
          tryAgain: 'Tentar novamente',
          qrcode: 'QR CODE',
          newQr: 'Novo QR CODE',
          connecting: 'Conectando',
        },
        toolTips: {
          disconnected: {
            title: 'Falha ao iniciar sessão do WhatsApp',
            content:
              'Certifique-se de que seu celular esteja conectado à internet e tente novamente, ou solicite um novo QR Code',
          },
          qrcode: {
            title: 'Esperando leitura do QR Code',
            content:
              "Clique no botão 'QR CODE' e leia o QR Code com o seu celular para iniciar a sessão",
          },
          connected: {
            title: 'Conexão estabelecida!',
          },
          timeout: {
            title: 'A conexão com o celular foi perdida',
            content:
              "Certifique-se de que seu celular esteja conectado à internet e o WhatsApp esteja aberto, ou clique no botão 'Desconectar' para obter um novo QR Code",
          },
          refresh: 'Refazer conexão',
          disconnect: 'Desconectar',
          scan: 'Ler QR Code',
          newQr: 'Gerar novo QR Code',
          retry: 'Tentar novamente',
        },
        table: {
          name: 'Nome',
          status: 'Status',
          lastUpdate: 'Última atualização',
          default: 'Padrão',
          actions: 'Ações',
          session: 'Sessão',
        },
      },
      internalChat: {
        title: 'Chat Interno',
        new: 'Novo',
        edit: 'Editar',
        delete: 'Excluir',
        close: 'Fechar',
        save: 'Salvar',
        chat: 'Chat',
        titlePlaceholder: 'Título',
        confirmDelete: 'Tem certeza que deseja excluir este chat?',
        confirmDeleteMessage: 'Esta ação não pode ser desfeita.',
        noChats: 'Nenhum chat encontrado',
        noMessages: 'Nenhuma mensagem encontrada',
        typeMessage: 'Digite uma mensagem',
        messages: 'Mensagens',
        chats: 'Chats',
        spyChat: 'Espiar Conversa',
        closeChat: 'Fechar Chat',
        acceptChat: 'Aceitar Chat',
        chatbot: 'Chatbot',
        queue: 'Fila',
        noQueue: 'Sem fila',
        assignedTo: 'Atribuído a',
        lastMessage: 'Última mensagem',
        newMessage: 'Nova mensagem',
        unreadMessages: 'Mensagens não lidas',
        closed: 'FECHADO',
        pending: 'PENDENTE',
        open: 'ABERTO',
        conversation: 'Conversar',
        location: 'Localização',
        clickToViewLocation: 'Clique para ver localização',
        download: 'Baixar',
        noRecords: 'Nenhum registro',
        dialog: {
          title: 'Conversa',
          titleLabel: 'Título',
          titlePlaceholder: 'Título',
          close: 'Fechar',
          save: 'Salvar',
          fillTitle: 'Por favor, preencha o título da conversa.',
          selectUser: 'Por favor, selecione pelo menos um usuário.',
        },
        tabs: {
          chats: 'Chats',
          messages: 'Mensagens',
        },
        presence: {
          composing: 'Digitando...',
          recording: 'Gravando...',
          available: 'Disponível',
          unavailable: 'Indisponível',
        },
      },
      todoList: {
        title: 'Lista de Tarefas',
        newTask: 'Nova tarefa',
        add: 'Adicionar',
        save: 'Salvar',
        edit: 'Editar',
        delete: 'Excluir',
        noTasks: 'Nenhuma tarefa encontrada',
        taskPlaceholder: 'Digite uma nova tarefa',
        lastUpdate: 'Última atualização',
        taskRequired: 'O texto da tarefa é obrigatório',
      },
      whatsappModal: {
        title: {
          add: 'Adicionar WhatsApp',
          edit: 'Editar WhatsApp',
        },
        form: {
          name: 'Nome',
          default: 'Padrão',
        },
        buttons: {
          okAdd: 'Adicionar',
          okEdit: 'Salvar',
          cancel: 'Cancelar',
        },
        success: 'WhatsApp salvo com sucesso.',
        token: {
          copied: 'Token copiado para a área de transferência',
        },
      },
      qrCode: {
        message: 'Escanear QR',
      },
      contacts: {
        title: 'Contatos',
        toasts: {
          deleted: 'Contato excluído com sucesso!',
        },
        searchPlaceholder: 'Pesquisar...',
        confirmationModal: {
          deleteTitle: 'Deletar ',
          importTitlte: 'Importar contatos',
          deleteMessage:
            'Tem certeza que deseja deletar este contato? Todos os atendimentos relacionados serão perdidos.',
          importMessage: 'Deseja importar todos os contatos do telefone?',
        },
        buttons: {
          import: 'Importar Contatos',
          add: 'Adicionar Contato',
        },
        table: {
          name: 'Nome',
          whatsapp: 'WhatsApp',
          email: 'Email',
          actions: 'Ações',
        },
      },
      contactModal: {
        title: {
          add: 'Adicionar contato',
          edit: 'Editar contato',
        },
        form: {
          mainInfo: 'Dados do contato',
          extraInfo: 'Informações adicionais',
          name: 'Nome',
          number: 'Número do Whatsapp',
          email: 'Email',
          extraName: 'Nome do campo',
          extraValue: 'Valor',
          disableBot: 'Desabilitar chatbot',
        },
        buttons: {
          addExtraInfo: 'Adicionar informação',
          okAdd: 'Adicionar',
          okEdit: 'Salvar',
          cancel: 'Cancelar',
        },
        success: 'Contato salvo com sucesso.',
      },
      queueModal: {
        title: {
          add: 'Adicionar fila',
          edit: 'Editar fila',
        },
        form: {
          name: 'Nome',
          color: 'Cor',
          greetingMessage: 'Mensagem de saudação',
          complationMessage: 'Mensagem de conclusão',
          outOfHoursMessage: 'Mensagem de fora de expediente',
          ratingMessage: 'Mensagem de avaliação',
          transferMessage: 'Mensagem de Transferência',
          token: 'Token',
        },
        buttons: {
          okAdd: 'Adicionar',
          okEdit: 'Salvar',
          cancel: 'Cancelar',
          attach: 'Anexar Arquivo',
        },
        serviceHours: {
          dayWeek: 'Dia da semana',
          startTimeA: 'Hora Inicial - Turno A',
          endTimeA: 'Hora Final - Turno A',
          startTimeB: 'Hora Inicial - Turno B',
          endTimeB: 'Hora Final - Turno B',
          monday: 'Segunda-feira',
          tuesday: 'Terça-feira',
          wednesday: 'Quarta-feira',
          thursday: 'Quinta-feira',
          friday: 'Sexta-feira',
          saturday: 'Sábado',
          sunday: 'Domingo',
        },
      },
      userModal: {
        title: {
          add: 'Adicionar usuário',
          edit: 'Editar usuário',
        },
        form: {
          name: 'Nome',
          email: 'Email',
          password: 'Senha',
          profile: 'Perfil',
        },
        buttons: {
          okAdd: 'Adicionar',
          okEdit: 'Salvar',
          cancel: 'Cancelar',
        },
        success: 'Usuário salvo com sucesso.',
      },
      scheduleModal: {
        title: {
          error: 'Erro de Envio',
          schedule: 'Agendar mensagem',
        },
        status: {
          pending: 'Pendente',
          sent: 'Enviado',
          erro: 'Erro',
        },
        validation: {
          bodyMin: 'Mensagem muito curta',
          required: 'Obrigatório',
          minTime:
            'O horário de agendamento deve ser pelo menos 5 minutos a partir de agora',
        },
        form: {
          body: 'Mensagem',
          sendAt: 'Enviar às',
          saveMessage: 'Salvar como modelo',
          contactPlaceholder: 'Contato',
          whatsappPlaceholder: 'WhatsApp',
        },
        buttons: {
          cancel: 'Cancelar',
          okAdd: 'Adicionar',
          okEdit: 'Salvar',
        },
        success: 'Agendamento salvo com sucesso!',
      },
      tagModal: {
        title: {
          add: 'Nova Tag',
          edit: 'Editar Tag',
          addKanban: 'Nova Lane',
          editKanban: 'Editar Lane',
        },
        form: {
          name: 'Nome',
          color: 'Cor',
          kanban: 'Kanban',
        },
        buttons: {
          okAdd: 'Adicionar',
          okEdit: 'Salvar',
          cancel: 'Cancelar',
        },
        success: 'Tag salvo com sucesso.',
        successKanban: 'Lane salva com sucesso.',
      },
      chat: {
        noTicketMessage: 'Selecione um ticket para começar a conversar.',
      },
      uploads: {
        titles: {
          titleUploadMsgDragDrop: 'ARRASTE E SOLTE ARQUIVOS NO CAMPO ABAIXO',
          titleFileList: 'Lista de arquivo(s)',
        },
      },
      ticketsManager: {
        buttons: {
          newTicket: 'Novo',
        },
      },
      ticketsQueueSelect: {
        placeholder: 'Filas',
      },
      tickets: {
        toasts: {
          deleted: 'O ticket em que você estava trabalhando foi excluído.',
        },
        notification: {
          message: 'Mensagem de',
        },
        tabs: {
          open: { title: 'Abertos' },
          closed: { title: 'Fechados' },
          groups: { title: 'Grupos' },
          search: { title: 'Busca' },
        },
        status: {
          closed: 'FECHADO',
        },
        tooltips: {
          closeConversation: 'Fechar Conversa',
        },
        search: {
          placeholder: 'Buscar atendimento e mensagens',
        },
        buttons: {
          showAll: 'Todos',
        },
      },
      transferTicketModal: {
        title: 'Transferir Ticket',
        fieldLabel: 'Digite para buscar usuários',
        fieldQueueLabel: 'Transferir para fila',
        fieldQueuePlaceholder: 'Selecione uma fila',
        noOptions: 'Nenhum usuário encontrado com esse nome',
        buttons: {
          ok: 'Transferir',
          cancel: 'Cancelar',
        },
      },
      ticketsList: {
        pendingHeader: 'Aguardando',
        assignedHeader: 'Atendendo',
        noTicketsTitle: 'Nada aqui!',
        noTicketsMessage:
          'Nenhum atendimento encontrado com esse status ou termo pesquisado',
        buttons: {
          accept: 'Aceitar',
        },
      },
      newTicketModal: {
        title: 'Criar Ticket',
        fieldLabel: 'Digite para pesquisar o contato',
        add: 'Adicionar',
        buttons: {
          ok: 'Salvar',
          cancel: 'Cancelar',
        },
      },
      mainDrawer: {
        listItems: {
          dashboard: 'Dashboard',
          connections: 'Conexões',
          tickets: 'Atendimentos',
          quickMessages: 'Respostas Rápidas',
          contacts: 'Contatos',
          queues: 'Filas & Chatbot',
          tags: 'Tags',
          administration: 'Administração',
          service: 'Atendimento',
          users: 'Usuários',
          settings: 'Configurações',
          helps: 'Ajuda',
          messagesAPI: 'API',
          schedules: 'Agendamentos',
          campaigns: 'Campanhas',
          annoucements: 'Informativos',
          chats: 'Chat Interno',
          financeiro: 'Financeiro',
          logout: 'Sair',
          management: 'Gerência',
          kanban: 'Kanban',
          leads: 'Leads',
          todoList: 'Lista de Tarefas',
          savia: 'Savia',
          listing: 'Listagem',
          contactLists: 'Listas de Contatos',
          configurations: 'Configurações',
        },
        appBar: {
          i18n: {
            language: 'Português 🇧🇷',
            language_short: 'pt_BR',
          },
          user: {
            profile: 'Perfil',
            darkmode: 'Modo escuro',
            lightmode: 'Modo claro',
            language: 'Selecionar idioma',
            about: 'Sobre',
            logout: 'Sair',
          },
        },
      },
      messagesAPI: {
        title: 'API',
        textMessage: {
          number: 'Número',
          body: 'Mensagem',
          token: 'Token cadastrado',
        },
        mediaMessage: {
          number: 'Número',
          body: 'Nome do arquivo',
          media: 'Arquivo',
          token: 'Token cadastrado',
        },
      },
      notifications: {
        noTickets: 'Nenhuma notificação.',
      },
      quickMessages: {
        title: 'Respostas Rápidas',
        buttons: {
          add: 'Nova Resposta',
        },
        dialog: {
          title: 'Mensagem Rápida',
          shortcode: 'Atalho',
          message: 'Resposta',
          buttons: {
            cancel: 'Cancelar',
            save: 'Salvar',
          },
        },
      },
      kanban: {
        title: 'Kanban',
        searchPlaceholder: 'Pesquisa',
        subMenus: {
          list: 'Painel',
          tags: 'Lanes',
        },
      },
      tagsKanban: {
        title: 'Lanes',
        laneDefault: 'Em aberto',
        confirmationModal: {
          deleteTitle: 'Você tem certeza que quer excluir esta Lane?',
          deleteMessage: 'Esta ação não pode ser revertida.',
        },
        table: {
          name: 'Nome',
          color: 'Cor',
          tickets: 'Tickets',
          actions: 'Ações',
        },
        buttons: {
          add: 'Nova Lane',
        },
        toasts: {
          deleted: 'Lane excluída com sucesso.',
        },
      },
      contactLists: {
        title: 'Listas de Contatos',
        table: {
          name: 'Nome',
          contacts: 'Contatos',
          actions: 'Ações',
        },
        buttons: {
          add: 'Nova Lista',
        },
        dialog: {
          name: 'Nome',
          company: 'Empresa',
          okEdit: 'Editar',
          okAdd: 'Adicionar',
          add: 'Adicionar',
          edit: 'Editar',
          cancel: 'Cancelar',
        },
        confirmationModal: {
          deleteTitle: 'Excluir',
          deleteMessage: 'Esta ação não pode ser revertida.',
        },
        toasts: {
          deleted: 'Registro excluído',
          created: 'Registro criado',
        },
      },
      contactListItems: {
        title: 'Contatos',
        searchPlaceholder: 'Pesquisa',
        buttons: {
          add: 'Novo',
          lists: 'Listas',
          import: 'Importar',
        },
        dialog: {
          name: 'Nome',
          number: 'Número',
          whatsapp: 'Whatsapp',
          email: 'E-mail',
          okEdit: 'Editar',
          okAdd: 'Adicionar',
          add: 'Adicionar',
          edit: 'Editar',
          cancel: 'Cancelar',
        },
        table: {
          name: 'Nome',
          number: 'Número',
          whatsapp: 'Whatsapp',
          email: 'E-mail',
          actions: 'Ações',
        },
        confirmationModal: {
          deleteTitle: 'Excluir',
          deleteMessage: 'Esta ação não pode ser revertida.',
          importMessage: 'Deseja importar os contatos desta planilha? ',
          importTitlte: 'Importar',
        },
        toasts: {
          deleted: 'Registro excluído',
        },
      },
      campaigns: {
        title: 'Campanhas',
        searchPlaceholder: 'Pesquisa',
        buttons: {
          add: 'Nova Campanha',
          contactLists: 'Listas de Contatos',
        },
        table: {
          name: 'Nome',
          whatsapp: 'Conexão',
          contactList: 'Lista de Contatos',
          status: 'Status',
          scheduledAt: 'Agendamento',
          completedAt: 'Concluída',
          confirmation: 'Confirmação',
          actions: 'Ações',
        },
        dialog: {
          new: 'Nova Campanha',
          update: 'Editar Campanha',
          readonly: 'Apenas Visualização',
          form: {
            name: 'Nome',
            message1: 'Mensagem 1',
            message2: 'Mensagem 2',
            message3: 'Mensagem 3',
            message4: 'Mensagem 4',
            message5: 'Mensagem 5',
            confirmationMessage1: 'Mensagem de Confirmação 1',
            confirmationMessage2: 'Mensagem de Confirmação 2',
            confirmationMessage3: 'Mensagem de Confirmação 3',
            confirmationMessage4: 'Mensagem de Confirmação 4',
            confirmationMessage5: 'Mensagem de Confirmação 5',
            messagePlaceholder: 'Conteúdo da mensagem',
            messageHelperText:
              'Utilize variáveis como {nome}, {numero}, {email} ou defina variáveis personalizadas.',
            whatsapp: 'Conexão',
            status: 'Status',
            scheduledAt: 'Agendamento',
            confirmation: 'Confirmação',
            contactList: 'Lista de Contato',
            disabled: 'Desabilitada',
            enabled: 'Habilitada',
            none: 'Nenhuma',
            msg1: 'Msg. 1',
            msg2: 'Msg. 2',
            msg3: 'Msg. 3',
            msg4: 'Msg. 4',
            msg5: 'Msg. 5',
          },
          buttons: {
            add: 'Adicionar',
            edit: 'Atualizar',
            okadd: 'Ok',
            cancel: 'Cancelar Disparos',
            restart: 'Reiniciar Disparos',
            close: 'Fechar',
            attach: 'Anexar Arquivo',
          },
        },
        confirmationModal: {
          deleteTitle: 'Excluir',
          deleteMessage: 'Esta ação não pode ser revertida.',
        },
        toasts: {
          success: 'Operação realizada com sucesso',
          cancel: 'Campanha cancelada',
          restart: 'Campanha reiniciada',
          deleted: 'Registro excluído',
        },
        status: {
          inactive: 'Inativa',
          scheduled: 'Programada',
          inProgress: 'Em Andamento',
          cancelled: 'Cancelada',
          finished: 'Finalizada',
        },
        tableData: {
          notDefined: 'Não definida',
          notDefinedMale: 'Não definido',
          noSchedule: 'Sem agendamento',
          notCompleted: 'Não concluída',
          enabled: 'Habilitada',
          disabled: 'Desabilitada',
        },
        tooltips: {
          stopCampaign: 'Parar Campanha',
          restartCampaign: 'Reiniciar Campanha',
        },
        validation: {
          tooShort: 'Muito curto!',
          tooLong: 'Muito longo!',
          required: 'Obrigatório',
        },
      },
      announcements: {
        title: 'Informativos',
        searchPlaceholder: 'Pesquisa',
        buttons: {
          add: 'Novo Informativo',
          contactLists: 'Listas de Informativos',
        },
        table: {
          priority: 'Prioridade',
          title: 'Title',
          text: 'Texto',
          mediaName: 'Arquivo',
          status: 'Status',
          actions: 'Ações',
        },
        dialog: {
          edit: 'Edição de Informativo',
          add: 'Novo Informativo',
          update: 'Editar Informativo',
          readonly: 'Apenas Visualização',
          form: {
            priority: 'Prioridade',
            title: 'Title',
            text: 'Texto',
            mediaPath: 'Arquivo',
            status: 'Status',
          },
          buttons: {
            add: 'Adicionar',
            edit: 'Atualizar',
            okadd: 'Ok',
            cancel: 'Cancelar',
            close: 'Fechar',
            attach: 'Anexar Arquivo',
          },
        },
        confirmationModal: {
          deleteTitle: 'Excluir',
          deleteMessage: 'Esta ação não pode ser revertida.',
        },
        toasts: {
          success: 'Operação realizada com sucesso',
          deleted: 'Registro excluído',
        },
      },
      campaignsConfig: {
        title: 'Configurações de Campanhas',
        intervals: 'Intervalos',
        messageInterval: 'Intervalo entre mensagens',
        longerIntervalAfter: 'Intervalo maior após',
        greaterInterval: 'Intervalo maior',
        noInterval: 'Sem intervalo',
        notDefined: 'Não definido',
        seconds: 'segundos',
        messages: 'mensagens',
        addVariable: 'Adicionar Variável',
        saveSettings: 'Salvar Configurações',
        shortcode: 'Código',
        content: 'Conteúdo',
        variables: 'Variáveis',
      },
      queues: {
        title: 'Filas & Chatbot',
        table: {
          name: 'Nome',
          color: 'Cor',
          greeting: 'Mensagem de saudação',
          actions: 'Ações',
        },
        buttons: {
          add: 'Adicionar fila',
        },
        confirmationModal: {
          deleteTitle: 'Excluir',
          deleteMessage:
            'Você tem certeza? Essa ação não pode ser revertida! Os atendimentos dessa fila continuarão existindo, mas não terão mais nenhuma fila atribuída.',
        },
      },
      queueSelect: {
        inputLabel: 'Filas',
      },
      users: {
        title: 'Usuários',
        table: {
          name: 'Nome',
          email: 'Email',
          profile: 'Perfil',
          actions: 'Ações',
        },
        buttons: {
          add: 'Adicionar usuário',
        },
        toasts: {
          deleted: 'Usuário excluído com sucesso.',
        },
        confirmationModal: {
          deleteTitle: 'Excluir',
          deleteMessage:
            'Todos os dados do usuário serão perdidos. Os atendimento abertos deste usuário serão movidos para a fila.',
        },
      },
      helps: {
        title: 'Central de Ajuda',
      },
      about: {
        aboutthe: 'Sobre o',
        copyright: '© 2024 - Funcionando com ticketz',
        buttonclose: 'Fechar',
        title: 'Sobre o ticketz',
        abouttitle: 'Origem e melhorias',
        aboutdetail:
          'O ticketz é derivado indireto do projeto Whaticket com melhorias compartilhadas pelos desenvolvedores do sistema EquipeChat através do canal VemFazer no youtube, posteriormente melhoradas por Claudemir Todo Bom',
        aboutauthorsite: 'Site do autor',
        aboutwhaticketsite: 'Site do Whaticket Community no Github',
        aboutvemfazersite: 'Site do canal Vem Fazer no Github',
      },
      schedules: {
        title: 'Agendamentos',
        confirmationModal: {
          deleteTitle: 'Você tem certeza que quer excluir este Agendamento?',
          deleteMessage: 'Esta ação não pode ser revertida.',
        },
        table: {
          contact: 'Contato',
          body: 'Mensagem',
          sendAt: 'Data de Agendamento',
          sentAt: 'Data de Envio',
          status: 'Status',
          actions: 'Ações',
        },
        buttons: {
          add: 'Novo Agendamento',
        },
        toasts: {
          deleted: 'Agendamento excluído com sucesso.',
        },
      },
      tags: {
        title: 'Tags',
        confirmationModal: {
          deleteTitle: 'Você tem certeza que quer excluir esta Tag?',
          deleteMessage: 'Esta ação não pode ser revertida.',
        },
        table: {
          name: 'Nome',
          color: 'Cor',
          tickets: 'Registros',
          actions: 'Ações',
          id: 'Id',
          kanban: 'Kanban',
        },
        buttons: {
          add: 'Nova Tag',
        },
        toasts: {
          deleted: 'Tag excluído com sucesso.',
        },
      },
      whitelabel: {
        primaryColorLight: 'Cor primária clara',
        primaryColorDark: 'Cor primária escura',
        lightLogo: 'Logo do app claro',
        darkLogo: 'Logo do app escuro',
        favicon: 'Favicon do app',
        appname: 'Nome do app',
        logoHint: 'Prefira SVG e aspecto de 28:10',
        faviconHint: 'Prefira imagem SVG quadrada ou PNG 512x512',
      },
      settings: {
        group: {
          general: 'Geral',
          timeouts: 'Tempos de espera',
          officeHours: 'Horário de expediente',
          groups: 'Grupos',
          confidenciality: 'Confidencialidade',
          api: 'API',
          externalServices: 'Serviços externos',
          serveradmin: 'Administração do servidor',
        },
        success: 'Configurações salvas com sucesso.',
        copiedToClipboard: 'Copiado para a área de transferência',
        title: 'Configurações',
        chatbotTicketTimeout: 'Timeout do chatbot (minutos)',
        chatbotTicketTimeoutAction: 'Ação do timeout do chatbot',
        settings: {
          userCreation: {
            name: 'Criação de usuário',
            options: {
              enabled: 'Ativado',
              disabled: 'Desativado',
            },
          },
        },
        validations: {
          title: 'Avaliações',
          options: {
            enabled: 'Habilitado',
            disabled: 'Desabilitado',
          },
        },
        OfficeManagement: {
          title: 'Gerenciamento de Expediente',
          options: {
            disabled: 'Desabilitado',
            ManagementByDepartment: 'Gerenciamento Por Fila',
            ManagementByCompany: 'Gerenciamento Por Empresa',
          },
        },
        outOfHoursAction: {
          title: 'Ação fora do expediente',
          options: {
            pending: 'Deixar como pendente',
            closed: 'Fechar ticket',
          },
        },
        IgnoreGroupMessages: {
          title: 'Ignorar Mensagens de Grupos',
          options: {
            enabled: 'Ativado',
            disabled: 'Desativado',
          },
        },
        soundGroupNotifications: {
          title: 'Notificações de som de grupo',
          options: {
            enabled: 'Ativado',
            disabled: 'Desativado',
          },
        },
        groupsTab: {
          title: 'Aba de Grupos',
          options: {
            enabled: 'Ativado',
            disabled: 'Desativado',
          },
        },
        VoiceAndVideoCalls: {
          title: 'Chamadas de Voz e Vídeo',
          options: {
            enabled: 'Ignorar',
            disabled: 'informar indisponibilidade',
          },
        },
        AutomaticChatbotOutput: {
          title: 'Saída automática de chatbot',
          options: {
            enabled: 'Activado',
            disabled: 'Desativado',
          },
        },
        ShowNumericEmoticons: {
          title: 'Exibir emojis numéricos na fila',
          options: {
            enabled: 'Activado',
            disabled: 'Desativado',
          },
        },
        QuickMessages: {
          title: 'Mensagens Rápidas',
          options: {
            enabled: 'Por empresa',
            disabled: 'Por Usuário',
          },
        },
        AllowRegistration: {
          title: 'Permitir cadastro',
          options: {
            enabled: 'Ativado',
            disabled: 'Desativado',
          },
        },
        FileUploadLimit: {
          title: 'Limite de Upload de arquivos (MB)',
        },
        FileDownloadLimit: {
          title: 'Limite de Download de arquivos (MB)',
        },
        messageVisibility: {
          title: 'Visibilidade da mensagem',
          options: {
            respectMessageQueue: 'Respeitar fila da mensagem',
            respectTicketQueue: 'Respeitar fila do ticket',
          },
        },
        keepQueueAndUser: {
          title: 'Manter fila e usuário no ticket fechado',
          options: {
            enabled: 'Ativado',
            disabled: 'Desativado',
          },
        },
        GracePeriod: {
          title: 'Carência após vencimento (dias)',
        },
        ticketAcceptedMessage: {
          title: 'Mensagem de ticket aceito',
          placeholder: 'Digite sua mensagem de ticket aceito aqui',
        },
        transferMessage: {
          title: 'Mensagem de transferência',
          placeholder: 'Digite sua mensagem de transferência aqui',
        },
        mustacheVariables: {
          title: 'Variáveis disponíveis:',
        },
        WelcomeGreeting: {
          greetings: 'Olá',
          welcome: 'Seja bem-vindo a',
          expirationTime: 'Ativo até',
        },
        Options: {
          title: 'Opções',
        },
        Companies: {
          title: 'Empresas',
        },
        schedules: {
          title: 'Horários',
        },
        Plans: {
          title: 'Planos',
        },
        Help: {
          title: 'Ajuda',
        },
        Whitelabel: {
          title: 'Whitelabel',
        },
        PaymentGateways: {
          title: 'Payment gateways',
        },
        AIProvider: {
          title: 'Serviço de IA',
        },
        AudioTranscriptions: {
          title: 'Transcrição de áudio',
        },
        TagsMode: {
          title: 'Modo de Tags',
          options: {
            ticket: 'Ticket',
            contact: 'Contato',
            both: 'Ticket e Contacto',
          },
        },
        schedulesUpdated: 'Horários atualizados com sucesso.',
        operationUpdated: 'Operação atualizada com sucesso.',
        paymentGateway: 'Gateway de pagamento',
        none: 'Nenhum',
        owenPayments: 'Owen Payments 💎',
        efi: 'Efí',
        apiToken: 'Token da API',
        aiKey: 'Chave de IA',
        defaultAppName: 'Ticketz',
        ratingsTimeout: 'Timeout para avaliação (minutos)',
        noQueueTimeout: 'Timeout para ticket sem fila (minutos)',
        noQueueTimeoutAction: 'Ação para timeout de ticket sem fila',
        openTicketTimeout: 'Timeout para ticket em atendimento (minutos)',
        openTicketTimeoutAction: 'Ação para timeout de ticket aberto',
        autoReopenTimeout: 'Timeout para reabertura automática (minutos)',
        close: 'Fechar',
        returnToQueue: 'Retornar para a fila',
        officeHours: 'Horário de expediente',
        officeManagement: 'Gerenciamento de Expediente',
        managementByQueue: 'Gerenciamento Por Fila',
        managementByCompany: 'Gerenciamento Por Empresa',
        groups: 'Grupos',
        ignoreGroupMessages: 'Ignorar Mensagens de Grupos',
        groupSoundNotifications: 'Notificações de som de grupo',
        groupsTab: 'Aba de Grupos',
        confidentiality: 'Confidencialidade',
        messageVisibility: 'Visibilidade da mensagem',
        respectMessageQueue: 'Respeitar fila da mensagem',
        respectTicketQueue: 'Respeitar fila do ticket',
        keepQueueAndUser: 'Manter fila e usuário',
        api: 'API',
        outOfHoursAction: 'Ação fora do expediente',
        leaveAsPending: 'Deixar como pendente',
        // Form fields
        name: 'Nome',
        email: 'E-mail',
        phone: 'Telefone',
        company: 'Empresa',
        plan: 'Plano',
        campaigns: 'Campanhas',
        status: 'Status',
        createdAt: 'Criado em',
        dueDate: 'Data de Vencimento',
        value: 'Valor',
        users: 'Usuários',
        connections: 'Conexões',
        queues: 'Filas',
        public: 'Público',
        yes: 'Sim',
        no: 'Não',
        active: 'Ativo',
        inactive: 'Inativo',
        // Plan management
        planName: 'Nome do Plano',
        planValue: 'Valor do Plano',
        planUsers: 'Usuários do Plano',
        planConnections: 'Conexões do Plano',
        planQueues: 'Filas do Plano',
        planPublic: 'Plano Público',
        // Campaign management
        campaignTitle: 'Título da Campanha',
        campaignCode: 'Código da Campanha',
        campaignDescription: 'Descrição da Campanha',
        campaignEnabled: 'Campanha Habilitada',
        campaignDisabled: 'Campanha Desabilitada',
        // User management
        userName: 'Nome do Usuário',
        userEmail: 'E-mail do Usuário',
        userPhone: 'Telefone do Usuário',
        userCompany: 'Empresa do Usuário',
        userPlan: 'Plano do Usuário',
        // Whitelabel
        primaryColorLight: 'Cor primária clara',
        primaryColorDark: 'Cor primária escura',
        appLogoLight: 'Logo da aplicação clara',
        appLogoDark: 'Logo da aplicação escura',
        appName: 'Nome da aplicação',
        appFavicon: 'Favicon da aplicação',
        logoSvgHint: 'Prefira SVG e aspecto de 28:10',
        faviconSvgHint: 'Prefira imagem SVG quadrada ou PNG 512x512',
        // Buttons
        clear: 'Limpar',
        save: 'Salvar',
        cancel: 'Cancelar',
        edit: 'Editar',
        delete: 'Excluir',
        add: 'Adicionar',
        // Date format
        dateFormat: 'dd/mm/yyyy',
        // Recurrence
        recurrence: 'Recorrência',
        // Contact lists
        contactLists: 'Listas de Contatos',
        // Settings
        settings: 'Configurações',
        // Navigation
        listing: 'Listagem',
        // System description
        systemDescription: 'ticketz chat based ticket system',
      },
      messagesList: {
        header: {
          assignedTo: 'Atribuído à:',
          buttons: {
            return: 'Retornar',
            resolve: 'Resolver',
            reopen: 'Reabrir',
            accept: 'Aceitar',
          },
        },
      },
      messagesInput: {
        placeholderOpen: 'Digite uma mensagem',
        placeholderClosed:
          'Reabra ou aceite esse ticket para enviar uma mensagem.',
        signMessage: 'Assinar',
        replying: 'Respondendo',
        editing: 'Editando',
      },
      message: {
        edited: 'Editada',
        forwarded: 'Encaminhada',
      },

      contactDrawer: {
        header: 'Dados do contato',
        buttons: {
          edit: 'Editar contato',
        },
        extraInfo: 'Outras informações',
      },
      ticketOptionsMenu: {
        schedule: 'Agendamento',
        delete: 'Deletar',
        transfer: 'Transferir',
        registerAppointment: 'Observações do Contato',
        appointmentsModal: {
          title: 'Observações do Contato',
          textarea: 'Observação',
          placeholder: 'Insira aqui a informação que deseja registrar',
        },
        confirmationModal: {
          title: 'Deletar o ticket do contato',
          message:
            'Atenção! Todas as mensagens relacionadas ao ticket serão perdidas.',
        },
        buttons: {
          delete: 'Excluir',
          cancel: 'Cancelar',
        },
      },
      confirmationModal: {
        buttons: {
          confirm: 'Ok',
          cancel: 'Cancelar',
        },
      },
      messageOptionsMenu: {
        delete: 'Deletar',
        edit: 'Editar',
        forward: 'Encaminhar',
        history: 'Histórico',
        reply: 'Responder',
        confirmationModal: {
          title: 'Apagar mensagem?',
          message: 'Esta ação não pode ser revertida.',
        },
      },
      messageHistoryModal: {
        close: 'Fechar',
        title: 'Histórico de edição da mensagem',
      },
      presence: {
        unavailable: 'Indisponível',
        available: 'Disponível',
        composing: 'Digitando...',
        recording: 'Gravando...',
        paused: 'Pausado',
      },
      privacyModal: {
        title: 'Editar Privacidade do Whatsapp',
        buttons: {
          cancel: 'Cancelar',
          okEdit: 'Salvar',
        },
        form: {
          menu: {
            all: 'Todos',
            none: 'Ninguém',
            contacts: 'Meus contatos',
            contact_blacklist: 'Contatos selecionados',
            match_last_seen: 'Semelhante ao Visto por Último',
            known: 'Conhecidos',
            disable: 'Desativada',
            hrs24: '24 Horas',
            dias7: '7 Dias',
            dias90: '90 Dias',
          },
          readreceipts: 'Para atualizar a privacidade dos recibos de leitura',
          profile: 'Para atualizar a privacidade da foto do perfil',
          status: 'Para atualizar a privacidade do recados',
          online: 'Para atualizar a privacidade online',
          last: 'Para atualizar a privacidade do Último Visto',
          groupadd: 'Para atualizar a privacidade de Adicionar a grupos',
          calladd: 'Para atualizar a privacidade de Adicionar a Ligações',
          disappearing: 'Para atualizar o Modo de Desaparecimento Padrão',
        },
      },
      backendErrors: {
        ERR_UNAUTHORIZED: 'Você não está autorizado a acessar este recurso.',
        ERR_FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
        ERR_CHECK_NUMBER: 'Verifique o número e tente novamente.',
        ERR_NO_OTHER_WHATSAPP: 'Deve haver pelo menos um WhatsApp padrão.',
        ERR_NO_DEF_WAPP_FOUND:
          'Nenhum WhatsApp padrão encontrado. Verifique a página de conexões.',
        ERR_WAPP_NOT_INITIALIZED:
          'Esta sessão do WhatsApp não foi inicializada. Verifique a página de conexões.',
        ERR_WAPP_CHECK_CONTACT:
          'Não foi possível verificar o contato do WhatsApp. Verifique a página de conexões',
        ERR_WAPP_INVALID_CONTACT: 'Este não é um número de Whatsapp válido.',
        ERR_WAPP_DOWNLOAD_MEDIA:
          'Não foi possível baixar mídia do WhatsApp. Verifique a página de conexões.',
        ERR_INVALID_CREDENTIALS:
          'Erro de autenticação. Por favor, tente novamente.',
        ERR_SENDING_WAPP_MSG:
          'Erro ao enviar mensagem do WhatsApp. Verifique a página de conexões.',
        ERR_DELETE_WAPP_MSG: 'Não foi possível excluir a mensagem do WhatsApp.',
        ERR_EDITING_WAPP_MSG: 'Não foi possível editar a mensagem do WhatsApp.',
        ERR_OTHER_OPEN_TICKET: 'Já existe um tíquete aberto para este contato.',
        ERR_SESSION_EXPIRED: 'Sessão expirada. Por favor entre.',
        ERR_USER_CREATION_DISABLED:
          'A criação do usuário foi desabilitada pelo administrador.',
        ERR_NO_PERMISSION: 'Você não tem permissão para acessar este recurso.',
        ERR_DUPLICATED_CONTACT: 'Já existe um contato com este número.',
        ERR_NO_SETTING_FOUND: 'Nenhuma configuração encontrada com este ID.',
        ERR_NO_CONTACT_FOUND: 'Nenhum contato encontrado com este ID.',
        ERR_NO_TICKET_FOUND: 'Nenhum tíquete encontrado com este ID.',
        ERR_NO_USER_FOUND: 'Nenhum usuário encontrado com este ID.',
        ERR_NO_WAPP_FOUND: 'Nenhum WhatsApp encontrado com este ID.',
        ERR_CREATING_MESSAGE: 'Erro ao criar mensagem no banco de dados.',
        ERR_CREATING_TICKET: 'Erro ao criar tíquete no banco de dados.',
        ERR_FETCH_WAPP_MSG:
          'Erro ao buscar a mensagem no WhtasApp, talvez ela seja muito antiga.',
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          'Esta cor já está em uso, escolha outra.',
        ERR_WAPP_GREETING_REQUIRED:
          'A mensagem de saudação é obrigatório quando há mais de uma fila.',
        ERR_SUBSCRIPTION_CHECK_FAILED: 'Assinatura inválida ou não encontrada',
        ERR_WAPP_NOT_FOUND: 'Conexão indisponível',
        ERR_SUBSCRIPTION_EXPIRED: 'Assinatura expirada',
        ERR_UNKOWN: 'Erro desconhecido',
      },
      ticketz: {
        registration: {
          header: 'Cadastre-se na base de usuários do Ticketz',
          description:
            'Preencha os campos abaixo para se cadastrar na base de usuários do Ticketz e receber novidades sobre o projeto.',
          name: 'Nome',
          country: 'País',
          phoneNumber: 'Número de Whatsapp',
          submit: 'Cadastrar',
        },
        support: {
          title: 'Apoie o projeto Ticketz Open Source',
          mercadopagotitle: 'Cartão de Crédito',
          recurringbrl: 'Doação recorrente em R$',
          paypaltitle: 'Cartão de Crédito',
          international: 'Internacional em US$',
        },
      },
      interactions: {
        toasts: {
          created: 'Interação criada com sucesso',
        },
        buttons: {
          add: 'Adicionar Interação',
        },
        types: {
          note: 'Nota',
          email: 'E-mail',
          message: 'Mensagem',
          file: 'Arquivo',
        },
        categories: {
          internal_note: 'Nota Interna',
          customer_communication: 'Comunicação com Cliente',
          system: 'Sistema',
        },
        dialog: {
          add: 'Adicionar Interação',
        },
        form: {
          type: 'Tipo',
          category: 'Categoria',
          notes: 'Notas',
        },
      },
      leads: {
        title: 'Leads',
        searchPlaceholder: 'Buscar leads',
        notFound: 'Lead não encontrado',
        buttons: {
          add: 'Novo Lead',
          save: 'Salvar',
          cancel: 'Cancelar',
        },
        views: {
          board: 'Quadro',
          list: 'Lista',
        },
        tabs: {
          basic: 'Básico',
          contact: 'Contato',
          financial: 'Financeiro',
          tags: 'Tags',
          notes: 'Notas',
        },
        modal: {
          add: {
            title: 'Novo Lead',
          },
          edit: {
            title: 'Editar Lead',
          },
          form: {
            contact: 'Contato',
            stage: 'Estágio',
            temperature: 'Temperatura',
            source: 'Fonte',
            expectedValue: 'Valor Esperado',
            probability: 'Probabilidade (%)',
            expectedClosingDate: 'Data Esperada de Fechamento',
            assignedTo: 'Atribuído a',
            notes: 'Notas',
            selectUser: 'Selecionar usuário',
          },
        },
        dialog: {
          new: 'Novo Lead',
          edit: 'Editar Lead',
          addTag: 'Adicionar Tag',
        },
        form: {
          name: 'Nome',
          title: 'Título',
          titleHelper: 'Breve descrição do lead',
          description: 'Descrição',
          temperature: 'Temperatura',
          status: 'Status',
          pipeline: 'Pipeline',
          contact: 'Contato',
          column: 'Coluna',
          assignedTo: 'Atribuído a',
          unassigned: 'Não atribuído',
          source: 'Fonte',
          expectedValue: 'Valor Esperado',
          currency: 'Moeda',
          probability: 'Probabilidade (%)',
          probabilityHelper: 'Probabilidade de fechar o negócio (0-100%)',
          expectedClosingDate: 'Data Esperada de Fechamento',
          tags: 'Tags',
          addTag: 'Adicionar Tag',
          tag: 'Tag',
          customFields: 'Campos Personalizados',
          customFieldName: 'Digite o nome do campo personalizado',
          addCustomField: 'Adicionar Campo Personalizado',
          notes: 'Notas',
        },
        table: {
          lead: 'Lead',
          contact: 'Contato',
          status: 'Status',
          pipeline: 'Pipeline',
          column: 'Coluna',
          temperature: 'Temperatura',
          tags: 'Tags',
          financial: 'Financeiro',
          assignedTo: 'Atribuído a',
          actions: 'Ações',
          unassigned: 'Não atribuído',
        },
        sections: {
          contact: 'Informações de Contato',
          financial: 'Informações Financeiras',
          tags: 'Tags',
          customFields: 'Campos Personalizados',
          notes: 'Notas',
        },
        fields: {
          contact: 'Contato',
          phone: 'Telefone',
          email: 'E-mail',
          source: 'Fonte',
          assignedTo: 'Atribuído a',
          expectedValue: 'Valor Esperado',
          probability: 'Probabilidade',
          expectedClosingDate: 'Data Esperada de Fechamento',
        },
        status: {
          new: 'Novo',
          contacted: 'Contactado',
          follow_up: 'Acompanhamento',
          proposal: 'Proposta',
          negotiation: 'Negociação',
          qualified: 'Qualificado',
          unqualified: 'Não qualificado',
          converted: 'Convertido',
          lost: 'Perdido',
          closed_won: 'Fechado Ganho',
          closed_lost: 'Fechado Perdido',
        },
        pipeline: {
          default: 'Padrão',
          sales: 'Vendas',
          support: 'Suporte',
          onboarding: 'Integração',
        },
        temperature: {
          hot: 'Quente',
          warm: 'Morno',
          cold: 'Frio',
        },
        timeline: {
          title: 'Linha do Tempo',
          empty: 'Nenhuma interação encontrada',
        },
        toasts: {
          created: 'Lead criado com sucesso',
          updated: 'Lead atualizado com sucesso',
          deleted: 'Lead excluído com sucesso',
          contactRequired: 'Contato é obrigatório',
          tagAdded: 'Tag adicionada com sucesso',
          tagRemoved: 'Tag removida com sucesso',
        },
        validation: {
          name: {
            required: 'Nome é obrigatório',
          },
          title: {
            max: 'O título deve ter no máximo 255 caracteres',
          },
          contact: {
            required: 'Contato é obrigatório',
          },
          column: {
            required: 'Coluna é obrigatória',
          },
          temperature: {
            required: 'Temperatura é obrigatória',
          },
          status: {
            required: 'Status é obrigatório',
          },
          pipeline: {
            required: 'Pipeline é obrigatório',
          },
          source: {
            required: 'Fonte é obrigatória',
          },
          currency: {
            required: 'Moeda é obrigatória',
          },
          probability: {
            min: 'Probabilidade deve ser no mínimo 0',
            max: 'Probabilidade deve ser no máximo 100',
          },
        },
        leadColumns: {
          buttons: {
            add: 'Nova Coluna',
            save: 'Salvar',
            cancel: 'Cancelar',
          },
          dialog: {
            new: 'Nova Coluna',
            edit: 'Editar Coluna',
          },
          modal: {
            add: {
              title: 'Nova Coluna',
            },
            edit: {
              title: 'Editar Coluna',
            },
            form: {
              name: 'Nome',
              color: 'Cor',
            },
          },
          toasts: {
            created: 'Coluna criada com sucesso',
            updated: 'Coluna atualizada com sucesso',
            deleted: 'Coluna excluída com sucesso',
          },
        },
      },
      ticketMessagesDialog: {
        buttons: {
          close: 'Fechar',
        },
      },
    },
  },
};

export { messages };
