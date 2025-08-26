"use client"
import ReviewCard from "./ReviewCard"
import UpdateReview from "./UpdateReview"
import VerifyActionButton from "@/components/global/VerifyActionButton"
import { BsTrash } from "react-icons/bs"
import { deleteReviewAction } from "@/utils/actions"

interface ManageableReviewCardProps {
  reviewInfo: {
    comment: string
    rating: number
    name: string
    image: string
    id: string
  }
}

function ManageableReviewCard({ reviewInfo }: ManageableReviewCardProps) {
  const { id } = reviewInfo
  return (
    <ReviewCard reviewInfo={reviewInfo}>
      <div className='flex items-center gap-x-2'>
        <UpdateReview reviewId={id} />
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
