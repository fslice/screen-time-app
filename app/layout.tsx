import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shutout — Stop Ignoring Your Screen Time Limits",
  description:
    "Shutout sets your Screen Time password in a way you won't remember, and makes you type 600 random words before you can retrieve it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html
        lang="en"
        className={`${instrumentSerif.variable} ${dmSans.variable} h-full`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
