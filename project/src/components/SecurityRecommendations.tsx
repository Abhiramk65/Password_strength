import React from 'react';
import { KeyRound, Smartphone, ShieldCheck, RefreshCw, AlertTriangle, CalendarDays, CheckCircle } from 'lucide-react';
import { type PasswordStrength } from '../utils/passwordStrength'; // Import the type

// Define props interface
interface SecurityRecommendationsProps {
  analysis: PasswordStrength | null;
}

export const SecurityRecommendations: React.FC<SecurityRecommendationsProps> = ({ analysis }) => {
  const hasDatePattern = analysis?.feedback.suggestions.some(s => s.includes('Avoid using dates like'));
  const isWeak = analysis && analysis.score <= 1;
  const isStrong = analysis && analysis.score >= 3;

  return (
    <div className="space-y-4">
      {/* Conditionally add extra warning for weak passwords */}
      {isWeak && (
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800">Weak Password Detected</h4>
            <p className="text-sm text-red-700">
              Your password appears weak. Using a password manager can help create and store much stronger, unique passwords.
            </p>
          </div>
        </div>
      )}

      {/* Password Manager Recommendation */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <KeyRound className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900">Use a Password Manager</h4>
          <p className="text-sm text-gray-600">
            Generate and securely store strong, unique passwords for all your accounts. This is crucial, especially if you struggle to create complex passwords.
          </p>
        </div>
      </div>

      {/* 2FA Recommendation */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Smartphone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900">Enable Two-Factor Authentication (2FA)</h4>
          <p className="text-sm text-gray-600">
            Add an essential extra layer of security to your accounts wherever possible. Even a strong password can be compromised.
          </p>
        </div>
      </div>
      
      {/* Add specific warning about dates if detected */}
      {hasDatePattern && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <CalendarDays className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-800">Avoid Personal Dates</h4>
            <p className="text-sm text-yellow-700">
              We noticed a date pattern. Avoid using birthdays, anniversaries, or other guessable dates in your passwords.
            </p>
          </div>
        </div>
      )}

      {/* Safe Storage Recommendation - Changed Icon */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <ShieldCheck className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900">Practice Safe Storage</h4>
          <p className="text-sm text-gray-600">
            Never share passwords insecurely (email, text). Don't reuse passwords across different sites.
          </p>
        </div>
      </div>

      {/* Regular Updates Recommendation */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <RefreshCw className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900">Keep Things Updated</h4>
          <p className="text-sm text-gray-600">
            Change passwords regularly, especially for critical accounts, and immediately if you suspect a breach.
          </p>
        </div>
      </div>

      {/* Conditionally add note for strong passwords */}
      {isStrong && (
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800">Good Strength!</h4>
            <p className="text-sm text-green-700">
              Your password shows good strength. Remember to keep it unique and enable 2FA for maximum security!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};