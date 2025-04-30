// src/types/tools.ts
export interface Tool {
    id: number;
    naam: string;
    beschrijving: string;
    url: string;
    icoon: string;
    categorie: 'communicatie' | 'productiviteit' | 'hr' | 'project' | 'anders';
}