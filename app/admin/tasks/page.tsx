import { SubmitButton } from "@/components/form/Buttons"
import FormContainer from "@/components/form/FormContainer"
import SectionTitle from "@/components/global/SectionTitle"
import { deleteOldUnpaidOrders } from "@/utils/actions"

function TasksPage() {
  return (
    <div>
      <SectionTitle text='Cleanup Tasks' size='xl' />
      <FormContainer action={deleteOldUnpaidOrders}>
        <SubmitButton text='Delete Unpaid Orders Older Than 1 Month' className="w-4/12 mt-8 bg-destructive"/>
      </FormContainer>
    </div>
  )
}
export default TasksPage
