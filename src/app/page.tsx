"use client";
import Logo from "../../public/a_a_logo.svg";
import Image from "next/image";
import "./globals.css";
import { Typewriter } from "@/components/Typewriter";
import { MainNavigation } from "@/components/MainNavigation";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  // Ref for which element will be scrolled
  const ref = useRef(null);
  // Get scroll progress, there are also other options that can be get from useScroll
  // See more from: https://www.framer.com/motion/use-scroll/
  const { scrollYProgress } = useScroll({ target: ref });
  // Transform scroll progress to x-position of the element (progress 0-1 will be mapped to -100% to 0%)
  const x = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  return (
    <div ref={ref}>
      <MainNavigation />
      <motion.div className="bg-gradient-to-br from-gray-900 to-blue-900 h-screen overflow-hidden">
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
      </motion.div>
      <div
        id="tietoja"
        className="bg-white h-screen p-24 pt-48 flex flex-col items-center justify-center"
      >
        {/* TODO: Add here content like some card, etc... */}
        <motion.div
          className="bg-red-300 h-[80%] w-[50%]"
          style={{
            scaleY: scrollYProgress,
            scaleX: scrollYProgress,
            x: x,
          }}
        >
          Tietoja sivu
        </motion.div>
      </div>
      {/* Here can be added more content to home page. Add also link to MainNavigation. */}
    </div>
  );
}
