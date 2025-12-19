import { useState } from 'react'
import { validateSMARTGoal, breakDownGoal } from '../utils/smartGoals'
import { Plus, CheckCircle, AlertCircle } from 'lucide-react'

export function GoalInput({ onGoalAdded }) {
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState({
    title: '',
    measurement: '',
    achievable: '',
    relevant: '',
    targetDate: ''
  })
  const [missingCriteria, setMissingCriteria] = useState([])
  const [showForm, setShowForm] = useState(false)

  const handleInputChange = (field, value) => {
    setGoal(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    const missing = validateSMARTGoal(goal)
    if (missing.length > 0) {
      setMissingCriteria(missing)
      setStep(2) // Show missing criteria
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const breakdown = breakDownGoal(goal)
    const newGoal = {
      id: `goal-${Date.now()}`,
      ...goal,
      breakdown,
      progress: 0,
      completedActions: 0,
      createdAt: new Date().toISOString(),
      lastActionDate: null
    }
    
    onGoalAdded(newGoal)
    resetForm()
  }

  const resetForm = () => {
    setGoal({
      title: '',
      measurement: '',
      achievable: '',
      relevant: '',
      targetDate: ''
    })
    setStep(1)
    setMissingCriteria([])
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full glass-effect p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 border-dashed border-primary-300 hover:border-primary-500"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-primary-500 p-3 rounded-full">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-semibold text-primary-700">Add New Goal</span>
        </div>
      </button>
    )
  }

  return (
    <div className="glass-effect p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Create Your SMART Goal</h2>
      
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              What is your goal? (Specific)
            </label>
            <input
              type="text"
              value={goal.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Run a marathon, Learn Spanish, Start a business"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              How will you measure success? (Measurable)
            </label>
            <input
              type="text"
              value={goal.measurement}
              onChange={(e) => handleInputChange('measurement', e.target.value)}
              placeholder="e.g., Complete 26.2 miles, Have 30-min conversation, Generate $10k/month"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Is this achievable? What do you need? (Achievable)
            </label>
            <textarea
              value={goal.achievable}
              onChange={(e) => handleInputChange('achievable', e.target.value)}
              placeholder="e.g., I have time to train 3x/week, I can afford the course, I have the skills"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Why is this important to you? (Relevant)
            </label>
            <textarea
              value={goal.relevant}
              onChange={(e) => handleInputChange('relevant', e.target.value)}
              placeholder="e.g., This aligns with my values, It will improve my life, It's my dream"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              When do you want to achieve this? (Time-bound)
            </label>
            <input
              type="date"
              value={goal.targetDate}
              onChange={(e) => handleInputChange('targetDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleNext}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Create Goal</span>
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 2 && missingCriteria.length > 0 && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Complete Your SMART Goal</h3>
                <p className="text-sm text-yellow-700 mb-3">Please provide the following information:</p>
                <ul className="space-y-2">
                  {missingCriteria.map((item, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      <strong>{item.criterion}:</strong> {item.question}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {missingCriteria.map((item, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {item.criterion.charAt(0).toUpperCase() + item.criterion.slice(1)}: {item.question}
              </label>
              {item.criterion === 'timeBound' ? (
                <input
                  type="date"
                  value={goal.targetDate}
                  onChange={(e) => handleInputChange('targetDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50"
                />
              ) : (
                <textarea
                  value={goal[item.criterion] || ''}
                  onChange={(e) => handleInputChange(item.criterion, e.target.value)}
                  placeholder={item.question}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:placeholder-slate-400"
                />
              )}
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Create Goal
            </button>
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

