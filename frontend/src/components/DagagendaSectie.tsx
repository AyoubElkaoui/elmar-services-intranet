"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { kalenderAPI, type KalenderEvenement, APIError } from '@/lib/strapiApi';

export default function DagagendaSectie() {
    const [evenementen, setEvenementen] = useState<KalenderEvenement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDagagenda();
    }, []);

    const fetchDagagenda = async () => {
        try {
            setLoading(true);
            setError(null);

            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const response = await kalenderAPI.getAll({
                startDatum: today.toISOString().split('T')[0],
                eindDatum: tomorrow.toISOString().split('T')[0],
                sort: 'startDatum:asc'
            });

            setEvenementen(response.data);
        } catch (error) {
            console.error('Error fetching dagagenda:', error);
            if (error instanceof APIError) {
                if (error.status === 0) {
                    setError('Geen verbinding');
                } else {
                    setError('Fout bij laden');
                }
            } else {
                setError('Onbekende fout');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatTijd = () => {
        // Voor demo purposes, omdat startDatum alleen datum is
        return '09:00';
    };

    const isToday = (dateString: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateString === today;
    };

    const getCategoryColor = (categorie: string) => {
        const colors = {
            'Meeting': 'bg-blue-100 text-blue-800',
            'Training': 'bg-green-100 text-green-800',
            'Event': 'bg-purple-100 text-purple-800',
            'Deadline': 'bg-red-100 text-red-800'
        };
        return colors[categorie as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <FiCalendar className="text-primary mr-2" />
                    Vandaag
                </h2>
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <FiCalendar className="text-primary mr-2" />
                    Vandaag
                </h2>
                <div className="text-center py-6">
                    <FiCalendar className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-red-600 text-sm mb-3">{error}</p>
                    <button
                        onClick={fetchDagagenda}
                        className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark"
                    >
                        Opnieuw
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                    <FiCalendar className="text-primary mr-2" />
                    Vandaag
                </h2>
                <Link href="/kalender" className="text-accent hover:underline text-sm">
                    Kalender
                </Link>
            </div>

            <div className="space-y-3">
                {evenementen.length > 0 ? (
                    evenementen.map(event => (
                        <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm mb-1">{event.titel}</h3>
                                    <div className="flex items-center text-xs text-gray-600 mb-2">
                                        <FiClock className="mr-1" />
                                        <span className="mr-3">{formatTijd()}</span>
                                        {event.locatie && (
                                            <>
                                                <FiMapPin className="mr-1" />
                                                <span>{event.locatie}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(event.categorie)}`}>
                                            {event.categorie}
                                        </span>
                                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                            {event.afdeling}
                                        </span>
                                    </div>
                                </div>
                                {isToday(event.startDatum) && (
                                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FiCalendar className="mx-auto mb-2" size={24} />
                        <p className="text-sm">Geen evenementen vandaag</p>
                    </div>
                )}
            </div>
        </section>
    );
}