# Password Strength Analyzer - Try here - (https://zippy-liger-6dc81a.netlify.app)

A sophisticated password strength analysis tool built with React and TypeScript that provides real-time feedback on password security.


## Features

- **Real-time Analysis**: Instant feedback as you type your password
- **Multiple Attack Scenarios**: 
  - Online Throttled Attack (100 attempts/hour)
  - Online No Throttling (10 attempts/second)
  - Offline Slow Hash (10k hashes/second)
  - Offline Fast Hash (10B hashes/second)
- **Comprehensive Strength Assessment**:
  - Character composition analysis
  - Common pattern detection
  - Dictionary word checking
  - Keyboard pattern recognition
  - Password entropy calculation
- **Visual Strength Indicator**: 5-level strength meter with color coding
- **Detailed Feedback**:
  - Specific warnings about password weaknesses
  - Actionable improvement suggestions
  - Estimated cracking times for different attack scenarios
- **Security Recommendations**: Best practices for password management

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- zxcvbn-ts (Password strength estimation)
- Lucide React (Icons)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## How It Works

The analyzer uses multiple approaches to evaluate password strength:

1. **Character Set Analysis**:
   - Lowercase letters (a-z): 26 characters
   - Uppercase letters (A-Z): +26 characters
   - Numbers (0-9): +10 characters
   - Special characters: +33 characters

2. **Pattern Detection**:
   - Common password patterns
   - Keyboard patterns (e.g., qwerty)
   - Date formats
   - Sequential numbers
   - Repeated characters

3. **Dictionary Checks**:
   - Common passwords
   - Dictionary words
   - Common substitutions (e.g., 'a' to '@')

4. **Cracking Time Estimation**:
   - Based on modern hardware capabilities
   - Multiple attack scenario simulations
   - Realistic attempt rates for different methods

## Security Considerations

- All analysis is performed client-side
- No passwords are stored or transmitted
- Calculations consider real-world attack scenarios
- Recommendations follow NIST guidelines

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Live Demo

Visit the live demo: [Password Strength Analyzer](https://zippy-liger-6dc81a.netlify.app)

## Acknowledgments

- zxcvbn-ts for the core password strength estimation
- Lucide for the beautiful icons
- Tailwind CSS for the styling system

# Password Strength Analyzer

A simple web application built with React, TypeScript, and Vite to analyze the strength of passwords.

## Features

*   Calculates password strength score (0-4) based on `zxcvbn-ts`.
*   Provides estimated crack times for different attack scenarios:
    *   Online Throttled Attack (100 attempts/hour)
    *   Online No Throttling (10 attempts/second)
    *   Offline Slow Hash (10k hashes/second)
    *   Offline Fast Hash (10B hashes/second)
*   Displays visual strength meter.
*   Offers suggestions for improvement based on `zxcvbn-ts` feedback.
*   Includes general security recommendations.
*   Uses Tailwind CSS for styling.
*   Uses Lucide React for icons.

## Tech Stack

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Password Strength:** `@zxcvbn-ts/core`
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React

## Setup and Running

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    Make sure you have Node.js and npm (or yarn/pnpm) installed.
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

4.  **Build for production:**
    ```bash
    npm run build
    # or
    # yarn build
    # or
    # pnpm build
    ```
    This creates a `dist` folder with the optimized production build.

## Password Strength Library

This project uses the `zxcvbn-ts` library, a TypeScript port of Dropbox's realistic password strength estimator. It analyzes passwords against common dictionaries, patterns, and provides feedback along with crack time estimations. 