import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bitlance.ai"),
  title: {
    default: "Voice Agent",
    template: "%s — Voice Agent",
  },
  description:
    "AI voice agents that answer calls instantly, qualify leads, book appointments, and sync updates to WhatsApp/CRM — with <1s responses and 99.9% uptime.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Bitlance AI",
    title: "Bitlance AI — AI Voice Agents for Sales & Support",
    description:
      "Automate inbound calls with natural voice AI: lead intake, booking, follow-ups, and CRM sync — 24/7.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitlance AI — AI Voice Agents for Sales & Support",
    description:
      "Automate inbound calls with natural voice AI: lead intake, booking, follow-ups, and CRM sync — 24/7.",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${publicSans.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-white/10 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-primary"
        >
          Skip to content
        </a>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
