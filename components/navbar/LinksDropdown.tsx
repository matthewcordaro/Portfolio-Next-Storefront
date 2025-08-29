"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { BsThreeDotsVertical } from "react-icons/bs"
import { links } from "@/utils/links"
import { getCurrentUserType } from "@/utils/actions"
import { UserRole } from "@/utils/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import UserIcon from "./UserIcon"
import SignOutLink from "./SignOutLink"

/**
 * Renders a dropdown menu for navigation links and user authentication actions.
 *
 * The menu displays different links based on current user's `UserRole`.
 * It also provides sign-in, sign-up, and sign-out options depending on the authentication state.
 *
 * @remarks
 * Client-side component.
 */
function LinksDropdown() {
  // State for dropdown open/close
  const [open, setOpen] = useState(false)

  // State for user type
  const [userType, setUserType] = useState<UserRole>("guest")
  useEffect(() => {
    async function fetchUserType() {
      const type = await getCurrentUserType()
      setUserType(type)
    }
    fetchUserType()
  }, [])

  const handleSignOut = () => {
    setUserType("guest")
    setOpen(false)
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='flex gap-4 max-w-[100px]'>
            <BsThreeDotsVertical className='w-6 h-6' />
            <UserIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-36' align='end' sideOffset={10}>
          {/* Links */}
          {links[userType].map(({ href, label }) => (
            <DropdownMenuItem
              asChild
              key={href}
              className='flex w-full text-right justify-end'
            >
              <Link href={href} className='capitalize w-full'>
                {label}
              </Link>
            </DropdownMenuItem>
          ))}
          {/* Signed Out */}
          <SignedOut>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignInButton mode='modal'>
                <button className='w-full text-left'>Login</button>
              </SignInButton>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SignUpButton mode='modal'>
                <button className='w-full text-left'>Register</button>
              </SignUpButton>
            </DropdownMenuItem>
          </SignedOut>
          {/* Signed In */}
          <SignedIn>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutLink onSignOut={handleSignOut} />
            </DropdownMenuItem>
          </SignedIn>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
export default LinksDropdown
