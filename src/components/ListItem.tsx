import type { FoodItem } from '../types'
import FoodIcon from './FoodIcon'
import CheckCircle from './CheckCircle'
import QuantityBadge from './QuantityBadge'

interface ListItemProps {
  item: FoodItem
  onToggle: (id: string) => void
  showCalories: boolean
}

export default function ListItem({ item, onToggle, showCalories }: ListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      className="text-left w-full cursor-pointer transition-all duration-150 active:scale-[0.985]"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        backgroundColor: '#F6F7FB',
        borderRadius: 20,
      }}
      aria-label={`${item.name}${item.checked ? ', checked' : ''}${item.quantity ? `, ${item.quantity}` : ''}`}
    >
      <CheckCircle checked={item.checked} />

      <FoodIcon icon={item.icon} gradient={item.gradient} label={item.name} size="sm" />

      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: item.checked ? '#8E8E93' : '#222222',
            textDecoration: item.checked ? 'line-through' : 'none',
            display: 'block',
          }}
        >
          {item.name}
        </span>
        {showCalories && item.calories && (
          <span style={{ fontSize: 13, color: '#8E8E93' }}>{item.calories} Kcal</span>
        )}
      </div>

      {item.quantity && <QuantityBadge quantity={item.quantity} />}
    </button>
  )
}
