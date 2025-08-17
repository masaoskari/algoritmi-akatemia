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
      className={`rounded-xl p-8 max-w-sm border transform hover:scale-105 transition-transform duration-300 border-gray-200 text-gray-800 shadow-lg`}
    >
      <div className="text-center">
        <div className="flex items-center p-4 justify-center">
          {emoji ? (
            <span className="text-4xl">{emoji}</span>
          ) : image ? (
            <Image priority src={image} className="w-15 h-10" alt={imageAlt} />
          ) : null}
        </div>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className={`text-sm leading-relaxed`}>{description}</p>
      </div>
    </div>
  );
}
