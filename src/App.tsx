import { useState, useEffect, useMemo } from 'react';
import { Download } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SidebarFilters } from './components/SidebarFilters';
import { UniversityList } from './components/UniversityList';
import { UniversityData, Filters, CriteriaScores, Country } from './types';
import { loadUniversityData } from './utils/dataLoader';
import { saveScores, loadScores, saveFilters, loadFilters, clearAllData } from './utils/storage';
import { getPresetForCourse } from './utils/presets';
import { exportToCSV } from './utils/export';
import { calculateScore } from './utils/scoring';

function App() {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [filters, setFilters] = useState<Filters>({
    countries: ['Brazil', 'Mexico', 'Colombia', 'United States', 'Others'] as Country[],
    stemCourses: [],
    targetFunction: 'DS/MLE',
  });
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadUniversityData();
        setUniversities(data);

        // Load saved filters
        const savedFilters = loadFilters();
        if (savedFilters) {
          setFilters(savedFilters);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save filters when changed
  useEffect(() => {
    if (!loading) {
      saveFilters(filters);
    }
  }, [filters, loading]);

  // Extract all unique courses
  const allCourses = useMemo(() => {
    const coursesSet = new Set<string>();
    universities.forEach(uni => {
      const courses = uni['STEM Courses (Archetypes)']
        .split(';')
        .map(c => c.trim())
        .filter(Boolean);
      courses.forEach(course => coursesSet.add(course));
    });
    return Array.from(coursesSet).sort();
  }, [universities]);

  // Update stem courses filter when universities load
  useEffect(() => {
    if (allCourses.length > 0 && filters.stemCourses.length === 0) {
      setFilters(prev => ({ ...prev, stemCourses: allCourses }));
    }
  }, [allCourses]);

  // Filter universities
  const filteredUniversities = useMemo(() => {
    return universities.filter(uni => {
      // Filter by country
      if (!filters.countries.includes(uni.Country)) {
        return false;
      }

      // Filter by STEM courses
      const uniCourses = uni['STEM Courses (Archetypes)']
        .split(';')
        .map(c => c.trim())
        .filter(Boolean);
      
      const hasMatchingCourse = uniCourses.some(course =>
        filters.stemCourses.includes(course)
      );

      return hasMatchingCourse;
    });
  }, [universities, filters]);

  const getScores = (university: string, course: string): CriteriaScores => {
    const saved = loadScores(university, course);
    if (saved) {
      return saved;
    }
    // Return zero scores as default
    return {
      curriculumDepth: 0,
      engineeringFoundations: 0,
      dataEngineeringExposure: 0,
      analyticsBusinessOrientation: 0,
      cohortSizeContinuity: 0,
      capstoneProjectsIntensity: 0,
      toolsStackFamiliarity: 0,
      clubsCompetitions: 0,
      internshipAlignment: 0,
      diPipelineContribution: 0,
      regionalCoverageFit: 0,
    };
  };

  const handleScoresChange = (university: string, course: string, scores: CriteriaScores) => {
    saveScores(university, course, scores);
    // Force re-render
    setUniversities([...universities]);
  };

  const handleApplyPreset = () => {
    filteredUniversities.forEach(uni => {
      const courses = uni['STEM Courses (Archetypes)']
        .split(';')
        .map(c => c.trim())
        .filter(Boolean);
      
      courses.forEach(course => {
        const preset = getPresetForCourse(course);
        saveScores(uni.University, course, preset);
      });
    });
    
    // Force re-render
    setUniversities([...universities]);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all saved scores? This cannot be undone.')) {
      clearAllData();
      setUniversities([...universities]);
    }
  };

  const handleExport = () => {
    const exportData = filteredUniversities.map(uni => {
      const courses = uni['STEM Courses (Archetypes)']
        .split(';')
        .map(c => c.trim())
        .filter(Boolean);
      
      const course = courses[0] || '';
      const scores = getScores(uni.University, course);
      const { baseScore, finalScore, tier } = calculateScore(
        scores,
        filters.targetFunction,
        uni.Country
      );

      return {
        ...uni,
        selectedCourse: course,
        scores,
        baseScore,
        finalScore,
        tier,
      };
    });

    exportToCSV(exportData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading universities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <SidebarFilters
          filters={filters}
          availableCourses={allCourses}
          onFiltersChange={setFilters}
          onApplyPreset={handleApplyPreset}
          onClearData={handleClearData}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            {/* Action bar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredUniversities.length} {filteredUniversities.length === 1 ? 'University' : 'Universities'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Target: {filters.targetFunction}
                </p>
              </div>
              <button
                onClick={handleExport}
                className="btn-primary flex items-center gap-2"
                disabled={filteredUniversities.length === 0}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {/* University list */}
            <UniversityList
              universities={filteredUniversities}
              targetFunction={filters.targetFunction}
              onScoresChange={handleScoresChange}
              getScores={getScores}
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;

