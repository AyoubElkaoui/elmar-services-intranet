"use client";

import React from 'react';
import Link from 'next/link';

const snelkoppelingen = [
    {
        id: 1,
        titel: 'Personeelszaken',
        beschrijving: 'Verlof, declaraties, handboek',
        href: '/personeelszaken',
        emoji: '👥',
        color: 'from-blue-500 to-blue-600',
        hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
        id: 2,
        titel: 'IT Support',
        beschrijving: 'Tickets, software, hulp',
        href: '/it-support',
        emoji: '💻',
        color: 'from-purple-500 to-purple-600',
        hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
        id: 3,
        titel: 'Documenten',
        beschrijving: 'Bestanden, handboeken, formulieren',
        href: '/documenten',
        emoji: '📁',
        color: 'from-green-500 to-green-600',
        hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
        id: 4,
        titel: 'Telefoongids',
        beschrijving: 'Contactgegevens medewerkers',
        href: '/telefoongids',
        emoji: '📞',
        color: 'from-orange-500 to-orange-600',
        hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
        id: 5,
        titel: 'Afdelingen',
        beschrijving: 'Teams en organisatie',
        href: '/afdelingen',
        emoji: '🏢',
        color: 'from-red-500 to-red-600',
        hoverColor: 'hover:from-red-600 hover:to-red-700'
    },
    {
        id: 6,
        titel: 'Links',
        beschrijving: 'Externe websites en tools',
        href: '/links',
        emoji: '🔗',
        color: 'from-pink-500 to-pink-600',
        hoverColor: 'hover:from-pink-600 hover:to-pink-700'
    },
    {
        id: 7,
        titel: 'Nieuws',
        beschrijving: 'Laatste updates en berichten',
        href: '/nieuws',
        emoji: '📰',
        color: 'from-indigo-500 to-indigo-600',
        hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
        id: 8,
        titel: 'Kalender',
        beschrijving: 'Evenementen en afspraken',
        href: '/kalender',
        emoji: '📅',
        color: 'from-teal-500 to-teal-600',
        hoverColor: 'hover:from-teal-600 hover:to-teal-700'
    }
];

export default function SnelkoppelingenGrid() {
    return (
        <div>
            <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">⚡</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Snelkoppelingen</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {snelkoppelingen.map(link => (
                    <Link key={link.id} href={link.href} className="group">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-gray-300">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${link.color} ${link.hoverColor} flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110`}>
                                {link.emoji}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {link.titel}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {link.beschrijving}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}