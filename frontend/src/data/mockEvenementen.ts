// src/data/mockEvenementen.ts
import { Evenement } from '@/types/index';

// Helper functie om datum strings voor evenementen te maken
const createDateString = (dayOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// Mock data voor aankomende evenementen
export const aankomende_evenementen: Evenement[] = [
    {
        id: 1,
        titel: 'Kwartaal presentatie Q2',
        datum: createDateString(15),
        startTijd: '13:00',
        eindTijd: '15:00',
        locatie: 'Grote vergaderzaal',
        type: 'presentatie',
        beschrijving: 'Presentatie van de kwartaalresultaten door het managementteam.'
    },
    {
        id: 2,
        titel: 'Teambuilding activiteit',
        datum: createDateString(23),
        startTijd: '14:00',
        eindTijd: '17:00',
        locatie: 'Stadspark',
        type: 'sociaal',
        beschrijving: 'Outdoor teambuilding activiteiten met de volledige afdeling.'
    },
    {
        id: 3,
        titel: 'Training nieuwe software',
        datum: createDateString(30),
        startTijd: '09:30',
        eindTijd: '12:30',
        locatie: 'Trainingsruimte',
        type: 'vergadering',
        beschrijving: 'Introductie en training voor het nieuwe projectmanagement systeem.'
    },
    {
        id: 4,
        titel: 'Verjaardag Jan Pietersen',
        datum: createDateString(38),
        startTijd: '15:00',
        eindTijd: '16:00',
        locatie: 'Kantine',
        type: 'verjaardag',
        beschrijving: 'Taart en koffie voor de verjaardag van Jan uit de IT-afdeling.'
    },
    {
        id: 5,
        titel: 'Strategisch overleg',
        datum: createDateString(45),
        startTijd: '10:00',
        eindTijd: '12:00',
        locatie: 'Boardroom',
        type: 'vergadering',
        beschrijving: 'Strategische planning voor Q3 en Q4 met het managementteam.'
    }
];

// Mock data voor dagagenda (evenementen voor vandaag)
const huidige_datum = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

export const dagagenda_evenementen: Evenement[] = [
    {
        id: 101,
        titel: 'Stand-up meeting',
        datum: huidige_datum,
        startTijd: '09:00',
        eindTijd: '09:30',
        locatie: 'Teams',
        type: 'vergadering',
        beschrijving: 'Dagelijkse stand-up meeting met het ontwikkelteam'
    },
    {
        id: 102,
        titel: 'Client meeting - ABC Corp',
        datum: huidige_datum,
        startTijd: '11:00',
        eindTijd: '12:00',
        locatie: 'Vergaderzaal 2',
        type: 'vergadering',
        beschrijving: 'Voortgangsbespreking met ABC Corp over lopend project'
    },
    {
        id: 103,
        titel: 'Lunch & Learn: Docker',
        datum: huidige_datum,
        startTijd: '12:30',
        eindTijd: '13:30',
        locatie: 'Kantine',
        type: 'presentatie',
        beschrijving: 'Informele presentatie over Docker tijdens de lunch'
    },
    {
        id: 104,
        titel: 'Projectplanning Q3',
        datum: huidige_datum,
        startTijd: '14:00',
        eindTijd: '15:30',
        locatie: 'Vergaderzaal 1',
        type: 'vergadering',
        beschrijving: 'Planning van projecten voor het derde kwartaal'
    }
];

// Helper functie om evenementen voor een specifieke datum te krijgen
export function getEvenementenVoorDatum(datumString: string): Evenement[] {
    const alleEvenementen = [...aankomende_evenementen, ...dagagenda_evenementen];
    return alleEvenementen.filter(event => event.datum === datumString);
}

// Helper functie om evenementen voor de huidige week te krijgen
export function getEvenementenVoorDezeWeek(): Evenement[] {
    const nu = new Date();
    const startVanWeek = new Date(nu);
    const dagVanWeek = nu.getDay() || 7; // 0 is zondag, maak er 7 van
    startVanWeek.setDate(nu.getDate() - dagVanWeek + 1); // Maandag

    const eindVanWeek = new Date(startVanWeek);
    eindVanWeek.setDate(startVanWeek.getDate() + 6); // Zondag

    const alleEvenementen = [...aankomende_evenementen, ...dagagenda_evenementen];

    return alleEvenementen.filter(event => {
        const eventDatum = new Date(event.datum.split(' ').reverse().join('-'));
        return eventDatum >= startVanWeek && eventDatum <= eindVanWeek;
    });
}