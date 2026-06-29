import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/data/profile";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/chrome/Cursor";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import { Preloader } from "@/components/chrome/Preloader";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kim-gihyun.github.io"),
  title: {
    default: "Gihyun Kim — Mechanical Engineering · Applied AI",
    template: "%s — Gihyun Kim",
  },
  description:
    "Gihyun Kim — engineering student at HKU working across triboelectric materials, robotics, and applied AI. A specimen catalogue of built things.",
  openGraph: {
    title: "Gihyun Kim — Mechanical Engineering · Applied AI",
    description:
      "Triboelectric materials, robotics, and applied AI. Live 3D models, an interactive CV, and field notes from the lab.",
    url: "https://kim-gihyun.github.io",
    siteName: "Gihyun Kim",
    images: [{ url: "/assets/og-card.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/assets/og-card.png"] },
  icons: { icon: "/assets/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1018" },
  ],
};

// No-flash theme + js flag, applied before first paint.
const bootScript = `(function(){try{var t=localStorage.getItem('gk-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;var r=document.documentElement;r.setAttribute('data-theme',d?'dark':'light');r.classList.add('js');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <Preloader name={profile.name} />
        <Cursor />
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
