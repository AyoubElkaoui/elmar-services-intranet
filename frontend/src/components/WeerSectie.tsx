"use client";

import React, { useState, useEffect } from 'react';

interface WeerData {
    temperatuur: number;
    beschrijving: string;
    emoji: string;
    vochtigheid: number;
    wind: number;
    voorspelling: {
        dag: string;
        temp: number;
        emoji: string;
    }[];
}

const mockWeerData: WeerData = {
    temperatuur: 12,
    beschrijving: 'Bewolkt',
    emoji: '☁️',
    vochtigheid: 65,
    wind: 15,
    voorspelling: [
        { dag: 'Ma', temp: 14, emoji: '🌤️' },
        { dag: 'Di', temp: 16, emoji: '☀️' },
        { dag: 'Wo', temp: 13, emoji: '🌧️' },
        { dag: 'Do', temp: 15, emoji: '⛅' }
    ]
};

export default function WeerSectie() {
    const [weer, setWeer] = useState<WeerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuleer API call
        setTimeout(() => {
            setWeer(mockWeerData);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-lg">🌤️</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Weer</h2>
                </div>
                <div className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex-1 h-16 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!weer) return null;

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-lg">🌤️</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Weer</h2>
            </div>

            {/* Huidige weer */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-blue-900 mb-1">
                            {weer.temperatuur}°C
                        </div>
                        <div className="text-blue-700 font-medium">
                            {weer.beschrijving}
                        </div>
                        <div className="text-xs text-blue-600 mt-2">
                            Amersfoort
                        </div>
                    </div>
                    <div className="text-6xl">
                        {weer.emoji}
                    </div>
                </div>

                {/* Details */}
                <div className="flex justify-between mt-4 pt-4 border-t border-blue-200">
                    <div className="text-center">
                        <div className="text-xs text-blue-600 mb-1">💧 Vochtigheid</div>
                        <div className="font-semibold text-blue-900">{weer.vochtigheid}%</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-blue-600 mb-1">💨 Wind</div>
                        <div className="font-semibold text-blue-900">{weer.wind} km/h</div>
                    </div>
                </div>
            </div>

            {/* Voorspelling */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Komende dagen</h3>
                <div className="grid grid-cols-4 gap-2">
                    {weer.voorspelling.map((dag, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-xs font-medium text-gray-600 mb-2">
                                {dag.dag}
                            </div>
                            <div className="text-2xl mb-2">
                                {dag.emoji}
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                                {dag.temp}°
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}