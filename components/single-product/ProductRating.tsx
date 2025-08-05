import { BsStar } from "react-icons/bs"

function ProductRating({ productId }: { productId: string }) {
  // TODO: implement dynamic count and rating
  const rating = 4.2
  const count = 25

  const className = `flex gap-1 items-center text-md mt-1 mb-4`
  const countValue = `(${count}) reviews`
  return (
    <span className={className}>
      <BsStar className='w-3 h-3' /> {rating} {count}
    </span>
  )
}
export default ProductRating
