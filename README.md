# STEM Course Prioritization Simulator

A sophisticated web application for ranking and prioritizing university STEM courses based on a simplified 4-criteria model tailored to specific career functions (Analytics Engineering, Business Analytics, Data Science/ML Engineering).

🔗 **Live Demo**: [https://arielfontes98.github.io/University-Tiers/](https://arielfontes98.github.io/University-Tiers/)

## Overview

This tool allows you to:
- Load course data with **4 simple evaluation criteria** (Quality, Scale, Employability, Geographic Fit)
- Select a target function (AE, BA, DS/MLE) with function-specific criterion weights
- Adjust weights (0.0–2.0) to customize scoring emphasis
- Filter by country and course archetype
- View ranked courses with computed scores and tier assignments
- Export results to CSV with full metadata

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** (Nubank-inspired design)
- **Lucide Icons**
- Client-side only (no backend)

---

## Data Model (Simplified 4-Criteria Approach)

### Data Files

Place your data file in `public/data/`:

**Primary (JSON, optional):**
```
public/data/university_course_simple_scores.json
```

**Fallback (CSV, required):**
```
public/data/university_course_simple_scores.csv
```

The application will attempt to load JSON first; if unavailable, it will fall back to CSV.

### Required Columns

Each row represents a **University × Course Archetype** record with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `Country` | string | Country name |
| `University` | string | University name |
| `City/Region` | string | Campus city or region |
| `Course Archetype` | string | Course name/type (e.g., "Computer Science (BSc)") |
| `Notes` | string | Free-text notes (e.g., "Heuristic scores; adjust when better data available") |
| `Quality_0_3` | integer [0-3] | Course quality/reputation in country |
| `Scale_0_3` | integer [0-3] | Cohort size / annual volume |
| `Employability_0_3` | integer [0-3] | Pipeline to data/tech/fintech roles |
| `GeoFit_0_2` | integer [0-2] | Geographic / strategic fit |

#### Example CSV Format

```csv
Country,University,City/Region,Course Archetype,Notes,Quality_0_3,Scale_0_3,Employability_0_3,GeoFit_0_2
Brazil,USP – IME/Poli,São Paulo,Computer Science (BSc),Heuristic simple scores; adjust when you have better data.,3,3,3,2
Mexico,UNAM – Ciencias/Ing.,Ciudad de México,Data Science (BSc),Heuristic simple scores; adjust when you have better data.,3,3,3,2
```

---

## Scoring Methodology

### The 4 Criteria Explained

#### 1. **Quality_0_3** — Course Quality Index

**Question:** "How strong is this course within its country?"

- **3** = Top programs (very selective, strong reputation)
- **2** = Solid / well-known program
- **1** = Decent but not a strong reference
- **0** = Unknown / weak

#### 2. **Scale_0_3** — Scale / Cohort Size

**Question:** "How many students does this course produce per year?"

- **3** = Large cohorts (strong, stable annual volume)
- **2** = Mid-size cohorts
- **1** = Small / niche program
- **0** = Unknown

#### 3. **Employability_0_3** — Employability in Data/Tech

**Question:** "How often do graduates of this course show up in data/tech/fintech roles (AE, BA, DS/MLE, etc.)?"

- **3** = Strong pipeline to data/tech (e.g., CS, Data Science, Statistics, Industrial Eng–Data, Ops Research, Business Analytics, Econometrics)
- **2** = Decent pipeline (e.g., Economics, Applied Math, Information Systems, Production Engineering, Mechatronics)
- **1** = Low direct pipeline (e.g., classic engineering programs with little direct connection to data/tech roles)
- **0** = Unknown / no signal

#### 4. **GeoFit_0_2** — Geographic / Strategic Fit

**Question:** "Is this campus/city strategically important for us?"

- **2** = Key hub (major tech / financial / talent hub cities)
- **1** = Secondary but still relevant
- **0** = Low strategic fit

---

### Scoring Formula

For each course and selected function:

#### Step 1: Calculate Raw Score
```
RawScore = Q × wQ + S × wS + E × wE + G × wG
```

Where:
- `Q` = Quality_0_3
- `S` = Scale_0_3
- `E` = Employability_0_3
- `G` = GeoFit_0_2
- `wQ`, `wS`, `wE`, `wG` = Function-specific weights (user-adjustable, default varies by function)

#### Step 2: Normalize to 0–100 (Base Score)
```
MaxRaw = 3 × wQ + 3 × wS + 3 × wE + 2 × wG
BaseScore = (RawScore / MaxRaw) × 100
```

#### Step 3: Apply Country Modifier
```
FinalScore = BaseScore × CountryModifier
```

**Country Modifiers:**
- **Brazil**: 1.20
- **Mexico**: 1.10
- **Colombia**: 1.05
- **United States**: 0.95
- **Others**: 0.90

#### Step 4: Assign Tier

| Final Score | Tier |
|-------------|------|
| ≥ 85 | **Tier 0** – Strategic |
| ≥ 70 | **Tier 1** – Core |
| ≥ 55 | **Tier 2** – Opportunistic |
| < 55 | **Tier 3** – Explore |

---

### Function-Specific Weights

Different target functions emphasize different criteria:

| Function | wQ (Quality) | wS (Scale) | wE (Employability) | wG (GeoFit) |
|----------|--------------|------------|--------------------|-------------|
| **AE** (Analytics Engineering / Data Eng) | 0.8 | 1.2 | 1.0 | 0.8 |
| **BA** (Business / Product Analytics) | 1.0 | 0.8 | 1.2 | 1.0 |
| **DS/MLE** (Data Science / ML Eng) | 1.2 | 0.8 | 1.2 | 0.8 |

**Interpretation:**
- **AE** emphasizes **Scale** (need volume)
- **BA** emphasizes **Employability** and **GeoFit** (business-oriented, location matters)
- **DS/MLE** emphasizes **Quality** and **Employability** (technical depth, strong pipeline)

---

## Important Disclaimer

⚠️ **These scores are heuristic and for simulation purposes only.**

The 4 criteria (Quality, Scale, Employability, GeoFit) are currently scored based on **public proxies** and **best-guess estimates**:
- Course quality → rough ranking within country (not standardized)
- Scale → estimated cohort size (not precise)
- Employability → general perception of pipeline to data/tech roles (no hard data yet)
- GeoFit → subjective strategic importance of city/region

**Future improvements** will incorporate:
- Real data from **MEC/ENADE** rankings (Brazil)
- National education quality indices (Mexico, Colombia, etc.)
- **LinkedIn** employment patterns (actual placement data)
- Internal **Nubank pipeline performance** (# hires, performance, retention)
- A potential 5th criterion: **NubankTraction_0_3** (internal metric)

**Until then, treat these scores as starting points for prioritization experiments, not ground truth.**

---

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

---

## Deployment

This project uses **GitHub Actions** to automatically deploy to **GitHub Pages** on every push to `main`.

### Workflow: `.github/workflows/gh-pages.yml`

- Installs dependencies
- Builds the app (`npm run build`)
- Deploys `./dist` to GitHub Pages

### Configuration

`vite.config.ts` sets `base: '/University-Tiers/'` to match the repository name for correct asset paths on GitHub Pages.

---

## Project Structure

```
university-tiers/
├── public/
│   └── data/
│       ├── university_course_simple_scores.json  (optional, preferred)
│       └── university_course_simple_scores.csv   (fallback, required)
├── src/
│   ├── components/
│   │   ├── SidebarFilters.tsx        (Country/Archetype/Function filters)
│   │   ├── WeightSliders.tsx         (4 weight sliders: wQ, wS, wE, wG)
│   │   ├── RankingTable.tsx          (Sortable table with expand details)
│   │   ├── TierBadge.tsx             (Tier display badge)
│   │   ├── Disclaimer.tsx            (Heuristic scores warning)
│   │   └── CriteriaInfo.tsx          (Criteria definitions panel)
│   ├── lib/
│   │   ├── types.ts                  (TypeScript interfaces)
│   │   ├── dataLoader.ts             (JSON/CSV loader)
│   │   ├── scoring.ts                (4-criteria scoring logic)
│   │   └── exportCsv.ts              (CSV export with metadata)
│   ├── App.tsx                       (Main application)
│   ├── main.tsx                      (React entry point)
│   └── index.css                     (Tailwind imports)
├── .github/
│   └── workflows/
│       └── gh-pages.yml              (GitHub Pages deployment)
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Features

### Simplified 4-Criteria Model
- **Quality, Scale, Employability, GeoFit** (0-3, 0-3, 0-3, 0-2)
- Function-specific weights (AE, BA, DS/MLE)
- User-adjustable weights (0.0–2.0) with reset to defaults

### Filtering
- Multi-select countries
- Multi-select course archetypes
- Switch target function (AE, BA, DS/MLE)
- "Clear all" button

### Sortable Table
- Click headers to sort by University, Quality, Scale, Employability, GeoFit, Base Score, or Final Score
- Click rows to expand and view:
  - Raw score breakdown
  - Country modifier
  - Notes
  - Full computation details

### CSV Export
- Includes metadata header with:
  - Target function
  - Active filters
  - Current weight values
- All raw data fields (Country, University, City/Region, Course Archetype, Notes)
- Raw criterion scores (Quality_0_3, Scale_0_3, Employability_0_3, GeoFit_0_2)
- Computed fields (RawScore, BaseScore_0_100, CountryModifier, FinalScore, Tier)
- Filename with timestamp

### Design
- **Nubank-inspired**: Purple (#820AD1), rounded-2xl cards, soft shadows
- **Responsive**: Works on desktop and mobile
- **Accessible**: Keyboard-navigable sliders, ARIA labels
- **Disclaimer visible**: Heuristic scores warning prominently displayed

---

## Customization

### Updating Data

To refine the model, update `public/data/university_course_simple_scores.csv` with better scores per university and course.

**Recommended process:**
1. Gather real data (MEC/ENADE, national rankings, LinkedIn, internal pipeline)
2. Re-score Quality, Scale, Employability, GeoFit based on evidence
3. Replace the CSV (or provide JSON)
4. Refresh the app → new rankings automatically computed

### Adjusting Function Weights

Edit `src/lib/scoring.ts`:

```typescript
export const FUNCTION_WEIGHTS: Record<TargetFunction, FunctionWeights> = {
  'AE': { wQ: 0.8, wS: 1.2, wE: 1.0, wG: 0.8 },
  'BA': { wQ: 1.0, wS: 0.8, wE: 1.2, wG: 1.0 },
  'DS/MLE': { wQ: 1.2, wS: 0.8, wE: 1.2, wG: 0.8 },
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

### Adding a 5th Criterion (Future: Internal Nubank Traction)

When internal data becomes available:
1. Add `NubankTraction_0_3` column to CSV (0-3 score)
2. Update `CourseData` interface in `src/lib/types.ts`
3. Update `FunctionWeights` to include `wN: number`
4. Update scoring formula in `src/lib/scoring.ts`:
   ```typescript
   const N = course.NubankTraction_0_3 || 0;
   const rawScore = Q * wQ + S * wS + E * wE + G * wG + N * wN;
   const maxRaw = 3 * wQ + 3 * wS + 3 * wE + 2 * wG + 3 * wN;
   ```
5. Update UI components to display the new criterion

---

## License

MIT

## Author

Ariel Fontes

---

## Changelog

### v2.0 (Current) — Simplified 4-Criteria Model
- Replaced 11-criteria model with 4 simple criteria: Quality, Scale, Employability, GeoFit
- Function-specific weights (AE, BA, DS/MLE) with user adjustment
- Added prominent disclaimer about heuristic scores
- Added "About Criteria" info panel with definitions
- Updated data loader to support `university_course_simple_scores.csv`
- Updated CSV export to include new metadata and column structure

### v1.0 — 11-Criteria Model (Legacy)
- Original model with 11 evaluation criteria
- Function multipliers per criterion
- User-adjustable weights (0.0–2.0)
