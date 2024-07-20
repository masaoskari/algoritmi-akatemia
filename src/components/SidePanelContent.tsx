"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Logo from "../../public/a_a_logo.svg";
import { useRouter } from "next/navigation";
import { Spin as Hamburger } from "hamburger-react";

const SidePanelContent = ({
  frontMatters,
}: {
  frontMatters: Record<string, string>[];
}) => {
  const router = useRouter();
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
        "abosolute opacity-95 transition-all duration-400 transparent-50 bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center gap-4 md:w-[20%] " +
        (isOpen
          ? "w-screen h-screen p-4 md:h-screen"
          : "w-full h-24 md:h-screen p-4")
      }
    >
      <div className="flex justify-between items-center md:justify-center">
        <Image
          className="w-1/12 md:w-1/4 cursor-pointer"
          src={Logo}
          alt="Algoritmi akatemia logo"
          onClick={() => router.push("/")}
        />

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
          "md:flex md:flex-col w-full gap-4 " +
          (isOpen ? "flex flex-col h-screen" : "hidden")
        }
      >
        {categories.map((category) => {
          return (
            <div key={category}>
              <h1 className="text-white text-center">{category}</h1>
              {frontMatters
                .filter((data) => data.category === category)
                .map((item) => (
                  <Link key={item.slug} href={`/materiaali/${item.slug}`}>
                    <p className="block mr-4 ml-4 hover:bg-white hover:text-black text-white p-2 rounded text-center">
                      {item.title}
                    </p>
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
