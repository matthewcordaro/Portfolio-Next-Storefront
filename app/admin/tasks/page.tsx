"use client"
import { deleteOldUnpaidOrders } from "@/utils/actions"
import VerifyActionButton from "@/components/global/VerifyActionButton"
import SectionTitle from "@/components/global/SectionTitle"

function TasksPage() {
  return (
    <div>
      <SectionTitle text='Cleanup Tasks' size='xl' />
      <VerifyActionButton
        type='destructive'
        buttonText='Delete Unpaid Orders Older Than 30 Minutes'
        buttonClassName='w-4/12 mt-8'
        dialogTitle='Confirm Deletion'
        dialogDescription='This will delete all unpaid orders created more than 30 mins ago.'
        dialogConfirmText='Delete'
        verificationAction={deleteOldUnpaidOrders}
      />
    </div>
  )
}
export default TasksPage
