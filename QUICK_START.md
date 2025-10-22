# 🚀 Quick Start Guide

## Install and Run (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open http://localhost:5173
```

## Deploy to GitHub Pages (2 steps)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Enable GitHub Pages
# Go to: Settings → Pages → Source: GitHub Actions
```

Your site will be live at: `https://arielfontes98.github.io/University-Tiers/`

## Add Your Data

Replace the seed file at:
```
/public/data/universities_stem_courses_exhaustive_seed.json
```

Then update line 6 in `src/utils/dataLoader.ts`:
```typescript
const response = await fetch('/University-Tiers/data/universities_stem_courses_exhaustive_seed.json');
```

## Key Features

✅ Score universities on 11 criteria  
✅ Auto-save scores in browser  
✅ Export to CSV  
✅ Apply smart presets  
✅ Filter by country/course/function  
✅ Get tier-based activation playbooks

## Need Help?

📖 Read [README.md](./README.md) for full documentation  
🔧 Read [SETUP.md](./SETUP.md) for detailed setup instructions

---

**Built with**: React + TypeScript + Vite + Tailwind CSS

