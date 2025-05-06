// src/data/mockVergaderzalen.ts
import { Vergaderzaal, Reservering } from '@/types/vergaderzaal';

export const mockVergaderzalen: Vergaderzaal[] = [
    {
        id: 1,
        naam: 'Boardroom',
        capaciteit: 12,
        faciliteiten: ['Beamer', 'Videoconference', 'Whiteboard'],
        beschikbaar: true,
        foto: '/images/boardroom.jpg'
    },
    {
        id: 2,
        naam: 'Brainstorm kamer',
        capaciteit: 8,
        faciliteiten: ['Whiteboard', 'TV scherm'],
        beschikbaar: false,
        foto: '/images/brainstorm.jpg'
    },
    {
        id: 3,
        naam: 'Focus ruimte 1',
        capaciteit: 4,
        faciliteiten: ['TV scherm'],
        beschikbaar: true,
        foto: '/images/focus1.jpg'
    },
    {
        id: 4,
        naam: 'Focus ruimte 2',
        capaciteit: 4,
        faciliteiten: ['TV scherm'],
        beschikbaar: true,
        foto: '/images/focus2.jpg'
    },
    {
        id: 5,
        naam: 'Grote vergaderzaal',
        capaciteit: 20,
        faciliteiten: ['Beamer', 'Videoconference', 'Audio systeem', 'Whiteboard'],
        beschikbaar: true,
        foto: '/images/groot.jpg'
    }
];

// Genereer huidige datum en tijden voor gebruik in reserveringen
const huidigeDate = new Date();
const startTijd = new Date(huidigeDate);
startTijd.setHours(9, 0, 0);
const eindTijd = new Date(huidigeDate);
eindTijd.setHours(10, 30, 0);

export const mockReserveringen: Reservering[] = [
    {
        id: 1,
        vergaderzaalId: 2, // Brainstorm kamer
        titel: 'Projectoverleg Marketing',
        startTijd: startTijd.toISOString(),
        eindTijd: eindTijd.toISOString(),
        organisator: 'Jan Jansen',
        deelnemers: ['Piet Peters', 'Anna Aalbers', 'Sander Simons']
    },
    {
        id: 2,
        vergaderzaalId: 5, // Grote vergaderzaal
        titel: 'Kwartaalpresentatie',
        startTijd: (() => {
            const time = new Date(huidigeDate);
            time.setHours(13, 0, 0);
            return time.toISOString();
        })(),
        eindTijd: (() => {
            const time = new Date(huidigeDate);
            time.setHours(15, 0, 0);
            return time.toISOString();
        })(),
        organisator: 'Directie',
        deelnemers: ['Alle medewerkers']
    },
    {
        id: 3,
        vergaderzaalId: 1, // Boardroom
        titel: 'Strategisch overleg',
        startTijd: (() => {
            const tomorrow = new Date(huidigeDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(10, 0, 0);
            return tomorrow.toISOString();
        })(),
        eindTijd: (() => {
            const tomorrow = new Date(huidigeDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(12, 0, 0);
            return tomorrow.toISOString();
        })(),
        organisator: 'Eline van Berg',
        deelnemers: ['Directie', 'Teamleiders']
    }
];

// Helper functie om beschikbaarheid van een zaal te controleren
export function isVergaderzaalBeschikbaar(
    zaalId: number,
    datumString: string,
    startTijdString: string,
    eindTijdString: string
): boolean {
    // Converteer strings naar datum objecten
    const datum = new Date(datumString);

    const [startUur, startMinuut] = startTijdString.split(':').map(Number);
    const startTijd = new Date(datum);
    startTijd.setHours(startUur, startMinuut, 0, 0);

    const [eindUur, eindMinuut] = eindTijdString.split(':').map(Number);
    const eindTijd = new Date(datum);
    eindTijd.setHours(eindUur, eindMinuut, 0, 0);

    // Controleer of er overlappende reserveringen zijn
    const overlappend = mockReserveringen.some(reservering => {
        if (reservering.vergaderzaalId !== zaalId) return false;

        const reserveringStart = new Date(reservering.startTijd);
        const reserveringEind = new Date(reservering.eindTijd);

        // Check voor overlap
        return (
            (startTijd >= reserveringStart && startTijd < reserveringEind) ||
            (eindTijd > reserveringStart && eindTijd <= reserveringEind) ||
            (startTijd <= reserveringStart && eindTijd >= reserveringEind)
        );
    });

    return !overlappend;
}