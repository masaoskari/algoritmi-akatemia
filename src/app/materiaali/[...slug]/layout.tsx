import "@/app/globals.css";
import { getAllContentFrontMatters } from "@/lib/mdxUtils";
import SidePanel from "@/components/SidePanel";

export default function ContentPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const frontMatters = getAllContentFrontMatters();
  return (
    <div className="flex md:flex-row flex-col h-screen overflow-hidden">
      <SidePanel frontMatters={frontMatters} />
      <div className="w-full flex flex-col p-4 md:p-8 md:pt-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
