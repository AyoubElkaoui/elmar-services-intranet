export interface Vergaderzaal {
    id: number;
    naam: string;
    capaciteit: number;
    faciliteiten: string[];
    beschikbaar: boolean;
    foto: string;
}

export interface Reservering {
    id: number;
    vergaderzaalId: number;
    titel: string;
    startTijd: string;
    eindTijd: string;
    organisator: string;
    deelnemers: string[];
}