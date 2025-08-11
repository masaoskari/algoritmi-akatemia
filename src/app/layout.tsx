import type { Metadata } from "next";
import PyodideProvider from "@/context/PyodideProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Algoritmi akatemia",
  description: "Algoritmi akatemia nettisivut koodauksen opiskeluun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <head>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js"></script>
      </head>
      <body>
        <PyodideProvider>{children}</PyodideProvider>
      </body>
    </html>
  );
}
