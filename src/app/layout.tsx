import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import SkipToContent from "@/components/SkipToContent";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bitlance.ai"),
  title: {
    default: "Voice Agent for Automated Calls | Bitlance AI",
    template: "%s — Voice Agent for Automated Calls",
  },
  description:
    "Automate inbound and outbound calls with Bitlance AI voice agents. Instantly qualify leads, book appointments, and sync data for automated voice calls—24/7.",
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
    title: "Bitlance AI — Voice Agent for Automated Calls",
    description:
      "Automate inbound calls with natural voice AI: lead intake, booking, follow-ups, and CRM sync — 24/7.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitlance AI — Voice Agent for Automated Calls",
    description:
      "Automate inbound calls with natural voice AI: lead intake, booking, follow-ups, and CRM sync — 24/7.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Bitlance AI Voice Agent",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "AI voice agents for automated calls that answer instantly, qualify leads, and book appointments 24/7."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does the AI handle different accents?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our advanced speech recognition engine is trained on diverse global datasets, allowing it to accurately understand and respond to various accents and dialects in real-time."
            }
          },
          {
            "@type": "Question",
            "name": "Can it book meetings directly into my calendar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The AI can check your availability and schedule meetings, site visits, or consultations directly into your CRM or calendar system, sending instant follow-up notifications."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if a customer needs a human agent?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The AI is designed to detect complexity or specific requests for human intervention. It can seamlessly transfer calls to your team while providing a full transcript of the conversation so far."
            }
          },
          {
            "@type": "Question",
            "name": "Is my customers' voice data secure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Security is our top priority. We use enterprise-grade end-to-end encryption and comply with global privacy standards to ensure all data is recorded, stored, and analyzed safely."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className={`${publicSans.variable} font-sans antialiased`}>
        <SkipToContent />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
