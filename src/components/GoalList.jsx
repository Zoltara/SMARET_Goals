import { useState } from 'react'
import { GoalCard } from './GoalCard'
import { Target, Filter } from 'lucide-react'

export function GoalList({ goals, onGoalUpdate, onGoalDelete }) {
  const [filter, setFilter] = useState('all') // all, active, completed

  const filteredGoals = goals.filter(goal => {
    if (filter === 'completed') {
      return goal.progress >= 100
    } else if (filter === 'active') {
      return goal.progress < 100
    }
    return true
  })

  if (goals.length === 0) {
    return (
      <div className="glass-effect p-12 rounded-2xl text-center">
        <Target className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Goals Yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Create your first SMART goal to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Your Goals</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Goals</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdate={onGoalUpdate}
            onDelete={onGoalDelete}
          />
        ))}
      </div>
    </div>
  )
}

