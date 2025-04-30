// src/components/SnelleToolLinksSectie.tsx
import SnelleToolLinks from '@/components/ui/SnelleToolLinks';
import { mockTools } from '@/data/mockTools';

export default function SnelleToolLinksSectie() {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Snelle Links</h2>
            <SnelleToolLinks tools={mockTools} />
        </div>
    );
}
