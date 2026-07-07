// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
import { nextui } from '@nextui-org/react'

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  daisyui: {
    themes: ['light', 'dark'],
  },
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', ...fontFamily.sans],
        serif: ['var(--font-newsreader)', ...fontFamily.serif],
      },
      colors: {
        primary: colors.sky,
        gray: colors.gray,
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': {
                color: `${theme('colors.primary.700')}`,
              },
              code: { color: theme('colors.primary.600') },
            },
            'h1,h2': {
              fontWeight: '600',
              fontStyle: 'italic',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              borderLeftColor: theme('colors.gray.300'),
            },
            code: {
              color: theme('colors.gray.700'),
              fontWeight: '500',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: `${theme('colors.primary.300')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
            },
            code: {
              color: theme('colors.gray.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    nextui(),
    require('daisyui'),
  ],
}
