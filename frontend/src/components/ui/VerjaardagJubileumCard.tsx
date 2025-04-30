import Image from 'next/image';
import { FiGift, FiAward } from 'react-icons/fi';
import { formatDatum, isVandaag, isDezeMaand } from '@/utils/dateUtils';
import { VerjaardagJubileum } from '@/types/verjaardag';

interface VerjaardagJubileumCardProps {
    item: VerjaardagJubileum;
}

export default function VerjaardagJubileumCard({ item }: VerjaardagJubileumCardProps) {
    const isToday = isVandaag(item.datum);
    const isThisMonth = isDezeMaand(item.datum);

    return (
        <div className={`flex items-center p-3 rounded-lg ${isToday ? 'bg-blue-50 border border-blue-100' : 'bg-white'}`}>
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                <Image
                    src={item.foto}
                    alt={item.naam}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex-grow">
                <div className="flex items-center">
                    <span className="font-medium text-sm">{item.naam}</span>
                    {isToday && (
                        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Vandaag!
            </span>
                    )}
                </div>
                <p className="text-xs text-gray-600">{item.afdeling}</p>
            </div>

            <div className="flex flex-col items-center">
                {item.type === 'verjaardag' ? (
                    <FiGift className="text-pink-500" size={18} />
                ) : (
                    <FiAward className="text-yellow-500" size={18} />
                )}
                <p className="text-xs mt-1 whitespace-nowrap">
                    {formatDatum(item.datum)}
                </p>
                {item.type === 'verjaardag' && item.leeftijd && (
                    <p className="text-xs text-gray-600">{item.leeftijd} jaar</p>
                )}
                {item.type === 'jubileum' && item.aantalJaren && (
                    <p className="text-xs text-gray-600">{item.aantalJaren} jaar in dienst</p>
                )}
            </div>
        </div>
    );
}