// src/types/polls.ts
export interface Poll {
    id: number;
    vraag: string;
    opties: PollOptie[];
    eindDatum: string;
    aantalStemmen: number;
    actief: boolean;
}

export interface PollOptie {
    id: number;
    tekst: string;
    aantalStemmen: number;
    percentage: number;
}

export interface Enquete {
    id: number;
    titel: string;
    beschrijving: string;
    deadline: string;
    aantalVragen: number;
    ingevuld: boolean;
}