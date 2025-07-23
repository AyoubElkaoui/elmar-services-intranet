"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { nieuwsAPI, type Nieuws, APIError } from '@/lib/strapiApi';

// Mock data als fallback
const mockNieuws: Nieuws[] = [
    {
        id: 1,
        documentId: 'news-1',
        titel: 'Nieuwe HR-richtlijnen voor 2025',
        samenvatting: 'Belangrijke updates voor het personeelsbeleid en nieuwe procedures die vanaf januari ingaan.',
        publicatieDatum: new Date().toISOString(),
        Auteur: 'HR Team',
        Categorie: 'HR',
        Uitgelicht: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
    },
    {
        id: 2,
        documentId: 'news-2',
        titel: 'IT Systeem onderhoud gepland',
        samenvatting: 'Geplande onderhoudsworkzaamheden aan onze IT-infrastructuur dit weekend.',
        publicatieDatum: new Date(Date.now() - 86400000).toISOString(),
        Auteur: 'Peter Bakker',
        Categorie: 'IT',
        Uitgelicht: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
    },
    {
        id: 3,
        documentId: 'news-3',
        titel: 'Nieuwe marketingcampagne gelanceerd',
        samenvatting: 'Onze nieuwste marketingcampagne is live gegaan met focus op duurzaamheid.',
        publicatieDatum: new Date(Date.now() - 172800000).toISOString(),
        Auteur: 'Sophie de Jong',
        Categorie: 'Marketing',
        Uitgelicht: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
    }
];

export default function NieuwsSectie() {
    const [nieuws, setNieuws] = useState<Nieuws[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [useMockData, setUseMockData] = useState(false);

    useEffect(() => {
        fetchNieuws();
    }, []);

    const fetchNieuws = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await nieuwsAPI.getAll({
                pageSize: 5,
                page: 1
            });
            setNieuws(response.data);
            setUseMockData(false);
        } catch (error) {
            console.error('Error fetching nieuws:', error);
            // Use mock data as fallback
            setNieuws(mockNieuws);
            setUseMockData(true);
            setError('Gebruik demo gegevens');
        } finally {
            setLoading(false);
        }
    };

    const getRelativeTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

            if (diffInHours < 1) return 'Net geplaatst';
            if (diffInHours < 24) return `${diffInHours}u geleden`;
            if (diffInHours < 48) return 'Gisteren';
            return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
        } catch {
            return 'Onbekend';
        }
    };

    const getCategoryColor = (categorie: string) => {
        const colors = {
            'Algemeen': 'bg-blue-100 text-blue-800',
            'HR': 'bg-green-100 text-green-800',
            'IT': 'bg-purple-100 text-purple-800',
            'Marketing': 'bg-pink-100 text-pink-800',
            'Verkoop': 'bg-orange-100 text-orange-800'
        };
        return colors[categorie as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-blue-600 text-xl">📰</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Laatste Nieuws</h2>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-blue-600 text-xl">📰</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Laatste Nieuws</h2>
                        {useMockData && (
                            <p className="text-xs text-amber-600 mt-1">Demo modus - Strapi niet verbonden</p>
                        )}
                    </div>
                </div>
                <Link
                    href="/nieuws"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Alle nieuws →
                </Link>
            </div>

            <div className="space-y-6">
                {nieuws.length > 0 ? (
                    nieuws.map((artikel) => (
                        <article key={artikel.id} className="group">
                            <Link href={`/nieuws/${artikel.documentId}`} className="block">
                                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex-shrink-0">
                                        {artikel.afbeelding?.url ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${artikel.afbeelding.url}`}
                                                alt={artikel.afbeelding.alternativeText || artikel.titel}
                                                className="w-16 h-16 object-cover rounded-xl"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                                <span className="text-blue-600 text-2xl">📝</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                            {artikel.titel}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                            {artikel.samenvatting}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-2">⏰</span>
                                                {getRelativeTime(artikel.publicatieDatum)}
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-2">👤</span>
                                                {artikel.Auteur}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(artikel.Categorie)}`}>
                                                {artikel.Categorie}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <div className="text-6xl mb-4">📰</div>
                        <p className="text-lg">Geen nieuws beschikbaar</p>
                    </div>
                )}
            </div>
        </div>
    );
}