import dynamic from 'next/dynamic'; // Ensure this is present
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Standard imports for Providers
import ReduxProvider from "./providers/ReduxProvider";
import AuthBootstrap from "./providers/AuthBootstrap";
import { Toaster } from "react-hot-toast";
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import QueryProvider from './providers/QueryProvider';


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ReduxProvider>
            <AuthBootstrap>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster position="top-center" reverseOrder={true} />
            </AuthBootstrap>
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}