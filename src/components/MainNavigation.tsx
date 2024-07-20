"use client";
import Hamburger from "hamburger-react";
import Link from "next/link";
import { useState } from "react";

export const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={
        "fixed top-0 left-0 w-full z-50 bg-gradient-to-tr from-gray-900 to-blue-900 flex flex-col md:h-auto mb-20  " +
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
          "w-full md:flex md:flex-row flex-col gap-8 p-8 mx-4 " +
          (isOpen ? "flex" : "hidden")
        }
      >
        <Link
          href="/"
          className="text-white font-medium text-xl hover:text-gray-500 text-center capitalize"
          onClick={toggleMenu}
        >
          Etusivu
        </Link>
        <Link
          href="#tietoja"
          className="text-white font-medium text-xl hover:text-gray-500 text-center capitalize"
          onClick={toggleMenu}
        >
          Tietoja
        </Link>
        <Link
          href="/materiaali/7lk"
          className="text-white font-medium text-xl hover:text-gray-500 text-center capitalize"
          onClick={toggleMenu}
        >
          Materiaali
        </Link>
      </nav>
    </div>
  );
};
