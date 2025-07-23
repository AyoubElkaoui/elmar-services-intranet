"use client";

import React from 'react';
import Link from 'next/link';

const tools = [
    {
        id: 1,
        naam: 'Email',
        url: 'https://mail.elmarservices.nl',
        emoji: '📧',
        beschrijving: 'Webmail toegang'
    },
    {
        id: 2,
        naam: 'OneDrive',
        url: 'https://onedrive.com',
        emoji: '☁️',
        beschrijving: 'Cloud opslag'
    },
    {
        id: 3,
        naam: 'Teams',
        url: 'https://teams.microsoft.com',
        emoji: '💬',
        beschrijving: 'Video vergaderen'
    },
    {
        id: 4,
        naam: 'CRM',
        url: '/crm',
        emoji: '📊',
        beschrijving: 'Klantbeheer'
    }
];

export default function SnelleToolLinksSectie() {
    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-lg">🔧</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Snelle Tools</h2>
            </div>

            <div className="space-y-3">
                {tools.map(tool => (
                    <Link
                        key={tool.id}
                        href={tool.url}
                        target={tool.url.startsWith('http') ? '_blank' : '_self'}
                        rel={tool.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                        <div className="flex items-center">
                            <div className="text-2xl mr-3">
                                {tool.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-sm">
                                    {tool.naam}
                                </h3>
                                <p className="text-xs text-gray-600">
                                    {tool.beschrijving}
                                </p>
                            </div>
                            <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
                                {tool.url.startsWith('http') ? '↗️' : '→'}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}