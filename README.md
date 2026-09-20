# 🕐 Office EOD Calculator

A simple and practical productivity tool for calculating your **target departure time** based on your office check-in time, required working hours, and breaks.

The Office EOD Calculator helps employees track their workday, account for lunch/prayer/tea breaks, and visualize their complete office schedule.

## ✨ Features

- 🏢 **Office Arrival Tracking** — Set your check-in time or use the current time.
- ⏱️ **Flexible Work Duration** — Choose common work durations such as 7.5h, 8h, 8.5h, or 9h, or enter a custom duration.
- ☕ **Break Management** — Add and manage lunch, prayer, tea, and custom breaks.
- 🧮 **Automatic EOD Calculation** — Calculates your target departure time by adding your required work duration and breaks.
- 📊 **Day Schedule Visualizer** — Get a visual overview of work and break intervals throughout the day.
- 📈 **Progress Tracking** — See how much of your workday has been completed.
- 📋 **Copy Summary** — Quickly copy your workday summary for sharing or personal tracking.
- 🔄 **Reset Option** — Easily reset the calculator and start a new workday.
- 📱 **Clean Responsive UI** — Designed for a simple and practical day-to-day office experience.

## 🛠️ Tech Stack

- **Angular**
- **TypeScript**
- **HTML5**
- **CSS3**
- **Angular Material** *(if enabled in the project)*

## 🚀 How It Works

1. Enter your **office check-in time**.
2. Select your required **target work duration**.
3. Add your **breaks and pauses**.
4. The calculator automatically determines your **target departure time**.
5. Use the **Day Schedule Visualizer** to understand your work/break distribution.
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
- Practicing Angular UI, state management, forms, and time calculations

## 📸 Preview

![Office EOD Calculator](./screenshot.png)

## 💻 Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- Angular CLI installed

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project:

```bash
cd office-eod-calculator
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Open your browser and visit:

```text
http://localhost:4200
```

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/
│   ├── services/
│   ├── models/
│   └── ...
├── assets/
├── styles.css
└── main.ts
```

> The exact structure may vary depending on the implementation.

## 🔮 Future Improvements

- Save daily work records using LocalStorage
- Weekly/monthly work-hour reports
- Overtime calculation
- Multiple shift support
- Dark mode
- Export daily summary as PDF
- PWA/offline support
- Notification when the target departure time is approaching

## 📄 License

This project is created for learning, productivity, and portfolio purposes.

---

⭐ If you find this project useful, consider giving the repository a star!
