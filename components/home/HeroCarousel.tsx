"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import hero1 from "@/public/images/1.jpg"
import hero2 from "@/public/images/2.jpg"
import hero3 from "@/public/images/3.jpg"
import hero4 from "@/public/images/4.jpg"
import { useMemo } from "react"

const carouselImages = [hero1, hero2, hero3, hero4]

function HeroCarousel() {
  // autoplay memoized to not kill the counter on rerender
  const autoplay = useMemo(() => Autoplay({ delay: 5000 }), [])
  return (
    <div className='hidden lg:block'>
      <Carousel plugins={[autoplay]}>
        <CarouselContent>
          {carouselImages.map((image, index) => {
            return (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className='p-2'>
                    <Image
                      src={image}
                      alt='hero'
                      className='w-full h-[24rem] rounded-md object-cover'
                      priority={index === 0}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
export default HeroCarousel
