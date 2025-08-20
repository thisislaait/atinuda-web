'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PortalLayout from '@/components/ui/PortalLayout';
import Dashboard from '@/app/dashboard/page';
import ScheduleDay from '@/components/ui/ScheduleDay';
import WorkshopEvent from '@/components/ui/WorkshopEvent';
import DinnerProgram from '@/components/ui/DinnerProgram';
import SpeakersList from '@/components/ui/SpeakersList';

const TicketPage = () => {
  const params = useParams();
  const ticketNumber = params?.ticketNumber as string;

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Date constants
  const today = new Date();
  const isDay1 = today.toDateString() === new Date('2025-08-05').toDateString();
  const isDay2 = today.toDateString() === new Date('2025-08-06').toDateString();

  useEffect(() => {
    if (ticketNumber) {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/tickets/${ticketNumber}`);
          const data = await res.json();
          setUserData(data);
        } catch (err) {
          console.error('Failed to fetch ticket:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [ticketNumber]);

  if (loading) return <div className="p-10 text-center">Loading your ticket...</div>;
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

