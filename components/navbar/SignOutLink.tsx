"use client"

import { useToast } from "@/hooks/use-toast"
import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"

function SignOutLink({ onSignOut }: { onSignOut?: () => void }) {
  const { toast } = useToast()
  const handleLogout = () => {
    toast({ description: "Logging Out..." })
    if (onSignOut) onSignOut()
  }
  return (
    <SignOutButton>
      <Link href={"/"} className='w-full text-left' onClick={handleLogout}>
        Logout
      </Link>
    </SignOutButton>
  )
}
export default SignOutLink
