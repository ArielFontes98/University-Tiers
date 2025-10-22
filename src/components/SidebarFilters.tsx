import { Target, MapPin, BookOpen } from 'lucide-react';
import { Country, TargetFunction, Filters } from '../types';

interface SidebarFiltersProps {
  filters: Filters;
  availableCourses: string[];
  onFiltersChange: (filters: Filters) => void;
  onApplyPreset: () => void;
  onClearData: () => void;
}

const COUNTRIES: Country[] = ['Brazil', 'Mexico', 'Colombia', 'United States', 'Others'];
const TARGET_FUNCTIONS: TargetFunction[] = ['AE', 'BA', 'DS/MLE'];

export function SidebarFilters({
  filters,
  availableCourses,
  onFiltersChange,
  onApplyPreset,
  onClearData,
}: SidebarFiltersProps) {
  const toggleCountry = (country: Country) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter(c => c !== country)
      : [...filters.countries, country];
    onFiltersChange({ ...filters, countries: newCountries });
  };

  const toggleCourse = (course: string) => {
    const newCourses = filters.stemCourses.includes(course)
      ? filters.stemCourses.filter(c => c !== course)
      : [...filters.stemCourses, course];
    onFiltersChange({ ...filters, stemCourses: newCourses });
  };

  const setTargetFunction = (targetFunction: TargetFunction) => {
    onFiltersChange({ ...filters, targetFunction });
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Target Function */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Target Function</h3>
          </div>
          <div className="space-y-2">
            {TARGET_FUNCTIONS.map(func => (
              <label key={func} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="targetFunction"
                  checked={filters.targetFunction === func}
                  onChange={() => setTargetFunction(func)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{func}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Countries</h3>
          </div>
          <div className="space-y-2">
            {COUNTRIES.map(country => (
              <label key={country} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.countries.includes(country)}
                  onChange={() => toggleCountry(country)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* STEM Courses */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">STEM Courses</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableCourses.map(course => (
              <label key={course} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.stemCourses.includes(course)}
                  onChange={() => toggleCourse(course)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{course}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6 border-t border-gray-200">
          <button
            onClick={onApplyPreset}
            className="btn-primary w-full"
          >
            Apply Default Presets
          </button>
          <button
            onClick={onClearData}
            className="btn-secondary w-full"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </aside>
  );
}

