import type { LucideIcon } from 'lucide-react'

interface FoodIconProps {
  icon: LucideIcon
  gradient: string
  label: string
  size?: 'sm' | 'lg'
}

const sizeMap = { sm: 'w-12 h-12', lg: 'w-20 h-20' }
const iconSize = { sm: 22, lg: 30 }

export default function FoodIcon({ icon: Icon, gradient, label, size = 'lg' }: FoodIconProps) {
  return (
    <div
      className={`${sizeMap[size]} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0`}
      role="img"
      aria-label={label}
    >
      <Icon size={iconSize[size]} className="text-[#111111]" strokeWidth={1.5} />
    </div>
  )
}
