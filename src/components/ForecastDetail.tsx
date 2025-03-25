import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import { WeatherDetailsProps } from "./WeatherDetails";

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

export default function ForecastDetail({}: Props) {
  return (
    <Container className=" gap-4">
      <section className="flex gap-4 items-center px-4">
        <div>
          <WeatherIcon />
        </div>
      </section>
    </Container>
  );
}
