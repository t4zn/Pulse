import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glass-Box Audit Ledger & Filecoin Registry",
  description: "100% public cryptographic audit trail. View verified disaster relief receipts permanently sealed on Filecoin & IPFS with real-time Polygon Amoy transaction logs.",
  openGraph: {
    title: "Glass-Box Audit Ledger | Pulse",
    description: "Cryptographically verified disaster aid receipts sealed permanently on Filecoin & IPFS.",
    images: ["/ico.png"],
  },
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
