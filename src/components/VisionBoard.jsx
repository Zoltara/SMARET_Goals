import { useState, useEffect } from 'react'
import { Sparkles, Image as ImageIcon, Download } from 'lucide-react'

export function VisionBoard({ goals }) {
  const [visionImages, setVisionImages] = useState([])

  useEffect(() => {
    // Generate vision board images based on goals
    // In a real app, this would call an image generation API
    // For now, we'll create a visual representation
    if (goals.length > 0) {
      generateVisionBoard(goals)
    }
  }, [goals])

  const generateVisionBoard = (userGoals) => {
    // Create visual representation of goals
    // This is a placeholder - in production, you'd integrate with an image generation API
    const images = userGoals.map((goal, index) => ({
      id: `vision-${goal.id}`,
      goalId: goal.id,
      title: goal.title,
      color: getColorForIndex(index),
      emoji: getEmojiForGoal(goal.title)
    }))
    setVisionImages(images)
  }

  const getColorForIndex = (index) => {
    const colors = [
      'bg-gradient-to-br from-primary-400 to-primary-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600'
    ]
    return colors[index % colors.length]
  }

  const getEmojiForGoal = (title) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('run') || lowerTitle.includes('marathon') || lowerTitle.includes('fitness')) {
      return '🏃'
    } else if (lowerTitle.includes('learn') || lowerTitle.includes('language') || lowerTitle.includes('study')) {
      return '📚'
    } else if (lowerTitle.includes('business') || lowerTitle.includes('start') || lowerTitle.includes('entrepreneur')) {
      return '💼'
    } else if (lowerTitle.includes('save') || lowerTitle.includes('money') || lowerTitle.includes('financial')) {
      return '💰'
    } else if (lowerTitle.includes('health') || lowerTitle.includes('weight') || lowerTitle.includes('diet')) {
      return '💪'
    } else if (lowerTitle.includes('travel') || lowerTitle.includes('visit')) {
      return '✈️'
    }
    return '🎯'
  }

  if (goals.length === 0) {
    return (
      <div className="glass-effect p-12 rounded-2xl text-center">
        <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Vision Board Yet</h3>
        <p className="text-gray-500">Create goals to build your vision board!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass-effect p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Your Vision Board</h2>
            <p className="text-gray-600">Visualize your dreams and stay motivated</p>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visionImages.map((vision) => {
            const goal = goals.find(g => g.id === vision.goalId)
            return (
              <div
                key={vision.id}
                className={`${vision.color} rounded-xl p-6 text-white relative overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="absolute top-2 right-2">
                  <ImageIcon className="w-5 h-5 opacity-50" />
                </div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2">{vision.emoji}</div>
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{vision.title}</h3>
                  {goal && (
                    <div className="text-sm opacity-90 mt-2">
                      <div className="w-full bg-white/20 rounded-full h-1.5 mb-1">
                        <div
                          className="bg-white rounded-full h-1.5 transition-all"
                          style={{ width: `${goal.progress || 0}%` }}
                        />
                      </div>
                      <span>{goal.progress || 0}% Complete</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <p className="text-sm text-primary-800">
            <strong>💡 Tip:</strong> Your vision board represents all your goals. Visualize yourself achieving them daily to stay motivated!
          </p>
        </div>
      </div>

      {/* Inspiration Section */}
      <div className="glass-effect p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Vision Board Tips</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-primary-600">✓</span>
            <span>Review your vision board every morning</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600">✓</span>
            <span>Visualize achieving each goal in detail</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600">✓</span>
            <span>Update your board as you progress</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600">✓</span>
            <span>Share your vision with supportive people</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

