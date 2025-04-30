// src/data/mockCalendarEvents.ts
import { CalendarEvent } from '@/types/calendar';
import { mockReserveringen } from './mockVergaderzalen';
import { mockVerjaardagenJubilea } from './mockVerjaardagen';

// Helper functie om datum/tijd strings correct te formatteren voor kalenderevents
function createDateTimeString(date: string, time?: string): string {
    if (!time) {
        return date; // Alleen datum zonder tijd
    }

    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = new Date(date);
    dateObj.setHours(hours, minutes, 0, 0);

    return dateObj.toISOString();
}

// Reserveringen omzetten naar kalenderevents
const reserveringEvents: CalendarEvent[] = mockReserveringen.map(res => ({
    id: res.id,
    title: res.titel,
    start: res.startTijd,
    end: res.eindTijd,
    type: 'meeting',
    location: `Zaal: ${res.vergaderzaalId}`,
    description: `Organisator: ${res.organisator}, Deelnemers: ${res.deelnemers.join(', ')}`
}));

// Verjaardagen en jubilea omzetten naar kalenderevents
const verjaardagJubileumEvents: CalendarEvent[] = mockVerjaardagenJubilea.map(vj => {
    const dateObj = new Date(vj.datum);
    const startDate = dateObj.toISOString();

    // Einddatum is dezelfde dag 23:59:59
    dateObj.setHours(23, 59, 59);
    const endDate = dateObj.toISOString();

    return {
        id: vj.id + 1000, // Voorkomen van ID-conflicten
        title: `${vj.type === 'verjaardag' ? 'Verjaardag' : 'Jubileum'} ${vj.naam}`,
        start: startDate,
        end: endDate,
        allDay: true,
        type: vj.type === 'verjaardag' ? 'birthday' : 'anniversary',
        description: vj.type === 'verjaardag'
            ? `${vj.naam} wordt ${vj.leeftijd} jaar`
            : `${vj.naam} is ${vj.aantalJaren} jaar in dienst`,
        location: vj.afdeling
    };
});

// Extra events toevoegen voor demonstratie
const extraEvents: CalendarEvent[] = [
    {
        id: 2001,
        title: 'Koningsdag',
        start: '2023-04-27',
        end: '2023-04-27',
        allDay: true,
        type: 'holiday'
    },
    {
        id: 2002,
        title: 'Deadline projectvoorstel',
        start: '2023-04-15T17:00:00',
        end: '2023-04-15T17:00:00',
        type: 'deadline',
        description: 'Inleveren projectvoorstel voor nieuwe klant'
    },
    {
        id: 2003,
        title: 'Teambuilding',
        start: '2023-05-12T13:00:00',
        end: '2023-05-12T17:00:00',
        type: 'other',
        location: 'Outdoor Activities Center',
        description: 'Teambuilding activiteit voor alle medewerkers'
    }
];

// Combineer alle events
export const mockCalendarEvents: CalendarEvent[] = [
    ...reserveringEvents,
    ...verjaardagJubileumEvents,
    ...extraEvents
];

