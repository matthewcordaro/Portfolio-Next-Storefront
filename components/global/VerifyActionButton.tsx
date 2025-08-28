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

/**
 * Represents the configuration for a verification dialog component.
 *
 * @property title - The title text displayed in the dialog.
 * @property description - The description or message shown in the dialog.
 * @property verifyChildren - Optional React node to customize the verify button's content.
 * @property rejectChildren - Optional React node to customize the reject button's content.
 * @property awaitActionChildren - Optional React node to display while awaiting an action.
 * @default
 *   verifyChildren: "Confirm",
 *   rejectChildren: "Cancel"
 *   awaitActionChildren: "..."
 */
export type VerifyDialog = {
  title: string
  description: string
  verifyChildren?: React.ReactNode
  rejectChildren?: React.ReactNode
  awaitActionChildren?: React.ReactNode
}

/**
 * Renders a button that, when clicked, opens a verification dialog before executing a specified action.
 *
 * The dialog prompts the user to confirm or cancel the action, displaying customizable title, description,
 * and button labels. Upon confirmation, the provided `verifyAction` function is executed asynchronously,
 * and a toast notification is shown with the result message.
 *
 * @param type - The variant of the button (e.g., "default", "destructive"). Defaults to "default".
 * @param className - Optional CSS class names to apply to the button.
 * @param verifyDialog - Optional dialog configuration object. If not provided, default values are used.
 * @param verifyAction - The async function to execute when the user confirms the action.
 * @param children - The content to display inside the trigger button.
 * @returns A React node containing the trigger button and the verification dialog.
 *
 * @default
 *   type: "default"
 *   verifyDialog.title: "Are you sure?",
 *   verifyDialog.description: "This action cannot be undone.",
 *   verifyDialog.verifyChildren: "Confirm",
 *   verifyDialog.rejectChildren: "Cancel"
 *   verifyDialog.awaitActionChildren: "..."
 */
export default function VerifyActionButton({
  type = "default",
  className,
  verifyDialog,
  verifyAction,
  children,
}: {
  type?: "destructive" | "default"
  className?: string
  verifyDialog?: VerifyDialog
  verifyAction: () => Promise<Message>
  children: React.ReactNode
}): React.ReactNode {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [awaitingAction, setAwaitingAction] = useState(false)

  const handleConfirm = async () => {
    setAwaitingAction(true)
    const message = await verifyAction()
    setAwaitingAction(false)
    setDialogOpen(false)
    toast({ description: message?.message || "Action completed." })
  }

  // Set defaults if not provided
  if (!verifyDialog) {
    verifyDialog = {
      title: "Are you sure?",
      description: "This action cannot be undone.",
      verifyChildren: "Confirm",
      rejectChildren: "Cancel",
      awaitActionChildren: "...",
    }
  } else {
    verifyDialog.verifyChildren = verifyDialog.verifyChildren || "Confirm"
    verifyDialog.rejectChildren = verifyDialog.rejectChildren || "Cancel"
    verifyDialog.awaitActionChildren = verifyDialog.awaitActionChildren || "..."
  }

  return (
    <>
      {/* Button that triggers the Dialog */}
      <Button
        variant={type}
        className={className}
        onClick={() => setDialogOpen(true)}
      >
        {children}
      </Button>
      {/* The verification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{verifyDialog.title}</DialogTitle>
            <DialogDescription>{verifyDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {/* Reject */}
            <Button
              variant='secondary'
              onClick={() => setDialogOpen(false)}
              disabled={awaitingAction}
            >
              {verifyDialog.rejectChildren}
            </Button>
            {/* Verify */}
            <Button
              type='button'
              variant={type}
              className={
                type === "destructive" ? "bg-destructive text-white" : ""
              }
              onClick={handleConfirm}
              disabled={awaitingAction}
            >
              {awaitingAction
                ? verifyDialog.awaitActionChildren
                : verifyDialog.verifyChildren}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
