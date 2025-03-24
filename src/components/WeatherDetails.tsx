import React from "react";
import { FaRegEye } from "react-icons/fa";
import { FiDroplet } from "react-icons/fi";
import { ImMeter } from "react-icons/im";
import { LuSunrise, LuSunset } from "react-icons/lu";
import { MdAir } from "react-icons/md";

export interface WeatherDetailsProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

export default function WeatherDetails(props: WeatherDetailsProps) {
  //   const {
  //     visibility = "25km",
  //     humidity = "70%",
  //     windSpeed = "5 km/h",
  //     airPressure = "1012 hPa",
  //     sunrise = "06:20",
  //     sunset = "18:48",
  //   } = props;
  return (
    <>
      <SingleWeatherDetails
        icon={<FaRegEye />}
        information="Visibility"
        value={props.visibility}
      />
      <SingleWeatherDetails
        icon={<FiDroplet />}
        information="Humidity"
        value={props.humidity}
      />
      <SingleWeatherDetails
        icon={<MdAir />}
        information="Wind Speed"
        value={props.windSpeed}
      />
      <SingleWeatherDetails
        icon={<ImMeter />}
        information="Air Pressure"
        value={props.airPressure}
      />
      <SingleWeatherDetails
        icon={<LuSunrise />}
        information="Sunrise"
        value={props.sunrise}
      />
      <SingleWeatherDetails
        icon={<LuSunset />}
        information="Sunser"
        value={props.sunset}
      />
    </>
  );
}

export interface SingleWeatherDetailsProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetails(props: SingleWeatherDetailsProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
