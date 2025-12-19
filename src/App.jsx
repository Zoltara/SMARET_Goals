import { useState, useEffect } from 'react'
import { GoalInput } from './components/GoalInput'
import { GoalList } from './components/GoalList'
import { VisionBoard } from './components/VisionBoard'
import { ProgressDashboard } from './components/ProgressDashboard'
import { HabitTracker } from './components/HabitTracker'
import { MotivationPanel } from './components/MotivationPanel'
import { ReminderBanner } from './components/ReminderBanner'
import { storage, STORAGE_KEYS } from './utils/storage'
import { createHabitFromGoal } from './utils/habits'
import { Target, Sparkles, TrendingUp, Calendar, Sun, Moon } from 'lucide-react'

function App() {
  const [goals, setGoals] = useState([])
  const [habits, setHabits] = useState([])
  const [activeTab, setActiveTab] = useState('goals')
  const [showReminder, setShowReminder] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // Load data from localStorage
    const savedGoals = storage.get(STORAGE_KEYS.GOALS, [])
    const savedHabits = storage.get(STORAGE_KEYS.HABITS, [])
    setGoals(savedGoals)
    setHabits(savedHabits)
    const storedTheme = localStorage.getItem('smarter_theme')
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    } else {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('smarter_theme', theme)
  }, [theme])

  const handleGoalAdded = (newGoal) => {
    const updatedGoals = [...goals, newGoal]
    setGoals(updatedGoals)
    storage.set(STORAGE_KEYS.GOALS, updatedGoals)
    
    // Create habit for new goal
    const newHabit = createHabitFromGoal(newGoal)
    const updatedHabits = [...habits, newHabit]
    setHabits(updatedHabits)
    storage.set(STORAGE_KEYS.HABITS, updatedHabits)
  }

  const handleGoalUpdate = (updatedGoal) => {
    const updatedGoals = goals.map(g => g.id === updatedGoal.id ? updatedGoal : g)
    setGoals(updatedGoals)
    storage.set(STORAGE_KEYS.GOALS, updatedGoals)
  }

  const handleGoalDelete = (goalId) => {
    const updatedGoals = goals.filter(g => g.id !== goalId)
    setGoals(updatedGoals)
    storage.set(STORAGE_KEYS.GOALS, updatedGoals)
    
    // Remove associated habits
    const updatedHabits = habits.filter(h => h.goalId !== goalId)
    setHabits(updatedHabits)
    storage.set(STORAGE_KEYS.HABITS, updatedHabits)
  }

  const handleHabitUpdate = (updatedHabit) => {
    const updatedHabits = habits.map(h => h.id === updatedHabit.id ? updatedHabit : h)
    setHabits(updatedHabits)
    storage.set(STORAGE_KEYS.HABITS, updatedHabits)
  }

  return (
    <div className="min-h-screen pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">SMARTER Goals</h1>
                <p className="text-xs text-gray-600 dark:text-gray-300">Achieve Your Dreams</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-600 bg-white/70 dark:bg-slate-900/70 text-xs font-medium shadow-sm hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Moon className="w-4 h-4 text-primary-600" />
                    <span className="text-gray-700 dark:text-gray-100">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700">Light</span>
                  </>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  {goals.length} Goals
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Reminder Banner */}
      <ReminderBanner 
        goals={goals} 
        show={showReminder}
        onClose={() => setShowReminder(false)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === 'goals'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Goals
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === 'progress'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Progress
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === 'habits'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Habits
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === 'vision'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Vision Board
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <GoalInput onGoalAdded={handleGoalAdded} />
            <GoalList 
              goals={goals}
              onGoalUpdate={handleGoalUpdate}
              onGoalDelete={handleGoalDelete}
            />
            <MotivationPanel />
          </div>
        )}

        {activeTab === 'progress' && (
          <ProgressDashboard goals={goals} />
        )}

        {activeTab === 'habits' && (
          <HabitTracker 
            habits={habits}
            goals={goals}
            onHabitUpdate={handleHabitUpdate}
          />
        )}

        {activeTab === 'vision' && (
          <VisionBoard goals={goals} />
        )}
      </main>
    </div>
  )
}

export default App

