"use client";
import Logo from "../../public/a_a_logo.svg";
import Image from "next/image";
import { useState } from "react";
import "./globals.css";
import { IoIosMenu } from "react-icons/io";
import Link from "next/link";
import { Typewriter } from "@/components/Typewriter";
import { IoIosClose } from "react-icons/io";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const LINKS: string[] = [
    "sisalto/home",
    "sisalto/7lk",
    "sisalto/8lk",
    "sisalto/9lk",
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 h-screen overflow-hidden">
      <div
        className={
          "flex flex-col p-4 md:h-auto  " +
          (isOpen ? "h-full opacity-100" : "h-auto")
        }
      >
        {isOpen ? (
          <IoIosClose
            className="text-white text-3xl cursor-pointer md:hidden"
            onClick={toggleMenu}
          />
        ) : (
          <IoIosMenu
            className="text-white text-3xl cursor-pointer md:hidden"
            onClick={toggleMenu}
          />
        )}
        <nav
          className={
            "w-full md:flex md:flex-row flex-col gap-4 p-4 mx-auto " +
            (isOpen ? "flex" : "hidden")
          }
        >
          {LINKS.map((link) => {
            if (link === "Home") {
              return (
                <Link
                  key={link}
                  href="/"
                  className="text-white hover:text-gray-500 text-center capitalize"
                >
                  {link}
                </Link>
              );
            }
            return (
              <Link
                key={link}
                href={`/${link}`}
                className="text-white hover:text-gray-500 text-center capitalize"
              >
                {link}
              </Link>
            );
          })}
        </nav>
      </div>
      <main className="flex flex-col items-center gap-4 justify-center">
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
      </main>
    </div>
  );
}
