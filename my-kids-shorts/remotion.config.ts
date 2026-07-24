// Remotion config file
import { Config } from '@remotion/cli/config';

Config.setChromiumOpenGlRenderer('swiftshader');

// Entry point that calls registerRoot()
export const entryPoint = './src/index.ts';