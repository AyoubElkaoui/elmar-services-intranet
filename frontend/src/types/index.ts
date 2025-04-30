import { ReactNode } from 'react'

export interface Nieuws {
    id: number
    titel: string
    datum: string
    samenvatting: string
    afbeelding: string
    content?: string
}

export interface Snelkoppeling {
    id: number
    titel: string
    icoon: ReactNode
    url: string
}

export interface Evenement {
    id: number
    titel: string
    datum: string
    type: string
    locatie?: string
    beschrijving?: string
}