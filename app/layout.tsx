import type { Metadata } from "next"
import { Varela_Round } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar/Navbar"
import Container from "@/components/global/Container"
import Providers from "./providers"
import { ClerkProvider } from "@clerk/nextjs"
import TimezoneDetector from "@/components/global/TimezoneDetector"

const font = Varela_Round({ subsets: ["latin"], weight: "400" })

export const metadata: Metadata = {
  title: "Portfolio Next Storefront",
  description: "A store built with Next.js",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },
}

type ReadonlyChildrenReactNode = Readonly<{ children: React.ReactNode }>

export default function RootLayout({ children }: ReadonlyChildrenReactNode) {
  const htmlElementAttributes: React.HTMLAttributes<HTMLElement> = {
    lang: "en",
    suppressHydrationWarning: true,
  }
  return (
    <ClerkProvider>
      <html {...htmlElementAttributes} className="scroll-smooth">
        <body className={font.className}>
          <Providers>
            <TimezoneDetector />
            <Navbar />
            <Container className='py-20'>{children}</Container>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
