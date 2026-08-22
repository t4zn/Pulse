import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WalletProvider } from "@/context/WalletContext";

export const metadata: Metadata = {
  title: "PULSE — Cross-Chain Emergency Aid & Verifiable Aid Protocol",
  description: "Cross-chain disaster relief protocol with Google Gemini 2.5 Flash severity triggers, zero-knowledge victim verification, and 100% visual public audit trails.",
  keywords: ["blockchain charity", "cross-chain emergency vault", "Gemini 2.5 Flash", "Merkle tree privacy", "EIP-712 gasless claim"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-canvas text-ink antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
        <WalletProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
