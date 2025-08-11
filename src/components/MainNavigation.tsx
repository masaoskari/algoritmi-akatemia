"use client";
import Hamburger from "hamburger-react";
import Link from "next/link";
import { useState } from "react";
import { LogoWithText } from "@/components/LogoWithText";
import { FaUserCircle } from "react-icons/fa";

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
        <LogoWithText />
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
        <Link
          href="/user"
          className="text-white font-bold text-2xl hover:text-gray-500 text-center capitalize md:ml-auto md:mr-8"
          onClick={toggleMenu}
        >
          <FaUserCircle />
        </Link>
      </nav>
    </div>
  );
};