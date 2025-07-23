"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { kalenderAPI, type KalenderEvenement, APIError } from '@/lib/strapiApi';

// Mock data als fallback
const mockEvenementen: KalenderEvenement[] = [
    {
        id: 1,
        documentId: 'event-1',
        titel: 'Teammeeting Marketing',
        startDatum: new Date().toISOString().split('T')[0],
        eindDatum: new Date().toISOString().split('T')[0],
        locatie: 'Vergaderzaal A',
        categorie: 'Meeting',
        afdeling: 'Marketing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
    },
    {
        id: 2,
        documentId: 'event-2',
        titel: 'IT Training Nieuwe Software',
        startDatum: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        eindDatum: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        locatie: 'Online',
        categorie: 'Training',
        afdeling: 'IT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
    },
    {
        id: 3,
        documentId: 'event-3',
        titel: 'Kwartaalcijfers Presentatie',
        startDatum: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        eindDatum: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        locatie: 'Grote Zaal',
        categorie: 'Event',
        afdeling: 'Management',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
    }
];

export default function KalenderSectie() {
    const [evenementen, setEvenementen] = useState<KalenderEvenement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [useMockData, setUseMockData] = useState(false);

    useEffect(() => {
        fetchEvenementen();
    }, []);

    const fetchEvenementen = async () => {
        try {
            setLoading(true);
            setError(null);

            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + 30);

            const response = await kalenderAPI.getAll({
                startDatum: today.toISOString().split('T')[0],
                eindDatum: futureDate.toISOString().split('T')[0]
            });

            setEvenementen(response.data.slice(0, 4));
            setUseMockData(false);
        } catch (error) {
            console.error('Error fetching kalender:', error);
            setEvenementen(mockEvenementen);
            setUseMockData(true);
            setError('Gebruik demo gegevens');
        } finally {
            setLoading(false);
        }
    };

    const formatDatum = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('nl-NL', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
        } catch {
            return 'Onbekend';
        }
    };

    const getCategoryEmoji = (categorie: string) => {
        const emojis = {
            'Meeting': '👥',
            'Training': '📚',
            'Event': '🎉',
            'Deadline': '⏰'
        };
        return emojis[categorie as keyof typeof emojis] || '📅';
    };

    const getCategoryColor = (categorie: string) => {
        const colors = {
            'Meeting': 'bg-blue-50 border-l-blue-400 text-blue-900',
            'Training': 'bg-green-50 border-l-green-400 text-green-900',
            'Event': 'bg-purple-50 border-l-purple-400 text-purple-900',
            'Deadline': 'bg-red-50 border-l-red-400 text-red-900'
        };
        return colors[categorie as keyof typeof colors] || 'bg-gray-50 border-l-gray-400 text-gray-900';
    };

    const isToday = (dateString: string) => {
        const today = new Date().toISOString().split('T')[0];
        return dateString === today;
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-green-600 text-xl">📅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Komende Evenementen</h2>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-20 bg-gray-200 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-green-600 text-xl">📅</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Komende Evenementen</h2>
                        {useMockData && (
                            <p className="text-xs text-amber-600 mt-1">Demo modus - Strapi niet verbonden</p>
                        )}
                    </div>
                </div>
                <Link
                    href="/kalender"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                    Kalender →
                </Link>
            </div>

            <div className="space-y-4">
                {evenementen.length > 0 ? (
                    evenementen.map(event => (
                        <div key={event.id} className={`p-4 rounded-xl border-l-4 transition-all hover:shadow-sm ${getCategoryColor(event.categorie)} ${isToday(event.startDatum) ? 'ring-2 ring-green-200' : ''}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">{getCategoryEmoji(event.categorie)}</span>
                                        <h3 className="font-bold text-lg line-clamp-1">
                                            {event.titel}
                                        </h3>
                                        {isToday(event.startDatum) && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                                                Vandaag
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm mb-3">
                                        <span className="mr-2">📍</span>
                                        <span className="mr-4">{formatDatum(event.startDatum)}</span>
                                        {event.locatie && (
                                            <>
                                                <span className="mr-2">🏢</span>
                                                <span className="truncate">{event.locatie}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-full text-xs bg-white/70 border font-medium">
                                            {event.categorie}
                                        </span>
                                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">
                                            {event.afdeling}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4 flex-shrink-0 text-center">
                                    <div className="text-2xl font-bold">
                                        {new Date(event.startDatum).getDate()}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase font-medium">
                                        {new Date(event.startDatum).toLocaleDateString('nl-NL', { month: 'short' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <div className="text-6xl mb-4">📅</div>
                        <p className="text-lg">Geen evenementen gepland</p>
                    </div>
                )}
            </div>
        </div>
    );
}