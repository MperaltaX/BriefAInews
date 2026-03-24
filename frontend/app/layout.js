import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "BriefAInews — Resúmenes inteligentes de noticias",
  description:
    "Mantente informado con resúmenes generados por IA de las noticias más relevantes del mundo en tiempo real.",
};

import { AuthProvider } from "@/context/AuthContext";
import NeuralBackground from "@/components/NeuralBackground";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <NeuralBackground />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
