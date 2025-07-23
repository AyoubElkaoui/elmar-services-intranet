// frontend/src/lib/strapiApi.ts
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'

// Strapi v5 Response Types
interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Strapi v5 Media Types
interface StrapiMediaFormat {
  url: string
  width: number
  height: number
  size: number
}

interface StrapiMedia {
  id: number
  documentId: string
  url: string
  alternativeText?: string
  caption?: string
  width: number
  height: number
  formats?: {
    thumbnail?: StrapiMediaFormat
    small?: StrapiMediaFormat
    medium?: StrapiMediaFormat
    large?: StrapiMediaFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Nieuws Item Type voor Strapi v5
export interface NieuwsItem {
  id: number
  documentId: string
  titel: string
  samenvatting: string
  inhoud: Array<{
    type: string
    children: Array<{
      text: string
      type: string
    }>
  }>
  Auteur: string
  Categorie: string
  Uitgelicht: boolean
  publicatieDatum: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  afbeelding?: StrapiMedia
}

// Bestand Type voor Strapi v5
export interface BestandItem {
  id: number
  documentId: string
  titel: string
  beschrijving?: string
  Categorie: 'beleid' | 'procedures' | 'formulieren' | 'handboeken' | 'it-documentatie' | 'algemeen'
  afdeling: 'Alle' | 'HR' | 'IT' | 'Marketing' | 'Verkoop' | 'Management'
  tags?: string
  downloadbaar: boolean
  bekijkbaar: boolean
  versie: string
  auteur: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  bestand?: StrapiMedia
}

// Formulier Type voor Strapi v5
export interface FormulierItem {
  id: number
  documentId: string
  title: string
  beschrijving: Array<{
    type: string
    children: Array<{
      text: string
      type: string
    }>
  }>
  categorie: 'HR' | 'IT' | 'Marketing' | 'Verkoop' | 'Algemeen'
  afdeling: 'HR' | 'IT' | 'Marketing' | 'Verkoop' | 'Alle'
  verplicht: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  bestand?: StrapiMedia
}

export class APIError extends Error {
  constructor(message: string, public status: number, public details?: any) {
    super(message)
    this.name = 'APIError'
  }
}

// Simple cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minuten

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}/api${endpoint}`

  if (!options.method || options.method === 'GET') {
    const cacheKey = `${endpoint}${JSON.stringify(options)}`
    const cachedData = getCachedData<T>(cacheKey)
    if (cachedData) {
      console.log('📦 Using cached data for:', endpoint)
      return cachedData
    }
  }

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
    console.log('🌐 Fetching from:', url)
    const response = await fetch(url, mergedOptions)

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      let errorDetails = null

      try {
        const errorData = await response.json()
        console.error('❌ API Error Response:', errorData)
        if (errorData.error) {
          errorMessage = errorData.error.message || errorMessage
          errorDetails = errorData.error.details
        }
      } catch {
        // Als we de error response niet kunnen parsen
      }

      throw new APIError(errorMessage, response.status, errorDetails)
    }

    const data = await response.json() as T
    console.log('✅ API Response received for:', endpoint)

    if (!options.method || options.method === 'GET') {
      const cacheKey = `${endpoint}${JSON.stringify(options)}`
      setCachedData(cacheKey, data)
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError('Netwerkfout: Kan geen verbinding maken met Strapi server', 0)
    }

    console.error('API Error:', error)
    throw new APIError('Onbekende fout opgetreden', 0)
  }
}

// Nieuws API functies voor Strapi v5
export const nieuwsAPI = {
  async getAll(params?: {
    page?: number
    pageSize?: number
    categorie?: string
    uitgelicht?: boolean
    search?: string
    sort?: string
  }): Promise<StrapiResponse<NieuwsItem[]>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('pagination[page]', params.page.toString())
    if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString())

    const sortBy = params?.sort || 'publicatieDatum:desc'
    searchParams.append('sort', sortBy)

    if (params?.categorie && params.categorie !== 'alle') {
      searchParams.append('filters[Categorie][$eq]', params.categorie)
    }

    if (params?.uitgelicht !== undefined) {
      searchParams.append('filters[Uitgelicht][$eq]', params.uitgelicht.toString())
    }

    if (params?.search) {
      searchParams.append('filters[$or][0][titel][$containsi]', params.search)
      searchParams.append('filters[$or][1][samenvatting][$containsi]', params.search)
    }

    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<NieuwsItem[]>>(`/nieuws-items?${searchParams.toString()}`)
  },

  async getById(idOrDocumentId: number | string): Promise<StrapiResponse<NieuwsItem>> {
    return fetchAPI<StrapiResponse<NieuwsItem>>(`/nieuws-items/${idOrDocumentId}?populate=*`)
  },

  async getByIdViaFilter(id: number): Promise<StrapiResponse<NieuwsItem[]>> {
    const searchParams = new URLSearchParams()
    searchParams.append('filters[id][$eq]', id.toString())
    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<NieuwsItem[]>>(`/nieuws-items?${searchParams.toString()}`)
  },

  async getUitgelicht(limit: number = 3): Promise<StrapiResponse<NieuwsItem[]>> {
    const searchParams = new URLSearchParams()
    searchParams.append('filters[Uitgelicht][$eq]', 'true')
    searchParams.append('sort', 'publicatieDatum:desc')
    searchParams.append('pagination[limit]', limit.toString())
    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<NieuwsItem[]>>(`/nieuws-items?${searchParams.toString()}`)
  },

  async getRecent(limit: number = 5): Promise<StrapiResponse<NieuwsItem[]>> {
    const searchParams = new URLSearchParams()
    searchParams.append('sort', 'publicatieDatum:desc')
    searchParams.append('pagination[limit]', limit.toString())
    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<NieuwsItem[]>>(`/nieuws-items?${searchParams.toString()}`)
  }
}

// Bestanden API functies
export const bestandenAPI = {
  async getAll(params?: {
    page?: number
    pageSize?: number
    categorie?: string
    afdeling?: string
    search?: string
    sort?: string
  }): Promise<StrapiResponse<BestandItem[]>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('pagination[page]', params.page.toString())
    if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString())

    const sortBy = params?.sort || 'updatedAt:desc'
    searchParams.append('sort', sortBy)

    if (params?.categorie && params.categorie !== 'alle') {
      searchParams.append('filters[Categorie][$eq]', params.categorie)
    }

    if (params?.afdeling && params.afdeling !== 'alle') {
      searchParams.append('filters[afdeling][$eq]', params.afdeling)
    }

    if (params?.search) {
      searchParams.append('filters[$or][0][titel][$containsi]', params.search)
      searchParams.append('filters[$or][1][beschrijving][$containsi]', params.search)
      searchParams.append('filters[$or][2][tags][$containsi]', params.search)
    }

    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<BestandItem[]>>(`/bestanden?${searchParams.toString()}`)
  },

  async getById(idOrDocumentId: number | string): Promise<StrapiResponse<BestandItem>> {
    return fetchAPI<StrapiResponse<BestandItem>>(`/bestanden/${idOrDocumentId}?populate=*`)
  }
}

// Formulieren API functies
export const formulierenAPI = {
  async getAll(params?: {
    page?: number
    pageSize?: number
    categorie?: string
    afdeling?: string
    search?: string
    sort?: string
  }): Promise<StrapiResponse<FormulierItem[]>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('pagination[page]', params.page.toString())
    if (params?.pageSize) searchParams.append('pagination[pageSize]', params.pageSize.toString())

    const sortBy = params?.sort || 'title:asc'
    searchParams.append('sort', sortBy)

    if (params?.categorie && params.categorie !== 'alle') {
      searchParams.append('filters[categorie][$eq]', params.categorie)
    }

    if (params?.afdeling && params.afdeling !== 'alle') {
      searchParams.append('filters[afdeling][$eq]', params.afdeling)
    }

    if (params?.search) {
      searchParams.append('filters[$or][0][title][$containsi]', params.search)
    }

    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<FormulierItem[]>>(`/formulieren?${searchParams.toString()}`)
  },

  async getRequired(params?: {
    categorie?: string
    afdeling?: string
    search?: string
    sort?: string
  }): Promise<StrapiResponse<FormulierItem[]>> {
    const searchParams = new URLSearchParams()

    searchParams.append('filters[verplicht][$eq]', 'true')

    const sortBy = params?.sort || 'title:asc'
    searchParams.append('sort', sortBy)

    if (params?.categorie && params.categorie !== 'alle') {
      searchParams.append('filters[categorie][$eq]', params.categorie)
    }

    if (params?.afdeling && params.afdeling !== 'alle') {
      searchParams.append('filters[afdeling][$eq]', params.afdeling)
    }

    if (params?.search) {
      searchParams.append('filters[$or][0][title][$containsi]', params.search)
    }

    searchParams.append('populate', '*')

    return fetchAPI<StrapiResponse<FormulierItem[]>>(`/formulieren?${searchParams.toString()}`)
  }
}

// Helper functies
export const contentHelpers = {
  richTextToHtml(blocks: NieuwsItem['inhoud']): string {
    if (!blocks || !Array.isArray(blocks)) {
      return ''
    }

    return blocks.map(block => {
      if (block.type === 'paragraph') {
        const text = block.children?.map(child => child.text || '').join('') || ''
        return `<p>${text}</p>`
      }
      if (block.type === 'heading') {
        const text = block.children?.map(child => child.text || '').join('') || ''
        return `<h2>${text}</h2>`
      }
      return ''
    }).join('')
  },

  richTextToPlainText(blocks: NieuwsItem['inhoud']): string {
    if (!blocks || !Array.isArray(blocks)) {
      return ''
    }

    return blocks.map(block => {
      return block.children?.map(child => child.text || '').join('') || ''
    }).join(' ')
  },

  truncateRichText(blocks: NieuwsItem['inhoud'], maxLength: number = 150): string {
    const plainText = this.richTextToPlainText(blocks)
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  },

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'Onbekende datum'
    }
  },

  formatRichText(blocks: FormulierItem['beschrijving']): string {
    if (!blocks || !Array.isArray(blocks)) {
      return ''
    }

    return blocks.map(block => {
      return block.children?.map(child => child.text || '').join('') || ''
    }).join(' ')
  },

  truncateText(text: string, maxLength: number = 150): string {
    if (!text || text.length <= maxLength) return text || ''
    return text.substring(0, maxLength) + '...'
  }
}

export const fileHelpers = {
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  getFileTypeIcon(ext: string): string {
    const extension = ext.toLowerCase().replace('.', '')

    const iconMap: Record<string, string> = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '📽️',
      pptx: '📽️',
      txt: '📄',
      rtf: '📄',
      csv: '📋',
      zip: '🗜️',
      rar: '🗜️',
      '7z': '🗜️',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      svg: '🖼️',
      mp4: '🎥',
      avi: '🎥',
      mkv: '🎥',
      mp3: '🎵',
      wav: '🎵',
      flac: '🎵',
      json: '⚙️',
      xml: '⚙️',
      html: '🌐',
      css: '🎨',
      js: '📜',
      exe: '⚙️',
      dmg: '💿',
      iso: '💿'
    }

    return iconMap[extension] || '📎'
  },

  getFileTypeColor(ext: string): string {
    const extension = ext.toLowerCase().replace('.', '')

    const colorMap: Record<string, string> = {
      pdf: 'text-red-600',
      doc: 'text-blue-600',
      docx: 'text-blue-600',
      xls: 'text-green-600',
      xlsx: 'text-green-600',
      ppt: 'text-orange-600',
      pptx: 'text-orange-600',
      txt: 'text-gray-600',
      zip: 'text-purple-600',
      rar: 'text-purple-600',
      jpg: 'text-pink-600',
      jpeg: 'text-pink-600',
      png: 'text-pink-600',
      mp4: 'text-indigo-600',
      mp3: 'text-yellow-600'
    }

    return colorMap[extension] || 'text-gray-500'
  },

  isViewableInBrowser(ext: string): boolean {
    const extension = ext.toLowerCase().replace('.', '')
    const viewable = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'txt', 'html', 'css', 'js', 'json', 'xml']
    return viewable.includes(extension)
  },

  getDownloadUrl(bestand?: StrapiMedia): string {
    if (!bestand?.url) return '#'
    return mediaHelpers.getMediaUrl(bestand.url)
  },

  viewFile(bestand?: StrapiMedia): void {
    const url = this.getDownloadUrl(bestand)
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  },

  downloadFile(bestand?: StrapiMedia, filename?: string): void {
    const url = this.getDownloadUrl(bestand)
    if (url !== '#') {
      const link = document.createElement('a')
      link.href = url
      link.download = filename || bestand?.name || 'download'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },

  getFileInfo(bestand?: StrapiMedia) {
    if (!bestand) return null

    return {
      name: bestand.name || 'Onbekend bestand',
      ext: bestand.ext || '',
      size: this.formatFileSize(bestand.size || 0),
      icon: this.getFileTypeIcon(bestand.ext || ''),
      color: this.getFileTypeColor(bestand.ext || ''),
      viewable: this.isViewableInBrowser(bestand.ext || ''),
      url: this.getDownloadUrl(bestand)
    }
  }
}

export const mediaHelpers = {
  getMediaUrl(url?: string): string {
    if (!url) return '/images/placeholder.svg'

    if (url.startsWith('http')) return url

    return `${API_URL}${url}`
  },

  getBestImageUrl(afbeelding?: StrapiMedia, preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string {
    if (!afbeelding) {
      return '/images/placeholder.svg'
    }

    const { formats, url } = afbeelding

    if (formats?.[preferredSize]) {
      return this.getMediaUrl(formats[preferredSize].url)
    }

    if (formats?.medium) return this.getMediaUrl(formats.medium.url)
    if (formats?.small) return this.getMediaUrl(formats.small.url)
    if (formats?.large) return this.getMediaUrl(formats.large.url)
    if (formats?.thumbnail) return this.getMediaUrl(formats.thumbnail.url)

    return this.getMediaUrl(url)
  }
}

export function clearAPICache(): void {
  cache.clear()
  console.log('🗑️ API cache cleared')
}