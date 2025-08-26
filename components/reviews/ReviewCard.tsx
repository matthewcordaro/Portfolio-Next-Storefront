import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Rating from "./Rating"
import Comment from "./Comment"
import Image from "next/image"
import { Review } from "@prisma/client"
import { ProductReviewWithProduct } from "@/utils/types"

type ReviewCardProps = {
  review: Review | ProductReviewWithProduct
  children?: React.ReactNode
}

/**
 * Renders a card displaying a review, including the reviewer's name, image, rating, and comment.
 * If the review contains product information, the product's name and image are shown;
 * otherwise, the author's name and image are used.
 *
 * @param review - The review object containing details such as rating, comment, and optionally product info.
 * @param children - Optional React nodes to be rendered in the top-right corner of the card.
 */
function ReviewCard({ review, children }: ReviewCardProps) {
  // Set the name and image based on whether the review includes product info
  const { name, image } =
    "product" in review
      ? review.product
      : { name: review.authorName, image: review.authorImageUrl }
  return (
    <Card className='relative'>
      <CardHeader>
        <div className='flex items-center'>
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className='w-12 h-12 rounded-full object-cover'
          />
          <div className='ml-4'>
            <h3 className='text-sm font-bold capitalize mb-1'>{name}</h3>
            <Rating rating={review.rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Comment comment={review.comment} />
      </CardContent>
      <div className='absolute top-3 right-3'>{children}</div>
    </Card>
  )
}

export default ReviewCard
