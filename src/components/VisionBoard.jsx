import { useState, useEffect } from 'react'
import { Sparkles, Image as ImageIcon, Download, Wand2, Loader2, AlertCircle } from 'lucide-react'

export function VisionBoard({ goals }) {
  const [visionImages, setVisionImages] = useState([])
  const [aiProvider, setAiProvider] = useState('openai')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null)
  const [error, setError] = useState(null)

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

  const handleGenerateAiImage = async () => {
    if (!goals.length) return
    setIsGenerating(true)
    setError(null)

    try {
      // This calls a backend route you can implement on Vercel (e.g., /api/generate-vision)
      // The backend should talk to OpenAI (ChatGPT Images) or Google Gemini,
      // using your secret API keys stored in environment variables.
      const response = await fetch('/api/generate-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          goals: goals.map(g => ({
            title: g.title,
            measurement: g.measurement,
            relevant: g.relevant
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image. Make sure the /api/generate-vision route is implemented.')
      }

      const data = await response.json()
      setGeneratedImageUrl(data.imageUrl)
    } catch (err) {
      setError(err.message || 'Something went wrong while generating the image.')
    } finally {
      setIsGenerating(false)
    }
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
            <p className="text-gray-600 dark:text-gray-300">Visualize your dreams and stay motivated</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">AI Provider:</label>
              <select
                value={aiProvider}
                onChange={(e) => {
                  setAiProvider(e.target.value)
                  setError(null) // Clear error when changing provider
                }}
                className="text-xs px-2 py-1 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="openai" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white">OpenAI (ChatGPT Images)</option>
                <option value="gemini" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white">Google Gemini</option>
              </select>
            </div>
            <button
              onClick={handleGenerateAiImage}
              disabled={isGenerating || !goals.length}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 text-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>AI Vision Image</span>
                </>
              )}
            </button>
            <button className="px-4 py-2 bg-primary-100 text-primary-800 dark:bg-slate-800 dark:text-slate-100 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2 text-sm">
              <Download className="w-4 h-4" />
              <span>Save Board</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start space-x-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-700 dark:bg-red-900/30">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p>
              {error}{' '}
              <span className="font-semibold">
                You need to implement the <code className="font-mono">/api/generate-vision</code> route on Vercel using your OpenAI or Gemini API key.
              </span>
            </p>
          </div>
        )}

        {generatedImageUrl && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">AI-Generated Vision Image</h3>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-md">
              <img src={generatedImageUrl} alt="AI generated vision" className="w-full h-auto object-cover" />
            </div>
          </div>
        )}

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

        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-700">
          <p className="text-sm text-primary-800 dark:text-primary-200">
            <strong>💡 Tip:</strong> Your vision board represents all your goals. Visualize yourself achieving them daily to stay motivated!
          </p>
        </div>
      </div>

      {/* Inspiration Section */}
      <div className="glass-effect p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Vision Board Tips</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-200">
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 dark:text-primary-400">✓</span>
            <span>Review your vision board every morning</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 dark:text-primary-400">✓</span>
            <span>Visualize achieving each goal in detail</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 dark:text-primary-400">✓</span>
            <span>Update your board as you progress</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 dark:text-primary-400">✓</span>
            <span>Share your vision with supportive people</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

