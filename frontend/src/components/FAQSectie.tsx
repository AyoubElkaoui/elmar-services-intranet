import Link from 'next/link';
import FAQItem from '@/components/ui/FAQItem';
import { mockFAQs } from '@/data/mockFAQs';

export default function FAQSectie() {
    // Filter op populaire vragen
    const populaireVragen = mockFAQs.filter(faq => faq.populair);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Veelgestelde vragen</h2>
                <Link href="/faq" className="text-accent hover:underline text-sm">
                    Alle vragen
                </Link>
            </div>

            <div className="space-y-0 divide-y">
                {populaireVragen.map(faq => (
                    <FAQItem key={faq.id} faq={faq} />
                ))}
            </div>

            <div className="mt-4 text-center">
                <Link
                    href="/faq"
                    className="inline-block bg-gray-100 hover:bg-gray-200 text-primary px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                    Meer vragen bekijken
                </Link>
            </div>
        </div>
    );
}