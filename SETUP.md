# Setup Guide for University Tiers

This guide will help you set up and deploy the University STEM Course Prioritization app.

## Prerequisites

- Git installed
- Node.js 18+ and npm
- A GitHub account

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/ArielFontes98/University-Tiers.git
cd University-Tiers

# Install dependencies
npm install
```

## Step 2: Test Locally

```bash
# Run development server
npm run dev

# Open http://localhost:5173 in your browser
```

You should see the application running with sample universities loaded.

## Step 3: Customize Your Data

### Option A: Use the existing seed file
The app comes with 23 sample universities. You can start using it immediately.

### Option B: Replace with your exhaustive data
If you have your own `universities_stem_courses_exhaustive_seed.json`:

1. Place it in: `/public/data/universities_stem_courses_exhaustive_seed.json`
2. Update `src/utils/dataLoader.ts` line 6:
   ```typescript
   const response = await fetch('/University-Tiers/data/universities_stem_courses_exhaustive_seed.json');
   ```
3. Rebuild: `npm run build`

### Option C: Edit the existing data
Edit `/public/data/universities_stem_courses_seed.json` to add/remove/modify universities.

**Data format:**
```json
{
  "Country": "Brazil|Mexico|Colombia|United States|Others",
  "University": "University Name",
  "City/Region": "City, State/Region",
  "STEM Courses (Archetypes)": "Course1; Course2; Course3",
  "Notes": "Any additional notes"
}
```

## Step 4: Configure for Your Repository

If you forked the repo or are using a different repository name:

1. Update `vite.config.ts` line 6:
   ```typescript
   base: '/Your-Repository-Name/',
   ```

2. Update `src/utils/dataLoader.ts` line 6:
   ```typescript
   const response = await fetch('/Your-Repository-Name/data/...');
   ```

## Step 5: Deploy to GitHub Pages

### First-time setup:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"
   - Save

3. **Wait for deployment:**
   - Go to "Actions" tab
   - Watch the "Deploy to GitHub Pages" workflow
   - Once complete (green checkmark), your site is live!

4. **Access your site:**
   ```
   https://arielfontes98.github.io/University-Tiers/
   ```
   (Replace with your username and repo name)

### Subsequent deployments:

Just push to main:
```bash
git add .
git commit -m "Update universities data"
git push origin main
```

The site will automatically rebuild and redeploy.

## Step 6: Using the App

### Filtering
- **Countries**: Check/uncheck countries to filter
- **STEM Courses**: Check/uncheck specific courses
- **Target Function**: Choose AE, BA, or DS/MLE to change scoring weights

### Scoring Universities
1. Click on a university card to expand it
2. Select a course (if multiple available)
3. Use the 11 sliders to score each criterion (0-10)
4. Scores are automatically saved to your browser

### Applying Presets
Click "Apply Default Presets" in the sidebar to automatically fill in reasonable scores for all universities based on their course types.

### Exporting Data
Click "Export CSV" to download the current filtered view with all scores and tiers.

### Clearing Data
Click "Clear All Data" to reset all scores and filters (this cannot be undone).

## Troubleshooting

### Site shows 404
- Ensure GitHub Pages is enabled in repository settings
- Check that `base` in `vite.config.ts` matches your repository name
- Verify the GitHub Actions workflow completed successfully

### Data not loading
- Check browser console for errors
- Ensure JSON file is valid (use a JSON validator)
- Verify file path matches what's in `dataLoader.ts`

### Scores not saving
- Check browser console for localStorage errors
- Try clearing browser cache
- Ensure you're not in private/incognito mode

### Build fails
- Delete `node_modules` and run `npm install` again
- Ensure Node.js version is 18+: `node -v`
- Check for TypeScript errors: `npm run build`

## Advanced Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#820AD1',  // Change to your brand color
}
```

### Modify Scoring Weights
Edit `src/types/index.ts` → `CRITERIA_WEIGHTS`

### Adjust Function Multipliers
Edit `src/utils/scoring.ts` → `FUNCTION_MULTIPLIERS`

### Change Country Modifiers
Edit `src/utils/scoring.ts` → `COUNTRY_MODIFIERS`

### Update Tier Thresholds
Edit `src/utils/scoring.ts` → `getTier()` function

## Getting Help

- 📖 Check the main [README.md](./README.md)
- 🐛 Open an issue on GitHub
- 💬 Review existing issues for solutions

## Next Steps

- Customize the data with your universities
- Adjust scoring criteria to match your priorities
- Share the deployed URL with your team
- Export and analyze the results

Happy prioritizing! 🎓

