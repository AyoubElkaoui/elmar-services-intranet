// frontend/src/components/NieuwsSectie.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaNewspaper } from 'react-icons/fa';
import { FiCalendar, FiUser, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { nieuwsAPI, mediaHelpers, contentHelpers, APIError, type NieuwsItem } from '@/lib/strapiApi';

export default function NieuwsSectie() {
    const [nieuws, setNieuws] = useState<NieuwsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retrying, setRetrying] = useState(false);

    const fetchNieuws = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Fetching nieuws from Strapi v5...');
            const response = await nieuwsAPI.getRecent(3);
            console.log('📰 Nieuws received:', response.data?.length || 0, 'items');
            
            setNieuws(response.data || []);
        } catch (error) {
            console.error('❌ Error fetching nieuws:', error);
            
            if (error instanceof APIError) {
                if (error.status === 0) {
                    setError('Kan geen verbinding maken met Strapi. Controleer of Strapi draait op http://localhost:1337');
                } else if (error.status === 404) {
                    setError('Content Type "nieuws-items" bestaat niet in Strapi. Controleer of je het Content Type hebt aangemaakt.');
                } else if (error.status === 403) {
                    setError('Geen toegang tot nieuws API. Controleer de permissions in Strapi Admin.');
                } else {
                    setError(`Fout bij laden van nieuws: ${error.message}`);
                }
            } else {
                setError('Er is een onbekende fout opgetreden bij het laden van het nieuws');
            }
        } finally {
            setLoading(false);
            setRetrying(false);
        }
    };

    useEffect(() => {
        fetchNieuws();
    }, []);

    const handleRetry = async () => {
        setRetrying(true);
        await fetchNieuws();
    };

    const formatDatum = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long'
            });
        } catch {
            return 'Onbekende datum';
        }
    };

    const getImageUrl = (item: NieuwsItem) => {
        return mediaHelpers.getBestImageUrl(item.afbeelding, 'small');
    };

    if (loading) {
        return (
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                    <FaNewspaper className="mr-2" />
                    Laatste nieuws
                </h2>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex space-x-4">
                            <div className="w-20 h-16 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                    <FaNewspaper className="mr-2" />
                    Laatste nieuws
                </h2>
                <div className="space-y-4">
                    <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                        <FiAlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <p className="text-red-800 font-medium">Fout bij laden van nieuws</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={handleRetry}
                            disabled={retrying}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            <FiRefreshCw className={retrying ? 'animate-spin' : ''} />
                            {retrying ? 'Bezig...' : 'Probeer opnieuw'}
                        </button>
                        
                        <a 
                            href="http://localhost:1337/admin" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        >
                            Open Strapi Admin
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary flex items-center">
                    <FaNewspaper className="mr-2" />
                    Laatste nieuws
                </h2>
                <Link href="/nieuws" className="text-accent hover:underline text-sm">
                    Alle nieuws
                </Link>
            </div>

            <div className="space-y-4">
                {nieuws.length > 0 ? (
                    nieuws.map(item => (
                        <div key={item.id} className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="w-20 h-16 relative flex-shrink-0">
                                <Image
                                    src={getImageUrl(item)}
                                    alt={item.titel}
                                    fill
                                    className="object-cover rounded"
                                    sizes="80px"
                                />
                                {item.Uitgelicht && (
                                    <div className="absolute -top-1 -right-1">
                                        <span className="bg-accent text-white text-xs px-1 py-0.5 rounded-full font-bold">
                                            ★
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                                    {item.titel}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <FiCalendar className="mr-1" />
                                    <span>{formatDatum(item.publicatieDatum)}</span>
                                    <span className="mx-2">•</span>
                                    <FiUser className="mr-1" />
                                    <span>{item.Auteur}</span>
                                    <span className="mx-2">•</span>
                                    <span className="capitalize bg-gray-100 px-2 py-0.5 rounded-full">
                                        {item.Categorie}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                    {item.samenvatting}
                                </p>
                                <Link
                                    href={`/nieuws/${item.id}`}
                                    className="text-accent text-xs hover:underline font-medium"
                                >
                                    Lees meer →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FaNewspaper className="mx-auto mb-3" size={32} />
                        <p className="font-medium">Geen nieuwsberichten beschikbaar</p>
                        <p className="text-sm mt-1">Voeg nieuws toe in Strapi om deze sectie te vullen</p>
                        <a 
                            href="http://localhost:1337/admin" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
                        >
                            Open Strapi Admin
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}