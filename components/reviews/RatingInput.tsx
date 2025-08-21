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
}: {
  name: string
  labelText?: string
}) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    (i + 1).toString()
  ).reverse()
  return (
    <div className='mb-2 max-w-xs'>
      <Label htmlFor={name} className='capitalize'>
        {labelText || name}
      </Label>
      <Select defaultValue={stars[0]} name={name} required>
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
