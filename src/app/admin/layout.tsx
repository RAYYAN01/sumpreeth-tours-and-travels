import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin is always light + brand-coloured, independent of the public theme.
  return (
    <div className="min-h-screen bg-[#eef3ee] text-forest-900 [color-scheme:light]">
      {children}
    </div>
  );
}
