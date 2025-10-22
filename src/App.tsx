import { useState, useEffect, useMemo } from 'react';
import { CourseData, TargetFunction, Weights } from './lib/types';
import { loadCourseData } from './lib/dataLoader';
import { calculateScore, CRITERION_KEYS, COUNTRY_MODIFIERS, DEFAULT_COUNTRY_MODIFIER } from './lib/scoring';
import { exportToCSV } from './lib/exportCsv';
import SidebarFilters from './components/SidebarFilters';
import WeightSliders from './components/WeightSliders';
import RankingTable from './components/RankingTable';
import ScoreDebugger from './components/ScoreDebugger';
import CountryModifierSliders, { CountryModifiers } from './components/CountryModifierSliders';
import { Download, Loader2 } from 'lucide-react';

function App() {
  const [data, setData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [targetFunction, setTargetFunction] = useState<TargetFunction>('DS/MLE');
  const [weights, setWeights] = useState<Weights>(() => {
    const defaultWeights: Weights = {};
    CRITERION_KEYS.forEach(key => {
      defaultWeights[key] = 1.0;
    });
    return defaultWeights;
  });

  const [countryModifiers, setCountryModifiers] = useState<CountryModifiers>({});
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    console.log('🚀 Starting data load...');
    loadCourseData()
      .then(loadedData => {
        console.log(`✅ Loaded ${loadedData.length} courses`);
        setData(loadedData);
        
        // Initialize country modifiers immediately with loaded data
        const uniqueCountries = Array.from(new Set(loadedData.map(d => d.Country)));
        const initialModifiers: CountryModifiers = {};
        uniqueCountries.forEach(country => {
          initialModifiers[country] = COUNTRY_MODIFIERS[country] ?? DEFAULT_COUNTRY_MODIFIER;
        });
        console.log('✅ Initialized country modifiers:', Object.keys(initialModifiers));
        setCountryModifiers(initialModifiers);
        
        setLoading(false);
        console.log('✅ App ready!');
      })
      .catch(err => {
        console.error('❌ Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Extract unique countries and archetypes
  const countries = useMemo(() => {
    return Array.from(new Set(data.map(d => d.Country))).sort();
  }, [data]);

  const archetypes = useMemo(() => {
    return Array.from(new Set(data.map(d => d['Course Archetype']))).sort();
  }, [data]);

  // Filter and score courses
  const scoredCourses = useMemo(() => {
    // Don't calculate if data or modifiers aren't ready
    if (data.length === 0 || Object.keys(countryModifiers).length === 0) {
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

  const handleExport = () => {
    exportToCSV(scoredCourses, targetFunction, weights, countryModifiers, {
      countries: selectedCountries,
      archetypes: selectedArchetypes,
    });
  };

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
        </div>
      </div>
    );
  }

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
                {scoredCourses.length} courses • {targetFunction} function
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Score Range: {stats.min}–{stats.max} • Average: {stats.avg}
              </p>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-6 py-8">
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
            <CountryModifierSliders
              countries={countries}
              modifiers={countryModifiers}
              onModifiersChange={setCountryModifiers}
            />
          </div>

          {/* Center - Table */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <ScoreDebugger 
              courses={scoredCourses}
              targetFunction={targetFunction}
              weights={weights}
            />
            <RankingTable courses={scoredCourses} />
          </div>

          {/* Right Sidebar - Weights */}
          <div className="col-span-12 lg:col-span-3">
            <WeightSliders weights={weights} onWeightsChange={setWeights} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
