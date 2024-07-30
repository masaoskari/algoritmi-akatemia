"use client";
import LaptopPhone from "../../public/laptop_phone.svg";
import MathPhone from "../../public/math_phone.svg";
import LaptopPen from "../../public/laptop_pen.svg";
import LaptopStep from "../../public/laptop_step.svg";
import Image from "next/image";
import "./globals.css";
import { Typewriter } from "@/components/Typewriter";
import { MainNavigation } from "@/components/MainNavigation";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
export default function Home() {
  // Ref for which element will be scrolled
  const ref = useRef(null);
  // Get scroll progress, there are also other options that can be get from useScroll
  // See more from: https://www.framer.com/motion/use-scroll/
  const { scrollYProgress } = useScroll({ target: ref });
  // Transform scroll progress to x-position of the element (progress 0-1 will be mapped to -100% to 0%)
  const xLeft = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  const router = useRouter();
  return (
    <div ref={ref}>
      <MainNavigation />
      <motion.div className="bg-background h-screen overflow-hidden">
        <div className="flex flex-col items-center gap-4 justify-center justify-between p-24 pt-36">
          <div className="gap-0 text-center">
            <h1 className="text-primary font-bold text-5xl">Ohjelmointimateriaalia yläkoulun</h1>
            <h1 className="text-white font-bold text-5xl">matematiikkaan soveltuen</h1>
          </div>
          <div className="text-white text-base text-center w-[50%]">
            Oletko joskus miettinyt miten ohjelmointia tulisi opettaa yläkoulussa? Tai tiesitkö, että nykypäivänä lähes kaikkialla on ihmisten ohjelmoimalla tekemiä sovelluksia. Haluaisitko sinäkin tutustua miten voisit tehdä näitä kotona?
          </div>
          <Image
            priority
            src={LaptopPhone}
            className="w-1/6"
            alt="Algoritmi akatemia logo"
          />
          <FaArrowAltCircleDown size="2rem" className="text-primary mt-auto ml-auto hover:text-gray-500" onClick={() => router.push("#tietoja")}/>
        </div>
      </motion.div>
      <div
        id="tietoja"
        className="h-screen flex justify-around"
      >
        {/* TODO: Add here content like some card, etc... */}
        <motion.div
          className="w-[50%] m-0"
          style={{
            x: xLeft
          }}
        >
          <div className="pt-24 px-24">
            <div className="py-12">
              <h3 className="text-xl font-bold">Tehtäviä eri aihealueisiin</h3>
              <p>Sivustolta löytyy monipuolisia matematiikkaa ja ohjelmointia yhdistäviä tehtäviä, jotka sopivat esimerkiksi lisätehtäviksi matematiikan tunneille.</p>
            </div>
            <Image
              priority
              src={MathPhone}
              className="w-1/6 m-auto py-12"
              alt="Algoritmi akatemia logo"
            />
            <div className="py-12">
              <h3 className="text-xl font-bold">Tasoluokat</h3>
              <p>Sivustolta löytyy monipuolisia matematiikkaa ja ohjelmointia yhdistäviä tehtäviä, jotka sopivat esimerkiksi lisätehtäviksi matematiikan tunneille.</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="bg-background w-[50%]"
          style={{
            x: xRight
          }}
        >
          <div className="pt-48 p-24 flex flex-col justify-around gap-4 h-screen">
            <Image
              priority
              src={LaptopPen}
              className="w-1/3 m-auto"
              alt="Algoritmi akatemia logo"
            />
            <div>
              <h3 className="text-xl text-white font-bold">Kiinnostavat tehtävät</h3>
              <p className="text-white">Sivustolta löytyy monipuolisia matematiikkaa ja ohjelmointia yhdistäviä tehtäviä, jotka sopivat esimerkiksi lisätehtäviksi matematiikan tunneille.</p>
            </div>
            <Image
              priority
              src={LaptopStep}
              className="w-1/3 m-auto"
              alt="Kannettavat tietokone taitotasoilla"
            />
          </div>
        </motion.div>
      </div>
      <div className="bg-background">
          <p className="text-white m-auto text-center">Algoritmi akatemia 2024 ©</p>
      </div>
      {/* Here can be added more content to home page. Add also link to MainNavigation. */}
    </div>
  );
}
