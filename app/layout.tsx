import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LangProvider } from "@/components/providers/lang-provider";
import { SessionProvider } from "@/components/providers/session-provider";


const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-sans",
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-ibm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Oak LMS — เรียนภาษาเปลี่ยนชีวิต", template: "%s | Oak LMS" },
  description: "ระบบการเรียนรู้ออนไลน์คุณภาพสูง คอร์สภาษาอังกฤษ จีน ญี่ปุ่น จากเจ้าของภาษา",
  keywords: ["LMS", "เรียนภาษา", "TOEIC", "IELTS", "HSK", "JLPT", "online course"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-ibm-sans), 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif" }}>
        <SessionProvider>
          <ThemeProvider>
            <LangProvider>
              {children}
              {/* <ChatbotWidget /> — hidden, not released yet */}
            </LangProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
