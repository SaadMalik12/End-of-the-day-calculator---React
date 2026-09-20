# 🕐 Office EOD Calculator

A simple and practical productivity tool for calculating your **target departure time** based on your office check-in time, required working hours, and breaks.

The Office EOD Calculator helps employees track their workday, account for lunch, prayer, tea, and other breaks, and visualize their complete office schedule.

## 🌐 Live Demo

Try the **Office EOD Calculator** online:

👉 https://endofthedaycalculator.vercel.app/

## ✨ Features

- 🏢 **Office Arrival Tracking** — Set your check-in time or use the current time.
- ⏱️ **Flexible Work Duration** — Choose common work durations such as 7.5h, 8h, 8.5h, or 9h, or enter a custom duration.
- ☕ **Break Management** — Add and manage lunch, prayer, tea, and custom breaks.
- 🧮 **Automatic EOD Calculation** — Automatically calculates your target departure time based on required work hours and breaks.
- 📊 **Day Schedule Visualizer** — View a visual representation of work and break intervals throughout the day.
- 📈 **Workday Progress Tracking** — Track how much of your workday has been completed.
- 📋 **Copy Summary** — Quickly copy your daily work summary.
- 🔄 **Reset Option** — Reset the calculator and start a new workday.
- 🎨 **Modern UI** — Clean, responsive interface with intuitive controls and icons.

## 🛠️ Tech Stack

- **React 19**
- **TypeScript**
- **React Compiler**
- **Vite**
- **Lucide React** — Icons
- **ESLint**
- **CSS**

## ⚡ React Compiler

This project uses the **React Compiler**, which is designed to automatically optimize React applications by analyzing components and applying appropriate memoization optimizations during compilation.

This allows the application to focus on clear, maintainable React code without manually adding memoization everywhere.

## 🚀 How It Works

1. Enter your **office check-in time**.
2. Select your required **target work duration**.
3. Add your **breaks and pauses**.
4. The calculator automatically calculates your **target departure time**.
5. Use the **Day Schedule Visualizer** to see your work and break distribution.
6. Track your progress throughout the day.

### Example

If you check in at **10:30 AM** and need to complete **8 hours of productive work**, with **1 hour of breaks**:

```text
Office Entry       → 10:30 AM
Target Work        → 8 hours
Total Breaks       → 1 hour
Total Office Time  → 9 hours
Target Departure   → 7:30 PM
```

## 🎯 Use Cases

This project can be useful for:

- Employees tracking their daily office hours
- Developers and remote workers managing work schedules
- People who need to account for multiple breaks
- Anyone who wants a quick end-of-day calculator
- Practicing React, TypeScript, component design, state management, and time calculations

## 📸 Preview

![Office EOD Calculator](./screenshot.png)

## 💻 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project directory:

```bash
cd eod-calculator
```

Install dependencies:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Vite will start the development server. Open the local URL shown in your terminal, typically:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

### Run Linting

```bash
npm run lint
```

## 📁 Project Structure

A typical structure for the project:

```text
eod-calculator/
├── public/
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── ...
```

> The exact structure may vary depending on the implementation.

## 🔮 Future Improvements

- 💾 Save daily work records using LocalStorage
- 📅 Weekly and monthly work-hour reports
- ⏰ Overtime calculation
- 🔄 Multiple shift support
- 🌙 Dark mode
- 📄 Export daily summaries as PDF
- 📱 Progressive Web App (PWA) support
- 🔔 Notifications when the target departure time is approaching

## 📄 License

This project is created for learning, productivity, and portfolio purposes.

---

⭐ If you find this project useful, consider giving the repository a star!
