import FeaturedProducts from "@/components/home/FeaturedProducts"
import FeaturedProductsSuspense from "@/components/home/FeaturedProductsSuspense"
import Hero from "@/components/home/Hero"
import { Suspense } from "react"

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<FeaturedProductsSuspense />}>
        <FeaturedProducts />
      </Suspense>
    </>
  )
}
export default HomePage
