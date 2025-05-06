export interface VerjaardagJubileum {
    id: number;
    naam: string;
    foto?: string; // Dit wordt gebruikt als avatar in de component
    type: 'verjaardag' | 'jubileum';
    datum: string;
    afdeling: string;
    functie?: string; // Deze is optioneel, want sommige data heeft dit niet
    leeftijd?: number; // Gebruikt voor verjaardagen
    aantalJaren?: number; // Gebruikt voor jubilea (jaren in dienst)
}