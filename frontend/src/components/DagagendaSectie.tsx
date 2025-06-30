// frontend/src/components/DagagendaSectie.tsx - WERKENDE COMPONENT
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

interface AgendaItem {
    id: number;
    attributes: {
        titel: string;
        startDatum: string;
        eindDatum: string;
        locatie?: string;
        type: string;
    };
}

export default function DagagendaSectie() {
    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodayEvents = async () => {
            try {
                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
                const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/evenementen?` +
                    `filters[startDatum][$gte]=${startOfDay}&` +
                    `filters[startDatum][$lte]=${endOfDay}&` +
                    `sort=startDatum:asc`
                );

                if (response.ok) {
                    const data = await response.json();
                    setAgendaItems(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching agenda:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodayEvents();
    }, []);

    const formatTijd = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '--:--';
        }
    };

    const getEventTypeColor = (type: string) => {
        const colors = {
            vergadering: 'border-blue-500 bg-blue-50',
            verjaardag: 'border-pink-500 bg-pink-50',
            presentatie: 'border-purple-500 bg-purple-50',
            sociaal: 'border-green-500 bg-green-50'
        };
        return colors[type as keyof typeof colors] || 'border-gray-500 bg-gray-50';
    };

    const today = new Date();
    const dayName = today.toLocaleDateString('nl-NL', { weekday: 'long' });
    const dayDate = today.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' });

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Agenda Vandaag</h2>
                <Link href="/kalender" className="text-accent hover:underline text-sm">
                    Volledige agenda
                </Link>
            </div>

            <div className="mb-4">
                <p className="text-lg font-medium capitalize">{dayName}</p>
                <p className="text-sm text-gray-600">{dayDate}</p>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {agendaItems.length > 0 ? (
                        agendaItems.map(item => (
                            <div
                                key={item.id}
                                className={`p-3 rounded-lg border-l-4 ${getEventTypeColor(item.attributes.type)}`}
                            >
                                <h3 className="font-medium text-sm mb-1">{item.attributes.titel}</h3>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <div className="flex items-center">
                                        <FiClock className="mr-1" />
                                        <span>
                      {formatTijd(item.attributes.startDatum)} - {formatTijd(item.attributes.eindDatum)}
                    </span>
                                    </div>
                                    {item.attributes.locatie && (
                                        <div className="flex items-center">
                                            <FiMapPin className="mr-1" />
                                            <span>{item.attributes.locatie}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <FiCalendar className="mx-auto mb-2" size={24} />
                            <p>Geen activiteiten gepland voor vandaag</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
