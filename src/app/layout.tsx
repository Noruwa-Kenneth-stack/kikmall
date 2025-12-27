import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FlyerProvider } from "@/contexts/FlyerContext";
import { CityProvider } from "@/contexts/CityContext";
import { ProductFavoritesProvider } from "@/contexts/ProductFavorites";
import { ShoppingListProvider } from "@/contexts/ShoppingListContext";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "@/contexts/SearchContext";
import { AuthProvider } from "@/contexts/AuthContext"; // Import AuthProvider
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KIK HUB",
  description:
    "Browse flyers, add items to your shopping list, and shop smarter.",
  keywords: "kik, flyers, shopping, list, smarter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen">
        <CityProvider>
          <FlyerProvider>
            <FavoritesProvider>
              <ShoppingListProvider>
                <SearchProvider>
                  <ProductFavoritesProvider>
                    <AuthProvider>
                    {children}
                    </AuthProvider>
                  </ProductFavoritesProvider>
                </SearchProvider>
              </ShoppingListProvider>
            </FavoritesProvider>
          </FlyerProvider>
        </CityProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#fff",
              color: "#333",
              borderRadius: "10px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#16a34a",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
