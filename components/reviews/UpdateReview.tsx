import { BsPencilSquare } from "react-icons/bs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import FormContainer from "@/components/form/FormContainer"
import RatingInput from "@/components/reviews/RatingInput"
import TextAreaInput from "@/components/form/TextAreaInput"
import { updateReviewAction } from "@/utils/actions"
import { Button } from "@/components/ui/button"
import { Review } from "@prisma/client"

function UpdateReview({ review }: { review: Review }) {
  const { id: reviewId, rating, comment, productId } = review

  const handleUpdateReview = async (_prevState: any, formData: FormData) => {
    return await updateReviewAction({
      productId,
      reviewId,
      rating: Number(formData.get("rating")),
      comment: formData.get("comment") as string,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span style={{ cursor: "pointer" }}>
          <BsPencilSquare />
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your review</DialogTitle>
        </DialogHeader>
        <FormContainer action={handleUpdateReview}>
          <input type='hidden' name='reviewId' value={reviewId} />
          <input type='hidden' name='productId' value={productId} />
          <RatingInput name='rating' defaultValue={rating} />
          <TextAreaInput
            name='comment'
            labelText='feedback'
            defaultValue={comment || ""}
          />
          <DialogFooter className='flex gap-2 mt-4'>
            <Button type='submit'>Confirm Change</Button>
            <DialogTrigger asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </FormContainer>
      </DialogContent>
    </Dialog>
  )
}
export default UpdateReview
