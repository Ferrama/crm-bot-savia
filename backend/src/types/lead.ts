export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  FOLLOW_UP = "follow_up",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  QUALIFIED = "qualified",
  UNQUALIFIED = "unqualified",
  CONVERTED = "converted",
  LOST = "lost",
  CLOSED_WON = "closed_won",
  CLOSED_LOST = "closed_lost"
}

export enum LeadPipeline {
  DEFAULT = "default",
  SALES = "sales",
  SUPPORT = "support",
  ONBOARDING = "onboarding"
}

export enum ActivityType {
  STATUS_CHANGE = "status_change",
  PIPELINE_CHANGE = "pipeline_change",
  EMAIL = "email",
  NOTE = "note",
  FILE = "file",
  MESSAGE = "message"
}

export interface LeadMetadata {
  email?: {
    from: string;
    to: string;
    subject?: string;
    body?: string;
  };
  file?: {
    name: string;
    url: string;
    type: string;
    size: number;
  };
  message?: {
    platform: string;
    direction: "in" | "out";
    content: string;
  };
  lastInteraction?: Date;
  lastStatusChange?: Date;
  lastAssignment?: Date;
  totalInteractions?: number;
  totalStatusChanges?: number;
  totalAssignments?: number;
}
