// src/components/ui/PollEnqueteWidget.tsx
'use client'

import { useState } from 'react';
import { Poll, PollOptie, Enquete } from '@/types/polls';
import { formatDatum } from '@/utils/dateUtils';

interface PollEnqueteWidgetProps {
    polls: Poll[];
    enquetes: Enquete[];
}

export default function PollEnqueteWidget({ polls, enquetes }: PollEnqueteWidgetProps) {
    const [activeTab, setActiveTab] = useState<'polls' | 'enquetes'>('polls');
    const [selectedPoll, setSelectedPoll] = useState<Poll>(polls[0]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState<boolean>(false);

    const handleVote = () => {
        if (selectedOption !== null) {
            // Hier zou je normaal een API call doen om de stem te registreren
            console.log(`Stem uitgebracht op optie ${selectedOption} voor poll ${selectedPoll.id}`);
            setHasVoted(true);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex mb-4 border-b">
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'polls' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('polls')}
                >
                    Polls
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'enquetes' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('enquetes')}
                >
                    Enquêtes
                </button>
            </div>

            {activeTab === 'polls' && (
                <div>
                    {polls.length > 0 ? (
                        <>
                            <h3 className="font-medium mb-3">{selectedPoll.vraag}</h3>

                            <div className="space-y-2 mb-4">
                                {selectedPoll.opties.map((optie) => (
                                    <div key={optie.id} className="relative">
                                        <div
                                            className={`p-2 border rounded-md ${hasVoted || !selectedPoll.actief ? 'bg-gray-50' : selectedOption === optie.id ? 'border-accent bg-accent-light/10' : 'hover:border-gray-300 cursor-pointer'}`}
                                            onClick={() => {
                                                if (selectedPoll.actief && !hasVoted) {
                                                    setSelectedOption(optie.id);
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between">
                                                <span className="text-sm">{optie.tekst}</span>
                                                {hasVoted && (
                                                    <span className="text-sm text-gray-600">{optie.percentage}%</span>
                                                )}
                                            </div>

                                            {hasVoted && (
                                                <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-accent rounded-full"
                                                        style={{ width: `${optie.percentage}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!hasVoted && selectedPoll.actief && (
                                <button
                                    onClick={handleVote}
                                    disabled={selectedOption === null}
                                    className={`w-full py-2 text-sm font-medium rounded ${selectedOption !== null ? 'bg-accent text-white hover:bg-accent-dark' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                                >
                                    Stem uitbrengen
                                </button>
                            )}

                            <div className="mt-3 text-xs text-gray-600 flex justify-between">
                                <span>{selectedPoll.aantalStemmen} stemmen uitgebracht</span>
                                <span>Sluit op {formatDatum(selectedPoll.eindDatum)}</span>
                            </div>

                            {polls.length > 1 && (
                                <div className="mt-4 pt-3 border-t">
                                    <p className="text-xs text-gray-600 mb-2">Andere polls:</p>
                                    {polls.filter(p => p.id !== selectedPoll.id).map(poll => (
                                        <button
                                            key={poll.id}
                                            onClick={() => {
                                                setSelectedPoll(poll);
                                                setSelectedOption(null);
                                                setHasVoted(false);
                                            }}
                                            className="text-sm text-primary hover:underline block mb-1"
                                        >
                                            {poll.vraag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-center py-4 text-gray-500">Geen actieve polls op dit moment</p>
                    )}
                </div>
            )}

            {activeTab === 'enquetes' && (
                <div>
                    <h3 className="font-medium mb-3">Actieve enquêtes</h3>

                    {enquetes.length > 0 ? (
                        <div className="space-y-3">
                            {enquetes.map(enquete => (
                                <div key={enquete.id} className="p-3 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium text-sm">{enquete.titel}</h4>
                                        {enquete.ingevuld && (
                                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                        Ingevuld
                      </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">{enquete.beschrijving}</p>
                                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                                        <span>{enquete.aantalVragen} vragen</span>
                                        <span>Deadline: {formatDatum(enquete.deadline)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4 text-gray-500">Geen actieve enquêtes op dit moment</p>
                    )}
                </div>
            )}
        </div>
    );
}