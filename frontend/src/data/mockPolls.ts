// src/data/mockPolls.ts
import { Poll, Enquete } from '@/types/polls';

export const mockPolls: Poll[] = [
    {
        id: 1,
        vraag: 'Welke dag heeft je voorkeur voor het bedrijfsuitje?',
        opties: [
            {
                id: 1,
                tekst: 'Vrijdag 12 juni',
                aantalStemmen: 15,
                percentage: 50
            },
            {
                id: 2,
                tekst: 'Zaterdag 13 juni',
                aantalStemmen: 10,
                percentage: 33
            },
            {
                id: 3,
                tekst: 'Vrijdag 19 juni',
                aantalStemmen: 5,
                percentage: 17
            }
        ],
        eindDatum: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        aantalStemmen: 30,
        actief: true
    },
    {
        id: 2,
        vraag: 'Welk thema zou je willen voor de eindejaarsborrel?',
        opties: [
            {
                id: 1,
                tekst: 'Winter Wonderland',
                aantalStemmen: 8,
                percentage: 40
            },
            {
                id: 2,
                tekst: 'Casino Royale',
                aantalStemmen: 5,
                percentage: 25
            },
            {
                id: 3,
                tekst: 'Hollywood Glamour',
                aantalStemmen: 4,
                percentage: 20
            },
            {
                id: 4,
                tekst: 'Jaren 80',
                aantalStemmen: 3,
                percentage: 15
            }
        ],
        eindDatum: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        aantalStemmen: 20,
        actief: true
    }
];

export const mockEnquetes: Enquete[] = [
    {
        id: 1,
        titel: 'Werknemerstevredenheid',
        beschrijving: 'Help ons om de werkomgeving te verbeteren',
        vragen: 10,
        eindDatum: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        url: '/enquetes/werknemerstevredenheid'
    },
    {
        id: 2,
        titel: 'Evaluatie nieuwe software',
        beschrijving: 'Geef je feedback over het nieuwe documentbeheersysteem',
        vragen: 5,
        eindDatum: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        url: '/enquetes/software-evaluatie'
    }
];

// Helper functie om een stem toe te voegen aan een poll
export function stemOpPollOptie(pollId: number, optieId: number): Poll {
    // Vind de poll
    const pollIndex = mockPolls.findIndex(poll => poll.id === pollId);
    if (pollIndex === -1) throw new Error('Poll niet gevonden');

    const poll = { ...mockPolls[pollIndex] };

    // Vind de optie
    const optieIndex = poll.opties.findIndex(optie => optie.id === optieId);
    if (optieIndex === -1) throw new Error('Optie niet gevonden');

    // Update de stem
    const bijgewerkeOpties = [...poll.opties];
    bijgewerkeOpties[optieIndex] = {
        ...bijgewerkeOpties[optieIndex],
        aantalStemmen: bijgewerkeOpties[optieIndex].aantalStemmen + 1
    };

    // Bereken nieuwe percentages
    const totaalStemmen = bijgewerkeOpties.reduce((sum, optie) => sum + optie.aantalStemmen, 0);
    const optiesMetPercentages = bijgewerkeOpties.map(optie => ({
        ...optie,
        percentage: Math.round((optie.aantalStemmen / totaalStemmen) * 100)
    }));

    // Update de poll
    const bijgewerktePoll = {
        ...poll,
        opties: optiesMetPercentages,
        aantalStemmen: totaalStemmen
    };

    // In een echte applicatie zou je dit opslaan in een database
    mockPolls[pollIndex] = bijgewerktePoll;

    return bijgewerktePoll;
}

// Helper functie om de actieve polls te krijgen
export function getActievePolls(): Poll[] {
    return mockPolls.filter(poll => poll.actief);
}