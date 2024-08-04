import SidePanel from "@/components/SidePanel";
import "@/app/globals.css";

export default function ContentPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex md:flex-row flex-col h-screen overflow-hidden">
      <SidePanel />
      <div className="w-full flex flex-col p-4 md:p-8 md:pt-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
