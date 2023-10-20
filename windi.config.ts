import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
    extract: {
        // A common use case is scanning files from the root directory
        include: ['**/*.{js,jsx,ts,tsx}'],
        // if you are excluding files, make sure you always include node_modules and .git
        exclude: ['node_modules', '.git', 'dist'],
    },
    theme: {
        extend: {
          screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
          },
          colors: {
            gray: colors.coolGray,
            blue: colors.sky,
            red: colors.rose,
            pink: colors.fuchsia,
          },
          fontFamily: {
            sans: ['Graphik', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
          },
          spacing: {
            128: '32rem',
            144: '36rem',
          },
          borderRadius: {
            '4xl': '2rem',
          },
        },
      },
})