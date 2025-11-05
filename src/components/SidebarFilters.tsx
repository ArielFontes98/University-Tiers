import { TargetFunction } from '../lib/types';

interface SidebarFiltersProps {
  countries: string[];
  archetypes: string[];
  selectedCountries: string[];
  selectedArchetypes: string[];
  targetFunction: TargetFunction;
  onCountriesChange: (countries: string[]) => void;
  onArchetypesChange: (archetypes: string[]) => void;
  onFunctionChange: (func: TargetFunction) => void;
  onClearFilters: () => void;
}

const FUNCTION_DESCRIPTIONS: Record<TargetFunction, string> = {
  'AE': 'Analytics Engineering / Data Engineering',
  'BA': 'Business / Product Analytics',
  'DS/MLE': 'Data Science / ML Engineering',
};

export default function SidebarFilters({
  countries,
  archetypes,
  selectedCountries,
  selectedArchetypes,
  targetFunction,
  onCountriesChange,
  onArchetypesChange,
  onFunctionChange,
  onClearFilters,
}: SidebarFiltersProps) {
  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      onCountriesChange(selectedCountries.filter(c => c !== country));
    } else {
      onCountriesChange([...selectedCountries, country]);
    }
  };

  const toggleArchetype = (archetype: string) => {
    if (selectedArchetypes.includes(archetype)) {
      onArchetypesChange(selectedArchetypes.filter(a => a !== archetype));
    } else {
      onArchetypesChange([...selectedArchetypes, archetype]);
    }
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary hover:text-primary-dark font-medium"
        >
          Clear all
        </button>
      </div>

      {/* Target Function */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Target Function
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Different functions emphasize different criteria through adjusted weights
        </p>
        <div className="space-y-2">
          {(['AE', 'BA', 'DS/MLE'] as TargetFunction[]).map(func => (
            <button
              key={func}
              onClick={() => onFunctionChange(func)}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                targetFunction === func
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              title={FUNCTION_DESCRIPTIONS[func]}
            >
              <div className="font-medium">{func}</div>
              <div className={`text-xs mt-0.5 ${targetFunction === func ? 'text-purple-100' : 'text-gray-500'}`}>
                {FUNCTION_DESCRIPTIONS[func]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Countries */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Country {selectedCountries.length > 0 && `(${selectedCountries.length} selected)`}
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {countries.map(country => (
            <label
              key={country}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() => toggleCountry(country)}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{country}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Course Archetypes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Course Archetype {selectedArchetypes.length > 0 && `(${selectedArchetypes.length} selected)`}
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {archetypes.map(archetype => (
            <label
              key={archetype}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <input
                type="checkbox"
                checked={selectedArchetypes.includes(archetype)}
                onChange={() => toggleArchetype(archetype)}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{archetype}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
