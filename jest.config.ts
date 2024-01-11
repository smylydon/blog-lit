import type {Config} from 'jest';

const config: Config = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  testRegex: './src/*/.*\\.test?\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
};

export default config;
