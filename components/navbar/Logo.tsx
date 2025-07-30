import { BsBoxSeam } from "react-icons/bs"
import { Button } from "../ui/button"
import Link from "next/link"
function Logo() {
  return (
    <Button size='icon' asChild>
      <Link href='/'>
        <BsBoxSeam className='w-6 h-6' />
      </Link>
    </Button>
  )
}
export default Logo
