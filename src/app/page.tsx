"use client";
import "./globals.css";
import LaptopPhone from "../../public/laptop_phone.svg";
import MathPhone from "../../public/math_phone.svg";
import LaptopPen from "../../public/laptop_pen.svg";
import LaptopStep from "../../public/laptop_step.svg";
import Logo from "../../public/a_a_logo.svg";
import Image from "next/image";
import { MainNavigation } from "@/components/MainNavigation";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useIsLargeScreen } from "@/hooks/useMediaQuery";

export default function Home() {
  // TODO: Modify animations and add more content to the page for example "ohjeet".
  const isLargeScreen = useIsLargeScreen();
  // Ref for which element will be scrolled
  const ref = useRef(null);
  // Get scroll progress, there are also other options that can be get from useScroll
  // See more from: https://www.framer.com/motion/use-scroll/
  const { scrollYProgress } = useScroll({ target: ref });

  // Adjust scroll progress range for small screens
  const smallScreenScrollRange = [0, 0.4];

  // Transform scroll progress to x-position of the element (progress 0-1 will be mapped to -100% to 0%)
  const xLeftLargeScreen = useTransform(
    scrollYProgress,
    [0, 1],
    ["-100%", "0%"]
  );

  // Different range for small screens
  const xLeftSmallScreen = useTransform(
    scrollYProgress,
    smallScreenScrollRange,
    ["-50%", "0%"]
  );

  // Use the appropriate transform based on screen size
  const xLeft = isLargeScreen ? xLeftLargeScreen : xLeftSmallScreen;

  const xRight = useTransform(
    scrollYProgress,
    [0, 0.9],
    isLargeScreen ? ["100%", "0%"] : ["50%", "0%"]
  );

  const router = useRouter();

  return (
    <div ref={ref}>
      <MainNavigation />
      <motion.div className="bg-background overflow-hidden">
        <div className="h-screen flex flex-col justify-around items-center p-6 md:p-24 pt-36">
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
          <motion.div
            className="ml-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 0.8,
            }}
          >
            <FaArrowAltCircleDown
              size="2rem"
              className="text-primary hover:text-gray-500"
              onClick={() => router.push("#tietoja")}
            />
          </motion.div>
        </div>
      </motion.div>
      <div
        id="tietoja"
        className="flex flex-col md:flex-row justify-around overflow-hidden"
      >
        <motion.div
          className="md:w-[50%] m-0"
          style={{
            x: xLeft,
          }}
        >
          <div className="h-screen pt-24 md:pt-48 p-6 md:p-24 flex flex-col justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold">
                Tehtäviä eri aihealueisiin
              </h3>
              <p>
                Sivustolta löytyy monipuolisia matematiikkaa ja ohjelmointia
                yhdistäviä tehtäviä, jotka sopivat esimerkiksi lisätehtäviksi
                matematiikan tunneille.
              </p>
            </div>
            <Image
              priority
              src={LaptopPen}
              className="w-2/3 md:w-1/2 m-auto"
              alt="Kannettava tietokone, jossa kynän kuva."
            />
            <div>
              <h3 className="text-xl font-bold">Tasoluokat</h3>
              <p>
                Jokaiselle jotakin, tehtävät on jaettu kolmeen eri tasoluokkaan,
                joten kaikille löytyy varmasti sopivaa puuhaa.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="bg-background md:w-[50%] m-0"
          style={{
            x: xRight,
          }}
        >
          <div className="h-screen py-24 md:pt-48 p-6 md:p-24 flex flex-col justify-between">
            <Image
              priority
              src={MathPhone}
              className="w-1/4 md:w-1/4 mx-auto"
              alt="Puhelin, jossa matemaattisia symboleja."
            />
            <div>
              <h3 className="text-xl text-white font-bold">
                Kiinnostava materiaali
              </h3>
              <p className="text-white">
                Materiaalista ja sen tehtävistä on pyritty tekemään innostavia
                ja sellaisia, että ne liittyvät ympäröivään maailmaan niiden
                konkretian avulla.
              </p>
            </div>
            <Image
              priority
              src={LaptopStep}
              className="w-1/2 mx-auto"
              alt="Kannettavat tietokone, jossa portaat kuvaavat eri taitotasoja."
            />
          </div>
        </motion.div>
      </div>
      <div className="bg-background flex items-center justify-center">
        <Image
          priority
          src={Logo}
          className="w-[50px] h-[50px]"
          alt="Algoritmi akatemia logo"
        />
        <p className="text-white text-center">Algoritmi akatemia 2024 ©</p>
      </div>
    </div>
  );
}
