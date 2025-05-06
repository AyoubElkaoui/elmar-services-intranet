"use client";

import React from 'react';
import { FaNewspaper } from 'react-icons/fa';
import Link from 'next/link';
import NieuwsKaart from '@/components/ui/NieuwsKaart';
import { Nieuws } from '@/types';

interface NieuwsSectieProps {
    nieuwsItems: Nieuws[];
}

export default function NieuwsSectie({ nieuwsItems }: NieuwsSectieProps) {
    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary flex items-center">
                    <FaNewspaper className="mr-2" />
                    Laatste nieuws
                </h2>
                <Link href="/nieuws" className="text-accent hover:underline text-sm">
                    Alle nieuwsberichten
                </Link>
            </div>

            <div className="space-y-6">
                {nieuwsItems.map(nieuwsItem => (
                    <NieuwsKaart key={nieuwsItem.id} nieuws={nieuwsItem} />
                ))}
            </div>
        </section>
    );
}