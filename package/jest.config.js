/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.(t|j)sx?$": ['ts-jest', { useESM: true }]
  },
  testRegex: "(/__tests__/.*)\\.test\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.(ts|tsc)"
  ],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 20,
      functions: 30,
      lines: 50
    }
  },
};