import React from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { CiLocationOn } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";
import Searchbox from "./Searchbox";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <TiWeatherPartlySunny className="text-3xl mt-1 text-gray-600" />
        </div>
        <section className="flex gap-2 items-center">
          <CiLocationOn className="text-2xl text-black hover:opacity-75 cursor-pointer" />
          <RiUserLocationLine className="text-3xl text-black hover:opacity-75 cursor-pointer" />
          <p className="text-slate-900/80 text-sm"> Sidcup </p>
          <div>
            <Searchbox />
            {/* Searchbox  */}
          </div>
        </section>
      </div>
    </nav>
  );
}
