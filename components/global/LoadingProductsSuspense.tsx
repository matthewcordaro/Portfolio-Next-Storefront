import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "../ui/skeleton"
import SectionTitle from "./SectionTitle"

function LoadingProductsSuspense({ text }: { text?: string }) {
  return (
    <section className='pt-24'>
      {text && <SectionTitle text={text} /> /* add section title if defined */}
      <div className='pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <LoadingProduct />
        <LoadingProduct />
        <LoadingProduct />
      </div>
    </section>
  )
}

function LoadingProduct() {
  return (
    <Card>
      <CardContent className='p-4'>
        <Skeleton className='h-48 w-full' />
        <Skeleton className='h-4 w-3/4 mt-4' />
        <Skeleton className='h-4 w-1/4 mt-4' />
      </CardContent>
    </Card>
  )
}
export default LoadingProductsSuspense
