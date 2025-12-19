import { useState } from 'react'
import { Calendar, Target, ChevronDown, ChevronUp, Trash2, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { calculateProgress, calculateTimeProgress } from '../utils/progress'

export function GoalCard({ goal, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const progress = calculateProgress(goal, goal.breakdown, goal.completedActions)
  const timeProgress = calculateTimeProgress(goal)

  const handleActionComplete = (type, index) => {
    const updatedGoal = { ...goal }
    
    if (type === 'daily' && updatedGoal.breakdown?.daily) {
      updatedGoal.breakdown.daily[index].completed = !updatedGoal.breakdown.daily[index].completed
    } else if (type === 'weekly' && updatedGoal.breakdown?.weekly) {
      updatedGoal.breakdown.weekly[index].completed = !updatedGoal.breakdown.weekly[index].completed
    } else if (type === 'monthly' && updatedGoal.breakdown?.monthly) {
      updatedGoal.breakdown.monthly[index].completed = !updatedGoal.breakdown.monthly[index].completed
    }
    
    // Update completed actions count
    const allActions = [
      ...(updatedGoal.breakdown?.daily || []),
      ...(updatedGoal.breakdown?.weekly || []),
      ...(updatedGoal.breakdown?.monthly || []),
      ...(updatedGoal.breakdown?.yearly || [])
    ]
    updatedGoal.completedActions = allActions.filter(a => a.completed).length
    updatedGoal.lastActionDate = new Date().toISOString()
    
    onUpdate(updatedGoal)
  }

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(goal.id)
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  return (
    <div className="glass-effect p-5 rounded-xl hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">{goal.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{goal.measurement}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Target: {goal.targetDate ? format(new Date(goal.targetDate), 'MMM dd, yyyy') : 'Not set'}</span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className={`p-2 rounded-lg transition-colors ${
            showDeleteConfirm
              ? 'bg-red-500 text-white'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700 dark:text-gray-200">Progress</span>
          <span className="font-bold text-primary-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Time: {timeProgress}%</span>
          <span>{goal.completedActions} actions completed</span>
        </div>
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700 py-2 rounded-lg hover:bg-primary-50 transition-colors"
      >
        <span className="text-sm font-medium">
          {expanded ? 'Hide' : 'Show'} Action Steps
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Content */}
      {expanded && goal.breakdown && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
          {/* Daily Actions */}
          {goal.breakdown.daily && goal.breakdown.daily.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Daily Actions
              </h4>
              <div className="space-y-2">
                {goal.breakdown.daily.slice(0, 5).map((action, index) => (
                  <label
                    key={index}
                    className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={action.completed || false}
                      onChange={() => handleActionComplete('daily', index)}
                      className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <span className={`text-sm ${action.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                        {action.action || action}
                      </span>
                      {action.date && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {format(new Date(action.date), 'MMM dd')}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Milestones */}
          {goal.breakdown.weekly && goal.breakdown.weekly.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Weekly Milestones</h4>
              <div className="space-y-2">
                {goal.breakdown.weekly.slice(0, 3).map((milestone, index) => (
                  <label
                    key={index}
                    className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={milestone.completed || false}
                      onChange={() => handleActionComplete('weekly', index)}
                      className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <span className={`text-sm ${milestone.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                        Week {milestone.week}: {milestone.milestone}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Checkpoints */}
          {goal.breakdown.monthly && goal.breakdown.monthly.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Monthly Checkpoints</h4>
              <div className="space-y-2">
                {goal.breakdown.monthly.slice(0, 3).map((checkpoint, index) => (
                  <label
                    key={index}
                    className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checkpoint.completed || false}
                      onChange={() => handleActionComplete('monthly', index)}
                      className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <span className={`text-sm ${checkpoint.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                        Month {checkpoint.month}: {checkpoint.checkpoint}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

