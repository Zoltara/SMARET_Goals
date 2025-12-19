import { differenceInDays } from 'date-fns';

// Progress tracking and rewards system

export function calculateProgress(goal, breakdown, completedActions) {
  if (!breakdown) return 0;
  
  const daily = breakdown.daily || [];
  const weekly = breakdown.weekly || [];
  const monthly = breakdown.monthly || [];
  const yearly = breakdown.yearly || [];

  const totalActions = [
    ...daily,
    ...weekly,
    ...monthly,
    ...yearly
  ].length;
  
  const completed = completedActions || 0;
  
  if (totalActions === 0) return 0;
  
  return Math.round((completed / totalActions) * 100);
}

export function calculateTimeProgress(goal) {
  if (!goal.targetDate || !goal.createdAt) return 0;
  
  const start = new Date(goal.createdAt);
  const end = new Date(goal.targetDate);
  const now = new Date();
  
  const total = differenceInDays(end, start);
  const elapsed = differenceInDays(now, start);
  
  if (total <= 0) return 100;
  
  return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
}

export function getProgressFeedback(progress, timeProgress) {
  const difference = progress - timeProgress;
  
  if (difference >= 20) {
    return {
      type: 'excellent',
      message: '🎉 Amazing! You\'re ahead of schedule! Keep up the momentum!',
      color: 'green'
    };
  } else if (difference >= 10) {
    return {
      type: 'great',
      message: '✨ Great job! You\'re making good progress!',
      color: 'blue'
    };
  } else if (difference >= -10) {
    return {
      type: 'on-track',
      message: '👍 You\'re on track! Keep going!',
      color: 'yellow'
    };
  } else if (difference >= -20) {
    return {
      type: 'behind',
      message: '⚠️ You\'re a bit behind. Let\'s pick up the pace!',
      color: 'orange'
    };
  } else {
    return {
      type: 'critical',
      message: '🚨 You need to take action now! Every day counts!',
      color: 'red'
    };
  }
}

export function getRewards(progress) {
  const rewards = [];
  
  if (progress >= 10) {
    rewards.push({ milestone: '10%', reward: '🌟 First Milestone Badge', unlocked: true });
  }
  if (progress >= 25) {
    rewards.push({ milestone: '25%', reward: '⭐ Quarter Complete Badge', unlocked: true });
  }
  if (progress >= 50) {
    rewards.push({ milestone: '50%', reward: '🏆 Halfway Hero Badge', unlocked: true });
  }
  if (progress >= 75) {
    rewards.push({ milestone: '75%', reward: '💎 Almost There Badge', unlocked: true });
  }
  if (progress >= 100) {
    rewards.push({ milestone: '100%', reward: '🎊 Goal Achieved Champion!', unlocked: true });
  }
  
  // Add streak rewards
  return rewards;
}

export function getDopamineReward(actionType) {
  const rewards = {
    daily: '✨ Great start!',
    weekly: '🎯 Weekly milestone reached!',
    monthly: '🏅 Monthly checkpoint achieved!',
    habit: '🔥 Streak maintained!',
    microstep: '✅ Step completed!'
  };
  
  return rewards[actionType] || '🎉 Well done!';
}

