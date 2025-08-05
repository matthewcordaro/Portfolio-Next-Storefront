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
import { links } from "@/utils/links"
import UserIcon from "./UserIcon"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import SignOutLink from "./SignOutLink"
import { auth } from "@clerk/nextjs/server"

// TODO: Fix the logout bug where the menu doesn't disappear.
// This will require moving any server-only logic out of UserIcon.tsx and into
// a server component or a layout-level fetch. Then passing the result down as
// props.

function LinksDropdown() {
  const { userId } = auth()
  const isAdmin = userId === process.env.ADMIN_USER_ID
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='flex gap-4 max-w-[100px]'>
            <BsThreeDotsVertical className='w-6 h-6' />
            <UserIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-36' align='end' sideOffset={10}>
          <SignedOut>
            <DropdownMenuItem>
              <SignInButton mode='modal'>
                <button className='w-full text-left'>Login</button>
              </SignInButton>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignUpButton mode='modal'>
              <button className='w-full text-left'>Register</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            {links.map((link) => {
              if (link.label === "dashboard" && !isAdmin) return null
              return (
                <DropdownMenuItem
                  key={link.href}
                  className='flex w-full text-right justify-end'
                >
                  <Link href={link.href} className='capitalize w-full'>
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutLink />
            </DropdownMenuItem>
          </SignedIn>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
export default LinksDropdown
