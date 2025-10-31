import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Family Budget Tracker",
    template: "%s | Family Budget Tracker"
  },
  description: "Track your family's income and expenses with ease. Manage your budget, set financial goals, and achieve financial freedom together.",
  keywords: ["budget tracker", "family finance", "expense tracking", "income management", "financial planning"],
  authors: [{ name: "Family Budget Tracker Team" }],
  creator: "Family Budget Tracker",
  publisher: "Family Budget Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Family Budget Tracker',
    description: 'Track your family\'s income and expenses with ease. Manage your budget, set financial goals, and achieve financial freedom together.',
    siteName: 'Family Budget Tracker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Family Budget Tracker',
    description: 'Track your family\'s income and expenses with ease. Manage your budget, set financial goals, and achieve financial freedom together.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
        <Toaster />
      </body>
    </html>
  );
}
