// src/components/VergaderzaalSectie.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';
import VergaderzaalCard from '@/components/ui/VergaderzaalCard';
import { mockVergaderzalen, mockReserveringen } from '@/data/mockVergaderzalen';
import { formatDatum } from '@/utils/dateUtils';

export default function VergaderzaalSectie() {
    const [showDialoog, setShowDialoog] = useState(false);
    const [geselecteerdeZaalId, setGeselecteerdeZaalId] = useState<number | null>(null);

    const handleReserveer = (zaalId: number) => {
        setGeselecteerdeZaalId(zaalId);
        setShowDialoog(true);

        // Hier zou je normaal een dialoog openen voor het reserveren
        // In dit voorbeeld tonen we een console-bericht
        console.log(`Reserveren van zaal ${zaalId}`);
    };

    const vandaag = new Date();

    // Haal de huidige reserveringen op voor elke zaal
    const huidigeReserveringen = mockVergaderzalen.map(zaal => {
        const reservering = mockReserveringen.find(res =>
            res.vergaderzaalId === zaal.id &&
            new Date(res.startTijd).toDateString() === vandaag.toDateString()
        );
        return { zaal, reservering };
    });

    // Beschikbare zalen eerst tonen
    const gesorteerdeZalen = huidigeReserveringen.sort((a, b) => {
        if (a.zaal.beschikbaar && !b.zaal.beschikbaar) return -1;
        if (!a.zaal.beschikbaar && b.zaal.beschikbaar) return 1;
        return 0;
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Vergaderzalen</h2>
                <Link href="/vergaderzalen" className="text-accent hover:underline text-sm">
                    Alle reserveringen
                </Link>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                Beschikbare vergaderzalen voor {formatDatum(vandaag.toISOString())}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gesorteerdeZalen.slice(0, 4).map(({ zaal, reservering }) => (
                    <VergaderzaalCard
                        key={zaal.id}
                        vergaderzaal={zaal}
                        huidigeReservering={reservering}
                        onReserveer={handleReserveer}
                    />
                ))}
            </div>
        </div>
    );
}