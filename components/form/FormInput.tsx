import { Input } from "../ui/input"
import { Label } from "../ui/label"

type FormInputProps = {
  name: string
  type: string
  label?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
}

function FormInput({
  label,
  name,
  type,
  defaultValue,
  placeholder,
  required = true,
}: FormInputProps) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}
export default FormInput
