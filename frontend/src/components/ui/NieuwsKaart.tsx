import Image from 'next/image'
import Link from 'next/link'
import { formateerDatum } from '@/utils/helpers'
import { Nieuws } from '@/types'

interface NieuwsKaartProps {
    nieuws: Nieuws
}

export default function NieuwsKaart({ nieuws }: NieuwsKaartProps) {
    return (
        <div className="flex flex-col md:flex-row border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-4">
                <div className="relative h-40 md:h-24 bg-gray-200 rounded overflow-hidden">
                    <Image
                        src={nieuws.afbeelding}
                        alt={nieuws.titel}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                    />
                </div>
            </div>
            <div className="w-full md:w-3/4">
                <h3 className="font-bold text-lg mb-1">{nieuws.titel}</h3>
                <p className="text-sm text-gray-500 mb-2">{formateerDatum(nieuws.datum)}</p>
                <p className="text-gray-600">{nieuws.samenvatting}</p>
                <Link href={`/nieuws/${nieuws.id}`} className="text-accent text-sm hover:underline mt-2 inline-block">
                    Lees meer
                </Link>
            </div>
        </div>
    )
}