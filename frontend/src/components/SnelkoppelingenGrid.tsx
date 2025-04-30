import SnelkoppelingKaart from '@/components/ui/SnelkoppelingKaart'
import { Snelkoppeling } from '@/types'

interface SnelkoppelingenGridProps {
    koppelingen: Snelkoppeling[]
}

export default function SnelkoppelingenGrid({ koppelingen }: SnelkoppelingenGridProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Snelkoppelingen</h2>
            <div className="grid grid-cols-2 gap-4">
                {koppelingen.map((koppeling) => (
                    <SnelkoppelingKaart key={koppeling.id} koppeling={koppeling} />
                ))}
            </div>
        </div>
    )
}