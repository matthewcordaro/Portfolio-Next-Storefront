"use client"

import LoadingProductsContainer from "@/components/products/LoadingProductsContainer"

const loading = () => (
  <LoadingProductsContainer
    text='loading products...'
    className='font-medium text-lg'
  />
)

export default loading
