import { LogoWithText } from "@/components/LogoWithText";
import { TurtleEditor } from "@/components/TurtleEditor";

export default async function TurtlePlayground() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 overflow-y-auto">
      <div className="w-full flex justify-between items-center px-4 py-4">
        <LogoWithText />

        <h1 className="text-white font-bold text-2xl text-center flex-grow">
          Kilpikonna leikkikenttä 🐢
        </h1>
      </div>
      <div className="md:w-1/2 h-2/3">
        <TurtleEditor />
      </div>
    </div>
  );
}
