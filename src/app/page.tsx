"use client";

import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { format, formatDate, fromUnixTime, parseISO } from "date-fns";
import axios from "axios";
import Container from "@/components/Container";
import { ToCelsius } from "@/utils/convertToCelcius";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNight } from "@/utils/dayOrNight";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToKilomenters } from "@/utils/metersToKilometers";
import { ConvertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastDetail from "@/components/ForecastDetail";
import { placeAtom } from "@/app/atom";
import { useAtom } from "jotai";
import { useEffect } from "react";

// https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.PUBLIC_WEATHER_KEY}&cnt=56

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
  const [place] = useAtom(placeAtom);
  // const [, setLoadingCity] = useAtom(loadingCityAtom);

  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    },
    // fetch('https://api.openweathermap.org/data/2.5/forecast?q=london&appid=1ea77c597e499c75c3a836e711a8b663&cnt=56').then((res) =>
    //   res.json(),
    // ),
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  console.log("data", data);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  const firstDataForEachEntry = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isPending)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-bounce text-blue-500">Loading...</p>
      </div>
    ); // ✅ Fixed JSX
  if (error) return <p>An error occurred: {error.message}</p>; // ✅ Fixed JSX

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex items-end gap-1 text-2xl">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {ToCelsius(firstData?.main.temp ?? 296.37)}º
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span> Feels like </span>
                  <span>{ToCelsius(firstData?.main.feels_like ?? 0)}º</span>
                </p>
                <p className="text-xs space-x-2">
                  <span>{ToCelsius(firstData?.main.temp_min ?? 0)} º↓ </span>
                  <span> {ToCelsius(firstData?.main.temp_max ?? 0)} º↑ </span>
                </p>
              </div>
              {/* time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>

                    {/* <WeatherIcon iconName={d.weather[0].icon} /> */}
                    <WeatherIcon
                      iconName={getDayOrNight(d.weather[0].icon, d.dt_txt)}
                    />

                    <p>{ToCelsius(d?.main.temp ?? 296.37)}º</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4 ">
            {/* left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p>{firstData?.weather[0].description}</p>
              <WeatherIcon
                iconName={getDayOrNight(
                  firstData?.weather[0].icon ?? " ",
                  firstData?.dt_txt ?? " "
                )}
              />
            </Container>
            {/* right */}
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visibility={metersToKilomenters(firstData?.visibility ?? 10000)}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(
                  fromUnixTime(data?.city.sunrise ?? 1702949452),
                  "H:mm"
                )}
                sunset={format(
                  fromUnixTime(data?.city.sunset ?? 1702949452),
                  "H:mm"
                )}
                windSpeed={ConvertWindSpeed(firstData?.wind.speed ?? 1.64)}
              />
            </Container>
          </div>
        </section>

        {/* 7 day forecast data */}
        <section className="flex flex-col gap-4 w-full ">
          <p className="text-2xl">Seven Day Forecast</p>
          {firstDataForEachEntry.map((d, i) => (
            <ForecastDetail
              key={i}
              description={d?.weather[0].description ?? ""}
              weatherIcon={d?.weather[0].icon ?? "01d"}
              date={formatDate(parseISO(d?.dt_txt ?? ""), "dd.MM")}
              day={formatDate(parseISO(d?.dt_txt ?? ""), "EEEE")}
              feelsLike={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              airPressure={`${d?.main.pressure ?? 0} hPa`}
              humidity={`${d?.main.humidity ?? 0}%`}
              windSpeed={ConvertWindSpeed(d?.wind.speed ?? 0)}
              // windDirection={getWindDirection(d?.wind.deg?? 0)}
              visibility={metersToKilomenters(d?.visibility ?? 0)}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1702949452),
                "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1702949452),
                "H:mm"
              )}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
