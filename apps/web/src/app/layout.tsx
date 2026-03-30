import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediVisitas - CRM para Propagandistas Farmacêuticos",
  description:
    "Sistema de gestão de visitas médicas e relacionamento com profissionais de saúde",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className="min-h-screen bg-background antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
