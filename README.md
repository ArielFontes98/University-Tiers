# STEM Course Prioritization Simulator

A sophisticated web application for ranking and prioritizing university STEM courses based on weighted criteria tailored to specific career functions (Analytics Engineering, Business Analytics, Data Science/ML Engineering).

🔗 **Live Demo**: [https://arielfontes98.github.io/University-Tiers/](https://arielfontes98.github.io/University-Tiers/)

## Overview

This tool allows you to:
- Load course data with 11 evaluation criteria
- Select a target function (AE, BA, DS/MLE) with pre-configured multipliers
- Adjust criterion weights (0.0–2.0) to customize scoring
- Filter by country and course archetype
- View ranked courses with computed scores and tier assignments
- Export results to CSV with metadata

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** (Nubank-inspired design)
- **Lucide Icons**
- Client-side only (no backend)

## Data Files

Place your data files in `public/data/`:

### Primary: JSON
`public/data/university_course_criteria_base.json`

```json
[
  {
    "Country": "Brazil",
    "University": "University of São Paulo",
    "City/Region": "São Paulo",
    "Course Archetype": "Computer Science - Data Science Track",
    "Notes": "Strong ML curriculum",
    "Curriculum Depth (DS/ML/Stats/SQL) (0-10)": 9,
    "Engineering Foundations (0-10)": 8,
    "Data Engineering Exposure (0-10)": 7,
    "Analytics/Business Orientation (0-10)": 6,
    "Cohort Size & Continuity (0-10)": 8,
    "Capstone/Projects Intensity (0-10)": 7,
    "Tools & Stack Familiarity (0-10)": 8,
    "Clubs & Competitions (0-10)": 7,
    "Internship Alignment (0-10)": 8,
    "D&I Pipeline Contribution (0-10)": 7,
    "Regional Coverage Fit (0-10)": 9
  }
]
```

### Fallback: CSV
`public/data/university_course_criteria_base.csv`

Must include headers (exact names):
- `Country`, `University`, `City/Region`, `Course Archetype`, `Notes`
- `Curriculum Depth (DS/ML/Stats/SQL) (0-10)`
- `Engineering Foundations (0-10)`
- `Data Engineering Exposure (0-10)`
- `Analytics/Business Orientation (0-10)`
- `Cohort Size & Continuity (0-10)`
- `Capstone/Projects Intensity (0-10)`
- `Tools & Stack Familiarity (0-10)`
- `Clubs & Competitions (0-10)`
- `Internship Alignment (0-10)`
- `D&I Pipeline Contribution (0-10)`
- `Regional Coverage Fit (0-10)`

Optional: Add `Source: <Criterion>` columns for reference links.

## Scoring Methodology

### Base Score Formula

For each course and selected function:

```
numerator = Σ(score[i] × weight[i] × multiplier[i])
denominator = Σ(10 × weight[i] × multiplier[i])
base_score = (numerator / denominator) × 100
```

Where:
- `score[i]`: Raw criterion value (0–10) from data
- `weight[i]`: User-adjustable weight (0.0–2.0, default 1.0)
- `multiplier[i]`: Function-specific multiplier

### Function Multipliers

Aligned with 11 criteria in order:

| Function | Multipliers |
|----------|-------------|
| **AE** (Analytics Engineering) | [0.6, 0.9, 1.0, 0.5, 0.8, 0.7, 0.9, 0.6, 0.6, 0.6, 0.6] |
| **BA** (Business Analytics) | [1.0, 0.6, 0.6, 1.0, 0.9, 0.9, 0.7, 0.8, 0.9, 0.8, 0.7] |
| **DS/MLE** (Data Science/ML) | [1.0, 0.9, 0.8, 0.7, 0.8, 0.8, 1.0, 0.7, 0.8, 0.7, 0.6] |

### Country Modifiers

```
final_score = base_score × country_modifier
```

- **Brazil**: 1.20
- **Mexico**: 1.10
- **Colombia**: 1.05
- **United States**: 0.95
- **Others**: 0.90

### Tier Assignment

| Final Score | Tier |
|-------------|------|
| ≥ 85 | **Tier 0** – Strategic |
| ≥ 70 | **Tier 1** – Core |
| ≥ 55 | **Tier 2** – Opportunistic |
| < 55 | **Tier 3** – Explore |

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Clone the repository
git clone git@github.com:ArielFontes98/University-Tiers.git
cd University-Tiers

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` (or the port Vite assigns).

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

### Run Tests

```bash
npm test
```

## Deployment

This project uses **GitHub Actions** to automatically deploy to **GitHub Pages** on every push to `main`.

### Workflow: `.github/workflows/gh-pages.yml`

- Installs dependencies
- Builds the app (`npm run build`)
- Deploys `./dist` to GitHub Pages

### Configuration

`vite.config.ts` sets `base: '/University-Tiers/'` to match the repository name for correct asset paths on GitHub Pages.

## Project Structure

```
university-tiers/
├── public/
│   └── data/
│       ├── university_course_criteria_base.json  (sample data)
│       └── university_course_criteria_base.csv   (fallback)
├── src/
│   ├── components/
│   │   ├── SidebarFilters.tsx     (Country/Archetype/Function filters)
│   │   ├── WeightSliders.tsx      (11 criterion weight sliders)
│   │   ├── RankingTable.tsx       (Sortable table with expand details)
│   │   └── TierBadge.tsx          (Tier display badge)
│   ├── lib/
│   │   ├── types.ts               (TypeScript interfaces)
│   │   ├── dataLoader.ts          (JSON/CSV loader with BASE_URL)
│   │   ├── scoring.ts             (Score calculation & tiers)
│   │   └── exportCsv.ts           (CSV export with metadata)
│   ├── App.tsx                    (Main application)
│   ├── main.tsx                   (React entry point)
│   └── index.css                  (Tailwind imports)
├── .github/
│   └── workflows/
│       └── gh-pages.yml           (GitHub Pages deployment)
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Features

### Interactive Weight Adjustment
- 11 sliders for each criterion (0.0–2.0)
- Instant re-calculation and re-ranking
- "Reset" button to restore defaults (1.0)

### Filtering
- Multi-select countries
- Multi-select course archetypes
- Switch target function (AE, BA, DS/MLE)
- "Clear all" button

### Sortable Table
- Click headers to sort by University, Base Score, or Final Score
- Click rows to expand and view:
  - Raw 11 criterion scores
  - Notes
  - Optional "Source: …" links

### CSV Export
- Includes metadata header with:
  - Target function
  - Active filters
  - Current weight values
- All computed fields (Base, Modifier, Final, Tier)
- Raw criterion scores
- Filename with timestamp

### Design
- **Nubank-inspired**: Purple (#820AD1), rounded-2xl cards, soft shadows
- **Responsive**: Works on desktop and mobile
- **Accessible**: Keyboard-navigable sliders, ARIA labels

## Customization

### Updating Data

Replace `public/data/university_course_criteria_base.json` with your full dataset following the schema. Alternatively, provide a CSV with the exact headers.

### Adjusting Multipliers

Edit `src/lib/scoring.ts`:

```typescript
export const FUNCTION_MULTIPLIERS: Record<TargetFunction, number[]> = {
  'AE': [0.6, 0.9, 1.0, 0.5, 0.8, 0.7, 0.9, 0.6, 0.6, 0.6, 0.6],
  'BA': [1.0, 0.6, 0.6, 1.0, 0.9, 0.9, 0.7, 0.8, 0.9, 0.8, 0.7],
  'DS/MLE': [1.0, 0.9, 0.8, 0.7, 0.8, 0.8, 1.0, 0.7, 0.8, 0.7, 0.6],
};
```

### Changing Country Modifiers

Edit `src/lib/scoring.ts`:

```typescript
export const COUNTRY_MODIFIERS: Record<string, number> = {
  'Brazil': 1.20,
  'Mexico': 1.10,
  'Colombia': 1.05,
  'United States': 0.95,
};
```

## License

MIT

## Author

Ariel Fontes
