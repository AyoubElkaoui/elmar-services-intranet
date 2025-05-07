// src/components/VerjaardagenJubileaSectie.tsx
"use client";

import Link from 'next/link';
import VerjaardagJubileumCard from '@/components/ui/VerjaardagJubileumCard';
import { mockVerjaardagenJubilea } from '@/data/mockVerjaardagen';
import { isDezeMaand, isVandaag, isDezeWeek } from '@/utils/dateUtils';
import { useEffect, useState } from 'react';
import { VerjaardagJubileum } from '@/types/verjaardag';

export default function VerjaardagenJubileaSectie() {
    const [verjaardagen, setVerjaardagen] = useState<VerjaardagJubileum[]>([]);

    useEffect(() => {
        // Generate some current birthdays and anniversaries based on the current month and year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

        // Create new birthdays with current dates
        const newVerjaardagen: VerjaardagJubileum[] = [
            {
                id: 1,
                naam: 'Jan Janssen',
                foto: '/images/placeholder.svg',
                type: 'verjaardag',
                datum: `${currentYear}-${String(currentMonth).padStart(2, '0')}-18`,
                afdeling: 'Verkoop',
                functie: 'Account Manager',
                leeftijd: 42
            },
            {
                id: 2,
                naam: 'Marloes Visser',
                foto: '/images/placeholder.svg',
                type: 'jubileum',
                datum: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${currentDate.getDate() + 5}`,
                afdeling: 'HR',
                functie: 'HR Manager',
                aantalJaren: 10
            },
            {
                id: 3,
                naam: 'Peter Bakker',
                foto: '/images/placeholder.svg',
                type: 'verjaardag',
                datum: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${currentDate.getDate() + 2}`,
                afdeling: 'IT',
                functie: 'Developer',
                leeftijd: 35
            },
            {
                id: 4,
                naam: 'Sophie de Jong',
                foto: '/images/placeholder.svg',
                type: 'verjaardag',
                datum: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${currentDate.getDate()}`,
                afdeling: 'Marketing',
                functie: 'Marketing Specialist',
                leeftijd: 29
            }
        ];

        setVerjaardagen(newVerjaardagen);
    }, []);

    // Filter for today, this week, and this month
    const vandaagItems = verjaardagen.filter(item => isVandaag(item.datum));
    const dezeWeekItems = verjaardagen.filter(item =>
        isDezeWeek(item.datum) && !isVandaag(item.datum)
    );
    const dezeMaandItems = verjaardagen.filter(item =>
        isDezeMaand(item.datum) && !isDezeWeek(item.datum) && !isVandaag(item.datum)
    );

    // Combine and limit to maximum 4 items
    const teTonenItems = [
        ...vandaagItems,
        ...dezeWeekItems,
        ...dezeMaandItems
    ].slice(0, 4);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Verjaardagen & Jubilea</h2>
                <Link href="/verjaardagen" className="text-accent hover:underline text-sm">
                    Bekijk alle
                </Link>
            </div>

            <div className="space-y-2">
                {teTonenItems.length > 0 ? (
                    teTonenItems.map(item => (
                        <VerjaardagJubileumCard
                            key={item.id}
                            item={item}
                        />
                    ))
                ) : (
                    <p className="text-center py-4 text-gray-500">Geen verjaardagen of jubilea deze maand</p>
                )}
            </div>
        </div>
    );
}