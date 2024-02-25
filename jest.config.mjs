
export default {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS imports
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}', // include
        '!src/**/*.d.ts', // exclude
        '!src/App.tsx',
        '!src/main.tsx',
    ],
    coverageReporters: ['lcov', 'text'] // standard report format
}