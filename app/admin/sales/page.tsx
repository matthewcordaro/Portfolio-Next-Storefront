import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { fetchAdminOrders } from "@/utils/actions"
import { formatCurrency, formatDate, formatTime } from "@/utils/format"

async function SalesPage() {
  const orders = await fetchAdminOrders()
  return (
    <div>
      <Table>
        <TableCaption>Total Orders: {orders.length}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead># Items</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(
            ({
              id,
              numItems,
              orderTotal,
              tax,
              shipping,
              createdAt,
              email,
              subTotal,
              isPaid,
            }) => {
              return (
                <TableRow key={id}>
                  <TableCell>{email}</TableCell>
                  <TableCell>{formatDate(createdAt)}</TableCell>
                  <TableCell>{formatTime(createdAt)}</TableCell>
                  <TableCell>{numItems}</TableCell>
                  <TableCell>{formatCurrency(subTotal)}</TableCell>
                  <TableCell>{formatCurrency(tax)}</TableCell>
                  <TableCell>{formatCurrency(shipping)}</TableCell>
                  <TableCell>{formatCurrency(orderTotal)}</TableCell>
                  <TableCell>{isPaid ? "Y" : "N"}</TableCell>
                </TableRow>
              )
            }
          )}
        </TableBody>
      </Table>
    </div>
  )
}
export default SalesPage
