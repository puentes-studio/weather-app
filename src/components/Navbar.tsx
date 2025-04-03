"use client";

import React, { useState } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { CiLocationOn } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";
import Searchbox from "./Searchbox";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);

    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
        );

        const suggestions = response.data.map(
          (item: any) => `${item.name}, ${item.country}` // Shows "City, Country"
        );

        setSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
        setError(suggestions.length === 0 ? "No matching locations found" : "");
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
        setError("Failed to fetch location data");
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setError("");
    }
  }

  function handleSuggestionsClick(item: string) {
    setCity(item);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();

    if (!city.trim()) {
      // ✅ Check if city is empty

      setError("Please enter a location");
      return;
    }

    if (suggestions.length === 0) {
      setLoadingCity(false);
      setError("Location not found");
      return;
    }

    setError("");
    setTimeout(() => {
      setPlace(city);
      setLoadingCity(false);
      setShowSuggestions(false);
    }, 500);
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords; // ✅ Corrected lat/lon extraction

        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
          );

          console.log("Location Response:", response.data); // ✅ Debugging

          if (response.data?.name) {
            setTimeout(() => {
              setPlace(response.data.name);
              setLoadingCity(false);
            }, 500);
          } else {
            throw new Error("No location name found in API response.");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setLoadingCity(false);
          setError("Failed to fetch location data.");
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setError(
          "Failed to get your location. Please enable location services."
        );
      }
    );
  }

  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <TiWeatherPartlySunny className="text-3xl mt-1 text-gray-600" />
        </div>
        <section className="flex gap-2 items-center">
          <CiLocationOn
            title="Your location"
            onClick={handleCurrentLocation}
            className="text-2xl text-black hover:opacity-75 cursor-pointer"
          />
          <RiUserLocationLine className="text-3xl text-black hover:opacity-75 cursor-pointer" />
          <p className="text-slate-900/80 text-sm"> {location} </p>
          <div className="relative">
            <Searchbox
              value={city}
              onSubmit={handleSubmitSearch}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <SuggestionBox
              {...{
                suggestions,
                showSuggestions,
                handleSuggestionsClick,
                error,
              }}
            />
          </div>
        </section>
      </div>
    </nav>
  );
}

function SuggestionBox({
  suggestions,
  showSuggestions,
  handleSuggestionsClick,
  error,
}: {
  suggestions: string[];
  showSuggestions: boolean;
  handleSuggestionsClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {(showSuggestions && suggestions.length > 0) || error ? (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
          {error && <li className="p-1 text-red-700">{error}</li>}{" "}
          {/* ✅ Always show error if exists */}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionsClick(item)}
              className="cursor-pointer p-1 rounded hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}{" "}
      {/* ✅ Hide completely when no suggestions or errors */}
    </>
  );
}
