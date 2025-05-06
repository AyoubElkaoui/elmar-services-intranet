// src/types/vergaderzaal.ts

export interface Vergaderzaal {
    id: number;
    naam: string;
    capaciteit: number;
    faciliteiten: string[];
    beschikbaar: boolean;
    foto?: string;
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

export interface ReserveringsRequest {
    vergaderzaalId: number;
    titel: string;
    datum: string;
    startTijd: string;
    eindTijd: string;
    organisator: string;
    deelnemers: string[];
    notities?: string;
}

export interface VergaderzaalBeschikbaarheid {
    beschikbaarDatum: string;
    startTijd: string;
    eindTijd: string;
    vergaderzaalId: number;
}