'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PortalLayout from '@/components/ui/PortalLayout';
import Dashboard from '@/app/dashboard/page';
import ScheduleDay from '@/components/ui/ScheduleDay';
import WorkshopEvent from '@/components/ui/WorkshopEvent';
import DinnerProgram from '@/components/ui/DinnerProgram';
import SpeakersList from '@/components/ui/SpeakersList';

// Shape returned by /api/tickets/[ticketNumber]
type TicketData = {
  ticketNumber: string;
  fullName: string;
  email: string;
  ticketType: string;
  location?: string;
  checkIn?: {
    day1: boolean;
    day2: boolean;
    dinner?: boolean;
  };
  // add other fields from your API if needed
};

type RouteParams = { ticketNumber?: string | string[] };

const TicketPage = () => {
  // Treat params as possibly null and normalize to a string
  const params = useParams() as RouteParams | null;
  const ticketNumber =
    Array.isArray(params?.ticketNumber)
      ? params!.ticketNumber![0] ?? ''
      : params?.ticketNumber ?? '';

  const [userData, setUserData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  // Date constants
  const today = new Date();
  const isDay1 = today.toDateString() === new Date('2025-08-05').toDateString();
  const isDay2 = today.toDateString() === new Date('2025-08-06').toDateString();

  useEffect(() => {
    if (!ticketNumber) {
      setLoading(false);
      setUserData(null);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/tickets/${encodeURIComponent(ticketNumber)}`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = (await res.json()) as TicketData;
        setUserData(data);
      } catch (err) {
        console.error('Failed to fetch ticket:', err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketNumber]);

  if (loading) return <div className="p-10 text-center">Loading your ticket...</div>;
  if (!ticketNumber) return <div className="p-10 text-center">Invalid ticket link.</div>;
  if (!userData) return <div className="p-10 text-center">No ticket found.</div>;

  return (
    <PortalLayout>
      <Dashboard />

      {isDay1 && (
        <>
          <ScheduleDay day="Day 1" />
          <WorkshopEvent day="Day 1" />
          <SpeakersList day="Day 1" />
        </>
      )}

      {isDay2 && (
        <>
          <ScheduleDay day="Day 2" />
          <WorkshopEvent day="Day 2" />
          <DinnerProgram />
          <SpeakersList day="Day 2" />
        </>
      )}
    </PortalLayout>
  );
};

export default TicketPage;

