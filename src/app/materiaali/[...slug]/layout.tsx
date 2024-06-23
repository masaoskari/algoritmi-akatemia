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
      <div className="overflow-y-auto flex flex-col mx-auto p-8 pt-4">
        {children}
      </div>
    </div>
  );
}
