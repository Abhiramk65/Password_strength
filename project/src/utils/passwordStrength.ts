import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// Get the type of the zxcvbn result object
type ZxcvbnResult = ReturnType<typeof zxcvbn>;
// Get the type for the sequence array and individual items
type ZxcvbnSequence = ZxcvbnResult['sequence'];
type ZxcvbnSequenceItem = ZxcvbnSequence[number];

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
  isPwned: boolean | null;
  pwnedCount: number | null;
}

// Helper function to generate specific feedback from zxcvbn sequence
const getSpecificSuggestions = (sequence: ZxcvbnSequence): string[] => {
  const suggestions: string[] = [];
  if (!sequence || sequence.length === 0) {
    return ["Use a mix of uppercase letters, lowercase letters, numbers, and symbols."]; // Default suggestion
  }

  sequence.forEach((item: ZxcvbnSequenceItem) => {
    // Limit feedback for very short tokens which might be noise
    if (item.token.length <= 2 && item.pattern !== 'repeat') return;

    switch (item.pattern) {
      case 'dictionary': {
        // Properties like l33t and dictionaryName only exist on dictionary items
        // Use type narrowing via the switch case
        suggestions.push(`Avoid common words like '${item.token}'${item.l33t ? ' (even with substitutions)' : ''}.`);
        // Check if dictionaryName exists and equals 'user_inputs'
        if ('dictionaryName' in item && item.dictionaryName === 'user_inputs') {
          suggestions.push(`Avoid using personal information easily guessable from context.`);
        }
        break;
      }
      case 'sequence':
        suggestions.push(`Avoid predictable sequences like '${item.token}'.`);
        break;
      case 'spatial':
        suggestions.push(`Avoid keyboard patterns like '${item.token}' (easy to guess).`);
        break;
      case 'repeat': {
         // Property 'repeatedChar' only exists on repeat items
         suggestions.push(`Avoid repeating characters like '${item.token}'.`);
         break;
      }
      case 'date':
        suggestions.push(`Avoid using dates like '${item.token}', especially personal ones.`);
        break;
      // Add cases for other patterns if needed (e.g., regex, bruteforce)
      default:
         // Handle potential unknown patterns gracefully
         break;
    }
  });
  
  // Add a general suggestion if few specific ones were generated
  if (suggestions.length < 2) {
      suggestions.push("Add more characters to increase strength significantly.");
      suggestions.push("Combine different character types (letters, numbers, symbols).");
  }

  // Deduplicate suggestions
  return Array.from(new Set(suggestions));
};

// Helper function to check password against HIBP Pwned Passwords API
async function checkPwnedStatus(password: string): Promise<{ isPwned: boolean; pwnedCount: number }> {
  try {
    // 1. Hash the password using SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    
    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // 2. Split hash for API query (k-Anonymity)
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5).toUpperCase(); // API response uses uppercase suffixes

    // 3. Query HIBP API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      throw new Error(`HIBP API error: ${response.statusText}`);
    }
    const text = await response.text();

    // 4. Check response for the suffix
    const lines = text.split('\n');
    for (const line of lines) {
      const [respSuffix, countStr] = line.split(':');
      if (respSuffix === suffix) {
        return { isPwned: true, pwnedCount: parseInt(countStr, 10) };
      }
    }

    // Suffix not found
    return { isPwned: false, pwnedCount: 0 };
  } catch (error) {
    console.error("Error checking pwned status:", error);
    // Return nulls or a specific error state if the check fails
    // For simplicity, we'll return as not pwned, but log the error
     return { isPwned: false, pwnedCount: 0 }; // Or potentially return nulls to indicate check failure
  }
}

// analyzePassword now returns a Promise
export const analyzePassword = async (password: string): Promise<PasswordStrength> => {
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
      },
      isPwned: null, // Initial state before check
      pwnedCount: null
    };
  }

  // Perform zxcvbn analysis first
  const zxcvbnResult = zxcvbn(password);
  
  // Perform HIBP check asynchronously
  const pwnedStatus = await checkPwnedStatus(password);

  // Map zxcvbn results
  const crackTimesSeconds = {
    onlineThrottling100perHour: zxcvbnResult.crackTimesSeconds.onlineThrottling100PerHour,
    onlineNoThrottling10perSecond: zxcvbnResult.crackTimesSeconds.onlineNoThrottling10PerSecond,
    offlineSlowHashing1e4perSecond: zxcvbnResult.crackTimesSeconds.offlineSlowHashing1e4PerSecond,
    offlineFastHashing1e10perSecond: zxcvbnResult.crackTimesSeconds.offlineFastHashing1e10PerSecond,
  };

  const crackTimesDisplay = {
    onlineThrottling100perHour: zxcvbnResult.crackTimesDisplay.onlineThrottling100PerHour,
    onlineNoThrottling10perSecond: zxcvbnResult.crackTimesDisplay.onlineNoThrottling10PerSecond,
    offlineSlowHashing1e4perSecond: zxcvbnResult.crackTimesDisplay.offlineSlowHashing1e4PerSecond,
    offlineFastHashing1e10perSecond: zxcvbnResult.crackTimesDisplay.offlineFastHashing1e10PerSecond,
  };
  
  // Map feedback, using the new helper function for suggestions
  const feedback = {
    warning: zxcvbnResult.feedback.warning ?? '',
    suggestions: getSpecificSuggestions(zxcvbnResult.sequence),
  };

  // Combine results
  return {
    score: zxcvbnResult.score,
    crackTimesDisplay,
    crackTimesSeconds,
    feedback,
    isPwned: pwnedStatus.isPwned,
    pwnedCount: pwnedStatus.pwnedCount
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