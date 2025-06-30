// frontend/src/components/KalenderSectie.tsx - WERKENDE COMPONENT
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt } from 'react-icons/fa';
import { FiClock, FiMapPin } from 'react-icons/fi';

interface Evenement {
    id: number;
    attributes: {
        titel: string;
        startDatum: string;
        eindDatum: string;
        locatie?: string;
        type: string;
    };
}

export default function KalenderSectie() {
    const [evenementen, setEvenementen] = useState<Evenement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvenementen = async () => {
            try {
                const today = new Date();
                const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/evenementen?` +
                    `filters[startDatum][$gte]=${today.toISOString()}&` +
                    `filters[startDatum][$lte]=${nextWeek.toISOString()}&` +
                    `sort=startDatum:asc&` +
                    `pagination[limit]=5`
                );

                if (response.ok) {
                    const data = await response.json();
                    setEvenementen(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching evenementen:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvenementen();
    }, []);

    const formatDatum = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('nl-NL', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
        } catch {
            return 'Onbekende datum';
        }
    };

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

    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <FaCalendarAlt className="text-primary mr-2" />
                    Aankomende evenementen
                </h2>
                <Link href="/kalender" className="text-accent hover:underline text-sm">
                    Volledige kalender
                </Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {evenementen.length > 0 ? (
                        evenementen.map(event => (
                            <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                                <div className="text-center min-w-[60px]">
                                    <div className="text-xs text-gray-500">
                                        {formatDatum(event.attributes.startDatum)}
                                    </div>
                                    <div className="text-sm font-medium">
                                        {formatTijd(event.attributes.startDatum)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm mb-1">{event.attributes.titel}</h3>
                                    {event.attributes.locatie && (
                                        <div className="flex items-center text-xs text-gray-600">
                                            <FiMapPin className="mr-1" />
                                            <span>{event.attributes.locatie}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <FaCalendarAlt className="mx-auto mb-2" size={24} />
                            <p>Geen evenementen gepland</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
