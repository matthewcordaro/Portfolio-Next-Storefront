import { currentUser } from "@clerk/nextjs/server"
import { BsPerson } from "react-icons/bs"

async function UserIcon() {
  const user = await currentUser()
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
