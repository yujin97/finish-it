import { type Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finish it",
  description: "for finishing things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-12 border-b border-border">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              Finish it
            </Link>
            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton>
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <div className="flex flex-col px-4 sm:px-6 lg:px-12 gap-6 lg:gap-8">
            {children}
          </div>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
