// Inspiring quotes and stories for motivation
export const quotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    author: "Roy T. Bennett"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "If you can dream it, you can do it.",
    author: "Walt Disney"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Unknown"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown"
  }
];

export const stories = [
  {
    title: "The Marathon Runner",
    content: "Sarah decided to run a marathon. She started by running just 1 mile a day. After 30 days, she increased to 2 miles. By month 3, she was running 5 miles daily. On day 365, she completed her first marathon. Small daily actions compound into extraordinary achievements.",
    lesson: "Consistency beats intensity. Start small, stay consistent."
  },
  {
    title: "The Language Learner",
    content: "Marcus wanted to learn Spanish. Instead of cramming for hours, he committed to 15 minutes daily. He used apps, watched shows, and practiced with native speakers. After one year, he was fluent enough to travel to Spain and have full conversations. Small, daily practice led to mastery.",
    lesson: "Daily practice, no matter how small, leads to mastery."
  },
  {
    title: "The Entrepreneur",
    content: "Lisa started a business with just an idea and $100. She worked on it for 30 minutes every morning before her day job. After 6 months, she had her first paying customer. After 2 years, she quit her job and her business was generating $10,000/month. Small steps, big results.",
    lesson: "Start where you are. Use what you have. Do what you can."
  }
];

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getRandomStory() {
  return stories[Math.floor(Math.random() * stories.length)];
}

