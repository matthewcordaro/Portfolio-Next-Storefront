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
