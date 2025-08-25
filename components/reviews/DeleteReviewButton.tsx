"use client"
import VerifyActionButton from "@/components/global/VerifyActionButton"
import { BsTrash } from "react-icons/bs"
import { deleteReviewAction } from "@/utils/actions"

/**
 * Renders a button that prompts the user to confirm deletion of a review.
 * Displays a confirmation dialog before executing the deletion action.
 *
 * @param reviewId - The unique identifier of the review to be deleted.
 * @returns A React element that allows the user to delete the specified review.
 */
function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  return (
    <VerifyActionButton
      type='destructive'
      buttonIcon={() => (
        <BsTrash className='h-4 w-4 text-destructive group-hover:text-white transition-colors' />
      )}
      buttonClassName='p-2 rounded bg-transparent hover:bg-destructive group flex items-center justify-center shadow-none'
      dialogTitle='Delete Review'
      dialogDescription='Are you sure you want to delete this review? This action cannot be undone.'
      dialogConfirmText='Delete'
      verificationAction={async () => await deleteReviewAction({ reviewId })}
    />
  )
}

export default DeleteReviewButton
