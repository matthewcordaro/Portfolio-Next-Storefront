"use client"
import VerifyActionButton from "@/components/global/VerifyActionButton"
import { BsTrash } from "react-icons/bs"
import { deleteProductAction } from "@/utils/actions"

/**
 * Renders a button that prompts the user to confirm deletion of a product.
 * Displays a confirmation dialog before executing the deletion action.
 *
 * @param productId - The unique identifier of the product to be deleted.
 * @returns A React element that allows the user to delete the specified product.
 */
function DeleteProductButton({ productId }: { productId: string }) {
  return (
    <VerifyActionButton
      type='destructive'
      buttonIcon={() => (
        <BsTrash className='h-4 w-4 text-destructive group-hover:text-white transition-colors' />
      )}
      buttonClassName='p-2 rounded bg-transparent hover:bg-destructive group flex items-center justify-center shadow-none'
      dialogTitle='Delete Product'
      dialogDescription='Are you sure you want to delete this product? This action cannot be undone.'
      dialogConfirmText='Delete'
      verificationAction={async () => await deleteProductAction({ productId })}
    />
  )
}

export default DeleteProductButton
