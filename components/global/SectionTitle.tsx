import { Separator } from "@/components/ui/separator"

function SectionTitle({ text }: { text: string }) {
  return (
    <div>
      <div className='text-3xl medium tracking-wider capitalize mb-8'>
        {text}
      </div>
      <Separator />
    </div>
  )
}
export default SectionTitle
