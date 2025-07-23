
"use client";

import React from 'react';

export default function WelkomstBanner() {
    const currentTime = new Date();
    const hour = currentTime.getHours();

    const getGreeting = () => {
        if (hour < 6) return { text: 'Goedenacht', emoji: '🌙', color: 'from-indigo-500 to-purple-600' };
        if (hour < 12) return { text: 'Goedemorgen', emoji: '☀️', color: 'from-amber-400 to-orange-500' };
        if (hour < 17) return { text: 'Goedemiddag', emoji: '☕', color: 'from-orange-400 to-red-500' };
        if (hour < 22) return { text: 'Goedenavond', emoji: '🌅', color: 'from-red-400 to-pink-500' };
        return { text: 'Goedenacht', emoji: '🌙', color: 'from-indigo-500 to-purple-600' };
    };

    const greeting = getGreeting();

    const formatDate = () => {
        return currentTime.toLocaleDateString('nl-NL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${greeting.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {greeting.emoji}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {greeting.text}!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Welkom bij het Elmar Services intranet
                    </p>
                </div>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatTime()}
                </div>
                <div className="text-gray-600">
                    {formatDate()}
                </div>
            </div>
        </div>
    );
}