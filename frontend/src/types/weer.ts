// src/types/weer.ts

export interface DagVoorspelling {
    dag: string;
    temperatuurHoog: number;
    temperatuurLaag: number;
    beschrijving: string;
    icoon: string;
}

export interface WeerInfo {
    stad: string;
    temperatuur: number;
    beschrijving: string;
    icoon: string;
    windsnelheid: number;
    windrichting: string;
    luchtvochtigheid: number;
    dagVoorspelling: DagVoorspelling[];
}

export interface VerkeerFile {
    traject: string;
    vertraging: string;
    lengte: string;
}

export interface VerkeerInfo {
    status: 'goed' | 'matig' | 'slecht';
    beschrijving: string;
    files: VerkeerFile[];
}