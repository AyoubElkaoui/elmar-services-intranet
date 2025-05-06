"use client";

// src/components/ui/PollEnqueteWidget.tsx
import React, { useState } from 'react';
import { formatDatum } from '@/utils/dateUtils';
import { Poll, PollOptie } from '@/types/polls';

// Gebruik PollOptie bij het maken van nieuwe opties
interface PollEnqueteWidgetProps {
    poll: Poll;
}

export default function PollEnqueteWidget({ poll }: PollEnqueteWidgetProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [localPoll, setLocalPoll] = useState<Poll>(poll);

    // Functie om de UI bij te werken na het stemmen
    const handleVote = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedOptionId === null) return;

        // Maak een nieuwe PollOptie array met bijgewerkte stemmen
        const updatedOptions = localPoll.opties.map(optie => {
            if (optie.id === selectedOptionId) {
                // Gebruik de PollOptie interface voor het bijgewerkte object
                const updatedOption: PollOptie = {
                    ...optie,
                    aantalStemmen: optie.aantalStemmen + 1
                };
                return updatedOption;
            }
            return optie;
        });

        // Bereken nieuwe percentages
        const totalVotes = updatedOptions.reduce((sum, option) => sum + option.aantalStemmen, 0);
        const optionsWithPercentages = updatedOptions.map(option => ({
            ...option,
            percentage: Math.round((option.aantalStemmen / totalVotes) * 100)
        }));

        // Update de lokale poll state
        setLocalPoll({
            ...localPoll,
            opties: optionsWithPercentages,
            aantalStemmen: totalVotes
        });

        setHasVoted(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-2">{localPoll.vraag}</h3>
            <p className="text-sm text-gray-600 mb-4">
                Sluit op {formatDatum(localPoll.eindDatum)} • {localPoll.aantalStemmen} stemmen
            </p>

            {hasVoted ? (
                // Resultaten view
                <div className="space-y-3">
                    {localPoll.opties.map(optie => (
                        <div key={optie.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>{optie.tekst}</span>
                                <span className="font-medium">{optie.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${optie.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    <p className="text-sm text-gray-600 mt-2 italic">
                        Bedankt voor je stem!
                    </p>
                </div>
            ) : (
                // Stem formulier
                <form onSubmit={handleVote}>
                    <div className="space-y-2 mb-4">
                        {localPoll.opties.map(optie => (
                            <label
                                key={optie.id}
                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="poll-option"
                                    value={optie.id}
                                    onChange={() => setSelectedOptionId(optie.id)}
                                    className="mr-3"
                                />
                                <span>{optie.tekst}</span>
                            </label>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={selectedOptionId === null}
                        className={`w-full py-2 rounded text-center ${
                            selectedOptionId === null
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                    >
                        Stem
                    </button>
                </form>
            )}
        </div>
    );
}