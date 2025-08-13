"use client"

import { ReloadIcon } from "@radix-ui/react-icons"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SignInButton } from "@clerk/nextjs"
import { BsHeart, BsHeartFill, BsTrash, BsPencilSquare } from "react-icons/bs"

type bsnSize = "default" | "lg" | "sm"

type SubmitButtonProps = {
  className?: string
  text?: string
  size?: bsnSize
}

/**
 * Renders a submit button for forms, displaying a loading spinner when the form is pending.
 *
 * @param className - Additional CSS classes to apply to the button.
 * @param text - The text to display on the button when not pending. Defaults to "submit".
 * @param size - The size of the button. Defaults to "lg".
 *
 * @returns A styled submit button that is disabled and shows a spinner when the form is pending.
 */
export function SubmitButton({
  className = "",
  text = "submit",
  size = "lg",
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      disabled={pending}
      className={cn("capitalize", className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
        </>
      ) : (
        text
      )}
    </Button>
  )
}

type actionType = "edit" | "delete"

/**
 * Renders an icon button for form actions such as "edit" or "delete".
 * Displays a loading spinner when the form is pending submission.
 *
 * @param actionType - The type of action the button represents ("edit" or "delete").
 * @returns A button element with the corresponding icon or a loading spinner.
 *
 * @throws Error if an invalid `actionType` is provided.
 */
export function IconButton({ actionType }: { actionType: actionType }) {
  const { pending } = useFormStatus()

  const renderIcon = () => {
    switch (actionType) {
      case "edit":
        return <BsPencilSquare />
      case "delete":
        return <BsTrash />
      default:
        const never: never = actionType
        throw new Error(`Invalid action type: ${never}`)
    }
  }

  return (
    <Button
      type='submit'
      size={"icon"}
      variant={"link"}
      className='p-2 cursor-pointer'
    >
      {pending ? <ReloadIcon className='animate-spin' /> : renderIcon()}
    </Button>
  )
}

/**
 * Renders a button wrapped in a `SignInButton` component that triggers a sign-in modal.
 * The button displays a heart icon and is styled as an outlined icon button.
 *
 * @returns A React element containing the sign-in button with a heart icon.
 */
export function CardSignInButton() {
  return (
    <SignInButton mode='modal'>
      <Button
        type='submit'
        size={"icon"}
        variant={"outline"}
        className='p-2 cursor-pointer'
        asChild
      >
        <BsHeart />
      </Button>
    </SignInButton>
  )
}

/**
 * Renders a submit button for a card form, displaying different icons based on the form status and favorite state.
 *
 * - Shows a spinning reload icon when the form is pending submission.
 * - Shows a filled heart icon if the item is marked as favorite (`isFav` is `true`).
 * - Shows an outlined heart icon if the item is not marked as favorite (`isFav` is `false`).
 *
 * @param isFav - Indicates whether the item is marked as favorite.
 * @returns A React element representing the submit button.
 */
export const CardSubmitButton = ({ isFav }: { isFav: boolean }) => {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      size={"icon"}
      variant={"outline"}
      className='p-2 cursor-pointer'
    >
      {pending ? (
        <ReloadIcon className='animate-spin' />
      ) : isFav ? (
        <BsHeartFill />
      ) : (
        <BsHeart />
      )}
    </Button>
  )
}
