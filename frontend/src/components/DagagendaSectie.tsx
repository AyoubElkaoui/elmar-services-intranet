// src/components/DagagendaSectie.tsx
"use client";

import Link from 'next/link';
import { formatDatum, getDagVanDeWeek } from '@/utils/dateUtils';
import DagagendaItem from '@/components/ui/DagagendaItem';
import { useEffect, useState } from 'react';
import { kalenderEvenementen } from '@/data/mockCalendarEvents';
import { Evenement } from '@/types';

export default function DagagendaSectie() {
    const [agendaItems, setAgendaItems] = useState<any[]>([]);
    const vandaag = new Date();

    useEffect(() => {
        // Filter events for today
        const todayEvents = kalenderEvenementen.filter(event => {
            const eventDate = new Date(event.datum);
            return eventDate.toDateString() === vandaag.toDateString();
        });

        // Convert to the format expected by the DagagendaItem component
        const formattedItems = todayEvents.map(event => ({
            id: event.id,
            titel: event.titel,
            startTijd: new Date(new Date().setHours(
                parseInt(event.startTijd.split(':')[0]),
                parseInt(event.startTijd.split(':')[1]), 0, 0
            )).toISOString(),
            eindTijd: new Date(new Date().setHours(
                parseInt(event.eindTijd.split(':')[0]),
                parseInt(event.eindTijd.split(':')[1]), 0, 0
            )).toISOString(),
            type: event.type as 'vergadering' | 'verjaardag' | 'presentatie' | 'sociaal' | 'anders',
            locatie: event.locatie
        }));

        setAgendaItems(formattedItems);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Agenda Vandaag</h2>
                <Link href="/kalender" className="text-accent hover:underline text-sm">
                    Volledige agenda
                </Link>
            </div>

            <div className="mb-3">
                <p className="text-lg font-medium">{getDagVanDeWeek(vandaag.toISOString())}</p>
                <p className="text-sm text-gray-600">{formatDatum(vandaag.toISOString())}</p>
            </div>

            <div className="space-y-2">
                {agendaItems.length > 0 ? (
                    agendaItems.map(item => (
                        <DagagendaItem key={`${item.id}-${item.type}`} item={item} />
                    ))
                ) : (
                    <p className="text-center py-4 text-gray-500">Geen activiteiten gepland voor vandaag</p>
                )}
            </div>
        </div>
    );
}