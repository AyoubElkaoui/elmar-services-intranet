// src/types/tools.ts
import { ReactNode } from 'react';

export interface Tool {
    id: number;
    naam: string;
    beschrijving: string;
    url: string;
    icoon: string; // String for external tools
    categorie: string;
}

// Voor direct gebruik in React componenten met icons als ReactNode
export interface ToolLink {
    id: number;
    titel: string;
    url: string;
    icon: ReactNode;
}