import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Arovia Vibes | Luxury Perfume Collection",
  description: "Exquisite fragrances for the modern individual. Experience luxury with Arovia Vibes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground min-h-full flex flex-col`}
      >
        <OrderProvider>
          <CartProvider>
            {children}
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#bda87f',
                border: '1px solid #bda87f',
              },
            }} />
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
