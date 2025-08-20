import { Separator } from "@/components/ui/separator"

function SectionTitle({
  text,
  size = "3xl",
}: {
  text: string
  size?: "xl" | "2xl" | "3xl"
}) {
  const ms = size === "3xl" ? "8" : size === "2xl" ? "6" : "4"
  return (
    <div>
      <div className={`text-${size} medium tracking-wider capitalize mb-${ms}`}>
        {text}
      </div>
      <Separator />
    </div>
  )
}
export default SectionTitle
