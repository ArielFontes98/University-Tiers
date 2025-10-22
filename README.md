# University STEM Course Prioritization Simulator

A modern, single-page web application for prioritizing STEM university courses for 2026 outreach campaigns. Built with React, TypeScript, Vite, and Tailwind CSS.

![University Tiers](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎯 Overview

This application helps university outreach teams prioritize STEM courses across different countries and universities by:

- **Scoring**: Evaluate universities using 11 weighted criteria
- **Tiering**: Automatically categorize universities into 4 strategic tiers (0-3)
- **Function-specific**: Customize scoring based on target function (AE, BA, DS/MLE)
- **Country modifiers**: Apply regional weighting to final scores
- **Activation playbooks**: Get specific engagement strategies per tier

## ✨ Features

### Core Functionality
- ✅ Multi-criteria scoring system with 11 weighted parameters
- ✅ Function-specific multipliers (Analytics Engineer, Business Analyst, Data Science/ML Engineer)
- ✅ Country-based scoring modifiers (Brazil, Mexico, Colombia, US, Others)
- ✅ Automatic tier classification (0: Strategic, 1: Core, 2: Opportunistic, 3: Explore)
- ✅ Interactive sliders for real-time scoring
- ✅ Course-specific preset defaults
- ✅ LocalStorage persistence for scores and filters
- ✅ CSV export functionality
- ✅ Responsive design with Nubank-inspired UI

### UI/UX Highlights
- 🎨 Modern, minimal design with Nubank purple (#820AD1)
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible (keyboard navigation, ARIA labels)
- 💾 Auto-save scores and preferences
- 🔍 Multi-select filters (country, course, function)
- 📊 Visual tier badges with color coding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/ArielFontes98/University-Tiers.git
cd University-Tiers
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

## 📁 Project Structure

```
university-tiers/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── public/
│   └── data/
│       ├── universities_stem_courses_seed.json
│       └── universities_stem_courses_seed.csv
├── src/
│   ├── components/
│   │   ├── ActivationPlaybook.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ScoreSliders.tsx
│   │   ├── SidebarFilters.tsx
│   │   ├── TierBadge.tsx
│   │   └── UniversityList.tsx
│   ├── utils/
│   │   ├── dataLoader.ts       # JSON/CSV data loading
│   │   ├── export.ts           # CSV export functionality
│   │   ├── presets.ts          # Course-specific score presets
│   │   ├── scoring.ts          # Core scoring logic
│   │   └── storage.ts          # LocalStorage utilities
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── __tests__/
│   │   └── scoring.test.ts     # Unit tests
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Entry point
│   └── index.css               # Tailwind styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 📊 Data Management

### Data Format

The application loads data from `/public/data/universities_stem_courses_seed.json` (with CSV fallback).

**JSON Schema:**
```json
[
  {
    "Country": "Brazil|Mexico|Colombia|United States|Others",
    "University": "string",
    "City/Region": "string",
    "STEM Courses (Archetypes)": "Course1; Course2; Course3",
    "Notes": "string"
  }
]
```

### Adding or Editing Universities

1. **JSON Format** (recommended):
   - Edit `/public/data/universities_stem_courses_seed.json`
   - Add a new object to the array following the schema above
   - Separate multiple courses with semicolons

2. **CSV Format** (fallback):
   - Edit `/public/data/universities_stem_courses_seed.csv`
   - Add a new row with comma-separated values
   - Use quotes around fields containing commas or semicolons

**Example:**
```json
{
  "Country": "Brazil",
  "University": "New University",
  "City/Region": "São Paulo, SP",
  "STEM Courses (Archetypes)": "Computer Science; Data Science; Statistics",
  "Notes": "Emerging tech program with industry partnerships"
}
```

### User can manually add the exhaustive seed file

The user mentioned they will manually add `universities_stem_courses_exhaustive_seed.json`. Place this file in:
- `/public/data/universities_stem_courses_exhaustive_seed.json`

Then update `src/utils/dataLoader.ts` line 6 to load the new filename:
```typescript
const response = await fetch('/University-Tiers/data/universities_stem_courses_exhaustive_seed.json');
```

## 🎯 Scoring Methodology

### Criteria (11 total)

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Curriculum Depth | 10 | DS/ML/Stats/SQL coverage |
| Engineering Foundations | 8 | Software engineering fundamentals |
| Data Engineering Exposure | 7 | Pipeline, ETL, infrastructure |
| Analytics/Business Orientation | 8 | Business intelligence, analytics focus |
| Cohort Size & Continuity | 9 | Student volume and retention |
| Capstone/Projects Intensity | 7 | Hands-on project work |
| Tools & Stack Familiarity | 6 | Modern tech stack exposure |
| Clubs & Competitions | 6 | Extracurricular tech engagement |
| Internship Alignment | 7 | Industry placement readiness |
| D&I Pipeline Contribution | 7 | Diversity and inclusion impact |
| Regional Coverage Fit | 5 | Geographic strategic alignment |

### Function Multipliers

Each criterion is adjusted based on target function:

**Analytics Engineer (AE)**: Focus on data engineering and tools  
**Business Analyst (BA)**: Focus on analytics and business orientation  
**Data Science/MLE (DS/MLE)**: Balanced focus on technical depth

### Country Modifiers

| Country | Modifier |
|---------|----------|
| Brazil | 1.20 |
| Mexico | 1.10 |
| Colombia | 1.05 |
| United States | 0.95 |
| Others | 0.90 |

### Score Calculation

1. **Base Score** = Σ(score<sub>i</sub> × weight<sub>i</sub> × multiplier<sub>i</sub>) / Σ(10 × weight<sub>i</sub> × multiplier<sub>i</sub>) × 100
2. **Final Score** = min(100, Base Score × Country Modifier)

### Tier Classification

| Tier | Score Range | Classification | Strategy |
|------|-------------|----------------|----------|
| 0 | ≥85 | Strategic | MOU, 2-3 events/semester, capstone, champion, always-on ads |
| 1 | 70-84 | Core | 1-2 events/semester, ad windows, interview blitz |
| 2 | 55-69 | Opportunistic | 1 event/semester or virtual, small ads, tight ROI |
| 3 | <55 | Explore | Virtual/joint fairs, content syndication, low-touch |

## 🚀 Deployment to GitHub Pages

### Automatic Deployment

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` branch.

### Setup Steps

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages"
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Push to main branch**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. **Wait for deployment**
   - Check the "Actions" tab for deployment progress
   - Once complete, your site will be live at:
   - `https://arielfontes98.github.io/University-Tiers/`

### Manual Deployment

If you need to deploy manually:

```bash
npm run build
# Then upload the dist/ folder to your hosting service
```

## 🎨 Design System

### Colors

- **Primary**: `#820AD1` (Nubank purple)
- **Primary Dark**: `#6A08AD`
- **Primary Light**: `#9B2DE6`
- **Neutrals**: Gray scale from 50-900

### Tier Colors

- **Tier 0 (Strategic)**: Purple (`purple-700` on `purple-100`)
- **Tier 1 (Core)**: Blue (`blue-700` on `blue-100`)
- **Tier 2 (Opportunistic)**: Yellow (`yellow-700` on `yellow-100`)
- **Tier 3 (Explore)**: Gray (`gray-700` on `gray-100`)

### Typography

System fonts stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`

### Spacing

Generous spacing with `rounded-2xl` corners and soft shadows for cards.

## 🧪 Testing

Unit tests are included for core scoring logic:

```bash
npm test
```

Tests cover:
- Score calculation accuracy
- Function multipliers
- Country modifiers
- Tier classification
- Edge cases (perfect scores, zero scores)

## 📝 License

MIT License - feel free to use for your university outreach efforts!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the scoring methodology documentation

## 🎓 Credits

Built for 2026 university outreach with ❤️ by the team  
Design inspired by Nubank's modern, accessible approach

---

**Live Demo**: [https://arielfontes98.github.io/University-Tiers/](https://arielfontes98.github.io/University-Tiers/)

**Repository**: [https://github.com/ArielFontes98/University-Tiers](https://github.com/ArielFontes98/University-Tiers)

