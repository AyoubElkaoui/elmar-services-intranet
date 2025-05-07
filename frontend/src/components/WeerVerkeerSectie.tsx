// src/components/ui/WeerVerkeerWidget.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
    WiRain, WiCloud, WiDaySunny,
    WiSnow, WiThunderstorm, WiFog
} from "react-icons/wi";
import { FaCarSide, FaMapMarkerAlt } from "react-icons/fa";
import { fetchWeatherData, WeatherData } from "@/services/weatherService";
import {
    fetchTrafficIncidents,
    TrafficIncident
} from "@/services/trafficService";

export default function WeerVerkeerWidget() {
    const [tab, setTab] = useState<"weer"|"verkeer">("weer");
    const [weather, setWeather] = useState<WeatherData|null>(null);
    const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                if (tab === "weer") {
                    setWeather(await fetchWeatherData());
                } else {
                    setIncidents(await fetchTrafficIncidents());
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        })();
    }, [tab]);

    const renderIcon = (desc: string) => {
        if (desc.includes("regen")) return <WiRain size={24}/>;
        if (desc.includes("bewolkt")) return <WiCloud size={24}/>;
        if (desc.includes("zonnig")||desc.includes("helder"))
            return <WiDaySunny size={24}/>;
        if (desc.includes("sneeuw")) return <WiSnow size={24}/>;
        if (desc.includes("onweer")) return <WiThunderstorm size={24}/>;
        if (desc.includes("mist"))   return <WiFog size={24}/>;
        return <WiCloud size={24}/>;
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* Tabs */}
            <div className="flex border-b">
                <button
                    className={`flex-1 py-2 ${tab === "weer" ? "bg-primary text-white" : "bg-gray-100"}`}
                    onClick={() => setTab("weer")}
                >
                    <WiDaySunny className="inline mr-1"/> Weer
                </button>
                <button
                    className={`flex-1 py-2 ${tab === "verkeer" ? "bg-primary text-white" : "bg-gray-100"}`}
                    onClick={() => setTab("verkeer")}
                >
                    <FaCarSide className="inline mr-1"/> Verkeer
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {loading && <p className="text-center">Laden…</p>}

                {/* ▶️ Weer-tab */}
                {!loading && tab === "weer" && weather && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold">Amersfoort</h3>
                                <div className="flex items-center text-gray-600">
                                    {renderIcon(weather.description)}
                                    <span className="ml-2">{weather.description}</span>
                                </div>
                            </div>
                            <div className="text-4xl font-bold">{weather.temperature}°C</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                                <p>Wind</p>
                                <p>{weather.windSpeed} km/u {weather.windDirection}</p>
                            </div>
                            <div>
                                <p>Luchtvochtigheid</p>
                                <p>{weather.humidity}%</p>
                            </div>
                        </div>

                        <h4 className="font-medium mb-2">Voorspelling</h4>
                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                            {weather.forecast.map((f, i) => (
                                <div key={i}>
                                    <p className="font-medium">{f.day}</p>
                                    {renderIcon(f.description)}
                                    <p>{f.temperature}°</p>
                                    <p className="text-xs text-gray-500">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Verkeer-tab */}
                {tab==="verkeer" && !loading && (
                    <>
                        <h3 className="text-lg font-bold mb-3">Actuele files</h3>
                        {incidents.length === 0 ? (
                            <p className="text-green-600">Geen files gemeld.</p>
                        ) : (
                            <ul className="space-y-3">
                                {incidents.map(inc => (
                                    <li key={inc.id} className="p-3 border rounded flex items-start space-x-3">
                                        <FaMapMarkerAlt className="text-primary mt-1" />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className="font-medium">{inc.roads.join(", ")}</span>
                                                <span className="text-red-600 font-semibold">+{inc.delayMinutes} min</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{inc.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Start: {inc.start.lat.toFixed(3)},{inc.start.lon.toFixed(3)}<br/>
                                                Eind: {inc.end.lat.toFixed(3)},{inc.end.lon.toFixed(3)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}