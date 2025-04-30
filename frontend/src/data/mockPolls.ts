// src/data/mockPolls.ts
import { Poll, Enquete } from '@/types/polls';

export const mockPolls: Poll[] = [
    {
        id: 1,
        vraag: 'Welke dag heeft jouw voorkeur voor de volgende teambuilding?',
        opties: [
            { id: 1, tekst: 'Vrijdag 14 april', aantalStemmen: 8, percentage: 40 },
            { id: 2, tekst: 'Vrijdag 21 april', aantalStemmen: 6, percentage: 30 },
            { id: 3, tekst: 'Vrijdag 28 april', aantalStemmen: 4, percentage: 20 },
            { id: 4, tekst: 'Liever een andere datum', aantalStemmen: 2, percentage: 10 }
        ],
        eindDatum: '2023-03-20',
        aantalStemmen: 20,
        actief: true
    },
    {
        id: 2,
        vraag: 'Welk thema voor de kerstborrel heeft jouw voorkeur?',
        opties: [
            { id: 1, tekst: 'Winter Wonderland', aantalStemmen: 12, percentage: 60 },
            { id: 2, tekst: 'Roaring Twenties', aantalStemmen: 5, percentage: 25 },
            { id: 3, tekst: 'Hollywood Glamour', aantalStemmen: 3, percentage: 15 }
        ],
        eindDatum: '2023-03-31',
        aantalStemmen: 20,
        actief: true
    }
];

export const mockEnquetes: Enquete[] = [
    {
        id: 1,
        titel: 'Medewerkerstevredenheid 2023',
        beschrijving: 'Jaarlijkse enquête over werktevredenheid en bedrijfscultuur',
        deadline: '2023-03-25',
        aantalVragen: 15,
        ingevuld: false
    },
    {
        id: 2,
        titel: 'Evaluatie thuiswerkbeleid',
        beschrijving: 'Feedback over het huidige thuiswerkbeleid',
        deadline: '2023-04-10',
        aantalVragen: 8,
        ingevuld: true
    }
];
