import { useState, useEffect } from 'react'
import { Bell, X, AlertCircle } from 'lucide-react'
import { calculateReminderLevel, getReminderMessage, shouldShowReminder } from '../utils/reminders'
import { storage, STORAGE_KEYS } from '../utils/storage'

export function ReminderBanner({ goals, show, onClose }) {
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    if (goals.length === 0) return

    const activeReminders = goals
      .filter(goal => {
        const settings = storage.get(`${STORAGE_KEYS.REMINDERS}_${goal.id}`, { enabled: true, frequency: 1 })
        return shouldShowReminder(goal, goal.lastActionDate, settings)
      })
      .map(goal => {
        const level = calculateReminderLevel(goal, goal.lastActionDate)
        const message = getReminderMessage(goal, level)
        return {
          goalId: goal.id,
          goalTitle: goal.title,
          level,
          ...message
        }
      })
      .filter(r => r.level !== 'gentle' || show) // Only show gentle if explicitly shown

    setReminders(activeReminders)
  }, [goals, show])

  if (reminders.length === 0) {
    return null
  }

  // Show the most urgent reminder
  const priorityReminder = reminders.sort((a, b) => {
    const priority = { aggressive: 4, firm: 3, moderate: 2, gentle: 1 }
    return priority[b.level] - priority[a.level]
  })[0]

  if (!priorityReminder) return null

  const bgColors = {
    gentle: 'bg-blue-50 border-blue-200',
    moderate: 'bg-yellow-50 border-yellow-200',
    firm: 'bg-orange-50 border-orange-200',
    aggressive: 'bg-red-50 border-red-200'
  }

  const textColors = {
    gentle: 'text-blue-800',
    moderate: 'text-yellow-800',
    firm: 'text-orange-800',
    aggressive: 'text-red-800'
  }

  return (
    <div className={`${bgColors[priorityReminder.level]} border-l-4 ${priorityReminder.level === 'aggressive' ? 'border-red-500' : priorityReminder.level === 'firm' ? 'border-orange-500' : priorityReminder.level === 'moderate' ? 'border-yellow-500' : 'border-blue-500'} p-4 mx-4 mt-4 rounded-lg shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <AlertCircle className={`w-5 h-5 ${textColors[priorityReminder.level]} mt-0.5 flex-shrink-0`} />
          <div className="flex-1">
            <h4 className={`font-semibold ${textColors[priorityReminder.level]} mb-1`}>
              {priorityReminder.title}
            </h4>
            <p className={`text-sm ${textColors[priorityReminder.level]} opacity-90`}>
              {priorityReminder.message}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Goal: {priorityReminder.goalTitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg hover:bg-white/50 transition-colors ${textColors[priorityReminder.level]}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

