import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WalletProvider } from "@/context/WalletContext";

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pulse-protocol.xyz"),
  title: {
    default: "Pulse — Decentralized Cross-Chain Emergency Aid Protocol",
    template: "%s | Pulse Protocol",
  },
  description: "Real-time disaster telemetry from USGS and NASA, zero-knowledge beneficiary aid on Polygon Amoy, and permanent tamper-proof receipts sealed on Filecoin & IPFS.",
  keywords: [
    "Pulse",
    "Pulse Protocol",
    "disaster relief",
    "Filecoin",
    "IPFS",
    "Pinata",
    "Polygon Amoy",
    "Ethereum Sepolia",
    "Zero-Knowledge",
    "Merkle Proofs",
    "USGS",
    "NASA EONET",
    "Web3 humanitarian aid",
    "Glass-box audit",
    "direct aid",
    "smart contracts",
  ],
  authors: [{ name: "Pulse Protocol Team" }],
  creator: "Pulse Protocol",
  publisher: "Pulse Protocol",
  icons: {
    icon: [
      { url: "/ico.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/ico.png",
    apple: [
      { url: "/ico.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pulse-protocol.xyz",
    title: "Pulse — Decentralized Cross-Chain Emergency Aid Protocol",
    description: "Radical transparency and instant cross-chain humanitarian relief powered by Polygon, Filecoin, and live seismic telemetry.",
    siteName: "Pulse Protocol",
    images: [
      {
        url: "/ico.png",
        width: 800,
        height: 800,
        alt: "Pulse Protocol Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse — Decentralized Cross-Chain Emergency Aid Protocol",
    description: "Zero-knowledge disaster aid with immutable Filecoin receipts.",
    images: ["/ico.png"],
    creator: "@PulseProtocol",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/ico.png" type="image/png" />
        <link rel="apple-touch-icon" href="/ico.png" />
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
