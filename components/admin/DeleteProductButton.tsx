"use client"
import VerifyActionButton, {
  VerifyDialog,
} from "@/components/global/VerifyActionButton"
import { BsArrowClockwise, BsTrash } from "react-icons/bs"
import { deleteProductAction } from "@/utils/actions"

/**
 * Renders a button that prompts the user to confirm deletion of a product.
 * Displays a confirmation dialog before executing the deletion action.
 *
 * @param productId - The unique identifier of the product to be deleted.
 * @returns A React element that allows the user to delete the specified product.
 */
function DeleteProductButton({ productId }: { productId: string }) {
  const verifyChildren = (
    <div className='flex items-center gap-x-2'>
      <BsTrash className='h-4 w-4' />
      <span>Delete</span>
    </div>
  )
  const verifyDialog: VerifyDialog = {
    title: "Delete Product",
    description:
      "Are you sure you want to delete this product? This action cannot be undone.",
    verifyChildren,
    awaitActionChildren: (
      <BsArrowClockwise className='mr-2 h-4 w-4 animate-spin' />
    ),
  }

  return (
    <VerifyActionButton
      type='destructive'
      className='p-2 rounded bg-transparent hover:bg-destructive group flex items-center justify-center shadow-none'
      verifyDialog={verifyDialog}
      verifyAction={async () => await deleteProductAction({ productId })}
    >
      <BsTrash className='h-4 w-4 text-destructive group-hover:text-white transition-colors' />
    </VerifyActionButton>
  )
}

export default DeleteProductButton
