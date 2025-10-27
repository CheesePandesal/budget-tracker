import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Family Budget Tracker",
  description: "Track your family's income and expenses with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Navigation />
        <main className="lg:ml-64 min-h-screen bg-background">
          <div className="pt-20 sm:pt-24 lg:pt-8 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
