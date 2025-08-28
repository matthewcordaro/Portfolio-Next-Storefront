"use client"
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
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

function UpdateReview({ review }: { review: Review }) {
  const { id: reviewId, rating, comment, productId } = review
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleUpdateReview = async (_prevState: any, formData: FormData) => {
    const message = await updateReviewAction({
      productId,
      reviewId,
      rating: Number(formData.get("rating")),
      comment: formData.get("comment") as string,
    })
    if (!message.error) {
      setOpen(false)
      // need to show toast here because FormContainer's useEffect won't run on same message due to dialog closing
      toast({ description: message.message })
    }
    return message
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"icon"}
          className='p-2 cursor-pointer hover:bg-primary hover:text-primary-foreground'
          onClick={() => setOpen(true)}
        >
          <BsPencilSquare />
        </Button>
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
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
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
