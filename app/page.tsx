import FeaturedProducts from "@/components/home/FeaturedProducts"
import LoadingProducts from "@/components/products/LoadingProductsSuspense"
import Hero from "@/components/home/Hero"
import { Suspense } from "react"

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense
        fallback={
          <LoadingProducts text='Featured products' className='pt-24' />
        }
      >
        <FeaturedProducts />
      </Suspense>
    </>
  )
}
export default HomePage
