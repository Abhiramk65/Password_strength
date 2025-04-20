import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// Initialize zxcvbn with language options
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

export interface TimeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PasswordStrength {
  score: number;
  crackTimesDisplay: {
    onlineThrottling100perHour: string;
    onlineNoThrottling10perSecond: string;
    offlineSlowHashing1e4perSecond: string;
    offlineFastHashing1e10perSecond: string;
  };
  crackTimesSeconds: {
    onlineThrottling100perHour: number;
    onlineNoThrottling10perSecond: number;
    offlineSlowHashing1e4perSecond: number;
    offlineFastHashing1e10perSecond: number;
  };
  feedback: {
    warning: string;
    suggestions: string[];
  };
}

// Realistic attempts per second based on modern hardware and techniques
const ATTEMPTS_PER_SECOND = {
  onlineThrottling: 100 / 3600, // 100 per hour
  onlineNoThrottling: 10, // 10 per second
  offlineSlow: 1000000, // 1M per second (realistic for CPU)
  offlineFast: 100000000000, // 100B per second (modern GPU farms)
};

// Common password patterns with their relative strength multipliers
const PATTERNS = [
  { pattern: /^[A-Z][a-z]+\d{2,4}[@#$%&*!?]$/, multiplier: 0.00001 }, // Password123!
  { pattern: /^[A-Z][a-z]+[0-9@#$%&*!?]+$/, multiplier: 0.00001 }, // Password@123
  { pattern: /^[A-Z][a-z]{5,10}\d{1,4}$/, multiplier: 0.00001 }, // Password123
  { pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%&*!?])[A-Za-z\d@#$%&*!?]{8,}$/, multiplier: 0.0001 }, // Common complexity pattern
  { pattern: /\d{4}$/, multiplier: 0.001 }, // Ends with 4 digits
  { pattern: /\d{2}$/, multiplier: 0.01 }, // Ends with 2 digits
  { pattern: /[@#$%&*!?]\d+$/, multiplier: 0.001 }, // Special char followed by numbers
];

const COMMON_WORDS = [
  'password', 'letmein', 'welcome', 'admin', 'monkey', 'dragon', 'master',
  'football', 'baseball', 'qwerty', 'abc123', '123456', 'superman', 'batman',
  'trustno1', 'sunshine', 'princess', 'passw0rd', 'shadow', 'michael',
];

const calculateCharacterSetSize = (password: string): number => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let size = 0;
  if (hasLower) size += 26;
  if (hasUpper) size += 26;
  if (hasDigit) size += 10;
  if (hasSpecial) size += 33;

  return size || 26;
};

const getPatternMultiplier = (password: string): number => {
  const lowerPassword = password.toLowerCase();
  let multiplier = 1;

  // Check for common words
  if (COMMON_WORDS.some(word => lowerPassword.includes(word))) {
    multiplier *= 0.00001; // Extremely common
  }

  // Check for common patterns
  for (const { pattern, multiplier: patternMultiplier } of PATTERNS) {
    if (pattern.test(password)) {
      multiplier *= patternMultiplier;
    }
  }

  // Check for dates
  if (/19\d{2}|20\d{2}|\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/.test(password)) {
    multiplier *= 0.0001;
  }

  // Check for keyboard patterns
  const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', '1234', '4321'];
  if (keyboardPatterns.some(pattern => lowerPassword.includes(pattern))) {
    multiplier *= 0.00001;
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    multiplier *= 0.001;
  }

  // Check for simple substitutions
  if (/[a@][s$][i1!][o0]/.test(lowerPassword)) {
    multiplier *= 0.01;
  }

  // Check for sequential numbers
  if (/(?:0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210)/.test(password)) {
    multiplier *= 0.0001;
  }

  return multiplier;
};

const calculateCrackingTime = (password: string, attemptsPerSecond: number): number => {
  if (!password) return 0;

  const charSetSize = calculateCharacterSetSize(password);
  const length = password.length;
  
  // Base calculation using more realistic entropy
  let entropy = Math.log2(Math.pow(charSetSize, length));
  let combinations = Math.pow(2, entropy);
  
  // Apply pattern-based reductions
  const patternMultiplier = getPatternMultiplier(password);
  combinations *= patternMultiplier;

  // Calculate time in seconds
  let timeInSeconds = combinations / attemptsPerSecond;

  // Ensure minimum time isn't unrealistic
  return Math.max(0.001, timeInSeconds);
};

export const analyzePassword = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      crackTimesDisplay: {
        onlineThrottling100perHour: "instant",
        onlineNoThrottling10perSecond: "instant",
        offlineSlowHashing1e4perSecond: "instant",
        offlineFastHashing1e10perSecond: "instant"
      },
      crackTimesSeconds: {
        onlineThrottling100perHour: 0,
        onlineNoThrottling10perSecond: 0,
        offlineSlowHashing1e4perSecond: 0,
        offlineFastHashing1e10perSecond: 0
      },
      feedback: {
        warning: "No password provided",
        suggestions: ["Enter a password to analyze"]
      }
    };
  }

  const result = zxcvbn(password);
  
  // Calculate realistic cracking times
  const crackTimesSeconds = {
    onlineThrottling100perHour: calculateCrackingTime(password, ATTEMPTS_PER_SECOND.onlineThrottling),
    onlineNoThrottling10perSecond: calculateCrackingTime(password, ATTEMPTS_PER_SECOND.onlineNoThrottling),
    offlineSlowHashing1e4perSecond: calculateCrackingTime(password, ATTEMPTS_PER_SECOND.offlineSlow),
    offlineFastHashing1e10perSecond: calculateCrackingTime(password, ATTEMPTS_PER_SECOND.offlineFast)
  };

  return {
    score: result.score,
    crackTimesDisplay: result.crackTimesDisplay,
    crackTimesSeconds,
    feedback: result.feedback,
  };
};

export const getScoreColor = (score: number): string => {
  switch (score) {
    case 0:
      return 'bg-red-500';
    case 1:
      return 'bg-orange-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-lime-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-200';
  }
};

export const getScoreText = (score: number): string => {
  switch (score) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Strong';
    case 4:
      return 'Very Strong';
    default:
      return 'N/A';
  }
};

export const calculateTimeBreakdown = (totalSeconds: number): TimeBreakdown => {
  if (totalSeconds <= 0) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
  const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
  const SECONDS_IN_MONTH = SECONDS_IN_DAY * 30.44; // Average month length
  const SECONDS_IN_YEAR = SECONDS_IN_MONTH * 12;

  const years = Math.floor(totalSeconds / SECONDS_IN_YEAR);
  let remainder = totalSeconds % SECONDS_IN_YEAR;

  const months = Math.floor(remainder / SECONDS_IN_MONTH);
  remainder = remainder % SECONDS_IN_MONTH;

  const days = Math.floor(remainder / SECONDS_IN_DAY);
  remainder = remainder % SECONDS_IN_DAY;

  const hours = Math.floor(remainder / SECONDS_IN_HOUR);
  remainder = remainder % SECONDS_IN_HOUR;

  const minutes = Math.floor(remainder / SECONDS_IN_MINUTE);
  const seconds = Math.floor(remainder % SECONDS_IN_MINUTE);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds
  };
};