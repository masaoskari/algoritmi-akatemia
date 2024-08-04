"use client";
import Link from "next/link";
import { useState } from "react";
import { Spin as Hamburger } from "hamburger-react";
import { LogoWithText } from "./LogoWithText";
import { FaBook } from "react-icons/fa";
import { FaLaptop } from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const categoriesIcons: Record<string, JSX.Element> = {
  "7lk": <FaBook />,
  "8lk": <FaLaptop />,
  "9lk": <FaTrophy />,
};

const SidePanelContent = ({
  frontMatters,
}: {
  frontMatters: Record<string, string>[];
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const categories = Array.from(
    new Set(frontMatters.map((data) => data.category))
  );
  return (
    <div
      className={
        "transition-all duration-400 bg-background flex flex-col gap-4 md:w-[30%] lg:w-[20%] " +
        (isOpen ? "w-screen h-screen p-4" : "w-full h-24 md:h-screen p-4")
      }
    >
      <div className="flex justify-between w-full items-center">
        <div className="mr-auto mt-4">
          <LogoWithText />
        </div>
        <div className="md:hidden">
          <Hamburger
            color="white"
            toggled={isOpen}
            size={25}
            toggle={toggleMenu}
          />
        </div>
      </div>
      <div
        className={
          "pl-8 mt-8 md:flex md:flex-col w-full gap-4 " +
          (isOpen ? "flex flex-col h-screen" : "hidden")
        }
      >
        {categories.map((category) => {
          return (
            <div key={category}>
              <div className="flex items-center gap-4">
                <div className="text-white">{categoriesIcons[category]}</div>
                <h3 className="text-white font-bold">{category}</h3>
              </div>
              {frontMatters
                .filter((data) => data.category === category)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/materiaali/${item.slug}`}
                    className={
                      "hover:text-gray-500 mx-4 p-2 " +
                      (pathname === `/materiaali/${item.slug}`
                        ? "text-primary"
                        : "text-white")
                    }
                  >
                    <p className="mx-4">{item.title}</p>
                  </Link>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidePanelContent;
