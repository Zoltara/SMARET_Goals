// Reminder system with escalation (gentle to aggressive)

export const ReminderLevels = {
  GENTLE: 'gentle',
  MODERATE: 'moderate',
  FIRM: 'firm',
  AGGRESSIVE: 'aggressive'
};

export function calculateReminderLevel(goal, lastActionDate) {
  if (!lastActionDate) {
    return ReminderLevels.GENTLE;
  }
  
  const daysSinceAction = Math.floor((Date.now() - new Date(lastActionDate).getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceAction <= 1) {
    return ReminderLevels.GENTLE;
  } else if (daysSinceAction <= 3) {
    return ReminderLevels.MODERATE;
  } else if (daysSinceAction <= 7) {
    return ReminderLevels.FIRM;
  } else {
    return ReminderLevels.AGGRESSIVE;
  }
}

export function getReminderMessage(goal, level) {
  const messages = {
    [ReminderLevels.GENTLE]: {
      title: "🌱 Gentle Reminder",
      message: `Hey! Just a friendly reminder to take a small step toward "${goal.title}" today. You've got this! 💪`,
      tone: "encouraging"
    },
    [ReminderLevels.MODERATE]: {
      title: "📅 Time to Act",
      message: `It's been a few days since you last worked on "${goal.title}". Let's get back on track with a small action today!`,
      tone: "supportive"
    },
    [ReminderLevels.FIRM]: {
      title: "⚠️ Important Reminder",
      message: `Your goal "${goal.title}" needs attention. Consistency is key to success. Take action today, even if it's just 5 minutes!`,
      tone: "urgent"
    },
    [ReminderLevels.AGGRESSIVE]: {
      title: "🚨 Action Required",
      message: `Your goal "${goal.title}" is at risk. It's been over a week since your last action. Remember why this matters to you and take action NOW!`,
      tone: "critical"
    }
  };
  
  return messages[level] || messages[ReminderLevels.GENTLE];
}

export function shouldShowReminder(goal, lastActionDate, reminderSettings) {
  if (!reminderSettings || !reminderSettings.enabled) {
    return false;
  }
  
  if (!lastActionDate) {
    return true; // Always remind if no action taken
  }
  
  const daysSinceAction = Math.floor((Date.now() - new Date(lastActionDate).getTime()) / (1000 * 60 * 60 * 24));
  const frequency = reminderSettings.frequency || 1; // days
  
  return daysSinceAction >= frequency;
}

