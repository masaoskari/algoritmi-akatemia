"use client";
import Logo from "../../public/a_a_logo.svg";
import Image from "next/image";
import "./globals.css";
import { Typewriter } from "@/components/Typewriter";
import { MainNavigation } from "@/components/MainNavigation";

export default function Home() {
  return (
    <>
      <MainNavigation />
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 h-screen overflow-hidden">
        <div className="flex flex-col items-center gap-4 justify-center p-24 pt-48">
          <Image
            priority
            src={Logo}
            className="w-1/2 md:w-1/2 lg:w-1/3"
            alt="Algoritmi akatemia logo"
          />

          <h1 className="text-4xl text-primary">Algoritmiakatemia</h1>
          <p className="text-white">
            <Typewriter
              text="Valmis oppimaan koodauksen saloja?..."
              delay={100}
            />
          </p>
        </div>
      </div>
      <div id="tietoja" className="bg-white h-screen p-24 pt-48">
        {/* TODO: Add here content like some card, etc... */}
        <div>Tietoja sivu</div>
      </div>
      {/* Here can be added more content to home page. Add also link to MainNavigation. */}
    </>
  );
}
