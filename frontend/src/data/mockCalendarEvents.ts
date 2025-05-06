// src/data/mockCalendarEvents.ts
import { Evenement } from '@/types/index';

// Helper functie om een datum-tijd string te maken
export function createDateTimeString(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0
): string {
    // Maand in JavaScript Date is 0-gebaseerd (0 = januari, 11 = december)
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toISOString();
}

// Helper functie om een leesbare datum string te maken
export function formatDateString(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Huidige datum informatie
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // JavaScript maanden zijn 0-gebaseerd

// Genereer evenementen voor deze maand
export const kalenderEvenementen: Evenement[] = [
    {
        id: 1,
        titel: 'Maandelijkse teammeeting',
        datum: formatDateString(createDateTimeString(currentYear, currentMonth, 5)),
        startTijd: '09:00',
        eindTijd: '10:30',
        locatie: 'Vergaderzaal 1',
        type: 'vergadering',
        beschrijving: 'Bespreking van de voortgang van lopende projecten'
    },
    {
        id: 2,
        titel: 'Verjaardag Lisa',
        datum: formatDateString(createDateTimeString(currentYear, currentMonth, 8)),
        startTijd: '15:00',
        eindTijd: '16:00',
        locatie: 'Kantine',
        type: 'verjaardag',
        beschrijving: 'Taart en koffie voor de verjaardag van Lisa'
    },
    {
        id: 3,
        titel: 'Klantpresentatie XYZ Corp',
        datum: formatDateString(createDateTimeString(currentYear, currentMonth, 12)),
        startTijd: '14:00',
        eindTijd: '16:00',
        locatie: 'Presentatiezaal',
        type: 'presentatie',
        beschrijving: 'Presentatie van nieuwe functionaliteiten aan XYZ Corp'
    },
    {
        id: 4,
        titel: 'Vrijdagmiddagborrel',
        datum: formatDateString(createDateTimeString(currentYear, currentMonth, 15)),
        startTijd: '16:30',
        eindTijd: '18:30',
        locatie: 'Kantine',
        type: 'sociaal',
        beschrijving: 'Informele borrel met het team'
    },
    {
        id: 5,
        titel: 'Projectoplevering',
        datum: formatDateString(createDateTimeString(currentYear, currentMonth, 20)),
        startTijd: '11:00',
        eindTijd: '12:30',
        locatie: 'Vergaderzaal 2',
        type: 'vergadering',
        beschrijving: 'Finale oplevering van Project Alpha'
    },
    {
        id: 6,
        titel: 'Trainingssessie',
        datum: formatDateString(createDateTimeString(currentYear, currentMonth, 22)),
        startTijd: '09:30',
        eindTijd: '16:30',
        locatie: 'Trainingsruimte',
        type: 'anders',
        beschrijving: 'Hele dag training nieuwe methodieken'
    },
    {
        id: 7,
        titel: 'Strategische planning Q3',
        datum: formatDateString(createDateTimeString(currentYear, currentMonth, 27)),
        startTijd: '10:00',
        eindTijd: '12:00',
        locatie: 'Boardroom',
        type: 'vergadering',
        beschrijving: 'Strategische planning voor het derde kwartaal'
    }
];

// Export een functie die evenementen voor een specifieke maand genereert
export function getEvenementenVoorMaand(jaar: number, maand: number): Evenement[] {
    // Zorg ervoor dat we altijd geldige data gebruiken
    if (maand < 1 || maand > 12) {
        throw new Error('Ongeldige maand. Maand moet tussen 1 en 12 liggen.');
    }

    // Clone het base-array
    const evenementen: Evenement[] = [];

    // Genereer basis evenementen voor elke maand
    evenementen.push({
        id: maand * 100 + 1,
        titel: `Teammeeting ${maand}/${jaar}`,
        datum: formatDateString(createDateTimeString(jaar, maand, 5)),
        startTijd: '09:00',
        eindTijd: '10:30',
        locatie: 'Vergaderzaal 1',
        type: 'vergadering',
        beschrijving: 'Maandelijkse teammeeting'
    });

    evenementen.push({
        id: maand * 100 + 2,
        titel: `Project review ${maand}/${jaar}`,
        datum: formatDateString(createDateTimeString(jaar, maand, 15)),
        startTijd: '14:00',
        eindTijd: '16:00',
        locatie: 'Vergaderzaal 2',
        type: 'vergadering',
        beschrijving: 'Review van lopende projecten'
    });

    // Voeg speciale evenementen toe voor specifieke maanden
    if (maand === 1) {
        evenementen.push({
            id: maand * 100 + 3,
            titel: 'Nieuwjaarsborrel',
            datum: formatDateString(createDateTimeString(jaar, maand, 10)),
            startTijd: '16:00',
            eindTijd: '20:00',
            locatie: 'Centrale hal',
            type: 'sociaal',
            beschrijving: 'Nieuwjaarsreceptie met hapjes en drankjes'
        });
    } else if (maand === 4) {
        evenementen.push({
            id: maand * 100 + 3,
            titel: 'Voorjaarsuitje',
            datum: formatDateString(createDateTimeString(jaar, maand, 20)),
            startTijd: '13:00',
            eindTijd: '18:00',
            locatie: 'Stadspark',
            type: 'sociaal',
            beschrijving: 'Jaarlijks voorjaarsuitje met het team'
        });
    } else if (maand === 12) {
        evenementen.push({
            id: maand * 100 + 3,
            titel: 'Kerstborrel',
            datum: formatDateString(createDateTimeString(jaar, maand, 18)),
            startTijd: '17:00',
            eindTijd: '22:00',
            locatie: 'Grand Café',
            type: 'sociaal',
            beschrijving: 'Jaarlijkse kerstborrel met diner'
        });
    }

    return evenementen;
}

// Helper functie om alle evenementen voor het huidige jaar te genereren
export function getAlleEvenementenVoorJaar(jaar: number): Evenement[] {
    let alleEvenementen: Evenement[] = [];

    for (let maand = 1; maand <= 12; maand++) {
        alleEvenementen = alleEvenementen.concat(getEvenementenVoorMaand(jaar, maand));
    }

    return alleEvenementen;
}