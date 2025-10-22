import { COUNTRY_MODIFIERS, DEFAULT_COUNTRY_MODIFIER } from '../lib/scoring';

export interface CountryModifiers {
  [country: string]: number;
}

interface CountryModifierSlidersProps {
  countries: string[];
  modifiers: CountryModifiers;
  onModifiersChange: (modifiers: CountryModifiers) => void;
}

export default function CountryModifierSliders({ 
  countries, 
  modifiers, 
  onModifiersChange 
}: CountryModifierSlidersProps) {
  const handleModifierChange = (country: string, value: number) => {
    onModifiersChange({ ...modifiers, [country]: value });
  };

  const resetModifiers = () => {
    const defaultModifiers: CountryModifiers = {};
    countries.forEach(country => {
      defaultModifiers[country] = COUNTRY_MODIFIERS[country] ?? DEFAULT_COUNTRY_MODIFIER;
    });
    onModifiersChange(defaultModifiers);
  };

  const getModifier = (country: string): number => {
    return modifiers[country] ?? COUNTRY_MODIFIERS[country] ?? DEFAULT_COUNTRY_MODIFIER;
  };

  const getDefaultModifier = (country: string): number => {
    return COUNTRY_MODIFIERS[country] ?? DEFAULT_COUNTRY_MODIFIER;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Country Modifiers</h2>
        <button
          onClick={resetModifiers}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
          aria-label="Reset all modifiers to defaults"
        >
          Reset
        </button>
      </div>

      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-xs text-green-800">
          🌎 <strong>Country Boost:</strong> Adjust how much each country's scores are amplified.
          Values &gt; 1.0 boost scores, &lt; 1.0 reduce them.
        </p>
      </div>

      <div className="space-y-4">
        {countries.map((country) => {
          const modifier = getModifier(country);
          const defaultVal = getDefaultModifier(country);
          const isModified = modifier !== defaultVal;

          return (
            <div key={country} className={`p-3 rounded-lg transition ${
              isModified ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={`modifier-${country}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {country}
                </label>
                <div className="flex items-center gap-2">
                  {isModified && (
                    <span className="text-xs text-purple-600 font-medium">
                      (was {defaultVal.toFixed(2)})
                    </span>
                  )}
                  <span className={`text-sm font-bold ${
                    modifier === 1.0 ? 'text-gray-600' :
                    modifier > 1.0 ? 'text-green-600' :
                    'text-orange-600'
                  }`}>
                    {modifier.toFixed(2)}x
                    {modifier !== 1.0 && (
                      <span className="text-xs ml-1">
                        {modifier > 1.0 ? '↑' : '↓'}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <input
                id={`modifier-${country}`}
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={modifier}
                onChange={(e) => handleModifierChange(country, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Country modifier for ${country}`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5</span>
                <span>1.0</span>
                <span>1.5</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Default modifiers:</strong><br/>
          🇧🇷 Brazil: 1.20 • 🇲🇽 Mexico: 1.10 • 🇨🇴 Colombia: 1.05<br/>
          🇺🇸 USA: 0.95 • 🌎 Others: 0.90
        </p>
      </div>
    </div>
  );
}

