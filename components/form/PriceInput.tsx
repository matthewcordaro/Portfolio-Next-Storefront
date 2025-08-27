"use client"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react"

const name = "price"
type FormInputNumberProps = {
  defaultValue?: number
}

function PriceInput({ defaultValue }: FormInputNumberProps) {
  const [price, setPrice] = useState<string>(
    typeof defaultValue === "number" ? defaultValue.toFixed(2) : ""
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value)
  }

  const handleBlur = () => {
    if (price === "") return
    const num = parseFloat(price)
    if (!isNaN(num)) {
      setPrice(num.toFixed(2))
    }
  }

  // CSS to hide number input arrows
  const hideArrows =
    "[appearance:textfield] " +
    "[&::-webkit-outer-spin-button]:appearance-none " +
    "[&::-webkit-inner-spin-button]:appearance-none"

  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        Price ($)
      </Label>
      <Input
        id={name}
        type='number'
        name={name}
        min={0}
        value={price}
        step={0.01}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        className={hideArrows}
      />
    </div>
  )
}
export default PriceInput
