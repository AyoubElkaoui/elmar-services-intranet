// src/components/ui/WeerVerkeerWidget.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
    WiRain,
    WiCloud,
    WiDaySunny,
    WiSnow,
    WiThunderstorm,
    WiFog,
} from "react-icons/wi";
import { FaCarSide } from "react-icons/fa";
import { fetchWeatherData, WeatherData } from "@/services/weatherService";
import { fetchRoadJams, RoadJamInfo } from "@/services/trafficService";

export default function WeerVerkeerWidget() {
    const [tab, setTab] = useState<"weer" | "verkeer">("weer");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [jams, setJams] = useState<RoadJamInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                if (tab === "weer") {
                    setWeather(await fetchWeatherData());
                } else {
                    setJams(await fetchRoadJams());
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        })();
    }, [tab]);

    const renderIcon = (d: string) => {
        if (d.includes("regen")) return <WiRain size={28} />;
        if (d.includes("bewolkt")) return <WiCloud size={28} />;
        if (d.includes("zonnig") || d.includes("helder"))
            return <WiDaySunny size={28} />;
        if (d.includes("sneeuw")) return <WiSnow size={28} />;
        if (d.includes("onweer")) return <WiThunderstorm size={28} />;
        if (d.includes("mist")) return <WiFog size={28} />;
        return <WiCloud size={28} />;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setTab("weer")}
                    className={`flex-1 py-2 ${
                        tab === "weer" ? "bg-primary text-white" : "bg-gray-100"
                    }`}
                >
                    <WiDaySunny className="inline mr-1" />
                    Weer
                </button>
                <button
                    onClick={() => setTab("verkeer")}
                    className={`flex-1 py-2 ${
                        tab === "verkeer" ? "bg-primary text-white" : "bg-gray-100"
                    }`}
                >
                    <FaCarSide className="inline mr-1" />
                    Verkeer
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {loading && <p className="text-center text-gray-600">Laden…</p>}

                {/* Weer-tab (ongewijzigd) */}
                {tab === "weer" && !loading && weather && (
                    <>
                        {/* … hier komt jouw bestaande weer‐rendering … */}
                    </>
                )}

                {/* Verkeer‐tab */}
                {tab === "verkeer" && !loading && (
                    <>
                        <h3 className="text-lg font-bold mb-2">Actuele files</h3>
                        {jams.length === 0 ? (
                            <p className="text-green-600">Geen files gemeld.</p>
                        ) : (
                            <ul className="space-y-2">
                                {jams.map((r) => (
                                    <li
                                        key={r.road}
                                        className="flex justify-between items-center border-b pb-1"
                                    >
                                        <span className="font-medium">{r.road}</span>
                                        <span className="text-right">
                      {r.count} files, {r.lengthKm} km
                    </span>
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
