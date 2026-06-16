import ListCard from '../components/ListCard'
import { groceryLists } from '../data'
import type { GroceryList } from '../types'

interface ListsScreenProps {
  onSelectList: (list: GroceryList) => void
}

export default function ListsScreen({ onSelectList }: ListsScreenProps) {
  return (
    <div className="min-h-dvh" style={{ padding: '32px 20px' }}>
      <h1
        className="tracking-tight"
        style={{ fontFamily: 'var(--font-heading)', fontSize: 34, fontWeight: 700, color: '#111111', marginBottom: 24 }}
      >
        LISTS
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {groceryLists.map((list) => (
          <ListCard
            key={list.id}
            list={list}
            onClick={() => onSelectList(list)}
          />
        ))}
      </div>
    </div>
  )
}
