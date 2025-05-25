const en = {
  leads: {
    title: 'Leads',
    searchPlaceholder: 'Search leads...',
    buttons: {
      add: 'Add Lead',
      save: 'Save',
      cancel: 'Cancel',
    },
    table: {
      name: 'Name',
      contact: 'Contact',
      column: 'Column',
      temperature: 'Temperature',
      source: 'Source',
      expectedValue: 'Expected Value',
      probability: 'Probability',
      expectedClosingDate: 'Expected Closing Date',
      assignedTo: 'Assigned To',
      actions: 'Actions',
    },
    temperatures: {
      hot: 'Hot',
      warm: 'Warm',
      cold: 'Cold',
    },
    modal: {
      add: {
        title: 'Add Lead',
      },
      edit: {
        title: 'Edit Lead',
      },
      form: {
        name: 'Name',
        contact: 'Contact',
        column: 'Column',
        temperature: 'Temperature',
        source: 'Source',
        expectedValue: 'Expected Value',
        probability: 'Probability',
        expectedClosingDate: 'Expected Closing Date',
        assignedTo: 'Assigned To',
        none: 'None',
      },
    },
    validation: {
      name: {
        required: 'Name is required',
      },
      contact: {
        required: 'Contact is required',
      },
      column: {
        required: 'Column is required',
      },
      temperature: {
        required: 'Temperature is required',
      },
      source: {
        required: 'Source is required',
      },
      probability: {
        min: 'Probability must be at least 0',
        max: 'Probability must be at most 100',
      },
    },
    toasts: {
      created: 'Lead created successfully',
      updated: 'Lead updated successfully',
      deleted: 'Lead deleted successfully',
    },
  },
  leadColumns: {
    buttons: {
      add: 'Add Column',
      save: 'Save',
      cancel: 'Cancel',
    },
    modal: {
      add: {
        title: 'Add Column',
      },
      edit: {
        title: 'Edit Column',
      },
      form: {
        name: 'Name',
        color: 'Color',
      },
    },
    toasts: {
      created: 'Column created successfully',
      updated: 'Column updated successfully',
      deleted: 'Column deleted successfully',
    },
  },
};

export default en;
