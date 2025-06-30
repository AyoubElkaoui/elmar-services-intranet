// frontend/src/lib/api.ts - Enhanced API client
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'

class APIError extends Error {
    constructor(message: string, public status: number) {
        super(message)
        this.name = 'APIError'
    }
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    }

    try {
        const response = await fetch(`${API_URL}/api${endpoint}`, mergedOptions)

        if (!response.ok) {
            throw new APIError(`API error: ${response.statusText}`, response.status)
        }

        const data = await response.json()
        return data
    } catch (error) {
        if (error instanceof APIError) {
            throw error
        }
        throw new APIError('Network error', 0)
    }
}

// Nieuws API
export const nieuwsAPI = {
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sort?: string;
        filters?: any
    }) {
        const searchParams = new URLSearchParams()

        if (params?.page) searchParams.append('pagination[page]', params.page.toString())
        if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString())
        if (params?.sort) searchParams.append('sort', params.sort)
        if (params?.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                searchParams.append(`filters[${key}]`, String(value))
            })
        }

        searchParams.append('populate', '*')

        return fetchAPI(`/nieuws-items?${searchParams.toString()}`)
    },

    async getById(id: number) {
        return fetchAPI(`/nieuws-items/${id}?populate=*`)
    },

    async create(data: any) {
        return fetchAPI('/nieuws-items', {
            method: 'POST',
            body: JSON.stringify({ data })
        })
    },

    async update(id: number, data: any) {
        return fetchAPI(`/nieuws-items/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ data })
        })
    },

    async delete(id: number) {
        return fetchAPI(`/nieuws-items/${id}`, {
            method: 'DELETE'
        })
    }
}

// Evenementen API
export const evenementenAPI = {
    async getAll(params?: {
        startDate?: string;
        endDate?: string;
        type?: string;
    }) {
        const searchParams = new URLSearchParams()
        searchParams.append('populate', '*')
        searchParams.append('sort', 'startDatum:asc')

        if (params?.startDate) {
            searchParams.append('filters[startDatum][$gte]', params.startDate)
        }
        if (params?.endDate) {
            searchParams.append('filters[startDatum][$lte]', params.endDate)
        }
        if (params?.type) {
            searchParams.append('filters[type][$eq]', params.type)
        }

        return fetchAPI(`/evenementen?${searchParams.toString()}`)
    },

    async getById(id: number) {
        return fetchAPI(`/evenementen/${id}?populate=*`)
    },

    async create(data: any) {
        return fetchAPI('/evenementen', {
            method: 'POST',
            body: JSON.stringify({ data })
        })
    },

    async update(id: number, data: any) {
        return fetchAPI(`/evenementen/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ data })
        })
    },

    async delete(id: number) {
        return fetchAPI(`/evenementen/${id}`, {
            method: 'DELETE'
        })
    }
}

// Documenten API
export const documentenAPI = {
    async getAll(params?: {
        categorie?: string;
        afdeling?: string;
        search?: string;
    }) {
        const searchParams = new URLSearchParams()
        searchParams.append('populate', '*')
        searchParams.append('sort', 'createdAt:desc')

        if (params?.categorie) {
            searchParams.append('filters[categorie][$eq]', params.categorie)
        }
        if (params?.afdeling) {
            searchParams.append('filters[afdeling][$eq]', params.afdeling)
        }
        if (params?.search) {
            searchParams.append('filters[titel][$containsi]', params.search)
        }

        return fetchAPI(`/documenten?${searchParams.toString()}`)
    },

    async getById(id: number) {
        return fetchAPI(`/documenten/${id}?populate=*`)
    },

    async create(data: any) {
        return fetchAPI('/documenten', {
            method: 'POST',
            body: JSON.stringify({ data })
        })
    }
}

// Medewerkers API
export const medewerkersAPI = {
    async getAll(params?: {
        afdeling?: string;
        actief?: boolean;
    }) {
        const searchParams = new URLSearchParams()
        searchParams.append('populate', '*')
        searchParams.append('sort', 'naam:asc')

        if (params?.afdeling) {
            searchParams.append('filters[afdeling][$eq]', params.afdeling)
        }
        if (params?.actief !== undefined) {
            searchParams.append('filters[actief][$eq]', params.actief.toString())
        }

        return fetchAPI(`/medewerkers?${searchParams.toString()}`)
    },

    async getVerjaardagen(month?: number, year?: number) {
        const searchParams = new URLSearchParams()
        searchParams.append('populate', '*')
        searchParams.append('filters[actief][$eq]', 'true')

        if (month && year) {
            // Filter op maand van geboortedatum
            const startDate = new Date(year, month - 1, 1).toISOString()
            const endDate = new Date(year, month, 0).toISOString()
            searchParams.append('filters[geboortedatum][$gte]', startDate)
            searchParams.append('filters[geboortedatum][$lte]', endDate)
        }

        return fetchAPI(`/medewerkers?${searchParams.toString()}`)
    }
}

// Vergaderzalen API
export const vergaderzalenAPI = {
    async getAll() {
        return fetchAPI('/vergaderzalen?populate=*&sort=naam:asc')
    },

    async getBeschikbaarheid(zaalId: number, datum: string) {
        const searchParams = new URLSearchParams()
        searchParams.append('filters[vergaderzaal][id][$eq]', zaalId.toString())
        searchParams.append('filters[startTijd][$gte]', datum)
        searchParams.append('filters[eindTijd][$lte]', new Date(new Date(datum).getTime() + 24 * 60 * 60 * 1000).toISOString())

        return fetchAPI(`/reserveringen?${searchParams.toString()}`)
    }
}

// Reserveringen API
export const reserveringenAPI = {
    async create(data: any) {
        return fetchAPI('/reserveringen', {
            method: 'POST',
            body: JSON.stringify({ data })
        })
    },

    async getByDateRange(startDate: string, endDate: string) {
        const searchParams = new URLSearchParams()
        searchParams.append('populate', '*')
        searchParams.append('filters[startTijd][$gte]', startDate)
        searchParams.append('filters[startTijd][$lte]', endDate)

        return fetchAPI(`/reserveringen?${searchParams.toString()}`)
    }
}

// Polls API
export const pollsAPI = {
    async getActive() {
        const searchParams = new URLSearchParams()
        searchParams.append('filters[actief][$eq]', 'true')
        searchParams.append('filters[eindDatum][$gte]', new Date().toISOString())

        return fetchAPI(`/polls?${searchParams.toString()}`)
    },

    async vote(pollId: number, optieId: number) {
        // In een echte implementatie zou je hier de stem verwerken
        // Voor nu returnen we een success response
        return { success: true }
    }
}

// Upload API
export const uploadAPI = {
    async uploadFile(file: File) {
        const formData = new FormData()
        formData.append('files', file)

        return fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        }).then(res => res.json())
    }
}