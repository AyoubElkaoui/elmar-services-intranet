// src/components/ui/DagagendaItem.tsx
// Update icon imports voor de agenda items
'use client'

import { formatTijd } from '@/utils/dateUtils';
// Gebruik van betere icons uit React Icons
import { BsBriefcase, BsPeople, BsGift, BsTrophy, BsCalendarEvent } from 'react-icons/bs';

interface Agendaitem {
    id: number;
    titel: string;
    startTijd: string;
    eindTijd: string;
    type: 'vergadering' | 'verjaardag' | 'presentatie' | 'sociaal' | 'anders';
    locatie?: string;
}

interface DagagendaItemProps {
    item: Agendaitem;
}

export default function DagagendaItem({ item }: DagagendaItemProps) {
    // Kies icoon op basis van evenement type
    const getIcoon = (type: string) => {
        switch(type) {
            case 'vergadering':
                return <BsBriefcase size={18} className="text-blue-500" />;
            case 'verjaardag':
                return <BsGift size={18} className="text-pink-500" />;
            case 'presentatie':
                return <BsTrophy size={18} className="text-purple-500" />;
            case 'sociaal':
                return <BsPeople size={18} className="text-green-500" />;
            default:
                return <BsCalendarEvent size={18} className="text-gray-500" />;
        }
    };

    return (
        <div className="flex items-start p-2 border-l-4 rounded-r-md bg-white mb-2"
             style={{
                 borderLeftColor:
                     item.type === 'vergadering' ? '#3B82F6' :
                         item.type === 'verjaardag' ? '#EC4899' :
                             item.type === 'presentatie' ? '#8B5CF6' :
                                 item.type === 'sociaal' ? '#10B981' :
                                     '#6B7280'
             }}>
            <div className="mr-3 mt-1">
                {getIcoon(item.type)}
            </div>
            <div className="flex-grow">
                <p className="font-medium text-sm">{item.titel}</p>
                <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-600">
                        {formatTijd(item.startTijd)} - {formatTijd(item.eindTijd)}
                    </p>
                    {item.locatie && (
                        <p className="text-xs text-gray-600">{item.locatie}</p>
                    )}
                </div>
            </div>
        </div>
    );
}