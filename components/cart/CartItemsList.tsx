import { Card } from "@/components/ui/card"
import { ImageColumn, InfoColumn, CurrencyColumn } from "./CartItemColumns"
import QuantityColumn from "./QuantityColumn"
import { CartItemWithProduct } from "@/utils/types"

function CartItemsList({ cartItems }: { cartItems: CartItemWithProduct[] }) {
  return (
    <div>
      {cartItems.map(({ id, amount, product }) => {
        const { id: productId, image, name, company, price } = product
        return (
          <Card
            key={id}
            className='flex flex-col gap-y-4 md:flex-row flex-wrap p-6 mb-8 gap-x-4'
          >
            <ImageColumn image={image} name={name} />
            <InfoColumn name={name} company={company} productId={productId} />
            <QuantityColumn id={id} quantity={amount} />
            <CurrencyColumn price={price} />
          </Card>
        )
      })}
    </div>
  )
}
export default CartItemsList
