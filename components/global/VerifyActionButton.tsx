import { createElement, useState } from "react"
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
import { IconType } from "react-icons"

type RequireIconOrText =
  | { buttonIcon: IconType; buttonText?: string }
  | { buttonIcon?: IconType; buttonText: string }

type VerifyButtonProps = {
  type?: "destructive" | "default"
  buttonClassName?: string
  dialogTitle: string
  dialogDescription: string
  dialogConfirmText: string
  verificationAction: () => Promise<Message>
} & RequireIconOrText

/**
 * A reusable button component that prompts the user with a confirmation dialog before executing a verification action.
 *
 * @remarks At least one of `buttonIcon` or `buttonText` is required.
 *
 * @param type - The visual variant of the button (e.g., "default", "destructive").
 * @param buttonIcon - Optional icon component to display in the button.
 * @param buttonText - The text to display on the button.
 * @param buttonClassName - Additional CSS classes for the button.
 * @param dialogTitle - The title displayed in the confirmation dialog.
 * @param dialogDescription - The description displayed in the confirmation dialog.
 * @param dialogConfirmText - The text for the confirmation button in the dialog.
 * @param verificationAction - An async function to execute when the user confirms the action. Should return a message object.
 *
 * Displays a loading spinner while the verification action is pending, disables buttons during the process,
 * and shows a toast notification with the result message upon completion.
 */
function VerifyActionButton({
  type = "default",
  buttonIcon,
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
        {buttonIcon && createElement(buttonIcon)}
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
