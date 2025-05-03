import React, { useState, useCallback, useEffect } from 'react';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { analyzePassword, getScoreText, type PasswordStrength } from './utils/passwordStrength';
import { StrengthMeter } from './components/StrengthMeter';
import { CrackTimeDisplay } from './components/CrackTimeDisplay';
import { SecurityRecommendations } from './components/SecurityRecommendations';

function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordStrength | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise(resolve => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => resolve(func(...args)), waitFor);
      });
  };

  const debouncedAnalyzePassword = useCallback(
    debounce(async (pwd: string) => {
      if (!pwd) {
        setAnalysis(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const result = await analyzePassword(pwd);
        setAnalysis(result);
      } catch (error) {
        console.error("Error analyzing password:", error);
        setAnalysis(null);
      }
      setIsLoading(false);
    }, 500),
    []
  );

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsLoading(true);
    debouncedAnalyzePassword(newPassword);
  }, [debouncedAnalyzePassword]);

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
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
              ) : (
                <button
                  onClick={togglePasswordVisibility}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            {analysis?.isPwned === true && (
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Warning: Password Compromised!</h3>
                  <p className="text-sm text-red-700">
                    This password has been found in data breaches approximately {analysis.pwnedCount?.toLocaleString() ?? 'multiple'} times.
                    It is highly recommended to choose a different password.
                  </p>
                </div>
              </div>
            )}
            {analysis?.isPwned === false && !isLoading && (
               <div className="p-4 bg-green-50 border border-green-300 rounded-lg flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                 <div>
                   <h3 className="font-semibold text-green-800">Good News!</h3>
                   <p className="text-sm text-green-700">
                     This password was not found in any known data breaches.
                   </p>
                 </div>
              </div>
            )}
          </div>

          {analysis && !isLoading && (
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
                <SecurityRecommendations analysis={analysis} />
              </div>
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <p className="text-center text-xs text-gray-500 mt-4 px-6">
          Privacy Note: Your password is analyzed locally in your browser and checked anonymously against known data breaches. It is never stored or sent to our servers.
        </p>

      </div>
    </div>
  );
}

export default App;