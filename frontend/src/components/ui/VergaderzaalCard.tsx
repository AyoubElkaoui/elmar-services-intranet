"use client";

import Image from 'next/image';
import { formatTijd } from '@/utils/dateUtils';
import { Vergaderzaal, Reservering } from '@/types/vergaderzaal';
import { FiUsers, FiMonitor, FiCoffee, FiEdit } from 'react-icons/fi';

interface VergaderzaalCardProps {
    vergaderzaal: Vergaderzaal;
    huidigeReservering?: Reservering;
    onReserveer: (zaalId: number) => void;
}

export default function VergaderzaalCard({ vergaderzaal, huidigeReservering, onReserveer }: VergaderzaalCardProps) {
    // Gebruik een default image als fallback
    const imageUrl = vergaderzaal.foto || '/images/vergaderzaal-placeholder.jpg';

    const getFaciliteitIcoon = (faciliteitNaam: string) => {
        switch(faciliteitNaam.toLowerCase()) {
            case 'videoconferentie':
            case 'lcd scherm':
            case 'projector':
                return <FiMonitor size={14} className="text-gray-500" />;
            case 'koffieautomaat':
                return <FiCoffee size={14} className="text-gray-500" />;
            default:
                return <FiEdit size={14} className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow">
            <div className="relative h-32 w-full">
                <Image
                    src={imageUrl}
                    alt={vergaderzaal.naam}
                    fill
                    className="object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${vergaderzaal.beschikbaar ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {vergaderzaal.beschikbaar ? 'Beschikbaar' : 'Bezet'}
                </div>
            </div>
            <div className="p-3">
                <div className="flex justify-between items-start">
                    <h3 className="font-medium">{vergaderzaal.naam}</h3>
                    <div className="flex items-center text-xs text-gray-600">
                        <FiUsers size={14} className="mr-1" />
                        <span>{vergaderzaal.capaciteit}</span>
                    </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                    {vergaderzaal.faciliteiten.slice(0, 3).map((faciliteitNaam, index) => (
                        <div key={index} className="inline-flex items-center text-xs bg-gray-100 rounded px-2 py-1">
                            {getFaciliteitIcoon(faciliteitNaam)}
                            <span className="ml-1">{faciliteitNaam}</span>
                        </div>
                    ))}
                    {vergaderzaal.faciliteiten.length > 3 && (
                        <div className="inline-flex items-center text-xs bg-gray-100 rounded px-2 py-1">
                            +{vergaderzaal.faciliteiten.length - 3}
                        </div>
                    )}
                </div>

                {huidigeReservering && (
                    <div className="mt-2 text-xs text-gray-600 p-2 bg-gray-50 rounded">
                        <p className="font-medium">{huidigeReservering.titel}</p>
                        <p>{formatTijd(huidigeReservering.startTijd)} - {formatTijd(huidigeReservering.eindTijd)}</p>
                    </div>
                )}

                <button
                    onClick={() => onReserveer(vergaderzaal.id)}
                    className={`mt-3 w-full py-1.5 text-xs font-medium rounded ${vergaderzaal.beschikbaar
                        ? 'bg-accent text-white hover:bg-accent-dark'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={!vergaderzaal.beschikbaar}
                >
                    {vergaderzaal.beschikbaar ? 'Reserveren' : 'Bezet'}
                </button>
            </div>
        </div>
    );
}