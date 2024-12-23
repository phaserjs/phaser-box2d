import { Init } from './BuildData.mjs';
import { RunBuild } from './RunBuild.mjs';

Init();

await RunBuild('dev');
await RunBuild('prod');
