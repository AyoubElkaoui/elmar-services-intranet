import Link from 'next/link'
import NieuwsKaart from '@/components/ui/NieuwsKaart'
import { Nieuws } from '@/types'

interface NieuwsSectieProps {
    nieuwsItems: Nieuws[]
}

export default function NieuwsSectie({ nieuwsItems }: NieuwsSectieProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Laatste Nieuws</h2>
                <Link href="/nieuws" className="text-accent hover:underline">
                    Alle nieuws
                </Link>
            </div>

            <div className="space-y-6">
                {nieuwsItems.map((item) => (
                    <NieuwsKaart key={item.id} nieuws={item} />
                ))}
            </div>
        </div>
    )
}