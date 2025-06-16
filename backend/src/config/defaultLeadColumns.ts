export interface DefaultLeadColumn {
  code: string;
  name: string;
  color: string;
  order: number;
  isSystem: boolean;
}

export const DEFAULT_LEAD_COLUMNS: DefaultLeadColumn[] = [
  {
    code: "new",
    name: "New",
    color: "#2196f3",
    order: 1,
    isSystem: true
  },
  {
    code: "contacted",
    name: "Contacted",
    color: "#ff9800",
    order: 2,
    isSystem: true
  },
  {
    code: "follow_up",
    name: "Follow Up",
    color: "#9c27b0",
    order: 3,
    isSystem: true
  },
  {
    code: "proposal",
    name: "Proposal",
    color: "#4caf50",
    order: 4,
    isSystem: true
  },
  {
    code: "negotiation",
    name: "Negotiation",
    color: "#ff5722",
    order: 5,
    isSystem: true
  },
  {
    code: "qualified",
    name: "Qualified",
    color: "#00bcd4",
    order: 6,
    isSystem: true
  },
  {
    code: "not_qualified",
    name: "Not Qualified",
    color: "#f44336",
    order: 7,
    isSystem: true
  },
  {
    code: "converted",
    name: "Converted",
    color: "#4caf50",
    order: 8,
    isSystem: true
  },
  {
    code: "lost",
    name: "Lost",
    color: "#f44336",
    order: 9,
    isSystem: true
  },
  {
    code: "closed_won",
    name: "Closed Won",
    color: "#4caf50",
    order: 10,
    isSystem: true
  },
  {
    code: "closed_lost",
    name: "Closed Lost",
    color: "#f44336",
    order: 11,
    isSystem: true
  }
];

export const getDefaultColumnByCode = (
  code: string
): DefaultLeadColumn | undefined => {
  return DEFAULT_LEAD_COLUMNS.find(column => column.code === code);
};

export const getDefaultColumns = (): DefaultLeadColumn[] => {
  return [...DEFAULT_LEAD_COLUMNS];
};
