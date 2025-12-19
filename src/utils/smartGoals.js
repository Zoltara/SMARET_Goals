import { differenceInDays, addDays, addWeeks, addMonths, addYears, format, isBefore, startOfDay } from 'date-fns';

// SMART Goals validation and breakdown
export const SMART_Criteria = {
  SPECIFIC: 'specific',
  MEASURABLE: 'measurable',
  ACHIEVABLE: 'achievable',
  RELEVANT: 'relevant',
  TIME_BOUND: 'timeBound'
};

export function validateSMARTGoal(goal) {
  const missing = [];
  
  if (!goal.title || goal.title.trim().length < 10) {
    missing.push({ criterion: SMART_Criteria.SPECIFIC, question: 'What exactly do you want to achieve? Be specific!' });
  }
  
  if (!goal.measurement || goal.measurement.trim().length < 5) {
    missing.push({ criterion: SMART_Criteria.MEASURABLE, question: 'How will you measure success? (e.g., "lose 20 pounds", "save $5000")' });
  }
  
  if (!goal.achievable || goal.achievable.trim().length < 5) {
    missing.push({ criterion: SMART_Criteria.ACHIEVABLE, question: 'Is this goal achievable? What resources/skills do you need?' });
  }
  
  if (!goal.relevant || goal.relevant.trim().length < 5) {
    missing.push({ criterion: SMART_Criteria.RELEVANT, question: 'Why is this goal important to you? How does it align with your values?' });
  }
  
  if (!goal.targetDate) {
    missing.push({ criterion: SMART_Criteria.TIME_BOUND, question: 'When do you want to achieve this goal?' });
  }
  
  return missing;
}

export function breakDownGoal(goal) {
  if (!goal.targetDate) return null;
  
  const today = startOfDay(new Date());
  const targetDate = startOfDay(new Date(goal.targetDate));
  const totalDays = differenceInDays(targetDate, today);
  
  if (totalDays <= 0) {
    return {
      daily: ['Review and adjust your timeline'],
      weekly: ['Assess progress and plan next steps'],
      monthly: ['Quarterly review'],
      yearly: ['Annual reflection']
    };
  }
  
  // Calculate breakdown based on timeline
  const weeks = Math.ceil(totalDays / 7);
  const months = Math.ceil(totalDays / 30);
  const years = Math.ceil(totalDays / 365);
  
  const breakdown = {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: []
  };
  
  // Daily actions (next 7 days)
  for (let i = 0; i < Math.min(7, totalDays); i++) {
    const date = addDays(today, i);
    breakdown.daily.push({
      date: format(date, 'yyyy-MM-dd'),
      action: generateDailyAction(goal, i, totalDays),
      completed: false
    });
  }
  
  // Weekly milestones
  for (let i = 1; i <= Math.min(12, weeks); i++) {
    const weekDate = addWeeks(today, i);
    breakdown.weekly.push({
      week: i,
      date: format(weekDate, 'yyyy-MM-dd'),
      milestone: generateWeeklyMilestone(goal, i, weeks),
      completed: false
    });
  }
  
  // Monthly checkpoints
  for (let i = 1; i <= Math.min(12, months); i++) {
    const monthDate = addMonths(today, i);
    breakdown.monthly.push({
      month: i,
      date: format(monthDate, 'yyyy-MM-dd'),
      checkpoint: generateMonthlyCheckpoint(goal, i, months),
      completed: false
    });
  }
  
  // Yearly reviews
  if (years > 0) {
    for (let i = 1; i <= years; i++) {
      const yearDate = addYears(today, i);
      breakdown.yearly.push({
        year: i,
        date: format(yearDate, 'yyyy-MM-dd'),
        review: generateYearlyReview(goal, i),
        completed: false
      });
    }
  }
  
  return breakdown;
}

function generateDailyAction(goal, dayIndex, totalDays) {
  const progress = (dayIndex / totalDays) * 100;
  const actions = [
    `Take one small step toward "${goal.title}"`,
    `Spend 15 minutes working on your goal`,
    `Review your progress and adjust if needed`,
    `Connect with someone who can help you achieve this goal`,
    `Learn something new related to your goal`,
    `Track your progress for today`,
    `Celebrate small wins and stay motivated`
  ];
  
  if (progress < 10) {
    return `Start: ${actions[0]}`;
  } else if (progress < 50) {
    return `Build momentum: ${actions[1]}`;
  } else if (progress < 80) {
    return `Maintain consistency: ${actions[2]}`;
  } else {
    return `Final push: ${actions[3]}`;
  }
}

function generateWeeklyMilestone(goal, weekIndex, totalWeeks) {
  const progress = (weekIndex / totalWeeks) * 100;
  
  if (progress < 25) {
    return `Establish foundation for "${goal.title}"`;
  } else if (progress < 50) {
    return `Build consistent routine toward your goal`;
  } else if (progress < 75) {
    return `Accelerate progress and overcome obstacles`;
  } else {
    return `Finalize and celebrate achievement of "${goal.title}"`;
  }
}

function generateMonthlyCheckpoint(goal, monthIndex, totalMonths) {
  return `Month ${monthIndex} Review: Assess progress on "${goal.title}", adjust strategy if needed, and plan next phase`;
}

function generateYearlyReview(goal, yearIndex) {
  return `Annual Review: Reflect on your journey with "${goal.title}", celebrate achievements, and set new goals`;
}

export function breakIntoMicroSteps(action) {
  // Simple micro-step breakdown
  const microSteps = [
    `Prepare: Gather what you need`,
    `Start: Take the first 5 minutes`,
    `Execute: Complete the main task`,
    `Review: Check your work`,
    `Celebrate: Acknowledge completion`
  ];
  
  return microSteps.map((step, index) => ({
    id: `${Date.now()}-${index}`,
    text: step,
    completed: false,
    order: index + 1
  }));
}

