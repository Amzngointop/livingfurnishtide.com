import type { Config } from 'tailwindcss'

/* One theme, and it is dark. No darkMode setting, no dark: variants: the dark values are the tokens. */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './data/**/*.ts'],
  theme: {
    extend: {
      colors: {
        walnut: 'var(--walnut)',
        'walnut-2': 'var(--walnut-2)',
        'walnut-3': 'var(--walnut-3)',
        pitch: 'var(--pitch)',
        bone: 'var(--bone)',
        'bone-2': 'var(--bone-2)',
        'bone-3': 'var(--bone-3)',
        patina: 'var(--patina)',
        'patina-d': 'var(--patina-d)',
        'patina-s': 'var(--patina-s)',
        rust: 'var(--rust)',
        'rust-d': 'var(--rust-d)',
        plate: 'var(--plate)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['var(--font-mono)', 'Consolas', 'Courier New', 'monospace'],
        body: ['var(--font-body)', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
