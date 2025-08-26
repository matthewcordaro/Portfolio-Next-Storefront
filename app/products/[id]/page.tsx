import BreadCrumbs from "@/components/single-product/BreadCrumbs"
import Image from "next/image"
import { formatCurrency } from "@/utils/format"
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton"
import AddToCart from "@/components/single-product/AddToCart"
import ProductRating from "@/components/single-product/ProductRating"
import ShareButton from "@/components/single-product/ShareButton"
import SubmitReview from "@/components/reviews/SubmitReview"
import ProductReviews from "@/components/reviews/ProductReviews"
import { fetchSingleProduct, findExistingReview } from "@/utils/actions"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

async function SingleProductPage({ params }: { params: { id: string } }) {
  const product = await fetchSingleProduct(params.id)
  const { name, image, company, description } = product
  const dollarAmount = formatCurrency(product.price)
  const { userId } = auth()
  const reviewDoesNotExist =
    userId && !(await findExistingReview(userId, product.id))
  return (
    <section>
      <BreadCrumbs name={name} />
      <div className='mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16'>
        {/* image */}
        <div className='relative h-full'>
          <Image
            src={image}
            alt={name}
            fill
            sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw'
            priority
            className='w-full rounded-md object-cover'
          />
        </div>
        {/* product info */}
        <div>
          <div className='flex gap-x-8 items-center'>
            <h1 className='capitalize text-3xl font-bold'>{name}</h1>
            <div className='flex items-center gap-x-2'>
              <FavoriteToggleButton productId={product.id} />
              <ShareButton name={name} productId={product.id} />
            </div>
          </div>
          <Link href='#product-rating' className='no-underline'>
            <ProductRating productId={product.id} />
          </Link>
          <h4 className='text-xl mt-2'>{company}</h4>
          <p className='mt-3 text-md bg-muted inline-block p-2 rounded-md'>
            {dollarAmount}
          </p>
          <p className='mt-6 leading-8 text-muted-foreground'>{description}</p>
          <AddToCart productId={product.id} />
        </div>
      </div>
      <div id='product-rating' />
      <ProductReviews
        productId={product.id}
        currentUserId={userId || undefined}
      />
      {reviewDoesNotExist && <SubmitReview productId={product.id} />}
    </section>
  )
}
export default SingleProductPage
