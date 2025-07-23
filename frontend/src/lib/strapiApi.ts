
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'

export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export class APIError extends Error {
  status: number
  details?: any

  constructor(message: string, status: number, details?: any) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.details = details
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${STRAPI_API_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log(`🌐 API Call: ${url}`)
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      console.error(`❌ API Error ${response.status}:`, data)
      throw new APIError(
          data.error?.message || `HTTP error! status: ${response.status}`,
          response.status,
          data.error?.details
      )
    }

    console.log(`✅ API Success:`, data)
    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    console.error('❌ Network Error:', error)
    throw new APIError(
        'Verbinding met server mislukt',
        0
    )
  }
}

// Nieuws interface
export interface Nieuws {
  id: number
  documentId: string
  titel: string
  samenvatting: string
  inhoud?: any[]
  publicatieDatum: string
  Auteur: string
  Categorie: string
  Uitgelicht: boolean
  afbeelding?: {
    url: string
    alternativeText?: string
  }
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export const nieuwsAPI = {
  async getAll(params?: {
    page?: number
    pageSize?: number
    categorie?: string
    search?: string
  }): Promise<StrapiResponse<Nieuws[]>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('pagination[page]', params.page.toString())
    if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString())
    if (params?.categorie && params.categorie !== 'alle') searchParams.append('filters[Categorie][$eq]', params.categorie)
    if (params?.search) searchParams.append('filters[titel][$containsi]', params.search)

    searchParams.append('sort', 'publicatieDatum:desc')
    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<Nieuws[]>>(`/api/nieuws-items?${searchParams.toString()}`)
  },

  async getById(idOrDocumentId: number | string): Promise<StrapiResponse<Nieuws>> {
    return fetchAPI<StrapiResponse<Nieuws>>(`/api/nieuws-items/${idOrDocumentId}?populate=*`)
  }
}

// Kalender Evenement interface
export interface KalenderEvenement {
  id: number
  documentId: string
  titel: string
  startDatum: string
  eindDatum: string
  locatie?: string
  categorie: string
  afdeling: string
  beschrijving?: any[]
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export const kalenderAPI = {
  async getAll(params?: {
    startDatum?: string
    eindDatum?: string
    categorie?: string
    afdeling?: string
  }): Promise<StrapiResponse<KalenderEvenement[]>> {
    const searchParams = new URLSearchParams()

    if (params?.startDatum) searchParams.append('filters[startDatum][$gte]', params.startDatum)
    if (params?.eindDatum) searchParams.append('filters[startDatum][$lte]', params.eindDatum)
    if (params?.categorie && params.categorie !== 'alle') searchParams.append('filters[categorie][$eq]', params.categorie)
    if (params?.afdeling && params.afdeling !== 'alle') searchParams.append('filters[afdeling][$eq]', params.afdeling)

    searchParams.append('sort', 'startDatum:asc')
    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<KalenderEvenement[]>>(`/api/kalender-evenementen?${searchParams.toString()}`)
  }
}

// Bestand interface
export interface Bestand {
  id: number
  documentId: string
  titel: string
  beschrijving?: string
  Categorie: 'beleid' | 'procedures' | 'formulieren' | 'handboeken' | 'it-documentatie' | 'algemeen'
  afdeling?: 'Alle' | 'HR' | 'IT' | 'Marketing' | 'Verkoop' | 'Management'
  auteur?: string
  versie?: string
  downloadbaar?: boolean
  bekijkbaar?: boolean
  tags?: string
  bestand?: {
    id: number
    documentId: string
    name: string
    alternativeText?: string
    caption?: string
    width?: number
    height?: number
    formats?: any
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl?: string
    provider: string
    provider_metadata?: any
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export const bestandenAPI = {
  async getAll(params?: {
    page?: number
    pageSize?: number
    categorie?: string
    afdeling?: string
    search?: string
  }): Promise<StrapiResponse<Bestand[]>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('pagination[page]', params.page.toString())
    if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString())
    if (params?.categorie && params.categorie !== 'alle') searchParams.append('filters[Categorie][$eq]', params.categorie)
    if (params?.afdeling && params.afdeling !== 'alle') searchParams.append('filters[afdeling][$eq]', params.afdeling)
    if (params?.search) searchParams.append('filters[titel][$containsi]', params.search)

    searchParams.append('sort', 'updatedAt:desc')
    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<Bestand[]>>(`/api/bestanden?${searchParams.toString()}`)
  },

  async getById(idOrDocumentId: number | string): Promise<StrapiResponse<Bestand>> {
    console.log(`🔍 Searching for document with ID: ${idOrDocumentId}`)

    try {
      // Probeer eerst directe lookup
      return await fetchAPI<StrapiResponse<Bestand>>(`/api/bestanden/${idOrDocumentId}?populate=*`)
    } catch (error: any) {
      console.log(`⚠️ Direct lookup failed, trying alternative methods...`)

      if (error.status === 404) {
        try {
          // Haal alle documenten op en zoek handmatig
          const allDocs = await this.getAll()
          const foundDoc = allDocs.data.find(doc =>
              doc.id.toString() === idOrDocumentId.toString() ||
              doc.documentId === idOrDocumentId.toString()
          )

          if (foundDoc) {
            console.log(`✅ Found document via search:`, foundDoc)
            return { data: foundDoc, meta: {} }
          }

          // Als laatste redmiddel, probeer met documentId filter
          const filterResponse = await fetchAPI<StrapiResponse<Bestand[]>>(`/api/bestanden?filters[documentId][$eq]=${idOrDocumentId}&populate=*`)
          if (filterResponse.data && filterResponse.data.length > 0) {
            console.log(`✅ Found document via filter:`, filterResponse.data[0])
            return { data: filterResponse.data[0], meta: filterResponse.meta }
          }

        } catch (searchError) {
          console.error(`❌ Search also failed:`, searchError)
        }
      }

      throw error
    }
  }
}

// Helper functies voor bestanden
export const fileHelpers = {
  getFileIcon: (fileExt?: string) => {
    if (!fileExt) return '📎'

    switch (fileExt.toLowerCase()) {
      case '.pdf': return '📄'
      case '.doc':
      case '.docx': return '📝'
      case '.xls':
      case '.xlsx': return '📊'
      case '.ppt':
      case '.pptx': return '📽️'
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif': return '🖼️'
      case '.zip':
      case '.rar': return '🗜️'
      default: return '📎'
    }
  },

  formatFileSize: (bytes?: number) => {
    if (!bytes) return 'Onbekend'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  },

  getFileUrl: (bestand?: Bestand['bestand']) => {
    if (!bestand?.url) return null
    return bestand.url.startsWith('http') ? bestand.url : `${STRAPI_API_URL}${bestand.url}`
  }
}

// Media helpers voor nieuwsberichten
export const mediaHelpers = {
  getImageUrl: (url?: string) => {
    if (!url) return null
    return url.startsWith('http') ? url : `${STRAPI_API_URL}${url}`
  }
}