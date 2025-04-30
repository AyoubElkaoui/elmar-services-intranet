// src/components/KalenderSectie.tsx
import Link from 'next/link';
import Calendar from '@/components/ui/Calendar';
import { mockCalendarEvents } from '@/data/mockCalendarEvents';

export default function KalenderSectie() {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Kalender</h2>
                <Link href="/kalender" className="text-accent hover:underline text-sm">
                    Volledige kalender
                </Link>
            </div>

            <Calendar events={mockCalendarEvents} initialView="month" />
        </div>
    );
}