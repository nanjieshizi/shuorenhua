import type { LucideIcon } from 'lucide-react'

export interface FoodItem {
  id: string
  name: string
  checked: boolean
  quantity?: string
  calories?: number
  icon: LucideIcon
  gradient: string
}

export interface GroceryList {
  id: string
  name: string
  itemCount: number
  completedCount: number
  items: FoodItem[]
}
