// src/services/weatherService.ts
const OPENWEATHER_API_KEY =
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ||
    "c5ed2474042d4033d0e3853899bbac09";
const AMERSFOORT_COORDINATES = { lat: 52.1561, lon: 5.3878 };

const vertaalWeerBeschrijving = (en: string): string => {
    const m: Record<string,string> = {
        "clear sky": "heldere lucht",
        "few clouds": "lichte bewolking",
        "scattered clouds": "verspreide bewolking",
        "broken clouds": "gebroken bewolking",
        "overcast clouds": "bewolkt",
        "light rain": "lichte regen",
        "moderate rain": "matige regen",
        "heavy intensity rain": "zware regen",
        "light snow": "lichte sneeuw",
        thunderstorm: "onweer",
        mist: "mist",
    };
    return m[en] || en;
};

const getWindDirection = (deg: number): string => {
    const dirs = ["N","NO","O","ZO","Z","ZW","W","NW"];
    return dirs[Math.round(deg/45)%8];
};

export interface WeatherForecastItem {
    day: string;
    temperature: number;
    description: string;
    icon: string;
}
export interface WeatherData {
    temperature:   number;  // °C
    description:   string;  // NL
    humidity:      number;  // %
    windSpeed:     number;  // km/u
    windDirection: string;
    forecast:      WeatherForecastItem[];
}

interface OWC { main:{temp:number;humidity:number}; weather:{description:string;icon:string}[]; wind:{speed:number;deg:number} }
interface OWFI { dt:number; main:{temp:number}; weather:{description:string;icon:string}[] }
interface OWF  { list:OWFI[] }

export const fetchWeatherData = async (): Promise<WeatherData> => {
    try {
        const r1 = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${AMERSFOORT_COORDINATES.lat}&lon=${AMERSFOORT_COORDINATES.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        const cur: OWC = await r1.json();

        const r2 = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${AMERSFOORT_COORDINATES.lat}&lon=${AMERSFOORT_COORDINATES.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        const fc: OWF = await r2.json();

        const forecast = fc.list
            .filter((_,i) => i%8===0)
            .slice(0,4)
            .map(d => ({
                day:         new Date(d.dt*1000).toLocaleDateString("nl-NL",{weekday:"short"}),
                temperature: Math.round(d.main.temp),
                description: vertaalWeerBeschrijving(d.weather[0].description),
                icon:        d.weather[0].icon
            }));

        return {
            temperature:   Math.round(cur.main.temp),
            description:   vertaalWeerBeschrijving(cur.weather[0].description),
            humidity:      cur.main.humidity,
            windSpeed:     Math.round(cur.wind.speed*3.6),
            windDirection: getWindDirection(cur.wind.deg),
            forecast,
        }
    } catch(err) {
        console.error("Weather API error", err);
        return {
            temperature:12, description:"bewolkt", humidity:75,
            windSpeed:15, windDirection:"ZW",
            forecast:[
                {day:"Wo",temperature:12,description:"lichte regen",icon:"10d"},
                {day:"Do",temperature:14,description:"bewolkt",icon:"03d"},
                {day:"Vr",temperature:16,description:"zonnig",icon:"01d"},
                {day:"Za",temperature:15,description:"gedeeltelijk bewolkt",icon:"02d"},
            ]
        }
    }
}
