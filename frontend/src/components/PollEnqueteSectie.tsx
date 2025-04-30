// src/components/PollEnqueteSectie.tsx
import PollEnqueteWidget from '@/components/ui/PollEnqueteWidget';
import { mockPolls, mockEnquetes } from '@/data/mockPolls';

export default function PollEnqueteSectie() {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Polls & Enquêtes</h2>
            <PollEnqueteWidget
                polls={mockPolls}
                enquetes={mockEnquetes}
            />
        </div>
    );
}