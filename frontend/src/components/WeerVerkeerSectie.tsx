// src/components/WeerVerkeerSectie.tsx
import WeerVerkeerWidget from '@/components/ui/WeerVerkeerWidget';
import { mockWeerData, mockVerkeerData } from '@/data/mockWeerVerkeer';

export default function WeerVerkeerSectie() {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Weer & Verkeer</h2>
            <WeerVerkeerWidget
                weerInfo={mockWeerData}
                verkeerInfo={mockVerkeerData}
            />
        </div>
    );
}