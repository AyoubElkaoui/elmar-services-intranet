// src/types/polls.ts

export interface PollOptie {
    id: number;
    tekst: string;
    aantalStemmen: number;
    percentage: number;
}

export interface Poll {
    id: number;
    vraag: string;
    opties: PollOptie[];
    eindDatum: string;
    aantalStemmen: number;
    actief: boolean;
}

export interface Enquete {
    id: number;
    titel: string;
    beschrijving: string;
    vragen: number;
    eindDatum: string;
    url: string;
}

export interface PollResultaat {
    pollId: number;
    stemOptieId: number;
    gebruikerId: number;
    stemDatum: string;
}