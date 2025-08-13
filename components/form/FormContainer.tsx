"use client"

import { useFormState } from "react-dom"
import { useEffect } from "react"
import { ActionFunction } from "@/utils/types"
import { useToast } from "@/hooks/use-toast"

const initialState = {
  message: "",
}

function FormContainer({
  action,
  children,
}: {
  action: ActionFunction
  children: React.ReactNode
}) {
  const [state, formAction] = useFormState(action, initialState)
  const { toast } = useToast()
  useEffect(() => {
    if (state?.message) {
      toast({ description: state.message })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])
  return <form action={formAction}>{children}</form>
}
export default FormContainer
