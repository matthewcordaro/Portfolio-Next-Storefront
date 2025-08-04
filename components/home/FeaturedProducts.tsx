import { fetchFeatureProducts } from "@/utils/actions"
import SectionTitle from "../global/SectionTitle"
import EmptyList from "../global/EmptyList"
import ProductsGrid from "../products/ProductsGrid"

async function FeaturedProducts() {
  const featuredProducts = await fetchFeatureProducts()
  if (featuredProducts.length === 0) return <EmptyList />
  return (
    <section className='pt-24'>
      <SectionTitle text='Featured products' />
      <ProductsGrid products={featuredProducts} />
    </section>
  )
}
export default FeaturedProducts
