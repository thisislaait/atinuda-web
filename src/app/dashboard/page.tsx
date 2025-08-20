'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const Dashboard = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const ticketNumber = Array.isArray(params?.ticketNumber)
        ? params.ticketNumber[0]
        : params?.ticketNumber || '';

    const [eventInfo, setEventInfo] = useState<string[]>([]);
    const [userName, setUserName] = useState<string>('Guest');
    const [checkInStatus, setCheckInStatus] = useState({
        day1: false,
        day2: false,
        dinner: false,
    });

    useEffect(() => {
        if (searchParams) {
        const nameFromQuery = searchParams?.get('name');
        if (nameFromQuery) {
            setUserName(nameFromQuery);
        }
        }

        if (ticketNumber) {
        const lower = ticketNumber.toLowerCase();
        const events: string[] = [];

        if (lower.includes('conf')) events.push('📍 Conference: Oct 7–8, 10am–5pm');
        if (lower.includes('wrk')) events.push('🛠 Workshop: Oct 7, 12pm–4pm');
        if (lower.includes('exec')) events.push('💼 Executive: Full access, includes dinner');
        if (lower.includes('prem')) events.push('🌟 Premium: VIP seating + dinner');
        if (lower.includes('dine')) events.push('🍽️ Dinner Only: Oct 8, 8pm');

        setEventInfo(events);
        }

        // Simulate check-in status (replace with real API later)
        setTimeout(() => {
        setCheckInStatus({
            day1: true,
            day2: false,
            dinner: false,
        });
        }, 1000);
    }, [ticketNumber, searchParams]);

    const statusBoxes = [
        { key: 'day1', label: 'Day 1' },
        { key: 'day2', label: 'Day 2' },
        { key: 'dinner', label: 'Dinner' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f6ff] flex flex-col items-start p-6">
        
        {/* Greeting */}
        <div className="mb-4 ml-1">
            <h2 className="text-sm font-medium text-gray-600">Hello, {userName}</h2>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
            
            {/* Ticket Card */}
            <div className="bg-gradient-to-br from-indigo-100 via-white to-blue-100 shadow-2xl rounded-2xl max-w-md w-full text-center p-8">
            <Image
                src="/assets/images/atinudalogo.png"
                alt="Atinuda Logo"
                width={64}
                height={64}
                className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">🎫 Your Ticket</h1>
            <p className="text-sm text-gray-600 mb-6">
                Ticket Number: <span className="font-semibold">{ticketNumber}</span>
            </p>

            {eventInfo.length > 0 ? (
                <div className="text-left space-y-2 mb-4">
                <h2 className="font-semibold text-gray-700">Event Schedule:</h2>
                {eventInfo.map((info, idx) => (
                    <p key={idx} className="text-gray-600">{info}</p>
                ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">Loading event details...</p>
            )}

            <p className="text-xs text-gray-400 mt-6">
                Please show this screen at the venue for check-in.
            </p>
            </div>

            {/* Check-In Status Boxes */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
            {statusBoxes.map(({ key, label }) => {
                const isCheckedIn = checkInStatus[key as keyof typeof checkInStatus];

                return (
                <div
                    key={key}
                    className={`p-4 rounded-xl shadow-md border-l-4 ${
                    isCheckedIn ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'
                    }`}
                >
                    <h3 className="text-lg font-semibold text-gray-800">🗓 {label}</h3>
                    <p
                    className={`text-sm mt-1 ${
                        isCheckedIn ? 'text-green-700 font-medium' : 'text-yellow-700'
                    }`}
                    >
                    {isCheckedIn ? 'Checked-In ✅' : 'Not Checked-In 🚫'}
                    </p>
                </div>
                );
            })}
            </div>

        </div>
        </div>
    );
};

export default Dashboard;


