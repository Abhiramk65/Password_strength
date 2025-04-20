import React from 'react';
import { KeyRound, Smartphone, Shield, RefreshCw } from 'lucide-react';

export const SecurityRecommendations: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <KeyRound className="w-5 h-5 text-blue-600 mt-1" />
        <div>
          <h4 className="font-medium text-gray-900">Use a Password Manager</h4>
          <p className="text-sm text-gray-600">
            Store and generate strong, unique passwords for all your accounts using a reputable password manager.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Smartphone className="w-5 h-5 text-blue-600 mt-1" />
        <div>
          <h4 className="font-medium text-gray-900">Enable Two-Factor Authentication</h4>
          <p className="text-sm text-gray-600">
            Add an extra layer of security by enabling 2FA on all accounts that support it.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Shield className="w-5 h-5 text-blue-600 mt-1" />
        <div>
          <h4 className="font-medium text-gray-900">Safe Storage Practices</h4>
          <p className="text-sm text-gray-600">
            Never share passwords via email or text. Use secure channels and avoid storing passwords in plain text.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <RefreshCw className="w-5 h-5 text-blue-600 mt-1" />
        <div>
          <h4 className="font-medium text-gray-900">Regular Updates</h4>
          <p className="text-sm text-gray-600">
            Change passwords every 3-6 months and immediately after any security breach notifications.
          </p>
        </div>
      </div>
    </div>
  );
};