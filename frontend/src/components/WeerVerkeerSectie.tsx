// WeerVerkeerSectie.tsx - WERKENDE COMPONENT
"use client";

import React, { useState } from 'react';
import { FiSun, FiCloud } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';

export default function WeerVerkeerSectie() {
    const [activeTab, setActiveTab] = useState<'weer' | 'verkeer'>('weer');
    const [weerData] = useState({
        temperatuur: 12,
        beschrijving: 'Bewolkt',
        windsnelheid: 15,
        luchtvochtigheid: 75
    });

    const [verkeerData] = useState({
        status: 'goed',
        beschrijving: 'Rustig op de weg',
        files: []
    });

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
                <button
                    className={`flex-1 py-3 px-4 text-center ${
                        activeTab === 'weer' ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('weer')}
                >
                    <FiSun className="inline mr-1" /> Weer
                </button>
                <button
                    className={`flex-1 py-3 px-4 text-center ${
                        activeTab === 'verkeer' ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('verkeer')}
                >
                    <FaCar className="inline mr-1" /> Verkeer
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {activeTab === 'weer' ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Amersfoort</h3>
                                <div className="flex items-center text-gray-600">
                                    <FiCloud className="mr-1" />
                                    <span>{weerData.beschrijving}</span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold">{weerData.temperatuur}°C</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <p>Wind</p>
                                <p>{weerData.windsnelheid} km/u</p>
                            </div>
                            <div>
                                <p>Luchtvochtigheid</p>
                                <p>{weerData.luchtvochtigheid}%</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Verkeerssituatie</h3>
                        <div className="flex items-center mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-600">{verkeerData.beschrijving}</span>
                        </div>
                        <p className="text-sm text-gray-600">Er zijn momenteel geen files gemeld in de regio.</p>
                    </div>
                )}
            </div>
        </div>
    );
}