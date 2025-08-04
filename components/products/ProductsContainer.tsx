import ProductsGrid from "./ProductsGrid"
import ProductsList from "./ProductsList"
import { BsGrid, BsList } from "react-icons/bs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { fetchAllProducts } from "@/utils/actions"
import Link from "next/link"

async function ProductsContainer({
  layout,
  search,
}: {
  layout: string
  search: string
}) {
  const products = await fetchAllProducts()
  const numberOfProducts = products.length
  const searchTerm = search ? `&search=${search}` : ""

  return (
    <>
      {/* Header */}
      <section>
        <div className='flex justify-between items-center'>
          <h4 className='font-medium text-lg'>
            {numberOfProducts} product{numberOfProducts > 1 && "s"}
          </h4>
          <div className='flex gap-x-2'>
            <Button
              variant={layout === "grid" ? "default" : "ghost"}
              size='icon'
              asChild
            >
              <Link href={`/products?layout=grid${searchTerm}`}>
                <BsGrid />
              </Link>
            </Button>
            <Button
              variant={layout === "list" ? "default" : "outline"}
              size='icon'
              asChild
            >
              <Link href={`/products?layout=list${searchTerm}`}>
                <BsList />
              </Link>
            </Button>
          </div>
        </div>
        <Separator className='mt-4' />
      </section>
      {/* Products */}
      <div>
        {numberOfProducts === 0 ? (
          <h5 className='text-2xl mt-16'>
            Sorry, no products matched your search.
          </h5>
        ) : layout === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </>
  )
}
export default ProductsContainer
