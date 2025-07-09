import Link from 'next/link'
import EvenementKaart from '@/components/ui/EvenementKaart'
import { Evenement } from '@/types'

interface KalenderWidgetProps {
    evenementen: Evenement[]
}

export default function KalenderWidget({ evenementen }: KalenderWidgetProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Kalender</h2>
                <Link href="/kalender" className="text-accent hover:underline text-sm">
                    Volledige kalender
                </Link>
            </div>

            <div className="space-y-3">
                {evenementen.map((evenement) => (
                    <EvenementKaart key={evenement.id} evenement={evenement} />
                ))}
            </div>
        </div>
    )
}