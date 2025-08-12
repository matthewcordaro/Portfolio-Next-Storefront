import FeaturedProducts from "@/components/home/FeaturedProducts"
import LoadingProductsContainer from "@/components/products/LoadingProductsContainer"
import Hero from "@/components/home/Hero"
import { Suspense } from "react"

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense
        fallback={
          <LoadingProductsContainer
            text='Featured products'
            className='pt-24'
          />
        }
      >
        <FeaturedProducts />
      </Suspense>
    </>
  )
}
export default HomePage
