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
  const title = goal.title.toLowerCase();
  const measurement = goal.measurement.toLowerCase();
  
  // Extract numbers from goal
  const extractNumbers = (text) => {
    const matches = text.match(/\d+(\.\d+)?/g);
    return matches ? matches.map(Number) : [];
  };
  
  const titleNumbers = extractNumbers(goal.title);
  const measurementNumbers = extractNumbers(goal.measurement);
  const allNumbers = [...titleNumbers, ...measurementNumbers];
  
  // Reading books
  if (title.includes('read') || title.includes('book') || measurement.includes('page')) {
    const pages = allNumbers.find(n => n >= 10 && n <= 1000) || 300;
    const pagesPerDay = Math.ceil(pages / totalDays);
    const startPages = Math.max(1, Math.floor(pagesPerDay * 0.3));
    const currentPages = Math.min(pages, startPages + (dayIndex * Math.ceil(pagesPerDay / 7)));
    
    if (dayIndex === 0) {
      return `Read 1 page of your book`;
    } else if (dayIndex < 3) {
      return `Read ${Math.min(currentPages, 5)} pages today`;
    } else if (dayIndex < 7) {
      return `Read ${Math.min(currentPages, 10)} pages today`;
    } else {
      return `Read ${Math.min(currentPages, pagesPerDay)} pages today`;
    }
  }
  
  // Running/Fitness goals
  if (title.includes('run') || title.includes('marathon') || title.includes('km') || measurement.includes('km') || measurement.includes('minute')) {
    const kmMatch = measurement.match(/(\d+(\.\d+)?)\s*km/);
    const timeMatch = measurement.match(/(\d+)\s*min/);
    const targetKm = kmMatch ? parseFloat(kmMatch[1]) : (allNumbers.find(n => n >= 1 && n <= 50) || 5);
    const targetTime = timeMatch ? parseInt(timeMatch[1]) : null;
    
    if (dayIndex === 0) {
      return `Walk/run for 10 minutes to build endurance`;
    } else if (dayIndex === 1) {
      return `Run/walk for 20 minutes`;
    } else if (dayIndex === 2) {
      return `Run 1 km at comfortable pace`;
    } else if (dayIndex === 3) {
      return `Run 2 km`;
    } else if (dayIndex < 7) {
      const km = Math.min(targetKm * 0.4, 2 + (dayIndex - 3));
      return `Run ${km.toFixed(1)} km`;
    } else {
      const progress = dayIndex / totalDays;
      const km = Math.min(targetKm * progress, targetKm);
      return `Run ${km.toFixed(1)} km${targetTime ? ` (aim for ${targetTime} min)` : ''}`;
    }
  }
  
  // Learning/Language goals
  if (title.includes('learn') || title.includes('language') || title.includes('study') || measurement.includes('conversation') || measurement.includes('fluent')) {
    if (dayIndex === 0) {
      return `Spend 10 minutes learning 5 new words/phrases`;
    } else if (dayIndex < 3) {
      return `Practice for 15 minutes: review yesterday's words + learn 5 new ones`;
    } else if (dayIndex < 7) {
      return `Practice for 20 minutes: vocabulary + basic conversation practice`;
    } else {
      return `Practice for 30 minutes: conversation, grammar, and vocabulary`;
    }
  }
  
  // Weight/Fitness goals
  if (title.includes('lose') || title.includes('weight') || title.includes('pound') || measurement.includes('pound') || measurement.includes('kg')) {
    const weight = allNumbers.find(n => n >= 5 && n <= 200) || 20;
    if (dayIndex === 0) {
      return `Start: Track your current weight and plan your meals`;
    } else if (dayIndex < 3) {
      return `Do 15 minutes of exercise + eat healthy meals`;
    } else if (dayIndex < 7) {
      return `Do 30 minutes of exercise + maintain calorie deficit`;
    } else {
      return `Do 45 minutes of exercise + follow your nutrition plan`;
    }
  }
  
  // Business/Financial goals
  if (title.includes('business') || title.includes('start') || title.includes('entrepreneur') || title.includes('save') || title.includes('money') || measurement.includes('$') || measurement.includes('revenue')) {
    const amount = allNumbers.find(n => n >= 100) || 10000;
    if (dayIndex === 0) {
      return `Research and plan: Spend 30 minutes researching your business idea`;
    } else if (dayIndex < 3) {
      return `Take action: Work on your business for 1 hour today`;
    } else if (dayIndex < 7) {
      return `Build momentum: Work on your business for 2 hours today`;
    } else {
      return `Scale up: Work on your business for 3+ hours today`;
    }
  }
  
  // Generic progressive action
  const progress = (dayIndex / totalDays) * 100;
  if (dayIndex === 0) {
    return `Start: Take the first small step toward "${goal.title}" (5 minutes)`;
  } else if (dayIndex < 3) {
    return `Build habit: Spend 15 minutes working on "${goal.title}"`;
  } else if (dayIndex < 7) {
    return `Increase intensity: Spend 30 minutes working on "${goal.title}"`;
  } else if (progress < 50) {
    return `Maintain momentum: Spend 45 minutes working on "${goal.title}"`;
  } else if (progress < 80) {
    return `Accelerate: Spend 1 hour working on "${goal.title}"`;
  } else {
    return `Final push: Spend 1.5+ hours working on "${goal.title}"`;
  }
}

function generateWeeklyMilestone(goal, weekIndex, totalWeeks) {
  const title = goal.title.toLowerCase();
  const measurement = goal.measurement.toLowerCase();
  const extractNumbers = (text) => {
    const matches = text.match(/\d+(\.\d+)?/g);
    return matches ? matches.map(Number) : [];
  };
  const allNumbers = [...extractNumbers(goal.title), ...extractNumbers(goal.measurement)];
  
  // Reading books
  if (title.includes('read') || title.includes('book') || measurement.includes('page')) {
    const pages = allNumbers.find(n => n >= 10 && n <= 1000) || 300;
    const targetPages = Math.ceil((pages / totalWeeks) * weekIndex);
    return `Week ${weekIndex}: Read ${targetPages} pages total (${Math.ceil(targetPages / 7)} pages/day average)`;
  }
  
  // Running goals
  if (title.includes('run') || title.includes('marathon') || measurement.includes('km')) {
    const kmMatch = measurement.match(/(\d+(\.\d+)?)\s*km/);
    const targetKm = kmMatch ? parseFloat(kmMatch[1]) : (allNumbers.find(n => n >= 1 && n <= 50) || 5);
    const weeklyKm = Math.min(targetKm * (weekIndex / totalWeeks), targetKm);
    return `Week ${weekIndex}: Run ${weeklyKm.toFixed(1)} km total (aim for ${(targetKm / totalWeeks).toFixed(1)} km this week)`;
  }
  
  // Learning goals
  if (title.includes('learn') || title.includes('language')) {
    const wordsLearned = weekIndex * 50;
    return `Week ${weekIndex}: Learn ${wordsLearned} words total, practice daily conversations`;
  }
  
  // Weight loss
  if (title.includes('lose') || title.includes('weight') || measurement.includes('pound') || measurement.includes('kg')) {
    const weight = allNumbers.find(n => n >= 5 && n <= 200) || 20;
    const weeklyLoss = (weight / totalWeeks) * weekIndex;
    return `Week ${weekIndex}: Target ${weeklyLoss.toFixed(1)} lbs lost (${(weight / totalWeeks).toFixed(1)} lbs this week)`;
  }
  
  // Business/Financial
  if (title.includes('business') || title.includes('save') || measurement.includes('$')) {
    const amount = allNumbers.find(n => n >= 100) || 10000;
    const weeklyAmount = Math.ceil((amount / totalWeeks) * weekIndex);
    return `Week ${weekIndex}: Reach $${weeklyAmount.toLocaleString()} (${Math.ceil(amount / totalWeeks).toLocaleString()} this week)`;
  }
  
  // Generic
  const progress = (weekIndex / totalWeeks) * 100;
  if (progress < 25) {
    return `Week ${weekIndex}: Establish foundation and daily routine for "${goal.title}"`;
  } else if (progress < 50) {
    return `Week ${weekIndex}: Build consistent progress toward "${goal.title}"`;
  } else if (progress < 75) {
    return `Week ${weekIndex}: Accelerate progress and overcome obstacles`;
  } else {
    return `Week ${weekIndex}: Finalize and achieve "${goal.title}"`;
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

