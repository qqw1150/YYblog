/** @type {import('tailwindcss').Config} */
module.exports = {
  // 内容路径配置
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 主题配置
  theme: {
    extend: {
      // 颜色配置
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      // 字体配置
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  // 插件配置
  plugins: [
    require('@tailwindcss/typography'),
  ],
  // 暗黑模式配置
  darkMode: 'media',
}
