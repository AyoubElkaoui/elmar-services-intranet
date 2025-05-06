"use client";

// src/components/WeerVerkeerSectie.tsx
import React, { useState } from 'react';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { FaCarSide } from 'react-icons/fa';
import { mockWeerData, mockVerkeerData } from '@/data/mockWeerVerkeer';

export default function WeerVerkeerSectie() {
    // Tab state voor het wisselen tussen weer en verkeer
    const [activeTab, setActiveTab] = useState<'weer' | 'verkeer'>('weer');

    // Functie om tussen tabs te schakelen - gebruikt de state variabele
    const switchTab = (tab: 'weer' | 'verkeer') => {
        setActiveTab(tab);
    };

    return (
        <section className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
                <button
                    className={`flex-1 py-3 px-4 text-center ${
                        activeTab === 'weer'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => switchTab('weer')}
                >
          <span className="flex items-center justify-center">
            <TiWeatherPartlySunny className="mr-2" />
            Weer
          </span>
                </button>
                <button
                    className={`flex-1 py-3 px-4 text-center ${
                        activeTab === 'verkeer'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => switchTab('verkeer')}
                >
          <span className="flex items-center justify-center">
            <FaCarSide className="mr-2" />
            Verkeer
          </span>
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'weer' ? (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-bold">{mockWeerData.stad}</h3>
                                <p className="text-gray-600">{mockWeerData.beschrijving}</p>
                            </div>
                            <div className="text-4xl font-bold">{mockWeerData.temperatuur}°C</div>
                        </div>

                        <div className="flex text-sm">
                            <div className="flex-1 border-r pr-2">
                                <p className="text-gray-600">Wind</p>
                                <p>{mockWeerData.windsnelheid} km/u {mockWeerData.windrichting}</p>
                            </div>
                            <div className="flex-1 pl-2">
                                <p className="text-gray-600">Luchtvochtigheid</p>
                                <p>{mockWeerData.luchtvochtigheid}%</p>
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-medium mb-2">Voorspelling</h4>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {mockWeerData.dagVoorspelling.map((dag, index) => (
                                    <div key={index}>
                                        <p className="font-medium">{dag.dag}</p>
                                        <p className="text-sm">{dag.temperatuurHoog}° | {dag.temperatuurLaag}°</p>
                                        <p className="text-xs text-gray-600">{dag.beschrijving}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1">Verkeerssituatie</h3>
                            <p className={`text-sm ${
                                mockVerkeerData.status === 'goed' ? 'text-green-600' :
                                    mockVerkeerData.status === 'matig' ? 'text-orange-600' : 'text-red-600'
                            }`}>
                                {mockVerkeerData.beschrijving}
                            </p>
                        </div>

                        {mockVerkeerData.files.length > 0 ? (
                            <div>
                                <h4 className="font-medium mb-2">Actuele files</h4>
                                <div className="space-y-2">
                                    {mockVerkeerData.files.map((file, index) => (
                                        <div key={index} className="border-b pb-2 last:border-b-0">
                                            <p className="font-medium">{file.traject}</p>
                                            <div className="flex text-sm">
                                                <p className="text-red-600 mr-3">{file.vertraging}</p>
                                                <p className="text-gray-600">{file.lengte}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>Er zijn momenteel geen files.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}