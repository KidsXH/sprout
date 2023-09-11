import './globals.css'
import type {Metadata} from 'next'
import {inter} from './fonts'
import {Providers} from "@/providers/redux";

export const metadata: Metadata = {
  title: 'SPROUT',
  description: 'Step-by-Step Programming Tutorials Authoring Tool',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <html lang="en">
      <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  )
}
