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
      <div className="overflow-y-auto flex flex-col mx-auto p-4 md:p-8 md:pt-4 w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
        {children}
      </div>
    </div>
  );
}
