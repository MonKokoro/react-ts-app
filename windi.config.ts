import { defineConfig } from 'windicss/helpers'
// import colors from 'windicss/colors'

export default defineConfig({
    extract: {
        include: ['**/*.{js,jsx,ts,tsx}'],
        exclude: ['node_modules', '.git', 'build'],
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
                // gray: colors.coolGray,
                // blue: colors.sky,
                // red: colors.rose,
                // pink: colors.fuchsia,
                darkGreen: "#13547A",
                brightBlue: "#1677FF",
                purplishRed: "#CE9C9D",
                leafGreen: "#ABD5BE",
                darkPink: "#E0B394"
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