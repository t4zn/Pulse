import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Oracle & Multi-Sensor Triage Engine",
  description: "Autonomous disaster severity evaluation engine powered by Google Gemini 2.5 Flash, multi-spectral satellite imagery, and automated smart contract triggers.",
  openGraph: {
    title: "AI Oracle & Triage Engine | Pulse",
    description: "Autonomous disaster triage with Google Gemini 2.5 Flash and multi-spectral sensors.",
    images: ["/ico.png"],
  },
};

export default function OracleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
