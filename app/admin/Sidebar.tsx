"use client"
import { adminLinks } from "@/utils/links"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

function Sidebar() {
  const pathname = usePathname()
  return (
    <aside>
      {adminLinks.map(({ href, label }) => {
        const isActivePage = pathname === href
        const variant = isActivePage ? "default" : "ghost"
        return (
          <Button
            key={href}
            asChild
            className='w-full mb-2 capitalize font-normal justify-start'
            variant={variant}
          >
            <Link href={href}>{label}</Link>
          </Button>
        )
      })}
    </aside>
  )
}
export default Sidebar
