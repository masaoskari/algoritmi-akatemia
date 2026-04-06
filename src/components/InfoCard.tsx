import Image, { StaticImageData } from "next/image";

type InfoCardProps = {
  title: string;
  description: string;
  image?: StaticImageData;
  emoji?: string;
  imageAlt: string;
};

export default function InfoCard({
  title,
  description,
  image,
  emoji,
  imageAlt,
}: InfoCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 h-full hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-2xl border border-slate-700`}
    >
      <div className="text-center">
        <div className="flex items-center p-4 justify-center">
          {emoji ? (
            <span className="text-5xl">{emoji}</span>
          ) : image ? (
            <Image priority src={image} className="w-15 h-10" alt={imageAlt} />
          ) : null}
        </div>
        <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
        <p className={`text-sm leading-relaxed text-gray-300`}>{description}</p>
      </div>
    </div>
  );
}
