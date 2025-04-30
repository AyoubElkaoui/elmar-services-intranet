import { Vergaderzaal, Reservering } from '@/types/vergaderzaal';

export const mockVergaderzalen: Vergaderzaal[] = [
    {
        id: 1,
        naam: 'Boardroom',
        capaciteit: 12,
        faciliteiten: ['Videoconferentie', 'Whiteboard', 'Koffieautomaat'],
        beschikbaar: false,
        foto: '/images/placeholder.svg'
    },
    {
        id: 2,
        naam: 'Brainstormruimte',
        capaciteit: 8,
        faciliteiten: ['Whiteboard', 'LCD scherm', 'Flexibele opstelling'],
        beschikbaar: true,
        foto: '/images/placeholder.svg'
    },
    {
        id: 3,
        naam: 'Kleine vergaderruimte',
        capaciteit: 4,
        faciliteiten: ['LCD scherm', 'Conferentietelefoon'],
        beschikbaar: true,
        foto: '/images/placeholder.svg'
    },
    {
        id: 4,
        naam: 'Presentatieruimte',
        capaciteit: 30,
        faciliteiten: ['Projector', 'Geluidsinstallatie', 'Podium'],
        beschikbaar: true,
        foto: '/images/placeholder.svg'
    },
];

export const mockReserveringen: Reservering[] = [
    {
        id: 101,
        vergaderzaalId: 1,
        titel: 'Management overleg',
        startTijd: '2023-03-14T09:30:00',
        eindTijd: '2023-03-14T11:00:00',
        organisator: 'Joost Veldman',
        deelnemers: ['Anna de Groot', 'Peter Bakker', 'Lotte Visser']
    },
    {
        id: 102,
        vergaderzaalId: 2,
        titel: 'Projectbespreking Techniek NL',
        startTijd: '2023-03-14T13:00:00',
        eindTijd: '2023-03-14T14:30:00',
        organisator: 'Marloes Janssen',
        deelnemers: ['Tim Cornelissen', 'Sophie de Jong']
    },
    {
        id: 103,
        vergaderzaalId: 4,
        titel: 'Kwartaalpresentatie',
        startTijd: '2023-03-22T14:00:00',
        eindTijd: '2023-03-22T16:00:00',
        organisator: 'Joost Veldman',
        deelnemers: ['Alle medewerkers']
    }
];
