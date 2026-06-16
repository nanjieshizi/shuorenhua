import { Citrus, ShoppingBasket, Croissant, Fish, Egg, Milk, Banana, Candy, Apple, Carrot, Wheat, Beef } from 'lucide-react'
import type { GroceryList } from './types'

export const groceryLists: GroceryList[] = [
  {
    id: 'week-14',
    name: 'Week 14',
    itemCount: 5,
    completedCount: 1,
    items: [
      { id: 'orange', name: 'Orange', checked: true, quantity: '2 pcs', calories: 95, icon: Citrus, gradient: 'from-amber-200 to-orange-300' },
      { id: 'avocado', name: 'Avocado', checked: false, calories: 160, icon: ShoppingBasket, gradient: 'from-green-200 to-emerald-300' },
      { id: 'ciabatta', name: 'Ciabatta', checked: false, quantity: '2 pcs', calories: 130, icon: Croissant, gradient: 'from-yellow-200 to-amber-300' },
      { id: 'salmon', name: 'Salmon', checked: false, quantity: '1 pack', calories: 208, icon: Fish, gradient: 'from-rose-200 to-pink-300' },
      { id: 'egg', name: 'Egg', checked: false, quantity: '12 pcs', calories: 78, icon: Egg, gradient: 'from-yellow-200 to-amber-300' },
    ],
  },
  {
    id: 'week-15',
    name: 'Week 15',
    itemCount: 3,
    completedCount: 0,
    items: [
      { id: 'milk', name: 'Milk', checked: false, quantity: '1 gal', calories: 149, icon: Milk, gradient: 'from-sky-200 to-blue-300' },
      { id: 'banana', name: 'Banana', checked: false, quantity: '6 pcs', calories: 105, icon: Banana, gradient: 'from-yellow-200 to-amber-300' },
      { id: 'cheese', name: 'Cheese', checked: false, calories: 113, icon: Candy, gradient: 'from-amber-200 to-orange-300' },
    ],
  },
  {
    id: 'week-16',
    name: 'Week 16',
    itemCount: 4,
    completedCount: 2,
    items: [
      { id: 'apple', name: 'Apple', checked: true, quantity: '4 pcs', calories: 95, icon: Apple, gradient: 'from-red-200 to-rose-300' },
      { id: 'carrot', name: 'Carrot', checked: true, quantity: '3 pcs', calories: 22, icon: Carrot, gradient: 'from-orange-200 to-amber-300' },
      { id: 'bread', name: 'Bread', checked: false, calories: 79, icon: Wheat, gradient: 'from-yellow-200 to-amber-200' },
      { id: 'beef', name: 'Beef', checked: false, quantity: '1 lb', calories: 250, icon: Beef, gradient: 'from-rose-200 to-red-300' },
    ],
  },
]
