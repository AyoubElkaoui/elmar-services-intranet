export interface VerjaardagJubileum {
    id: number;
    naam: string;
    foto: string;
    type: 'verjaardag' | 'jubileum';
    datum: string;
    afdeling: string;
    aantalJaren?: number; // Voor jubileum
    leeftijd?: number; // Voor verjaardag
}