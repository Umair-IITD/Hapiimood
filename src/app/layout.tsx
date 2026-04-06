import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hapiimood | Your Emotional Operating System",
  description: "Culturally-aware AI empathy for Indian students. Anonymous, instant, and supportive.",
  keywords: ["mental health", "AI therapy", "student wellness", "Hapiimood", "CBT", "empathy"],
  authors: [{ name: "Hapiimood Team" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0F1117",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#6366F1", 
          colorText: "#1E293B", // Default dark text for light components
        },
        elements: {
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 pointer-cursor shadow-lg shadow-indigo-500/20",
          footerActionLink: "text-indigo-600 hover:text-indigo-700 transition-colors duration-300 font-bold",
        }
      }}
    >
      <html lang="en" className={`${plusJakarta.variable} h-full antialiased`} suppressHydrationWarning={true}>
        <body className="min-h-full font-sans selection:bg-primary/30">
          <div className="bg-mesh" aria-hidden="true" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
