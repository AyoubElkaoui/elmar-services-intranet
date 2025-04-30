// src/data/mockVerjaardagen.ts
import { VerjaardagJubileum } from '@/types/verjaardag';

export const mockVerjaardagenJubilea: VerjaardagJubileum[] = [
    {
        id: 1,
        naam: 'Jan Janssen',
        foto: '/images/medewerkers/jan.jpg',
        type: 'verjaardag',
        datum: '2023-03-18',
        afdeling: 'Verkoop',
        leeftijd: 42
    },
    {
        id: 2,
        naam: 'Marloes Visser',
        foto: '/images/medewerkers/marloes.jpg',
        type: 'jubileum',
        datum: '2023-03-25',
        afdeling: 'HR',
        aantalJaren: 10
    },
    {
        id: 3,
        naam: 'Peter Bakker',
        foto: '/images/medewerkers/peter.jpg',
        type: 'verjaardag',
        datum: '2023-04-05',
        afdeling: 'IT',
        leeftijd: 35
    },
    {
        id: 4,
        naam: 'Sophie de Jong',
        foto: '/images/medewerkers/sophie.jpg',
        type: 'verjaardag',
        datum: '2023-04-12',
        afdeling: 'Marketing',
        leeftijd: 29
    }
];