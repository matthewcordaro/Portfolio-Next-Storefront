import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/utils/types"
import { BsArrowClockwise } from "react-icons/bs"

interface VerifyButtonProps {
  type?: "destructive" | "default"
  buttonText: string
  buttonClassName?: string
  dialogTitle: string
  dialogDescription: string
  dialogConfirmText: string
  verificationAction: () => Promise<Message>
}

/**
 * Renders a button that opens a confirmation dialog before performing an action.
 *
 * @param type - Optional type of the action, can be 'destructive' or 'default'. Defaults to 'default'.
 * @param buttonText - The text to display on the button.
 * @param buttonClassName - Optional CSS class name(s) for styling the button.
 * @param dialogTitle - The title of the confirmation dialog.
 * @param dialogDescription - The description or message shown in the dialog.
 * @param dialogConfirmText - The text for the confirmation button inside the dialog.
 * @param verificationAction - The callback function to execute when the action is confirmed.
 */
function VerifyActionButton({
  type = "default",
  buttonText,
  buttonClassName,
  dialogTitle,
  dialogDescription,
  dialogConfirmText,
  verificationAction,
}: VerifyButtonProps) {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [awaitingAction, setAwaitingAction] = useState(false)

  const handleConfirm = async () => {
    setAwaitingAction(true)
    const message = await verificationAction()
    setAwaitingAction(false)
    setDialogOpen(false)
    toast({ description: message?.message || "Action completed." })
  }

  return (
    <>
      <Button
        variant={type}
        className={buttonClassName}
        onClick={() => setDialogOpen(true)}
      >
        {buttonText}
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='secondary'
              onClick={() => setDialogOpen(false)}
              disabled={awaitingAction}
            >
              Cancel
            </Button>
            <Button
              type='button'
              variant={type}
              className={
                type === "destructive" ? "bg-destructive text-white" : ""
              }
              onClick={handleConfirm}
              disabled={awaitingAction}
            >
              {awaitingAction ? (
                <BsArrowClockwise className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                dialogConfirmText
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default VerifyActionButton
