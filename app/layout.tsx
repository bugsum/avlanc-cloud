import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header/header";
// import { Announcement } from "@/components/ui/announcement";
import { ChatWidget } from "@/components/chat-widget";
import { ubuntu } from "@/lib/fonts";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Avlanc Cloud",
  description: "The NextGen Hosting Solutions!",
  icons: "/avlanc.png",
  authors: { name: "Samarth Sharma", url: "https://github.com/bugsum" },
  category: "Cloud Hosting",
  creator: "Avlanc Corp.",
  keywords: [
    "Hosting",
    "Minecraft Hosting",
    "Best Minecraft Hosting",
    "Best Cloud Hosting",
    "Free Hosting",
    "VPS Server",
    "Cheap",
    "Affordable",
    "Avlanc Cloud",
    "Avlanc Corp",
    "Avlanc",
    "avlanc",
    "avlanc cloud",
    "free hosting",
    "free",
  ],
  openGraph: {
    type: "website",
    countryName: "India",
    description: "The NextGen Hosting Solutions!",
    emails: "support@avlanc.com",
    title: "Avlanc Cloud",
    siteName: "Avlanc Cloud",
    url: "https://avlanc.com",
    phoneNumbers: "+91 9302687277",
    locale: "en",
  },
  robots: { index: true, follow: true },
  other: {
    "google-adsense-account": "ca-pub-2187816601788737",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased relative",
          ubuntu.className
        )} suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <div
            className={cn(
              "absolute inset-0 overflow-hidden pointer-events-none"
            )}
            style={{ zIndex: "-10" }}
          >
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square rounded-full"
              style={{
                width: "30%",
                background: `radial-gradient(circle, ${[
                  "#ff007a",
                  "#00e0ff",
                  "#7928ca",
                ].join(", ")})`,
                filter: `blur(120px)`,
                opacity: "0.15",
              }}
            />
          </div> */}
          {/* <Banner2
            title="Stability is here!"
            description="Avlanc's first stable release is here."
            buttonText="Get Started"
            buttonUrl="/"
          /> */}
          {/* <Announcement
            message="The website is still under beta version. 🚀"
            variant="warning"
            // link={{ text: "Learn More", href: "https://avlanc.com" }}
          /> */}
          <ChatWidget />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
