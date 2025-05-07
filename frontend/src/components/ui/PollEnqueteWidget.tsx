// src/components/ui/PollEnqueteWidget.tsx
import React, { useState } from 'react';

interface PollOption {
    id: string;
    text: string;
    votes: number;
}

interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    endDate: string;
    totalVotes: number;
}

const mockPoll: Poll = {
    id: '1',
    question: 'Welke dag heeft je voorkeur voor het bedrijfsuitje?',
    options: [
        { id: '1', text: 'Vrijdag 12 juni', votes: 8 },
        { id: '2', text: 'Zaterdag 13 juni', votes: 15 },
        { id: '3', text: 'Vrijdag 19 juni', votes: 7 }
    ],
    endDate: '2023-05-13',
    totalVotes: 30
};

const PollEnqueteWidget: React.FC = () => {
    const [poll] = useState<Poll>(mockPoll);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState<boolean>(false);

    const handleVote = () => {
        if (!selectedOption) return;

        // In a real app, this would call an API to register the vote
        setHasVoted(true);
    };

    const calculatePercentage = (votes: number) => {
        return Math.round((votes / poll.totalVotes) * 100);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <i className="fas fa-chart-bar text-primary mr-2"></i>
                <h2 className="text-xl font-bold text-primary">Poll</h2>
            </div>

            <h3 className="font-medium text-lg mb-2">{poll.question}</h3>
            <p className="text-sm text-gray-600 mb-4">
                Sluit op {new Date(poll.endDate).toLocaleDateString('nl-NL')} • {poll.totalVotes} stemmen
            </p>

            {!hasVoted ? (
                <>
                    <div className="space-y-3 mb-4">
                        {poll.options.map(option => (
                            <div key={option.id} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`option-${option.id}`}
                                    name="poll-option"
                                    className="mr-3"
                                    checked={selectedOption === option.id}
                                    onChange={() => setSelectedOption(option.id)}
                                />
                                <label htmlFor={`option-${option.id}`}>{option.text}</label>
                            </div>
                        ))}
                    </div>

                    <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        disabled={!selectedOption}
                        onClick={handleVote}
                    >
                        Stem
                    </button>
                </>
            ) : (
                <div className="space-y-4">
                    {poll.options.map(option => {
                        const percentage = calculatePercentage(option.votes);
                        return (
                            <div key={option.id}>
                                <div className="flex justify-between mb-1">
                                    <span>{option.text}</span>
                                    <span>{percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}

                    <p className="text-sm text-gray-600 italic mt-4">
                        Bedankt voor je stem!
                    </p>
                </div>
            )}
        </div>
    );
};

export default PollEnqueteWidget;