import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
import path from 'path';

const getVersion = () => {
  try {
    const latestEpic = execSync('git log -n 1 --grep="^epic:" --format="%H"').toString().trim();
    let epicCount = '0';
    let featCount = '0';
    let fixCount = '0';
    
    if (latestEpic) {
      epicCount = execSync('git log --grep="^epic:" --oneline | wc -l').toString().trim();
      featCount = execSync(`git log ${latestEpic}..HEAD --grep="^feat:" --oneline | wc -l`).toString().trim();
      fixCount = execSync(`git log ${latestEpic}..HEAD --grep="^fix:\\|^chore:\\|^refactor:\\|^style:\\|^docs:\\|^test:" --oneline | wc -l`).toString().trim();
    } else {
      featCount = execSync('git log --grep="^feat:" --oneline | wc -l').toString().trim();
      fixCount = execSync('git log --grep="^fix:\\|^chore:\\|^refactor:\\|^style:\\|^docs:\\|^test:" --oneline | wc -l').toString().trim();
    }
    
    // Base version is 3 (x), epicCount is y, featCount is a, fixCount is bb
    return `3.${epicCount}.${featCount}.${fixCount}`;
  } catch (e) {
    return '3.0.0.00';
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(getVersion())
  },
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.jsx', 'src/api.js'],
      exclude: ['src/main.jsx', 'src/setupTests.js'],
      all: true
    }
  },
})
