"use client"

import { useFormState } from "react-dom"
import { useEffect } from "react"
import { ActionFunction } from "@/utils/types"
import { useToast } from "@/hooks/use-toast"
import { redirect } from "next/navigation"

const initialState = {
  message: "",
}

function FormContainer({
  action,
  onSuccessRedirectTo,
  children,
}: {
  action: ActionFunction
  onSuccessRedirectTo?: string
  children: React.ReactNode
}) {
  const [state, formAction] = useFormState(action, initialState)
  const { toast } = useToast()
  useEffect(() => {
    if (state?.message) {
      toast({ description: state.message })
      if (onSuccessRedirectTo) {
        redirect(onSuccessRedirectTo)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])
  return <form action={formAction}>{children}</form>
}
export default FormContainer
