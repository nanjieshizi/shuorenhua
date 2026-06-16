import { ClipboardList } from 'lucide-react'
import type { GroceryList } from '../types'

interface ListCardProps {
  list: GroceryList
  onClick: () => void
}

export default function ListCard({ list, onClick }: ListCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full cursor-pointer transition-all duration-150 active:scale-[0.97] hover:shadow-sm"
      style={{
        backgroundColor: '#F1F3F5',
        borderRadius: 28,
        padding: '20px 16px',
      }}
      aria-label={`${list.name}, ${list.completedCount} of ${list.itemCount} items done`}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
          <ClipboardList size={30} color="#8E8E93" strokeWidth={1.5} />
        </div>

        <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
          <h2
            className="leading-tight"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#111111' }}
          >
            {list.name}
          </h2>
          <p style={{ fontSize: 13, color: '#8E8E93', marginTop: 2 }}>
            {list.completedCount}/{list.itemCount} products
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <div style={{ width: 24, height: 6, borderRadius: 999, backgroundColor: '#8E8E93' }} />
        <div style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: '#D1D1D6' }} />
        <div style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: '#D1D1D6' }} />
      </div>
    </button>
  )
}
