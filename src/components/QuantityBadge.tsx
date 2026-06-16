interface QuantityBadgeProps {
  quantity: string
}

export default function QuantityBadge({ quantity }: QuantityBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#111111] text-white">
      {quantity}
    </span>
  )
}
