"use client";

// src/components/ui/VerjaardagJubileumCard.tsx
import React from 'react';
import Image from 'next/image';
import { formatDatum, dagVerschil } from '@/utils/dateUtils';
import { VerjaardagJubileum } from '@/types/verjaardag';

interface VerjaardagJubileumCardProps {
    item: VerjaardagJubileum;
}

export default function VerjaardagJubileumCard({
                                                   item
                                               }: VerjaardagJubileumCardProps) {
    const { naam, functie, afdeling, datum, type, aantalJaren, foto } = item;

    // Bereken dagen tot het evenement
    const dagenTot = dagVerschil(new Date().toISOString(), datum);

    // Controleer of de datum in deze maand valt (voor filtering)
    const isThisMonth = () => {
        const eventDate = new Date(datum);
        const now = new Date();
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    };

    // Bepaal of het evenement vandaag is, binnenkort komt, of al voorbij is
    const isPast = dagenTot < 0;
    const isToday = dagenTot === 0;
    const isUpcoming = dagenTot > 0;

    // Kies achtergrondkleur op basis van type
    const bgColor = type === 'verjaardag' ? 'bg-blue-50' : 'bg-amber-50';
    const textColor = type === 'verjaardag' ? 'text-blue-800' : 'text-amber-800';

    // Maak de toepasselijke label tekst
    const getEventLabel = () => {
        // We gebruiken de isThisMonth functie hier om extra informatie te tonen
        const inThisMonth = isThisMonth();

        // Gebruik de variabele inThisMonth daadwerkelijk in de logica
        if (isToday) {
            if (inThisMonth) {
                return type === 'verjaardag' ? 'Jarig vandaag! 🎉' : `${aantalJaren} jaar in dienst vandaag! 🎉`;
            } else {
                return type === 'verjaardag' ? 'Jarig vandaag! 🎉' : `${aantalJaren} jaar in dienst vandaag! 🎉`;
            }
        } else if (isPast) {
            return type === 'verjaardag' ? 'Was jarig' : 'Heeft jubileum gevierd';
        } else if (isUpcoming) {
            return type === 'verjaardag'
                ? `Jarig over ${dagenTot} ${dagenTot === 1 ? 'dag' : 'dagen'}`
                : `${aantalJaren} jaar in dienst over ${dagenTot} ${dagenTot === 1 ? 'dag' : 'dagen'}`;
        }
        return '';
    };

    return (
        <div className={`p-4 rounded-lg ${bgColor} relative overflow-hidden`}>
            <div className="flex items-center">
                {/* Avatar - gebruik next/image in plaats van img voor betere performance */}
                {foto ? (
                    <div className="mr-4 flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden">
                        <Image
                            src={foto}
                            alt={naam}
                            fill
                            sizes="(max-width: 48px) 100vw, 48px"
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="mr-4 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-600 font-medium">
              {naam.substring(0, 2).toUpperCase()}
            </span>
                    </div>
                )}

                {/* Info */}
                <div>
                    <h4 className="font-medium">{naam}</h4>
                    <p className="text-sm text-gray-600">
                        {functie ? `${functie}, ` : ''}{afdeling}
                    </p>
                    <p className={`text-sm font-medium ${textColor} mt-1`}>
                        {getEventLabel()}
                    </p>
                </div>
            </div>

            {/* Datum */}
            <div className="text-xs text-gray-500 mt-2">
                {formatDatum(datum)}
            </div>
        </div>
    );
}