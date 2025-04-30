// Basis API client voor communicatie met Strapi backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

export async function fetchAPI(endpoint: string, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const mergedOptions = {
        ...defaultOptions,
        ...options,
    }

    const response = await fetch(`${API_URL}/api${endpoint}`, mergedOptions)

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
}

// Voorbeeld functies voor het ophalen van data
export async function getNieuws() {
    const data = await fetchAPI('/nieuws-items')
    return data
}

export async function getNieuwsById(id: number) {
    const data = await fetchAPI(`/nieuws-items/${id}`)
    return data
}

export async function getEvenementen() {
    const data = await fetchAPI('/evenementen')
    return data
}