import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataCloudScript from "@/components/DataCloudScript";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Altamar · Moda mediterránea",
  description: "Lino, algodón y fibras naturales para mujer, hombre y niños. Envío gratis desde 50 €."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-screen">
        <DataCloudScript />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
