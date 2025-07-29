import type { Metadata } from "next"
import { Varela_Round } from "next/font/google"
import "./globals.css"

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
    // suppressHydrationWarning: true,
  }
  return (
    <html {...htmlElementAttributes}>
      <body className={font.className}>{children}</body>
    </html>
  )
}
