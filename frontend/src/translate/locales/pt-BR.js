const ptBR = {
  // ... existing code ...
  leads: {
    title: 'Leads',
    searchPlaceholder: 'Buscar leads...',
    buttons: {
      add: 'Adicionar Lead',
      save: 'Salvar',
      cancel: 'Cancelar',
    },
    table: {
      name: 'Nome',
      contact: 'Contato',
      column: 'Coluna',
      temperature: 'Temperatura',
      source: 'Origem',
      expectedValue: 'Valor Esperado',
      probability: 'Probabilidade',
      expectedClosingDate: 'Data Prevista de Fechamento',
      assignedTo: 'Atribuído a',
      actions: 'Ações',
    },
    temperatures: {
      hot: 'Quente',
      warm: 'Morno',
      cold: 'Frio',
    },
    modal: {
      add: {
        title: 'Adicionar Lead',
      },
      edit: {
        title: 'Editar Lead',
      },
      form: {
        name: 'Nome',
        contact: 'Contato',
        column: 'Coluna',
        temperature: 'Temperatura',
        source: 'Origem',
        expectedValue: 'Valor Esperado',
        probability: 'Probabilidade',
        expectedClosingDate: 'Data Prevista de Fechamento',
        assignedTo: 'Atribuído a',
        none: 'Nenhum',
      },
    },
    validation: {
      name: {
        required: 'Nome é obrigatório',
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
      source: {
        required: 'Origem é obrigatória',
      },
      probability: {
        min: 'Probabilidade deve ser no mínimo 0',
        max: 'Probabilidade deve ser no máximo 100',
      },
    },
    toasts: {
      created: 'Lead criado com sucesso',
      updated: 'Lead atualizado com sucesso',
      deleted: 'Lead excluído com sucesso',
    },
  },
  leadColumns: {
    buttons: {
      add: 'Adicionar Coluna',
      save: 'Salvar',
      cancel: 'Cancelar',
    },
    modal: {
      add: {
        title: 'Adicionar Coluna',
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
  // ... existing code ...
};

export default ptBR;
