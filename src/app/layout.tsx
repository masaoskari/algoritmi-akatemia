import type { Metadata } from "next";
import PyodideProvider from "@/context/PyodideProvider";
import BodyWrapper from "../components/BodyWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Algoritmi akatemia",
  description: "Algoritmi akatemia nettisivut koodauksen opiskeluun.",
  icons: {
    icon: "/a_a_logo.svg",
  },
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
        {/* Hack to prevent body scroll on content pages */}
        <BodyWrapper />
        <PyodideProvider>{children}</PyodideProvider>
      </body>
    </html>
  );
}
