"use client"

import LoadingProductsSuspense from "@/components/products/LoadingProductsSuspense"

const loading = () => (
  <LoadingProductsSuspense text='loading products...' className='font-medium text-lg' />
)

export default loading
