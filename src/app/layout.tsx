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
    <html lang="en">
      <head>
        {/* This loads GitHub theme for rehypeHighlight. */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css"
        />
        <script src="https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js"></script>
      </head>
      <body>
        <PyodideProvider>{children}</PyodideProvider>
      </body>
    </html>
  );
}
