import { useMemo } from 'react'
import { TrendingUp, Award, Target, Calendar } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { calculateProgress, calculateTimeProgress, getProgressFeedback, getRewards } from '../utils/progress'
import { format } from 'date-fns'

// Safe progress calculation helper
const getGoalProgress = (goal) => {
  try {
    if (goal.progress !== undefined && goal.progress !== null) {
      return goal.progress
    }
    return calculateProgress(goal, goal.breakdown, goal.completedActions) || 0
  } catch (error) {
    console.error('Error calculating progress:', error)
    return 0
  }
}

export function ProgressDashboard({ goals }) {
  const stats = useMemo(() => {
    if (goals.length === 0) {
      return {
        totalGoals: 0,
        completedGoals: 0,
        averageProgress: 0,
        totalActions: 0,
        completedActions: 0
      }
    }

    // Calculate progress for each goal if not set
    const goalsWithProgress = goals.map(g => ({
      ...g,
      progress: getGoalProgress(g)
    }))
    
    const completedGoals = goalsWithProgress.filter(g => g.progress >= 100).length
    const totalProgress = goalsWithProgress.reduce((sum, g) => sum + g.progress, 0)
    const averageProgress = goals.length > 0 ? Math.round(totalProgress / goals.length) : 0
    
    const allActions = goals.reduce((sum, g) => {
      const breakdown = g.breakdown || {}
      return sum + [
        ...(breakdown.daily || []),
        ...(breakdown.weekly || []),
        ...(breakdown.monthly || []),
        ...(breakdown.yearly || [])
      ].length
    }, 0)
    
    const completedActions = goals.reduce((sum, g) => sum + (g.completedActions || 0), 0)

    return {
      totalGoals: goals.length,
      completedGoals,
      averageProgress,
      totalActions,
      completedActions,
      completionRate: allActions > 0 ? Math.round((completedActions / allActions) * 100) : 0
    }
  }, [goals])

  const chartData = useMemo(() => {
    try {
      return goals.map(goal => ({
        name: goal.title && goal.title.length > 15 ? goal.title.substring(0, 15) + '...' : (goal.title || 'Untitled'),
        progress: getGoalProgress(goal),
        timeProgress: calculateTimeProgress(goal)
      }))
    } catch (error) {
      console.error('Error creating chart data:', error)
      return []
    }
  }, [goals])

  const pieData = useMemo(() => {
    return [
      { name: 'Completed', value: stats.completedGoals, color: '#10b981' },
      { name: 'In Progress', value: stats.totalGoals - stats.completedGoals, color: '#3b82f6' }
    ]
  }, [stats])

  if (goals.length === 0) {
    return (
      <div className="glass-effect p-12 rounded-2xl text-center">
        <TrendingUp className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Progress Data</h3>
        <p className="text-gray-500 dark:text-gray-400">Create goals and track your progress here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-effect p-5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold text-primary-600">{stats.totalGoals}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Goals</p>
        </div>

        <div className="glass-effect p-5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-600">{stats.completedGoals}</span>
          </div>
          <p className="text-sm text-gray-600">Completed</p>
        </div>

        <div className="glass-effect p-5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">{stats.averageProgress}%</span>
          </div>
          <p className="text-sm text-gray-600">Avg Progress</p>
        </div>

        <div className="glass-effect p-5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-600">{stats.completionRate}%</span>
          </div>
          <p className="text-sm text-gray-600">Action Rate</p>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Progress Bar Chart */}
        <div className="glass-effect p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Goal Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Status Pie Chart */}
        <div className="glass-effect p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Goal Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Goal Progress */}
      <div className="glass-effect p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Progress</h3>
        <div className="space-y-4">
          {goals.map(goal => {
            const progress = getGoalProgress(goal)
            const timeProgress = calculateTimeProgress(goal)
            const feedback = getProgressFeedback(progress, timeProgress)
            const rewards = getRewards(progress)

            return (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{goal.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{goal.measurement}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    feedback.type === 'excellent' || feedback.type === 'great' ? 'bg-green-100 text-green-800' :
                    feedback.type === 'on-track' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {progress}%
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                    <span>Progress: {progress}%</span>
                    <span>Time: {timeProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        feedback.type === 'excellent' || feedback.type === 'great' ? 'bg-green-500' :
                        feedback.type === 'on-track' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${feedback.color === 'green' ? 'text-green-700' : feedback.color === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>
                    {feedback.message}
                  </p>
                  {rewards.length > 0 && (
                    <div className="flex space-x-1">
                      {rewards.map((r, i) => (
                        <span key={i} className="text-lg" title={r.reward}>🏆</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

