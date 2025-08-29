"use client"
import { useUser } from "@clerk/nextjs"
import { BsPerson } from "react-icons/bs"

function UserIcon() {
  const { user } = useUser()
  const profileImage = user?.imageUrl
  if (profileImage)
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profileImage}
          alt={user.fullName ?? "User avatar"}
          className='w-6 h-6 rounded-full object-cover'
        />
    )
  return <BsPerson />
}
export default UserIcon
