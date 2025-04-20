import React, { useState, useCallback } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { analyzePassword, getScoreText, type PasswordStrength } from './utils/passwordStrength';
import { StrengthMeter } from './components/StrengthMeter';
import { CrackTimeDisplay } from './components/CrackTimeDisplay';
import { SecurityRecommendations } from './components/SecurityRecommendations';

function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordStrength | null>(null);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setAnalysis(newPassword ? analyzePassword(newPassword) : null);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-gray-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Password Strength Analyzer
          </h1>
          <p className="text-gray-600">
            Check how strong your password is against common attack methods
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {analysis && (
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Password Strength
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {getScoreText(analysis.score)}
                  </span>
                </div>
                <StrengthMeter score={analysis.score} />
              </div>

              {analysis.feedback.warning && (
                <div className="text-sm text-red-600 mt-2">
                  {analysis.feedback.warning}
                </div>
              )}

              {analysis.feedback.suggestions.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    Suggestions for improvement:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    {analysis.feedback.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Detailed Crack Time Analysis
                </h3>
                <CrackTimeDisplay 
                  crackTimes={analysis.crackTimesDisplay} 
                  crackTimeSeconds={analysis.crackTimesSeconds}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Security Recommendations
                </h3>
                <SecurityRecommendations />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;