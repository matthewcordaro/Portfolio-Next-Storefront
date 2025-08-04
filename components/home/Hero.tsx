import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroCarousel from "./HeroCarousel"

function Hero() {
  return (
    <section className='grid grid-cols-1 lg:grid-cols-2 gap-24 items-center'>
      <div>
        <h1 className='max-w-2xl font-bold text-4xl tracking-tight sm:text-6xl'>
          Welcome to our shop
        </h1>
        <p className='mt-8 max-w-xl text-lg leading-8 text-muted-foreground'>
          Step into the spotlight with us as we unveil a vibrant experience full
          of imagination, connection, and unforgettable moments. Whether you are
          here to be inspired, entertained, or simply explore something new, our
          show celebrates every voice, every story, and every spark of
          curiosity.
        </p>
        <Button asChild size='lg' className='mt-10'>
          <Link href='/products'>Our Products</Link>
        </Button>
      </div>
      <HeroCarousel />
    </section>
  )
}
export default Hero
