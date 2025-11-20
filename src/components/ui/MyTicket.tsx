export type TicketCardProps = {
  attendee: string;
  ticketNumber: string;
  ticketType: string;
  eventName: string;
  seat?: string | null;
  email?: string | null;
  status?: 'active' | 'refunded' | 'canceled' | string;
};

export default function MyTicket({
  attendee,
  ticketNumber,
  ticketType,
  eventName,
  seat,
  email,
  status = 'active',
}: TicketCardProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 max-w-xl">
      <header className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Ticket</p>
        <h1 className="text-2xl font-bold text-gray-900">{eventName}</h1>
        <p className="text-sm text-gray-500">{ticketType}</p>
      </header>

      <dl className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <dt className="text-gray-500">Issued To</dt>
          <dd className="font-medium text-gray-900">{attendee}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Ticket No.</dt>
          <dd className="font-mono text-gray-900">{ticketNumber}</dd>
        </div>
        {seat && (
          <div className="flex justify-between">
            <dt className="text-gray-500">Seat</dt>
            <dd className="text-gray-900">{seat}</dd>
          </div>
        )}
        {email && (
          <div className="flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900">{email}</dd>
          </div>
        )}
      </dl>

      <footer className="mt-6 flex items-center justify-between text-xs uppercase tracking-wide">
        <span className={`px-3 py-1 rounded-full font-semibold ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
          {status}
        </span>
        <span className="text-gray-400">Powered by Atinuda</span>
      </footer>
    </section>
  );
}
