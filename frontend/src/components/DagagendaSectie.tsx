// src/components/DagagendaSectie.tsx
import Link from 'next/link';
import { formatDatum, getDagVanDeWeek } from '@/utils/dateUtils';
import DagagendaItem from '@/components/ui/DagagendaItem';
import {mockReserveringen, mockVergaderzalen} from '@/data/mockVergaderzalen';
import { mockVerjaardagenJubilea } from '@/data/mockVerjaardagen';

export default function DagagendaSectie() {
    const vandaag = new Date();

    // Combineer alle agenda-items voor vandaag
    const agendaItems = [
        // Vergaderingen
        ...mockReserveringen
            .filter(res => new Date(res.startTijd).toDateString() === vandaag.toDateString())
            .map(res => ({
                id: res.id,
                titel: res.titel,
                startTijd: res.startTijd,
                eindTijd: res.eindTijd,
                type: 'vergadering' as const,
                locatie: `Zaal: ${mockVergaderzalen.find(z => z.id === res.vergaderzaalId)?.naam}`
            })),

        // Verjaardagen en jubilea
        ...mockVerjaardagenJubilea
            .filter(vj => new Date(vj.datum).toDateString() === vandaag.toDateString())
            .map(vj => ({
                id: vj.id,
                titel: `${vj.type === 'verjaardag' ? 'Verjaardag' : 'Jubileum'} ${vj.naam}`,
                startTijd: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
                eindTijd: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
                type: vj.type === 'verjaardag' ? 'verjaardag' as const : 'anders' as const,
                locatie: vj.afdeling
            }))
    ];

    // Sorteer op starttijd
    const gesorteerdeItems = agendaItems.sort((a, b) =>
        new Date(a.startTijd).getTime() - new Date(b.startTijd).getTime()
    );

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
                {gesorteerdeItems.length > 0 ? (
                    gesorteerdeItems.map(item => (
                        <DagagendaItem key={`${item.id}-${item.type}`} item={item} />
                    ))
                ) : (
                    <p className="text-center py-4 text-gray-500">Geen activiteiten gepland voor vandaag</p>
                )}
            </div>
        </div>
    );
}