import { Init } from './BuildData.mjs';
import { RunBuild } from './RunBuild.mjs';
import { StartBox2DWatcher } from './StartBox2DWatcher.mjs';

Init();

StartBox2DWatcher();

RunBuild('dev');
