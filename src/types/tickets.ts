export type TicketCheckMap = Record<string, boolean>;

export type TicketPayload = {
  fullName: string;
  email: string;
  ticketType: string;
  ticketNumber: string;
  location?: string | null;
  checkIn?: TicketCheckMap | null;
  giftClaimed?: boolean;
  qrCode?: string;
};

export type TicketSource = "tickets" | "payments" | "attendees";

export type TicketLookupResponse = {
  ok: boolean;
  source?: TicketSource;
  ticket?: TicketPayload | null;
  message?: string;
};
