# SMARTER Goals

A comprehensive goal-setting and tracking application that helps you achieve your dreams using the SMART goals framework, Atomic Habits principles, and powerful progress tracking.

## Features

### 🎯 SMART Goals
- Create goals following the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound)
- Automatic validation to ensure all criteria are met
- Intelligent prompts for missing information

### 📅 Goal Breakdown
- Automatic breakdown into daily, weekly, monthly, and yearly action steps
- Micro-step breakdown for complex tasks
- Visual progress tracking with completion checkboxes

### 🎨 Vision Board
- Visual representation of all your goals
- Color-coded goal cards with progress indicators
- Motivational visualizations to keep you inspired

### 🔥 Habit Tracking
- Automatic habit creation from goals
- Based on Atomic Habits principles:
  - Make it Obvious (Cue)
  - Make it Attractive (Craving)
  - Make it Easy (Response)
  - Make it Satisfying (Reward)
- Streak tracking and habit strength scoring
- Daily habit completion tracking

### 📊 Progress Dashboard
- Visual charts and graphs
- Progress vs. time comparison
- Dopamine-friendly rewards and badges
- Honest feedback on your progress
- Detailed statistics and analytics

### 🔔 Smart Reminders
- Gentle reminders that escalate based on inactivity
- Four levels: Gentle → Moderate → Firm → Aggressive
- Contextual messages based on your progress

### 💪 Motivation
- Inspiring quotes from successful people
- Real success stories with lessons
- Daily motivation to keep you going

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment to Vercel

Deploying to Vercel is simple and free! Here are the steps:

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

3. **Click "Add New Project"**

4. **Import your repository** from GitHub

5. **Vercel will auto-detect** your Vite project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Click "Deploy"** - That's it! 🎉

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** - Vercel will guide you through the setup

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Configuration

The project includes a `vercel.json` file that configures:
- Build settings for Vite
- SPA routing (all routes redirect to `index.html` for client-side routing)
- Output directory

**Note**: Your app data is stored in browser localStorage, so each user's data is stored locally on their device. No backend or database needed!

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **date-fns** - Date utilities
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## Usage

1. **Create a Goal**: Click "Add New Goal" and fill in the SMART criteria
2. **Review Breakdown**: The app automatically creates action steps
3. **Track Habits**: Complete daily habits to build consistency
4. **Monitor Progress**: Check the Progress tab for detailed analytics
5. **Stay Motivated**: Read quotes and stories in the Goals tab
6. **Visualize Success**: View your Vision Board to stay inspired

## Features in Detail

### SMART Goals Framework
- **Specific**: Clear, well-defined goal
- **Measurable**: Quantifiable success criteria
- **Achievable**: Realistic and attainable
- **Relevant**: Aligned with your values
- **Time-bound**: Clear deadline

### Atomic Habits Integration
The app implements James Clear's Atomic Habits principles:
- **Cue**: Clear trigger for the habit
- **Craving**: Motivation to perform the habit
- **Response**: The actual habit
- **Reward**: Immediate satisfaction

### Progress Tracking
- Visual progress bars
- Time-based progress comparison
- Action completion tracking
- Milestone badges and rewards
- Honest feedback system

## Mobile Responsive

The app is fully responsive and works beautifully on:
- Desktop computers
- Tablets
- Mobile phones

## Data Storage

All data is stored locally in your browser's localStorage. Your goals, habits, and progress are saved automatically.

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ to help you achieve your dreams**

