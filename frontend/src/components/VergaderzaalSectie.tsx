"use client";

// src/components/VergaderzaalSectie.tsx
import React, { useState } from 'react';
import { MdMeetingRoom } from 'react-icons/md';
import { mockVergaderzalen } from '@/data/mockVergaderzalen';

interface ReserveringsDialoogProps {
    show: boolean;
    onClose: () => void;
    zaalId: number | null;
}

// Eenvoudige ReserveringsDialoog component
const ReserveringsDialoog: React.FC<ReserveringsDialoogProps> = ({ show, onClose, zaalId }) => {
    if (!show) return null;

    const zaal = mockVergaderzalen.find(z => z.id === zaalId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Reserveer {zaal?.naam}</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block mb-1">Titel vergadering</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded p-2"
                            placeholder="Projectbespreking"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Datum</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Tijd</label>
                            <input
                                type="time"
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded"
                        >
                            Reserveren
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function VergaderzaalSectie() {
    // Nu gebruiken we deze state variabelen daadwerkelijk
    const [showDialoog, setShowDialoog] = useState(false);
    const [geselecteerdeZaalId, setGeselecteerdeZaalId] = useState<number | null>(null);

    // Functie om de dialoog te openen met het geselecteerde zaalId
    const openReserveringsDialoog = (zaalId: number) => {
        setGeselecteerdeZaalId(zaalId);
        setShowDialoog(true);
    };

    // Functie om de dialoog te sluiten
    const sluitDialoog = () => {
        setShowDialoog(false);
        setGeselecteerdeZaalId(null);
    };

    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MdMeetingRoom className="text-primary mr-2" />
                Vergaderzalen
            </h2>

            <div className="space-y-3">
                {mockVergaderzalen.map((zaal) => (
                    <div key={zaal.id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                        <div>
                            <p className="font-medium">{zaal.naam}</p>
                            <p className="text-sm text-gray-600">Capaciteit: {zaal.capaciteit} personen</p>
                        </div>
                        <div>
                            <button
                                onClick={() => openReserveringsDialoog(zaal.id)}
                                className={`px-3 py-1 rounded text-sm ${
                                    zaal.beschikbaar
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={!zaal.beschikbaar}
                            >
                                {zaal.beschikbaar ? 'Reserveren' : 'Bezet'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Voeg de dialoog toe aan het component */}
            <ReserveringsDialoog
                show={showDialoog}
                onClose={sluitDialoog}
                zaalId={geselecteerdeZaalId}
            />
        </section>
    );
}