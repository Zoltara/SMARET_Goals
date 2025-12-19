// Atomic Habits principles implementation
// Based on: Make it Obvious, Make it Attractive, Make it Easy, Make it Satisfying

export const HabitTypes = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

export function createHabitFromGoal(goal, habitType = HabitTypes.DAILY) {
  // Implementation stack: Cue, Craving, Response, Reward
  const habit = {
    id: `habit-${Date.now()}`,
    goalId: goal.id,
    name: `Work on: ${goal.title}`,
    type: habitType,
    cue: generateCue(goal),
    craving: generateCraving(goal),
    response: generateResponse(goal, habitType),
    reward: generateReward(goal),
    streak: 0,
    bestStreak: 0,
    completedToday: false,
    createdAt: new Date().toISOString()
  };
  
  return habit;
}

function generateCue(goal) {
  const cues = [
    `After I wake up, I will work on "${goal.title}"`,
    `After I finish breakfast, I will take action on my goal`,
    `At 9 AM, I will start working toward "${goal.title}"`,
    `When I see my goal reminder, I will take one step forward`,
    `After I check my phone in the morning, I will work on my goal`
  ];
  return cues[Math.floor(Math.random() * cues.length)];
}

function generateCraving(goal) {
  return `I want to achieve "${goal.title}" because ${goal.relevant || 'it matters to me'}`;
}

function generateResponse(goal, habitType) {
  if (habitType === HabitTypes.DAILY) {
    return `Spend 15-30 minutes working on "${goal.title}"`;
  } else if (habitType === HabitTypes.WEEKLY) {
    return `Dedicate 2-3 hours this week to "${goal.title}"`;
  } else {
    return `Review and plan next steps for "${goal.title}"`;
  }
}

function generateReward(goal) {
  return `Track progress, celebrate small wins, and visualize achieving "${goal.title}"`;
}

export function checkHabitCompletion(habit) {
  const today = new Date().toDateString();
  const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
  
  return lastCompleted === today;
}

export function updateHabitStreak(habit, completed) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
  
  if (completed) {
    if (lastCompleted === today) {
      // Already completed today
      return habit;
    } else if (lastCompleted === yesterday) {
      // Continuing streak
      const newStreak = habit.streak + 1;
      return {
        ...habit,
        streak: newStreak,
        bestStreak: Math.max(newStreak, habit.bestStreak),
        lastCompleted: new Date().toISOString(),
        completedToday: true
      };
    } else {
      // New streak
      return {
        ...habit,
        streak: 1,
        lastCompleted: new Date().toISOString(),
        completedToday: true
      };
    }
  } else {
    // Reset streak if not completed
    if (lastCompleted !== today) {
      return {
        ...habit,
        streak: 0,
        completedToday: false
      };
    }
  }
  
  return habit;
}

export function getHabitScore(habit) {
  // Calculate habit strength score (0-100)
  const streakWeight = Math.min(habit.streak * 2, 50);
  const consistencyWeight = habit.bestStreak > 0 ? Math.min((habit.bestStreak / 30) * 50, 50) : 0;
  return Math.round(streakWeight + consistencyWeight);
}

