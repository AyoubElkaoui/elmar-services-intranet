'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'

export default function ZoekBalk() {
    const [zoekQuery, setZoekQuery] = useState('')
    const router = useRouter()

    const handleZoeken = (e: React.FormEvent) => {
        e.preventDefault()
        if (zoekQuery.trim()) {
            router.push(`/zoeken?q=${encodeURIComponent(zoekQuery)}`)
        }
    }

    return (
        <form onSubmit={handleZoeken} className="relative">
            <input
                type="text"
                placeholder="Zoeken..."
                className="w-full py-2 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-300"
                value={zoekQuery}
                onChange={(e) => setZoekQuery(e.target.value)}
            />
            <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-500"
                aria-label="Zoeken"
            >
                <FiSearch size={20} />
            </button>
        </form>
    )
}