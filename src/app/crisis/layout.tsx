import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Crisis Feed & Emergency Vaults",
  description: "Real-time global natural disaster telemetry from USGS Seismology, EMSC, and NASA EONET with instant cross-chain direct relief vaults.",
  openGraph: {
    title: "Live Crisis Feed & Emergency Vaults | Pulse",
    description: "Real-time natural disaster monitoring and instant decentralized aid vaults.",
    images: ["/ico.png"],
  },
};

export default function CrisisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
