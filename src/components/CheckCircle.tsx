import { Check } from 'lucide-react'

interface CheckCircleProps {
  checked: boolean
}

export default function CheckCircle({ checked }: CheckCircleProps) {
  return (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
        checked ? 'bg-[#111111]' : 'border-2 border-[#D1D1D6]'
      }`}
      aria-hidden="true"
    >
      {checked && <Check size={14} color="#fff" strokeWidth={2.5} />}
    </div>
  )
}
