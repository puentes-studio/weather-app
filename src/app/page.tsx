"use client";

import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import axios from "axios";

// https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.PUBLIC_WEATHER_KEY}&cnt=56
// https://api.openweathermap.org/data/2.5/forecast?q=london&appid=1ea77c597e499c75c3a836e711a8b663&cnt=56

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: { pod: string };
  dt_txt: string;
}

export default function Home() {
  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    },
    // fetch('https://api.openweathermap.org/data/2.5/forecast?q=london&appid=1ea77c597e499c75c3a836e711a8b663&cnt=56').then((res) =>
    //   res.json(),
    // ),
  });

  const firstData = data?.list[0];

  console.log("data", data?.city.country);

  if (isPending)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-bounce text-blue-500">Loading...</p>
      </div>
    ); // ✅ Fixed JSX
  if (error) return <p>An error occurred: {error.message}</p>; // ✅ Fixed JSX

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today data */}
        <section>
          <div>
            <h2 className="flex items-end gap-1 text-2xl">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <div></div>
          </div>
        </section>

        {/* 7 day forecast data */}
        <section></section>
      </main>
    </div>
  );
}
