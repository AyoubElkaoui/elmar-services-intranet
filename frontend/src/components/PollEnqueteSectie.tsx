"use client";

// src/components/PollEnqueteSectie.tsx
import React, { useState } from 'react';
import { BiPoll } from 'react-icons/bi';
import { mockPolls } from '@/data/mockPolls';
import { formatDatum } from '@/utils/dateUtils';

export default function PollEnqueteSectie() {
    const activePoll = mockPolls.find(poll => poll.actief);

    // State voor het bijhouden van gekozen optie en of er gestemd is
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    // Functie om stem te verwerken - nu gebruiken we de state variabelen
    const submitVote = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOptionId !== null) {
            // In een echte app zou je hier een API call maken
            console.log(`Stem uitgebracht op optie ${selectedOptionId}`);
            setHasVoted(true);
        }
    };

    if (!activePoll) {
        return (
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <BiPoll className="text-primary mr-2" />
                    Poll
                </h2>
                <p className="text-gray-600">Er is momenteel geen actieve poll beschikbaar.</p>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <BiPoll className="text-primary mr-2" />
                Poll
            </h2>

            <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">{activePoll.vraag}</h3>
                <p className="text-sm text-gray-600">
                    Sluit op {formatDatum(activePoll.eindDatum)} • {activePoll.aantalStemmen} stemmen
                </p>
            </div>

            {hasVoted ? (
                // Resultaten weergeven na stemmen
                <div className="space-y-3">
                    {activePoll.opties.map(optie => (
                        <div key={optie.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>{optie.tekst}</span>
                                <span>{optie.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{ width: `${optie.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    <p className="text-sm text-gray-600 mt-2">
                        Bedankt voor je stem!
                    </p>
                </div>
            ) : (
                // Stem formulier weergeven
                <form onSubmit={submitVote} className="space-y-3">
                    {activePoll.opties.map(optie => (
                        <div key={optie.id} className="flex items-center">
                            <input
                                type="radio"
                                id={`optie-${optie.id}`}
                                name="poll-optie"
                                className="mr-3"
                                onChange={() => setSelectedOptionId(optie.id)}
                            />
                            <label htmlFor={`optie-${optie.id}`}>{optie.tekst}</label>
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={selectedOptionId === null}
                        className={`mt-3 px-4 py-2 rounded ${
                            selectedOptionId === null
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white'
                        }`}
                    >
                        Stem
                    </button>
                </form>
            )}
        </section>
    );
}