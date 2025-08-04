import FeaturedProducts from "@/components/home/FeaturedProducts"
import LoadingProductsSuspense from "@/components/global/LoadingProductsSuspense"
import Hero from "@/components/home/Hero"
import { Suspense } from "react"

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LoadingProductsSuspense text='Featured products' />}>
        <FeaturedProducts />
      </Suspense>
    </>
  )
}
export default HomePage
