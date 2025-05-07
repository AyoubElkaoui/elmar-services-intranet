// src/data/mockCalendarEvents.ts
import { Evenement } from '@/types/index';

// Helper function to create a date-time string based on the current month and year
export function createCurrentMonthDateString(day: number): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Generate events for the current month
export const kalenderEvenementen: Evenement[] = [
    {
        id: 1,
        titel: 'Maandelijkse teammeeting',
        datum: createCurrentMonthDateString(5),
        startTijd: '09:00',
        eindTijd: '10:30',
        locatie: 'Vergaderzaal 1',
        type: 'vergadering',
        beschrijving: 'Bespreking van de voortgang van lopende projecten'
    },
    {
        id: 2,
        titel: 'Verjaardag Lisa',
        datum: createCurrentMonthDateString(8),
        startTijd: '15:00',
        eindTijd: '16:00',
        locatie: 'Kantine',
        type: 'verjaardag',
        beschrijving: 'Taart en koffie voor de verjaardag van Lisa'
    },
    {
        id: 3,
        titel: 'Klantpresentatie XYZ Corp',
        datum: createCurrentMonthDateString(12),
        startTijd: '14:00',
        eindTijd: '16:00',
        locatie: 'Presentatiezaal',
        type: 'presentatie',
        beschrijving: 'Presentatie van nieuwe functionaliteiten aan XYZ Corp'
    },
    {
        id: 4,
        titel: 'Vrijdagmiddagborrel',
        datum: createCurrentMonthDateString(15),
        startTijd: '16:30',
        eindTijd: '18:30',
        locatie: 'Kantine',
        type: 'sociaal',
        beschrijving: 'Informele borrel met het team'
    },
    {
        id: 5,
        titel: 'Projectoplevering',
        datum: createCurrentMonthDateString(20),
        startTijd: '11:00',
        eindTijd: '12:30',
        locatie: 'Vergaderzaal 2',
        type: 'vergadering',
        beschrijving: 'Finale oplevering van Project Alpha'
    },
    {
        id: 6,
        titel: 'Trainingssessie',
        datum: createCurrentMonthDateString(22),
        startTijd: '09:30',
        eindTijd: '16:30',
        locatie: 'Trainingsruimte',
        type: 'anders',
        beschrijving: 'Hele dag training nieuwe methodieken'
    },
    {
        id: 7,
        titel: 'Strategische planning Q3',
        datum: createCurrentMonthDateString(27),
        startTijd: '10:00',
        eindTijd: '12:00',
        locatie: 'Boardroom',
        type: 'vergadering',
        beschrijving: 'Strategische planning voor het derde kwartaal'
    },
    // Add today's event
    {
        id: 8,
        titel: 'Daily stand-up',
        datum: createCurrentMonthDateString(new Date().getDate()),
        startTijd: '09:00',
        eindTijd: '09:30',
        locatie: 'Teams meeting',
        type: 'vergadering',
        beschrijving: 'Dagelijkse stand-up meeting met het ontwikkelteam'
    }
];