// app/api/files/route.ts
import { NextResponse } from 'next/server'
import { gunzipSync } from 'zlib'
import axios from 'axios'
import { parseStringPromise } from 'xml2js'

export async function GET() {
    try {
        const response = await axios.get('https://opendata.ndw.nu/incidents.xml.gz', {
            responseType: 'arraybuffer'
        })

        const xml = gunzipSync(response.data).toString('utf-8')
        const json = await parseStringPromise(xml)

        const incidents = json?.d2LogicalModel?.payloadPublication?.[0]?.situation || []

        return NextResponse.json(incidents)
    } catch (error) {
        console.error('NDW fout:', error)
        return NextResponse.json({ error: 'Fout bij ophalen verkeersdata' }, { status: 500 })
    }
}
