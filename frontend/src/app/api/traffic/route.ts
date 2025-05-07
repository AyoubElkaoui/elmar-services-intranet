// src/app/api/traffic/route.ts
import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'

const NDW_FEED_URL = 'https://data.ndw.nu/feeds/ndw/NDW-Verkeersdata.xml'

export async function GET() {
    try {
        const res = await fetch(NDW_FEED_URL)
        const xml = await res.text()

        const parser = new XMLParser({
            ignoreAttributes:     false,
            attributeNamePrefix:  '@_'
        })
        const json = parser.parse(xml)

        // Pak alle situatie-records (TrafficData én TrafficFlow etc)
        const records = json?.ExchangeDataPublication
            ?.situationExchange
            ?.situationRecordCollection
            ?.situationRecord ?? []
        const arr = Array.isArray(records) ? records : [records]

        // Haal uit élk record alle gemeten waarden (measuredValue)
        const incidents = arr
            .flatMap(r => {
                const mv = r.trafficDataExtension
                    ?.trafficDataExtension
                    ?.measuredValue
                if (!mv) return []
                const list = Array.isArray(mv) ? mv : [mv]
                return list.map((m: any, i: number) => ({
                    id:              `${r['@_id']}-${i}`,
                    measurementTime: r.recordedAtTime,
                    speed:           Number(m.value),  // km/u
                }))
            })
            .slice(0, 5)  // pak er 5 voor test

        return NextResponse.json(incidents)
    } catch (err) {
        console.error('⚠️ NDW fetch error', err)
        return NextResponse.json({ error: 'Kan verkeersdata niet ophalen' }, { status: 500 })
    }
}
