// src/components/ui/SnelkoppelingKaart.tsx
// Update icon imports voor de snelkoppelingen
import Link from 'next/link';
import { Snelkoppeling } from '@/types';
// Geen wijziging nodig - we gebruiken de icons die als ReactNode worden doorgegeven

interface SnelkoppelingKaartProps {
    koppeling: Snelkoppeling;
}

export default function SnelkoppelingKaart({ koppeling }: SnelkoppelingKaartProps) {
    return (
        <Link
            href={koppeling.url}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
            <div className="text-primary mb-2">{koppeling.icoon}</div>
            <span className="text-sm text-center">{koppeling.titel}</span>
        </Link>
    );
}