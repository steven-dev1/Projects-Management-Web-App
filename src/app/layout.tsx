import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBarWrapper } from "@/components/Providers/NavBarWrapper";
import Providers from "@/components/Providers/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Projects M.",
    template: "%s | Projects M.",
  },
  description: "Gestiona tus proyectos y tareas en equipo con tableros kanban, checklists, fechas límite y más.",
  keywords: ["kanban", "gestión de proyectos", "tareas", "colaboración", "tablero"],
  authors: [{ name: "Projects M." }],
  creator: "Projects M.",
  openGraph: {
    type: "website",
    title: "Projects M.",
    description: "Gestiona tus proyectos y tareas en equipo con tableros kanban.",
    siteName: "Projects M.",
  },
  twitter: {
    card: "summary",
    title: "Projects M.",
    description: "Gestiona tus proyectos y tareas en equipo con tableros kanban.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased h-full`}>
        <SpeedInsights />
        <Providers>
          <NavBarWrapper>{children}</NavBarWrapper>
        </Providers>
      </body>
    </html>
  );
}
