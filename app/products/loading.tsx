"use client"

import LoadingProducts from "@/components/products/LoadingProductsSuspense"

const loading = () => (
  <LoadingProducts text='loading products...' className='font-medium text-lg' />
)

export default loading
