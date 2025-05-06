'use client'

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FAQ } from '@/types/faq';

interface FAQItemProps {
    faq: FAQ;
}

export default function FAQItem({ faq }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b last:border-b-0">
            <button
                className="w-full text-left py-3 px-1 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="font-medium text-sm">{faq.vraag}</span>
                {isOpen ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
            </button>

            {isOpen && (
                <div className="py-2 px-1 pb-4 text-sm text-gray-600">
                    <p>{faq.antwoord}</p>
                </div>
            )}
        </div>
    );
}