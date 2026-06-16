import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { GroceryList } from '../types'
import ListItem from '../components/ListItem'
import ToggleSwitch from '../components/ToggleSwitch'
import FoodIcon from '../components/FoodIcon'

interface ListDetailScreenProps {
  list: GroceryList
  onBack: () => void
}

export default function ListDetailScreen({ list, onBack }: ListDetailScreenProps) {
  const [items, setItems] = useState(list.items)
  const [showCalories, setShowCalories] = useState(false)

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const visibleIcons = items.slice(0, 4)

  return (
    <div className="min-h-dvh" style={{ backgroundColor: '#F6F7FB' }}>
      {/* Header */}
      <div style={{ padding: '32px 20px 8px' }}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center active:scale-90 transition-transform"
          style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#F1F3F5', marginBottom: 16 }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} color="#111111" strokeWidth={1.75} />
        </button>

        <h1
          className="tracking-tight"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 34, fontWeight: 700, color: '#111111' }}
        >
          {list.name}
        </h1>
      </div>

      {/* 3D Food Icon Grid */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {visibleIcons.map((item) => (
            <FoodIcon
              key={item.id}
              icon={item.icon}
              gradient={item.gradient}
              label={item.name}
              size="lg"
            />
          ))}
        </div>
      </div>

      {/* Toggle: "Show Calories" */}
      <div style={{ padding: '8px 20px', marginBottom: 8 }}>
        <div
          className="shadow-sm"
          style={{ backgroundColor: 'white', borderRadius: 28, padding: '6px 20px' }}
        >
          <ToggleSwitch
            checked={showCalories}
            onChange={setShowCalories}
            label="Show Calories"
          />
        </div>
      </div>

      {/* Item List */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              onToggle={handleToggle}
              showCalories={showCalories}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
