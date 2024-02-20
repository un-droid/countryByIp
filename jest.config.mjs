
export default {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS imports
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    },
}