"use client"
import { useToast } from "@/hooks/use-toast"
import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"

/**
 * Renders a sign-out link that triggers a logout action and displays a toast notification.
 *
 * @param onSignOut - Optional callback function to execute after the sign-out action is triggered.
 *
 * @remarks
 * - Displays a toast message when the user clicks the logout link.
 * - Invokes the `onSignOut` callback if provided.
 * - Navigates the user to the home page (`"/"`) after logout.
 */
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
