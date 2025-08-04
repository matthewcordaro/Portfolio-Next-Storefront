import { BsHeart } from "react-icons/bs"
import { Button } from "@/components/ui/button"

function FavoriteToggleButton({ productId }: { productId: string }) {
  return (
    <Button size={"icon"} variant={"outline"} className='p-2 cursor-pointer'>
      <BsHeart />
    </Button>
  )
}
export default FavoriteToggleButton
