"use client"
import { deleteOldUnpaidOrders } from "@/utils/actions"
import VerifyActionButton, {
  VerifyDialog,
} from "@/components/global/VerifyActionButton"
import SectionTitle from "@/components/global/SectionTitle"
import { BsArrowClockwise, BsTrash } from "react-icons/bs"

function TasksPage() {
  const verifyChildren = (
    <div className='flex items-center gap-x-2'>
      <BsTrash className='h-4 w-4' />
      <span>Delete</span>
    </div>
  )
  const verifyDialog: VerifyDialog = {
    title: "Delete Unpaid Orders",
    description:
      "Are you sure you want to delete all unpaid orders older than 30 minutes? This action cannot be undone.",
    verifyChildren,
    awaitActionChildren: (
      <BsArrowClockwise className='mr-2 h-4 w-4 animate-spin' />
    ),
  }
  return (
    <div>
      <SectionTitle text='Cleanup Tasks' size='xl' />
      <VerifyActionButton
        type='destructive'
        className='mt-8'
        verifyDialog={verifyDialog}
        verifyAction={deleteOldUnpaidOrders}
      >
        Delete Unpaid Orders Older Than 30 Minutes
      </VerifyActionButton>
    </div>
  )
}
export default TasksPage
