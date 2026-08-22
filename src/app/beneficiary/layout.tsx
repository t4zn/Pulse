import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beneficiary Aid Portal & ZK Verification",
  description: "Claim direct emergency disaster relief aid securely using Zero-Knowledge Merkle cryptographic proofs and gasless EIP-712 claims.",
  openGraph: {
    title: "Beneficiary Aid Portal | Pulse",
    description: "Zero-Knowledge disaster relief verification and instant USDC aid claims on Polygon Amoy.",
    images: ["/ico.png"],
  },
};

export default function BeneficiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
