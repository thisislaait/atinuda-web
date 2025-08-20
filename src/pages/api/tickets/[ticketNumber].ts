// pages/api/tickets/[ticketNumber].ts
import { NextApiRequest, NextApiResponse } from 'next';

type TicketData = {
  name: string;
  ticketNumber: string;
  event: string;
  seat: string;
  email: string;
  status: string;
};

type TicketMap = {
  [key: string]: TicketData;
};

const mockData: TicketMap = {
  "PREM-ATIN71537": {
    name: "Jane Doe",
    ticketNumber: "PREM-ATIN71537",
    event: "Atinuda Conference 2025",
    seat: "B12",
    email: "jane@example.com",
    status: "Confirmed",
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ticketNumber } = req.query;

  const ticket = mockData[ticketNumber as string];

  if (ticket) {
    res.status(200).json(ticket);
  } else {
    res.status(404).json({ error: "Ticket not found" });
  }
}
