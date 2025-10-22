#!/bin/bash

echo "🚀 Starting STEM Course Prioritization App..."
echo ""
echo "📁 Project: /Users/ariel.fontes/university-tiers"
echo "📊 Dataset: 1136 courses"
echo ""

cd /Users/ariel.fontes/university-tiers

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔥 Starting development server..."
echo ""
echo "✨ Features:"
echo "   • 1136 STEM courses"
echo "   • Adjustable criterion weights (0.0-2.0)"
echo "   • Adjustable country modifiers (0.5x-1.5x)"
echo "   • Real-time score calculator"
echo "   • Visual progress bars"
echo "   • Export to CSV"
echo ""
echo "🎯 After server starts:"
echo "   1. Open the Score Calculator panel"
echo "   2. Move any slider and watch scores update instantly"
echo "   3. Try the 'Test' button for dramatic changes"
echo "   4. Adjust country modifiers to prioritize regions"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev

