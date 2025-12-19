import { useState } from 'react'
import { Calendar, Flame, CheckCircle2, Circle, TrendingUp } from 'lucide-react'
import { updateHabitStreak, getHabitScore, checkHabitCompletion } from '../utils/habits'
import { format, isToday, parseISO } from 'date-fns'

export function HabitTracker({ habits, goals, onHabitUpdate }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleHabitToggle = (habit) => {
    const completed = !checkHabitCompletion(habit)
    const updatedHabit = updateHabitStreak(habit, completed)
    onHabitUpdate(updatedHabit)
  }

  const getGoalName = (goalId) => {
    const goal = goals.find(g => g.id === goalId)
    return goal ? goal.title : 'Unknown Goal'
  }

  if (habits.length === 0) {
    return (
      <div className="glass-effect p-12 rounded-2xl text-center">
        <Flame className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Habits Yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Habits are automatically created when you add goals!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-effect p-6 rounded-2xl">
        <h2 className="text-2xl font-bold gradient-text mb-4">Habit Tracker</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Build consistency with Atomic Habits principles</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-primary-800">Total Streaks</span>
            </div>
            <p className="text-2xl font-bold text-primary-600">
              {habits.reduce((sum, h) => sum + h.streak, 0)}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {Math.max(...habits.map(h => h.bestStreak), 0)}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Today's Habits</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {habits.filter(h => checkHabitCompletion(h)).length} / {habits.length}
            </p>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map(habit => {
          const completed = checkHabitCompletion(habit)
          const score = getHabitScore(habit)
          const goalName = getGoalName(habit.goalId)

          return (
            <div key={habit.id} className="glass-effect p-6 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">{habit.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Goal: {goalName}</p>
                  
                  {/* Habit Stack */}
                  <div className="space-y-2 mt-3">
                    <div className="text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Cue:</span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">{habit.cue}</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Response:</span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">{habit.response}</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Reward:</span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">{habit.reward}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleHabitToggle(habit)}
                  className={`ml-4 p-3 rounded-lg transition-all ${
                    completed
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Streak and Score */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Flame className={`w-5 h-5 ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {habit.streak} day streak
                    </span>
                    {habit.bestStreak > habit.streak && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (Best: {habit.bestStreak})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Habit Strength:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-primary-600">{score}%</span>
                  </div>
                </div>
              </div>

              {/* Atomic Habits Tips */}
              {habit.streak === 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>💡 Tip:</strong> Start your streak today! Even 2 minutes counts. Make it obvious, attractive, easy, and satisfying.
                  </p>
                </div>
              )}

              {habit.streak > 0 && habit.streak < 7 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>🔥 Keep going!</strong> You're building momentum. Research shows it takes 21-66 days to form a habit. You're on day {habit.streak}!
                  </p>
                </div>
              )}

              {habit.streak >= 7 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800">
                    <strong>🎉 Amazing!</strong> You've maintained a {habit.streak}-day streak! This habit is becoming automatic.
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Atomic Habits Principles */}
      <div className="glass-effect p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Atomic Habits Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h4 className="font-semibold text-primary-800 mb-2">1. Make it Obvious</h4>
            <p className="text-sm text-primary-700">Set clear cues and place them where you'll see them.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">2. Make it Attractive</h4>
            <p className="text-sm text-purple-700">Connect habits to things you enjoy and want.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">3. Make it Easy</h4>
            <p className="text-sm text-green-700">Start with 2-minute rule. Reduce friction.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">4. Make it Satisfying</h4>
            <p className="text-sm text-yellow-700">Reward yourself immediately. Track progress visually.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

