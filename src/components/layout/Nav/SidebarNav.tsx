// components/SidebarNav.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const navItems = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Announcement Card', href: '#announce' },
    { name: 'Check-In', href: '#checkin' },
];

const SidebarNav = () => {
    const router = useRouter();

    return (
        <nav className="fixed top-0 left-0 h-screen w-56 bg-white shadow-md p-4 z-50">
            <h2 className="text-xl font-bold mb-6">Attendee Menu</h2>
            <ul className="space-y-4">
                {navItems.map((item) => (
                    <li key={item.href}>
                        <a
                            href={item.href}
                            className="block text-gray-700 hover:text-blue-600 font-medium"
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SidebarNav;

