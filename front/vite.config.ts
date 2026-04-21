import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        // chart.js와 react-chartjs-2를 명시적으로 최적화 목록에 포함
        include: ['chart.js', 'react-chartjs-2'],
    },
    resolve: {
        // 프로젝트의 React 인스턴스를 하나로 고정 (Deduplication)
        dedupe: ['react', 'react-dom'],
    },
})
