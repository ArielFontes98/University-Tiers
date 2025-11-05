import { useState, useEffect, useMemo } from 'react';
import { CourseData, TargetFunction, FunctionWeights } from './lib/types';
import { loadCourseData } from './lib/dataLoader';
import { calculateScore, FUNCTION_WEIGHTS, COUNTRY_MODIFIERS } from './lib/scoring';
import { exportToCSV } from './lib/exportCsv';
import SidebarFilters from './components/SidebarFilters';
import WeightSliders from './components/WeightSliders';
import RankingTable from './components/RankingTable';
import Disclaimer from './components/Disclaimer';
import CriteriaInfo from './components/CriteriaInfo';
import { Download, Loader2, Info } from 'lucide-react';

function App() {
  const [data, setData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCriteriaInfo, setShowCriteriaInfo] = useState(false);

  const [targetFunction, setTargetFunction] = useState<TargetFunction>('DS/MLE');
  const [weights, setWeights] = useState<FunctionWeights>(FUNCTION_WEIGHTS['DS/MLE']);

  const [countryModifiers] = useState<Record<string, number>>(() => {
    // Initialize country modifiers (currently not user-editable, but ready for future)
    return { ...COUNTRY_MODIFIERS };
  });

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    console.log('🚀 Starting data load...');
    loadCourseData()
      .then(loadedData => {
        console.log(`✅ Loaded ${loadedData.length} courses`);
        setData(loadedData);
        setLoading(false);
        console.log('✅ App ready!');
      })
      .catch(err => {
        console.error('❌ Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Update weights when function changes
  useEffect(() => {
    setWeights(FUNCTION_WEIGHTS[targetFunction]);
  }, [targetFunction]);

  // Extract unique countries and archetypes
  const countries = useMemo(() => {
    return Array.from(new Set(data.map(d => d.Country))).sort();
  }, [data]);

  const archetypes = useMemo(() => {
    return Array.from(new Set(data.map(d => d['Course Archetype']))).sort();
  }, [data]);

  // Filter and score courses
  const scoredCourses = useMemo(() => {
    if (data.length === 0) {
      return [];
    }

    let filtered = data;

    if (selectedCountries.length > 0) {
      filtered = filtered.filter(d => selectedCountries.includes(d.Country));
    }

    if (selectedArchetypes.length > 0) {
      filtered = filtered.filter(d => selectedArchetypes.includes(d['Course Archetype']));
    }

    return filtered.map(course => calculateScore(course, targetFunction, weights, countryModifiers));
  }, [data, targetFunction, weights, countryModifiers, selectedCountries, selectedArchetypes]);

  const handleClearFilters = () => {
    setSelectedCountries([]);
    setSelectedArchetypes([]);
  };

  const handleResetWeights = () => {
    setWeights(FUNCTION_WEIGHTS[targetFunction]);
  };

  const handleExport = () => {
    exportToCSV(scoredCourses, targetFunction, weights, countryModifiers, {
      countries: selectedCountries,
      archetypes: selectedArchetypes,
    });
  };

  // Stats for header
  const stats = useMemo(() => {
    if (scoredCourses.length === 0) return { avg: 0, min: 0, max: 0 };
    const finals = scoredCourses.map(c => c.finalScore);
    return {
      avg: Math.round(finals.reduce((a, b) => a + b, 0) / finals.length * 100) / 100,
      min: Math.round(Math.min(...finals) * 100) / 100,
      max: Math.round(Math.max(...finals) * 100) / 100,
    };
  }, [scoredCourses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Data</h2>
          <pre className="bg-gray-100 p-4 rounded-xl text-sm text-gray-700 overflow-auto whitespace-pre-wrap">
            {error}
          </pre>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Expected data file:</strong> <code>public/data/university_course_simple_scores.csv</code> or <code>.json</code>
            </p>
            <p className="text-sm text-blue-800 mt-2">
              Make sure the file exists and contains the required columns: Country, University, City/Region, Course Archetype, Notes, Quality_0_3, Scale_0_3, Employability_0_3, GeoFit_0_2
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                STEM Course Prioritization
              </h1>
              <p className="text-gray-600 mt-1">
                {scoredCourses.length} courses • {targetFunction} function • Simplified 4-Criteria Model
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Score Range: {stats.min}–{stats.max} • Average: {stats.avg}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCriteriaInfo(!showCriteriaInfo)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                aria-label="Show criteria information"
              >
                <Info className="w-5 h-5" />
                <span>About Criteria</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Export current view as CSV"
              >
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <Disclaimer />

        {showCriteriaInfo && (
          <div className="mb-6">
            <CriteriaInfo />
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <SidebarFilters
              countries={countries}
              archetypes={archetypes}
              selectedCountries={selectedCountries}
              selectedArchetypes={selectedArchetypes}
              targetFunction={targetFunction}
              onCountriesChange={setSelectedCountries}
              onArchetypesChange={setSelectedArchetypes}
              onFunctionChange={setTargetFunction}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Center - Table */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <RankingTable courses={scoredCourses} />
          </div>

          {/* Right Sidebar - Weights */}
          <div className="col-span-12 lg:col-span-3">
            <WeightSliders 
              weights={weights} 
              onWeightChange={setWeights}
              onReset={handleResetWeights}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1920px] mx-auto px-6 py-6">
          <p className="text-sm text-gray-600 text-center">
            STEM Course Prioritization Tool • Simplified 4-Criteria Model • 
            Data is heuristic and for simulation purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
