import EmptyList from "@/components/global/EmptyList"
import { deleteProductAction, fetchAdminProducts } from "@/utils/actions"
import Link from "next/link"
import { formatCurrency } from "@/utils/format"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconButton } from "@/components/form/Buttons"
import { Icon } from "lucide-react"
import FormContainer from "@/components/form/FormContainer"

async function AdminProductsPage() {
  const items = await fetchAdminProducts()
  if (items.length === 0) return <EmptyList />
  return (
    <section>
      <Table>
        <TableCaption className='capitalize'>
          total products : {items.length}
        </TableCaption>
        <TableHeader>
          <TableRow className='capitalize'>
            <TableHead>product name</TableHead>
            <TableHead>company</TableHead>
            <TableHead>price</TableHead>
            <TableHead>actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(({ id, name, price, company }) => {
            return (
              <>
                <TableRow key={id}>
                  <TableCell>
                    <Link
                      href={`/products/${id}`}
                      className='underline text-muted-foreground tracking-wide capitalize'
                    >
                      {name}
                    </Link>
                  </TableCell>
                  <TableCell>{company}</TableCell>
                  <TableCell>{formatCurrency(price)}</TableCell>
                  <TableCell className='flex items-center gap-x-2'>
                    <Link href={`/admin/products/${id}/edit`}>
                      <IconButton actionType='edit' />
                    </Link>
                    <DeleteProduct productId={id} />
                  </TableCell>
                </TableRow>
              </>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}
export default AdminProductsPage

function DeleteProduct({ productId }: { productId: string }) {
  const deleteProduct = deleteProductAction.bind(null, { productId })
  return (
    <FormContainer action={deleteProduct}>
      <IconButton actionType='delete' />
    </FormContainer>
  )
}
