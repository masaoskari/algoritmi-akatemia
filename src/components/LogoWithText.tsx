import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/a_a_logo.svg";

export const LogoWithText = () => {
  return (
    <Link className="flex text-center" href="/">
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
    </Link>
  );
};
