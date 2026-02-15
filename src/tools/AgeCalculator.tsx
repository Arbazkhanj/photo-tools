import { useState, useEffect } from 'react';
import { X, Calculator, Calendar, ChevronRight, RotateCcw } from 'lucide-react';

interface AgeCalculatorProps {
  onClose: () => void;
  title?: string;
}

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

interface DateParts {
  day: string;
  month: string;
  year: string;
}

const months = [
  { value: '1', label: 'January (जनवरी)' },
  { value: '2', label: 'February (फरवरी)' },
  { value: '3', label: 'March (मार्च)' },
  { value: '4', label: 'April (अप्रैल)' },
  { value: '5', label: 'May (मई)' },
  { value: '6', label: 'June (जून)' },
  { value: '7', label: 'July (जुलाई)' },
  { value: '8', label: 'August (अगस्त)' },
  { value: '9', label: 'September (सितंबर)' },
  { value: '10', label: 'October (अक्टूबर)' },
  { value: '11', label: 'November (नवंबर)' },
  { value: '12', label: 'December (दिसंबर)' },
];

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

const AgeCalculator = ({ onClose, title = 'Age Calculator' }: AgeCalculatorProps) => {
  const today = new Date();
  
  // Birth date state
  const [birthDate, setBirthDate] = useState<DateParts>({
    day: '',
    month: '',
    year: ''
  });
  
  // To date state (default: today)
  const [toDate, setToDate] = useState<DateParts>({
    day: today.getDate().toString(),
    month: (today.getMonth() + 1).toString(),
    year: today.getFullYear().toString()
  });
  
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'birth' | 'to'>('birth');

  // Update max days when month/year changes
  const [maxBirthDays, setMaxBirthDays] = useState(31);
  const [maxToDays, setMaxToDays] = useState(31);

  useEffect(() => {
    if (birthDate.month && birthDate.year) {
      const days = getDaysInMonth(parseInt(birthDate.month), parseInt(birthDate.year));
      setMaxBirthDays(days);
      if (parseInt(birthDate.day) > days) {
        setBirthDate(prev => ({ ...prev, day: '' }));
      }
    }
  }, [birthDate.month, birthDate.year]);

  useEffect(() => {
    if (toDate.month && toDate.year) {
      const days = getDaysInMonth(parseInt(toDate.month), parseInt(toDate.year));
      setMaxToDays(days);
      if (parseInt(toDate.day) > days) {
        setToDate(prev => ({ ...prev, day: '' }));
      }
    }
  }, [toDate.month, toDate.year]);

  const calculateAge = () => {
    if (!birthDate.day || !birthDate.month || !birthDate.year) {
      setError('Please enter complete birth date (Day, Month, Year)');
      setActiveTab('birth');
      return;
    }

    if (!toDate.day || !toDate.month || !toDate.year) {
      setError('Please enter complete calculation date');
      setActiveTab('to');
      return;
    }

    const birth = new Date(parseInt(birthDate.year), parseInt(birthDate.month) - 1, parseInt(birthDate.day));
    const to = new Date(parseInt(toDate.year), parseInt(toDate.month) - 1, parseInt(toDate.day));

    if (isNaN(birth.getTime()) || isNaN(to.getTime())) {
      setError('Invalid date entered');
      return;
    }

    if (birth > to) {
      setError('Birth date cannot be after the calculation date');
      return;
    }

    setError('');

    let years = to.getFullYear() - birth.getFullYear();
    let months = to.getMonth() - birth.getMonth();
    let days = to.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days
    const diffTime = Math.abs(to.getTime() - birth.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays });
  };

  const reset = () => {
    setBirthDate({ day: '', month: '', year: '' });
    setToDate({
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(),
      year: today.getFullYear().toString()
    });
    setResult(null);
    setError('');
    setActiveTab('birth');
  };

  // Quick year selection
  const yearOptions = [];
  const currentYear = today.getFullYear();
  for (let y = currentYear; y >= 1950; y--) {
    yearOptions.push(y.toString());
  }

  // Day options based on month
  const getDayOptions = (maxDays: number) => {
    const days = [];
    for (let d = 1; d <= maxDays; d++) {
      days.push(d.toString().padStart(2, '0'));
    }
    return days;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-blue-100 text-sm">Calculate exact age for exam eligibility</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('birth')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'birth'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎂 Date of Birth
            </button>
            <button
              onClick={() => setActiveTab('to')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'to'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📅 Calculate Till
            </button>
          </div>

          {/* Birth Date Input */}
          {activeTab === 'birth' && (
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                Enter Your Date of Birth
                <span className="text-xs font-normal text-gray-500">(जन्म तिथि)</span>
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Day */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Day (दिन)</label>
                  <select
                    value={birthDate.day}
                    onChange={(e) => setBirthDate(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-lg font-semibold text-center appearance-none cursor-pointer hover:border-blue-300"
                  >
                    <option value="">DD</option>
                    {getDayOptions(maxBirthDays).map(d => (
                      <option key={d} value={parseInt(d)}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Month (महीना)</label>
                  <select
                    value={birthDate.month}
                    onChange={(e) => setBirthDate(prev => ({ ...prev, month: e.target.value }))}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-lg font-semibold text-center appearance-none cursor-pointer hover:border-blue-300"
                  >
                    <option value="">MM</option>
                    {months.map(m => (
                      <option key={m.value} value={m.value}>{m.value.padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Year (साल)</label>
                  <select
                    value={birthDate.year}
                    onChange={(e) => setBirthDate(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-lg font-semibold text-center appearance-none cursor-pointer hover:border-blue-300"
                  >
                    <option value="">YYYY</option>
                    {yearOptions.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Month Name Display */}
              {birthDate.month && (
                <div className="mt-3 text-center">
                  <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {months.find(m => m.value === birthDate.month)?.label.split('(')[0]}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* To Date Input */}
          {activeTab === 'to' && (
            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                <Calendar className="w-5 h-5 text-green-600" />
                Calculate Age Till
                <span className="text-xs font-normal text-gray-500">(किस तारीख तक)</span>
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Day */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Day (दिन)</label>
                  <select
                    value={toDate.day}
                    onChange={(e) => setToDate(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-lg font-semibold text-center appearance-none cursor-pointer hover:border-green-300"
                  >
                    <option value="">DD</option>
                    {getDayOptions(maxToDays).map(d => (
                      <option key={d} value={parseInt(d)}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Month (महीना)</label>
                  <select
                    value={toDate.month}
                    onChange={(e) => setToDate(prev => ({ ...prev, month: e.target.value }))}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-lg font-semibold text-center appearance-none cursor-pointer hover:border-green-300"
                  >
                    <option value="">MM</option>
                    {months.map(m => (
                      <option key={m.value} value={m.value}>{m.value.padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Year (साल)</label>
                  <select
                    value={toDate.year}
                    onChange={(e) => setToDate(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-lg font-semibold text-center appearance-none cursor-pointer hover:border-green-300"
                  >
                    <option value="">YYYY</option>
                    {yearOptions.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Month Name Display */}
              {toDate.month && (
                <div className="mt-3 text-center">
                  <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {months.find(m => m.value === toDate.month)?.label.split('(')[0]}
                  </span>
                </div>
              )}

              {/* Quick Set Today */}
              <button
                onClick={() => {
                  setToDate({
                    day: today.getDate().toString(),
                    month: (today.getMonth() + 1).toString(),
                    year: today.getFullYear().toString()
                  });
                }}
                className="mt-3 w-full py-2 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg font-medium transition-colors"
              >
                Set to Today (आज की तारीख)
              </button>
            </div>
          )}

          {/* Summary Display */}
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Birth Date</div>
              <div className="font-semibold text-gray-800">
                {birthDate.day && birthDate.month && birthDate.year
                  ? `${birthDate.day.padStart(2, '0')}/${birthDate.month.padStart(2, '0')}/${birthDate.year}`
                  : '--/--/----'}
              </div>
            </div>
            <div className="flex items-center text-gray-400">
              <ChevronRight className="w-5 h-5" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Till Date</div>
              <div className="font-semibold text-gray-800">
                {toDate.day && toDate.month && toDate.year
                  ? `${toDate.day.padStart(2, '0')}/${toDate.month.padStart(2, '0')}/${toDate.year}`
                  : '--/--/----'}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={calculateAge}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <Calculator className="w-5 h-5" />
              Calculate Age
              <span className="text-blue-200 font-normal">| उम्र जानें</span>
            </button>
            <button
              onClick={reset}
              className="px-5 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-blue-600" />
                Your Age
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">{result.years}</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">{result.months}</div>
                  <div className="text-sm text-gray-600">Months</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">{result.days}</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-indigo-600">{result.totalDays.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Days</div>
              </div>

              {/* Exam Eligibility Note */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Use this calculation to check your eligibility for government exams like SSC, Banking, Railways, etc.
                </p>
              </div>
            </div>
          )}

          {/* Quick Info */}
          {!result && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm">
              <p className="font-semibold text-amber-800 mb-2">📖 How to use / उपयोग करने का तरीका:</p>
              <ol className="space-y-1.5 text-amber-700 list-decimal list-inside">
                <li><strong>Date of Birth</strong> tab mein apni janam tithi bharein (Day, Month, Year)</li>
                <li>Calculate Till tab mein woh date select karein jis din tak age nikalna hai (default: aaj)</li>
                <li><strong>Calculate Age</strong> button par click karein</li>
                <li>Result mein exact age dikhegi - Years, Months, Days</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;
