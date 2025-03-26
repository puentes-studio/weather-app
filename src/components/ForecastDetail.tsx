import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailsProps } from "./WeatherDetails";
import { ToCelsius } from "@/utils/convertToCelcius";

export interface ForecastWeatherDetailsProps extends WeatherDetailsProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feelsLike: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastDetail(props: ForecastWeatherDetailsProps) {
  return (
    <Container className=" gap-4">
      {/* left */}
      <section className="flex gap-4 items-center px-4">
        <div>
          <WeatherIcon iconName={WeatherIcon} />
          <p>{props.date}</p>
          <p className="text-sm">{props.day}</p>
        </div>

        <div className="flex flex-col px-4">
          <span className="text-5xl">{ToCelsius(props.temp ?? 0)}º</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels like</span>
            <span>{ToCelsius(props.temp ?? 0)}º</span>
          </p>
          <p className="capitalize">{props.description}</p>
        </div>
      </section>

      {/* right */}
      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}
