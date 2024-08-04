import React from "react";

type ExamplePrintProps = {
  children: React.ReactNode;
};

export const ExamplePrint = ({ children }: ExamplePrintProps) => {
  return (
    <div style={{ whiteSpace: "pre-wrap" }} className="min-h-[200px] shadow-lg">
      <div className="flex justify-between">
        <p className="font-semibold px-4">Konsoli</p>
        <p className="text-blue-600 font-semibold px-4">Esimerkkitulostus</p>
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
};
