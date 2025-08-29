"use client"
import { BsThreeDotsVertical } from "react-icons/bs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Button } from "../ui/button"
import { NavLink, links } from "@/utils/links"
import UserIcon from "./UserIcon"
import {
  Protect,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs"
import SignOutLink from "./SignOutLink"
import { useEffect, useState } from "react"
import { getCurrentUserType } from "@/utils/actions"
import { UserRole } from "@/utils/types"

function LinksDropdown() {
  const [userType, setUserType] = useState<UserRole>("guest")
  const [open, setOpen] = useState(false)
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

  const displayLinks = links[userType]
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
          <MenuLinks links={displayLinks} />
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

function MenuLinks({ links }: { links: NavLink[] }) {
  return (
    <>
      {links.map((link) => {
        return (
          <DropdownMenuItem
            asChild
            key={link.href}
            className='flex w-full text-right justify-end'
          >
            <Link href={link.href} className='capitalize w-full'>
              {link.label}
            </Link>
          </DropdownMenuItem>
        )
      })}
    </>
  )
}
