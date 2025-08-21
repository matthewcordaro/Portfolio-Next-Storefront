"use server"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import SectionTitle from "@/components/global/SectionTitle"
import { fetchUserOrders } from "@/utils/actions"
import { formatCurrency, formatDate, formatTime } from "@/utils/format"

async function OrdersPage() {
  const orders = await fetchUserOrders()
  return (
    <>
      <SectionTitle text='Your Orders' />
      <div>
        <Table>
          <TableCaption>Total orders: {orders.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead># Items</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(
              ({
                id,
                numItems,
                orderTotal,
                subTotal,
                tax,
                shipping,
                createdAt,
              }) => {
                return (
                  <TableRow key={id}>
                    <TableCell>{formatDate(createdAt)}</TableCell>
                    <TableCell>{formatTime(createdAt)}</TableCell>
                    <TableCell>{numItems}</TableCell>
                    <TableCell>{formatCurrency(subTotal)}</TableCell>
                    <TableCell>{formatCurrency(tax)}</TableCell>
                    <TableCell>{formatCurrency(shipping)}</TableCell>
                    <TableCell>{formatCurrency(orderTotal)}</TableCell>
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
export default OrdersPage
