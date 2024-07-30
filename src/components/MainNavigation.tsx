"use client";
import Hamburger from "hamburger-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Logo from "../../public/a_a_logo.svg";


export const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={
        "fixed top-0 left-0 w-full z-50 bg-background flex flex-col md:h-auto mb-20  " +
        (isOpen ? "h-screen" : "h-auto")
      }
    >
      <div className="md:hidden p-4">
        <Hamburger
          color="white"
          toggled={isOpen}
          size={25}
          toggle={toggleMenu}
        />
      </div>
      <nav
        className={
          "w-full md:flex md:flex-row flex-col items-center gap-16 p-4 mx-4 " +
          (isOpen ? "flex" : "hidden")
        }
      >
        <div className="flex">
          <Image
              priority
              src={Logo}
              className="w-[50px] h-[50px]"
              alt="Algoritmi akatemia logo"
          />
          <div className="flex flex-col">
            <p className="text-white font-bold">Algorigmi</p>
            <p className="text-primary font-bold">Akatemia</p>
          </div>
        </div>
        <Link
          href="/"
          className="text-white font-bold text-xl hover:text-gray-500 text-center capitalize"
          onClick={toggleMenu}
        >
          Koti
        </Link>
        <Link
          href="#tietoja"
          className="text-white font-bold text-xl hover:text-gray-500 text-center capitalize"
          onClick={toggleMenu}
        >
          Tietoja
        </Link>
        <Link
          href="/materiaali/7lk"
          className="text-white font-bold text-xl hover:text-gray-500 text-center capitalize"
          onClick={toggleMenu}
        >
          Materiaali
        </Link>
      </nav>
    </div>
  );
};
