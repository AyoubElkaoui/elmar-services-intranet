// frontend/src/components/VergaderzaalSectie.tsx - WERKENDE COMPONENT
"use client";

import React, { useState, useEffect } from 'react';
import { MdMeetingRoom } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';

interface Vergaderzaal {
    id: number;
    attributes: {
        naam: string;
        capaciteit: number;
        beschrijving?: string;
        actief: boolean;
    };
}

export default function VergaderzaalSectie() {
    const [vergaderzalen, setVergaderzalen] = useState<Vergaderzaal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVergaderzalen = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/vergaderzalen?filters[actief][$eq]=true`);
                if (response.ok) {
                    const data = await response.json();
                    setVergaderzalen(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching vergaderzalen:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVergaderzalen();
    }, []);

    const handleReserveer = (zaalId: number) => {
        // Simpel: redirect naar kalender of toon alert
        alert('Reservering functionaliteit wordt binnenkort toegevoegd!');
    };

    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MdMeetingRoom className="text-primary mr-2" />
                Vergaderzalen
            </h2>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {vergaderzalen.map((zaal) => (
                        <div key={zaal.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div>
                                <h3 className="font-medium">{zaal.attributes.naam}</h3>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FiUsers className="mr-1" />
                                    <span>{zaal.attributes.capaciteit} personen</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleReserveer(zaal.id)}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
                            >
                                Reserveren
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {vergaderzalen.length === 0 && !loading && (
                <div className="text-center py-6 text-gray-500">
                    <MdMeetingRoom className="mx-auto mb-2" size={24} />
                    <p>Geen vergaderzalen beschikbaar</p>
                </div>
            )}
        </section>
    );
}