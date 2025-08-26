import { fetchProductReviewsWithProductForAuthUser } from "@/utils/actions"
import SectionTitle from "@/components/global/SectionTitle"
import ManageableReviewCard from "@/components/reviews/ManageableReviewCard"

async function ReviewsPage() {
  const reviews = await fetchProductReviewsWithProductForAuthUser()
  if (reviews.length === 0)
    return <SectionTitle text='you have no reviews yet' />

  return (
    <>
      <SectionTitle text='Your Reviews' />
      <section className='grid md:grid-cols-2 gap-8 mt-4 '>
        {reviews.map((review) => {
          return <ManageableReviewCard key={review.id} review={review} />
        })}
      </section>
    </>
  )
}

export default ReviewsPage
