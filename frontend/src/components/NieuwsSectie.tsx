// frontend/src/components/NieuwsSectie.tsx - WERKENDE COMPONENT
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaNewspaper } from 'react-icons/fa';
import { FiCalendar, FiUser } from 'react-icons/fi';

interface Nieuws {
    id: number;
    attributes: {
        titel: string;
        samenvatting: string;
        createdAt: string;
        auteur: string;
        afbeelding?: {
            data?: {
                attributes: {
                    url: string;
                }
            }
        }
    };
}

export default function NieuwsSectie() {
    const [nieuws, setNieuws] = useState<Nieuws[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNieuws = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/nieuws-items?populate=*&sort=createdAt:desc&pagination[limit]=3`);
                if (response.ok) {
                    const data = await response.json();
                    setNieuws(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching nieuws:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNieuws();
    }, []);

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

    const getImageUrl = (item: Nieuws) => {
        const imageUrl = item.attributes.afbeelding?.data?.attributes?.url;
        return imageUrl ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${imageUrl}` : '/images/placeholder.svg';
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
                            </div>
                        </div>
                    ))}
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
                {nieuws.map(item => (
                    <div key={item.id} className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-20 h-16 relative flex-shrink-0">
                            <Image
                                src={getImageUrl(item)}
                                alt={item.attributes.titel}
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-sm mb-1 line-clamp-2">
                                {item.attributes.titel}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500 mb-2">
                                <FiCalendar className="mr-1" />
                                <span>{formatDatum(item.attributes.createdAt)}</span>
                                <span className="mx-2">•</span>
                                <FiUser className="mr-1" />
                                <span>{item.attributes.auteur}</span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                                {item.attributes.samenvatting}
                            </p>
                            <Link
                                href={`/nieuws/${item.id}`}
                                className="text-accent text-xs hover:underline mt-1 inline-block"
                            >
                                Lees meer
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {nieuws.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <FaNewspaper className="mx-auto mb-2" size={24} />
                    <p>Geen nieuwsberichten beschikbaar</p>
                </div>
            )}
        </section>
    );
}