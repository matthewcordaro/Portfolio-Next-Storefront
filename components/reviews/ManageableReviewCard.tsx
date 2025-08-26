"use client"
import ReviewCard from "./ReviewCard"
import UpdateReview from "./UpdateReview"
import VerifyActionButton from "@/components/global/VerifyActionButton"
import { BsTrash } from "react-icons/bs"
import { deleteReviewAction } from "@/utils/actions"
import { Review } from "@prisma/client"
import { ProductReviewWithProduct } from "@/utils/types"

/**
 * Renders a review card with management actions for a given review.
 * Displays update and delete (with verification) controls for the review.
 *
 * @param review - The review object to display and manage. Can be of type `Review` or `ProductReviewWithProduct`.
 * @returns A JSX element containing the review card and management actions.
 */
function ManageableReviewCard({
  review,
}: {
  review: Review | ProductReviewWithProduct
}) {
  const id = review.id
  return (
    <ReviewCard review={review}>
      <div className='flex items-center gap-x-2'>
        <UpdateReview review={review} />
        <VerifyActionButton
          type='destructive'
          buttonIcon={() => (
            <BsTrash className='h-4 w-4 text-destructive group-hover:text-white transition-colors' />
          )}
          buttonClassName='p-2 rounded bg-transparent hover:bg-destructive group flex items-center justify-center shadow-none'
          dialogTitle='Delete Review'
          dialogDescription='Are you sure you want to delete this review? This action cannot be undone.'
          dialogConfirmText='Delete'
          verificationAction={async () =>
            await deleteReviewAction({ reviewId: id })
          }
        />
      </div>
    </ReviewCard>
  )
}

export default ManageableReviewCard
