import { BsCart2 } from "react-icons/bs"
import Link from "next/link"
import { Button } from "../ui/button"
import { fetchCartItems } from "@/utils/actions"

async function CartButton() {
  const numItemsInCart = await fetchCartItems()
  return (
    <Button
      size='icon'
      variant={"outline"}
      asChild
      className='flex justify-center items-center relative'
    >
      <Link href='/cart'>
        <BsCart2 />
        <span className='absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center'>
          {numItemsInCart}
        </span>
      </Link>
    </Button>
  )
}
export default CartButton
