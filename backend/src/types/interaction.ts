export enum InteractionType {
  NOTE = "note",
  EMAIL = "email",
  CALL = "call",
  MEETING = "meeting",
  QUOTE_SENT = "quote_sent",
  QUOTE_ACCEPTED = "quote_accepted",
  QUOTE_REJECTED = "quote_rejected",
  FILE = "file",
  MESSAGE = "message"
}

export enum InteractionCategory {
  INTERNAL_NOTE = "internal_note",
  CUSTOMER_COMMUNICATION = "customer_communication",
  SYSTEM = "system"
}

export enum InteractionPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}
