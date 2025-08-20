// components/ui/MyTicket.tsx

type TicketData = {
    name: string;
    ticketNumber: string;
    event: string;
    seat: string;
    email: string;
    status: string;
    };

    export default function MyTicket({ data }: { data: TicketData }) {
    return (
        <div>
        <h1>{data.event}</h1>
        <p>Name: {data.name}</p>
        <p>Ticket Number: {data.ticketNumber}</p>
        <p>Seat: {data.seat}</p>
        <p>Email: {data.email}</p>
        <p>Status: {data.status}</p>
        </div>
    );
}

