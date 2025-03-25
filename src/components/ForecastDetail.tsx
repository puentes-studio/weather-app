import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import { WeatherDetailsProps } from "./WeatherDetails";
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
      <section className="flex gap-4 items-center px-4">
        <div>
          <WeatherIcon iconName={WeatherIcon} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>

        <div className="flex flex-col px-4">
          <span className="text-5xl">{ToCelsius(temp ?? 0)}º</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels like</span>
            <span>{ToCelsius(temp ?? 0)}º</span>
          </p>
          <p className="capitalize">{desciption}</p>
        </div>
      </section>
    </Container>
  );
}
