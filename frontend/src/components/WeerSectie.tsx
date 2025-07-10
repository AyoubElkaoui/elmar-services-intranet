'use client'

import { useState, useEffect } from 'react'
import { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiWind, FiDroplet, FiThermometer } from 'react-icons/fi'
import { FaCar, FaRoute } from 'react-icons/fa'

interface WeatherData {
    location: string
    temperature: number
    description: string
    humidity: number
    windSpeed: number
    windDirection: string
    icon: string
    forecast: Array<{
        day: string
        high: number
        low: number
        description: string
        icon: string
    }>
}

interface TrafficData {
    status: 'goed' | 'matig' | 'slecht'
    description: string
    incidents: Array<{
        route: string
        description: string
        delay: string
        severity: 'low' | 'medium' | 'high'
    }>
}

export default function WeerVerkeerSectie() {
    const [activeTab, setActiveTab] = useState<'weer' | 'verkeer'>('weer')
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [trafficData, setTrafficData] = useState<TrafficData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            await Promise.all([fetchWeatherData(), fetchTrafficData()])
            setLoading(false)
        }
        load()
    }, [])

    const fetchWeatherData = async () => {
        try {
            const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo_key'
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Amersfoort,NL&appid=${API_KEY}&units=metric&lang=nl`)
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Amersfoort,NL&appid=${API_KEY}&units=metric&lang=nl`)

            if (!response.ok || !forecastResponse.ok) throw new Error('Mislukt')

            const data = await response.json()
            const forecastData = await forecastResponse.json()

            setWeatherData({
                location: data.name,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6),
                windDirection: getWindDirection(data.wind.deg),
                icon: data.weather[0].icon,
                forecast: forecastData.list.slice(0, 5).map((item: any) => ({
                    day: new Date(item.dt * 1000).toLocaleDateString('nl-NL', { weekday: 'short' }),
                    high: Math.round(item.main.temp_max),
                    low: Math.round(item.main.temp_min),
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                }))
            })
        } catch (err) {
            console.error('Weerdata error:', err)
            setError('Weerdata niet beschikbaar')
        }
    }

    const fetchTrafficData = async () => {
        try {
            const res = await fetch('/api/files')
            const data = await res.json()

            const processedIncidents = data.slice(0, 10).map((item: any) => {
                const queue = item?.situationRecord?.trafficQueue
                const length = queue?.queueLength || 'onbekend'
                const delay = queue?.delay || 0

                return {
                    route: 'Onbekende weg',
                    description: `File van ${length} meter`,
                    delay: `${delay} sec`,
                    severity: delay > 300 ? 'high' : 'medium'
                }
            })

            setTrafficData({
                status: processedIncidents.length > 5 ? 'slecht' : processedIncidents.length > 0 ? 'matig' : 'goed',
                description: `${processedIncidents.length} file(s) gemeld`,
                incidents: processedIncidents
            })
        } catch (err) {
            console.error('Verkeer error:', err)
            setTrafficData({
                status: 'goed',
                description: 'Verkeersinformatie niet beschikbaar',
                incidents: []
            })
        }
    }

    const getWindDirection = (deg: number): string => {
        const dirs = ['N', 'NNO', 'NO', 'ONO', 'O', 'OZO', 'ZO', 'ZZO', 'Z', 'ZZW', 'ZW', 'WZW', 'W', 'WNW', 'NW', 'NNW']
        return dirs[Math.round(deg / 22.5) % 16]
    }

    const getWeatherIcon = (icon: string) => {
        switch (icon.slice(0, 2)) {
            case '01': return <FiSun className="text-yellow-500" size={32} />
            case '02':
            case '03':
            case '04': return <FiCloud className="text-gray-500" size={32} />
            case '09':
            case '10': return <FiCloudRain className="text-blue-500" size={32} />
            case '13': return <FiCloudSnow className="text-blue-200" size={32} />
            default: return <FiSun className="text-yellow-500" size={32} />
        }
    }

    const getStatusColor = (status: TrafficData['status']) => ({
        goed: 'text-green-600',
        matig: 'text-yellow-600',
        slecht: 'text-red-600'
    }[status] || 'text-gray-600')

    const getStatusDot = (status: TrafficData['status']) => ({
        goed: 'bg-green-500',
        matig: 'bg-yellow-500',
        slecht: 'bg-red-500'
    }[status] || 'bg-gray-500')

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 text-gray-400 text-center">Laden...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 text-red-600">{error}</div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
                {['weer', 'verkeer'].map(tab => (
                    <button
                        key={tab}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                            activeTab === tab ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveTab(tab as 'weer' | 'verkeer')}
                    >
                        {tab === 'weer' ? <FiSun className="inline mr-2" size={16} /> : <FaCar className="inline mr-2" size={16} />}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-4">
                {activeTab === 'weer' && weatherData && (
                    <div>
                        <div className="flex justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-primary">{weatherData.location}</h3>
                                <div className="flex items-center text-gray-600 mt-1">
                                    {getWeatherIcon(weatherData.icon)}
                                    <span className="ml-2 capitalize">{weatherData.description}</span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-primary">{weatherData.temperature}°C</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-2 bg-blue-50 rounded">
                                <FiDroplet className="mx-auto text-blue-600 mb-1" size={16} />
                                <p className="text-xs text-gray-500">Vochtigheid</p>
                                <p className="font-medium">{weatherData.humidity}%</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                                <FiWind className="mx-auto text-green-600 mb-1" size={16} />
                                <p className="text-xs text-gray-500">Wind</p>
                                <p className="font-medium">{weatherData.windSpeed} km/h</p>
                                <p className="text-xs">{weatherData.windDirection}</p>
                            </div>
                            <div className="text-center p-2 bg-orange-50 rounded">
                                <FiThermometer className="mx-auto text-orange-600 mb-1" size={16} />
                                <p className="text-xs text-gray-500">Gevoeld</p>
                                <p className="font-medium">{weatherData.temperature}°C</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'verkeer' && trafficData && (
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-3">Verkeerssituatie</h3>
                        <div className="flex items-center mb-4">
                            <div className={`w-3 h-3 rounded-full mr-3 ${getStatusDot(trafficData.status)}`}></div>
                            <span className={`font-medium ${getStatusColor(trafficData.status)}`}>{trafficData.description}</span>
                        </div>

                        {trafficData.incidents.length > 0 ? (
                            trafficData.incidents.map((incident, index) => (
                                <div key={index} className="border-l-4 border-yellow-400 pl-3 py-2 bg-yellow-50 mb-2">
                                    <div className="flex items-center mb-1">
                                        <FaRoute className="text-yellow-600 mr-2" size={12} />
                                        <span className="font-medium text-sm">{incident.route}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{incident.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">Vertraging: {incident.delay}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <FaCar className="mx-auto text-green-500 mb-2" size={24} />
                                <p className="text-sm text-gray-600">Geen files in de regio Amersfoort.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
