import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs"

function Rating({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2 // rounds to nearest 0.5
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1
    if (rounded >= starValue) return "full"
    if (rounded >= starValue - 0.5) return "half"
    return "empty"
  })

  return (
    <div className="flex items-center gap-x-1">
      {stars.map((type, i) => {
        const className = `w-3 h-3 ${
          type === "full" || type === "half" ? "text-primary" : "text-gray-400"
        }`
        if (type === "full") return <BsStarFill className={className} key={i} />
        if (type === "half") return <BsStarHalf className={className} key={i} />
        return <BsStar className={className} key={i} />
      })}
    </div>
  )
}

export default Rating
