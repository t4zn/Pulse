import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Filecoin Aid Receipt Certificate",
  description: "Cryptographically verified on-chain disaster relief disbursement certificate sealed on Filecoin & IPFS.",
  openGraph: {
    title: "Verified Filecoin Aid Receipt | Pulse",
    description: "Cryptographically verified disaster aid receipt sealed permanently on Filecoin & IPFS.",
    images: ["/ico.png"],
  },
};

export default function ReceiptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
