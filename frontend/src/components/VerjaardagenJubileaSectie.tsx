"use client";

import React, { useState, useEffect } from 'react';

interface MedewerkerData {
    id: number;
    naam: string;
    functie: string;
    afdeling: string;
    datum: string;
    type: 'verjaardag' | 'jubileum';
    jaren?: number;
    avatar?: string;
}

const mockMedewerkers: MedewerkerData[] = [
    {
        id: 1,
        naam: 'Sophie de Jong',
        functie: 'Marketing Manager',
        afdeling: 'Marketing',
        datum: new Date().toISOString().split('T')[0],
        type: 'verjaardag'
    },
    {
        id: 2,
        naam: 'Peter Bakker',
        functie: 'IT Manager',
        afdeling: 'IT',
        datum: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        type: 'jubileum',
        jaren: 5
    },
    {
        id: 3,
        naam: 'Jan Janssen',
        functie: 'Sales Manager',
        afdeling: 'Verkoop',
        datum: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        type: 'verjaardag'
    }
];

export default function VerjaardagenJubileaSectie() {
    const [medewerkers, setMedewerkers] = useState<MedewerkerData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuleer loading
        setTimeout(() => {
            setMedewerkers(mockMedewerkers);
            setLoading(false);
        }, 500);
    }, []);

    const formatDatum = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            if (date.toDateString() === today.toDateString()) {
                return 'Vandaag';
            } else if (date.toDateString() === tomorrow.toDateString()) {
                return 'Morgen';
            } else {
                return date.toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'short'
                });
            }
        } catch {
            return 'Onbekend';
        }
    };

    const getInitials = (naam: string) => {
        return naam.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-pink-600 text-lg">🎉</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Verjaardagen & Jubilea</h2>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-pink-600 text-lg">🎉</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Verjaardagen & Jubilea</h2>
            </div>

            {medewerkers.length > 0 ? (
                <div className="space-y-4">
                    {medewerkers.map(medewerker => (
                        <div key={medewerker.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex-shrink-0">
                                {medewerker.avatar ? (
                                    <img
                                        src={medewerker.avatar}
                                        alt={medewerker.naam}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                        medewerker.type === 'verjaardag'
                                            ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                                            : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                                    }`}>
                                        {getInitials(medewerker.naam)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900 text-sm">
                                        {medewerker.naam}
                                    </h3>
                                    <span className="text-lg">
                                        {medewerker.type === 'verjaardag' ? '🎂' : '🏆'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">
                                    {medewerker.functie} • {medewerker.afdeling}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-700">
                                        {formatDatum(medewerker.datum)}
                                    </span>
                                    {medewerker.type === 'jubileum' && medewerker.jaren && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                                            {medewerker.jaren} jaar
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="text-sm">Geen verjaardagen of jubilea deze week</p>
                </div>
            )}
        </div>
    );
}