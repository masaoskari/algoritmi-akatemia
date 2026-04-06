"use client";
import "./globals.css";
import LaptopPhone from "../../public/laptop_phone.svg";
import LaptopPen from "../../public/laptop_pen.svg";
import Logo from "../../public/a_a_logo.svg";
import Image from "next/image";
import { MainNavigation } from "@/components/MainNavigation";
import InfoCard from "@/components/InfoCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-smooth">
      <MainNavigation />

      {/* Hero Section */}
      <section className="bg-background overflow-hidden relative">
        <div className="h-screen w-screen flex flex-col justify-center items-center p-6">
          <div className="text-center">
            <h1 className="text-primary font-bold text-4xl md:text-5xl">
              Ohjelmointimateriaalia yläkoulun matematiikkaan soveltuen
            </h1>
            <div className="text-white text-base text-center w-[90%] md:w-[80%] mt-4 mx-auto">
              Löydä matikan uusi ulottuvuus koodauksen avulla – innostavia ja
              haasteellisia tehtäviä yläkoululaisille
            </div>
          </div>
          <Image
            priority
            src={LaptopPhone}
            className="w-2/3 md:w-1/3"
            alt="Kannettava tietokone ja puhelin, joissa on Algoritmi akatemian logot."
          />
          {/* Scroll Indicator Arrow */}
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - scrollY / 100) }}
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section with Smooth Scroll */}
      <section className="w-full h-full py-12 md:py-20 px-6 bg-gradient-to-b bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Miksi valita Algoritmi Akatemia?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Monipuoliset tehtävät",
                description:
                  "Sivustolta löytyy matematiikkaa ja ohjelmointia yhdistäviä tehtäviä eri vuosiluokille. Tulevaisuudessa tullaan myös lisäämään satunnaisia tehtäviä, jotka oppivat esimerkiksi lisätehtäviksi matematiikan tunneille sekä laajempia projekteja ja haasteita.",
                image: LaptopPen,
                imageAlt: "Kannettava tietokone, jossa kynän kuva.",
                delay: 0,
              },
              {
                title: "Tasoluokat",
                description:
                  "Jokaiselle jotakin, tehtävät on jaettu kolmeen eri tasoluokkaan, joten kaikille löytyy varmasti sopivaa puuhaa.",
                emoji: "⭐⭐⭐",
                imageAlt:
                  "Kannettavat tietokone, jossa portaat kuvaavat eri taitotasoja.",
                delay: 1,
              },
              {
                title: "Interaktiivinen oppiminen",
                description:
                  "Kokeile koodia suoraan selaimessa! Tehtävät sisältävät interaktiivisia elementtejä, joiden avulla voit testata ja kokeilla ratkaisujasi välittömästi.",
                emoji: "💻",
                imageAlt: "Tietokone emoji",
                delay: 2,
              },
              {
                title: "Opetussuunnitelma huomioitu",
                description:
                  "Tehtävät on suunniteltu vastaamaan matematiikan opetussuunnitelman tavoitteita. Saat konkreettisen arvosanan suoritettujen tehtävien perusteella.",
                emoji: "📚",
                imageAlt: "Opetussuunnitelma ja arvosana",
                delay: 3,
              },
              {
                title: "Seuraa edistymistäsi",
                description:
                  "Näe suorittamasi tehtävät, kerätyt pisteet ja edistymisesi eri aiheissa. Kirjaudu sisään tallentaaksesi tuloksesi pysyvästi!",
                emoji: "📊",
                imageAlt: "Dashboard tilastot",
                delay: 4,
              },
              {
                title: "Tulostettava diplomi",
                description:
                  "Kun olet suorittanut riittävästi tehtäviä, saat henkilökohtaisen diplomin, jonka voit tulostaa ja esitellä saavutuksistasi!",
                emoji: "🏆",
                imageAlt: "Diplomi",
                delay: 5,
              },
            ].map((card, index) => {
              const triggerPoint = 300 + index * 70;
              const scrollProgress = Math.max(0, scrollY - triggerPoint);
              const opacity = Math.min(1, scrollProgress / 100);
              const transform = Math.max(0, 60 - scrollProgress / 3);

              return (
                <div
                  key={index}
                  className="transition-all duration-700 ease-out"
                  style={{
                    opacity: opacity,
                    transform: `translateY(${transform}px)`,
                  }}
                >
                  <InfoCard
                    title={card.title}
                    description={card.description}
                    image={card.image}
                    emoji={card.emoji}
                    imageAlt={card.imageAlt}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background flex items-center justify-center py-8">
        <Image
          priority
          src={Logo}
          className="w-[50px] h-[50px]"
          alt="Algoritmi akatemia logo"
        />
        <p className="text-center font-semibold ml-4 text-white">
          Algoritmi akatemia 2026 ©
        </p>
      </footer>
    </div>
  );
}
