"use client";
import "./globals.css";
import LaptopPhone from "../../public/laptop_phone.svg";
import LaptopPen from "../../public/laptop_pen.svg";
import Logo from "../../public/a_a_logo.svg";
import Image from "next/image";
import { MainNavigation } from "@/components/MainNavigation";
import InfoCard from "@/components/InfoCard";
import { useIsLargeScreen } from "@/hooks/useMediaQuery";

export default function Home() {
  const isLargeScreen = useIsLargeScreen();

  return (
    <div>
      <MainNavigation />
      <div className="bg-background overflow-hidden">
        <div className="h-screen md:h-[75vh] flex flex-col justify-around items-center p-6 pt-24">
          {isLargeScreen ? (
            <div className="text-center">
              <h1 className="text-primary font-bold text-4xl">
                Ohjelmointimateriaalia yläkoulun
              </h1>
              <h1 className="text-white font-bold text-4xl">
                matematiikkaan soveltuen
              </h1>

              <div className="text-white text-base text-center w-[90%] md:w-[80%] mt-4 mx-auto">
                Löydä matikan uusi ulottuvuus koodauksen avulla – innostavia ja
                haasteellisia tehtäviä yläkoululaisille
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-primary font-bold text-5xl">Algoritmi</h1>
              <h1 className="text-white font-bold text-5xl">Akatemia</h1>
              <p className="text-white text-base">
                Löydä matikan uusi ulottuvuus koodauksen avulla
              </p>
            </div>
          )}
          <Image
            priority
            src={LaptopPhone}
            className="w-2/3 md:w-1/3"
            alt="Kannettava tietokone ja puhelin, joissa on Algoritmi akatemian logot."
          />
        </div>
      </div>
      <div className="md:h-screen grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center md:place-items-stretch overflow-hidden p-8 md:p-12 md:auto-rows-fr">
        <InfoCard
          title="Monipuoliset tehtävät"
          description="Sivustolta löytyy matematiikkaa ja ohjelmointia yhdistäviä tehtäviä eri vuosiluokille. Tulevaisuudessa tullaan myös lisäämään satunnaisia tehtäviä, jotka oppivat esimerkiksi lisätehtäviksi matematiikan tunneille sekä laajempia projekteja ja haasteita."
          image={LaptopPen}
          imageAlt="Kannettava tietokone, jossa kynän kuva."
        />
        <InfoCard
          title="Tasoluokat"
          description="Jokaiselle jotakin, tehtävät on jaettu kolmeen eri tasoluokkaan, joten kaikille löytyy varmasti sopivaa puuhaa."
          emoji="⭐⭐⭐"
          imageAlt="Kannettavat tietokone, jossa portaat kuvaavat eri taitotasoja."
        />
        <InfoCard
          title="Interaktiivinen oppiminen"
          description="Kokeile koodia suoraan selaimessa! Tehtävät sisältävät interaktiivisia elementtejä, joiden avulla voit testata ja kokeilla ratkaisujasi välittömästi."
          emoji="💻"
          imageAlt="Tietokone emoji"
        />
        <InfoCard
          title="Opetussuunnitelma huomioitu"
          description="Tehtävät on suunniteltu vastaamaan matematiikan opetussuunnitelman tavoitteita. Saat konkreettisen arvosanan suoritettujen tehtävien perusteella."
          emoji="📚"
          imageAlt="Opetussuunnitelma ja arvosana"
        />
        <InfoCard
          title="Seuraa edistymistäsi"
          description="Näe suorittamasi tehtävät, kerätyt pisteet ja edistymisesi eri aiheissa. Kirjaudu sisään tallentaaksesi tuloksesi pysyvästi!"
          emoji="📊"
          imageAlt="Dashboard tilastot"
        />

        <InfoCard
          title="Tulostettava diplomi"
          description="Kun olet suorittanut riittävästi tehtäviä, saat henkilökohtaisen diplomin, jonka voit tulostaa ja esitellä saavutuksistasi!"
          emoji="🏆"
          imageAlt="Diplomi"
        />
      </div>
      <div className="bg-white flex items-center justify-center">
        <Image
          priority
          src={Logo}
          className="w-[50px] h-[50px]"
          alt="Algoritmi akatemia logo"
        />
        <p className="text-center font-semibold">Algoritmi akatemia 2024 ©</p>
      </div>
    </div>
  );
}
