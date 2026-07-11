import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import FeedbackButton from "@/components/FeedbackButton";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://triviakicks.com"),
  title: "Trivia Kicks",
  description: "Country trivia — penalty shootout style.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>",
  },
  openGraph: {
    title: "Trivia Kicks",
    description: "Country trivia shootout",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pressStart2P.variable}>
      <body>
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}
