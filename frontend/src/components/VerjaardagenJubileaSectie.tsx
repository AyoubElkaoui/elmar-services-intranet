"use client";

// src/components/VerjaardagenJubileaSectie.tsx
import Link from 'next/link';
import VerjaardagJubileumCard from '@/components/ui/VerjaardagJubileumCard';
import { mockVerjaardagenJubilea } from '@/data/mockVerjaardagen';
import { isDezeMaand, isVandaag, isDezeWeek } from '@/utils/dateUtils';

export default function VerjaardagenJubileaSectie() {
    // Filter voor vandaag, deze week en deze maand
    const vandaagItems = mockVerjaardagenJubilea.filter(item => isVandaag(item.datum));
    const dezeWeekItems = mockVerjaardagenJubilea.filter(item =>
        isDezeWeek(item.datum) && !isVandaag(item.datum)
    );
    const dezeMaandItems = mockVerjaardagenJubilea.filter(item =>
        isDezeMaand(item.datum) && !isDezeWeek(item.datum) && !isVandaag(item.datum)
    );

    // Combineer en limiteer tot maximaal 4 items
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