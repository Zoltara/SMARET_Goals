import { useState, useEffect } from 'react'
import { Sparkles, Quote, BookOpen, RefreshCw } from 'lucide-react'
import { getRandomQuote, getRandomStory } from '../utils/motivation'

export function MotivationPanel() {
  const [quote, setQuote] = useState(null)
  const [story, setStory] = useState(null)
  const [showStory, setShowStory] = useState(false)

  useEffect(() => {
    loadMotivation()
  }, [])

  const loadMotivation = () => {
    setQuote(getRandomQuote())
    setStory(getRandomStory())
  }

  return (
    <div className="space-y-4">
      {/* Quote Card */}
      {quote && (
        <div className="glass-effect p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <Quote className="w-24 h-24 text-primary-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <Sparkles className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
              <button
                onClick={loadMotivation}
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-primary-600" />
              </button>
            </div>
            <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
              "{quote.text}"
            </blockquote>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">— {quote.author}</p>
          </div>
        </div>
      )}

      {/* Story Card */}
      {story && (
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Success Story</h3>
            </div>
            <button
              onClick={() => setShowStory(!showStory)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showStory ? 'Hide' : 'Read Story'}
            </button>
          </div>

          {showStory && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{story.title}</h4>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{story.content}</p>
              <div className="p-3 bg-primary-50 rounded-lg border-l-4 border-primary-500">
                <p className="text-sm font-semibold text-primary-800">
                  💡 Lesson: {story.lesson}
                </p>
              </div>
            </div>
          )}

          {!showStory && (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Click "Read Story" to get inspired by real success stories!
            </p>
          )}
        </div>
      )}
    </div>
  )
}

