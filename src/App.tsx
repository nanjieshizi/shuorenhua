import { useState } from 'react'
import ListsScreen from './screens/ListsScreen'
import ListDetailScreen from './screens/ListDetailScreen'
import type { GroceryList } from './types'

export default function App() {
  const [selectedList, setSelectedList] = useState<GroceryList | null>(null)

  if (selectedList) {
    return (
      <ListDetailScreen
        list={selectedList}
        onBack={() => setSelectedList(null)}
      />
    )
  }

  return <ListsScreen onSelectList={setSelectedList} />
}
