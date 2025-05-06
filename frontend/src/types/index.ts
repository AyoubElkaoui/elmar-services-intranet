// src/types/index.ts
import { ReactNode } from 'react';

export interface Nieuws {
    id: number;
    titel: string;
    samenvatting: string;
    datum: string;
    afbeelding?: string;
    // Maak deze velden optioneel om te passen bij je data
    inhoud?: string;
    auteur?: string;
    categorie?: string;
}

export interface Snelkoppeling {
    id: number;
    titel: string;
    url: string;
    icoon: ReactNode;
}

export interface Evenement {
    id: number;
    titel: string;
    datum: string;
    startTijd: string;
    eindTijd: string;
    locatie: string;
    type: 'vergadering' | 'verjaardag' | 'presentatie' | 'sociaal' | 'anders';
    beschrijving?: string;
}

export interface EvenementItem {
    id: number;
    title: string;
    time: string;
    type: Evenement['type'];
}

export interface FAQ {
    id: number;
    vraag: string;
    antwoord: string;
    populariteit: number;
}

export interface Gebruiker {
    id: number;
    naam: string;
    email: string;
    afdeling: string;
    functie: string;
    avatar?: string;
    telefoonnummer?: string;
}

export interface Afdeling {
    id: number;
    naam: string;
    beschrijving: string;
    manager: string;
    medewerkers: number;
}

export interface Document {
    id: number;
    titel: string;
    type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'img' | 'anders';
    grootte: string;
    laatstGewijzigd: string;
    eigenaar: string;
    url: string;
    categorie: string;
}

export interface VerjaardigJubileumData {
    id: number;
    naam: string;
    functie: string;
    afdeling: string;
    datum: string;
    type: 'verjaardag' | 'jubileum';
    jaren?: number;
    avatar?: string;
}

export interface ToolLink {
    id: number;
    titel: string;
    url: string;
    icon: ReactNode;
}