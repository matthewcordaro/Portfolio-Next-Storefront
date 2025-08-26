import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function RatingInput({
  name,
  labelText,
  defaultValue,
}: {
  name: string
  labelText?: string
  defaultValue?: number
}) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    (i + 1).toString()
  ).reverse()

  return (
    <div className='mb-2 max-w-xs'>
      <Label htmlFor={name} className='capitalize'>
        {labelText || name}
      </Label>
      <Select defaultValue={defaultValue?.toString() || stars[0]} name={name} required>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {stars.map((star) => {
            return (
              <SelectItem key={star} value={star}>
                {star}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default RatingInput
