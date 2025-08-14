import { Card, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/utils/format"
import { createOrderAction } from "@/utils/actions"
import FormContainer from "../form/FormContainer"
import { SubmitButton } from "../form/Buttons"
import { Cart } from "@prisma/client"

function CartTotals({ cart }: { cart: Cart }) {
  const { cartTotal, shipping, tax, orderTotal } = cart
  return (
    <div>
      <Card className='p-8'>
        <AmountRow label='Subtotal' amount={cartTotal} />
        <AmountRow label='Shipping' amount={shipping} />
        <AmountRow label='Tax' amount={tax} />
        <CardTitle className='mt-8'>
          <AmountRow label='Order Total' amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
      <FormContainer action={createOrderAction}>
        <SubmitButton text='place order' className='w-full mt-8' />
      </FormContainer>
    </div>
  )
}
export default CartTotals

function AmountRow({
  label,
  amount,
  lastRow,
}: {
  label: string
  amount: number
  lastRow?: boolean
}) {
  return (
    <>
      <p className='flex justify-between text-sm'>
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </p>
      {lastRow ? null : <Separator className='my-2' />}
    </>
  )
}
