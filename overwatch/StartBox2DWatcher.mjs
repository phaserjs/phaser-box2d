import { IsReady } from './BuildData.mjs';
import { RunBuild } from './RunBuild.mjs';
import boxen from 'boxen';
import chokidar from 'chokidar';
import path from 'path';

export function StartBox2DWatcher ()
{
    const watcher = chokidar.watch(`src${path.sep}`, {
        persistent: true,
        ignoreInitial: true
    });
   
    watcher.on('add', (path) => {
    
        if (!IsReady())
        {
            return;
        }

        console.log(boxen(`Box2D added: ${path}`, {
            padding: 1,
            margin: 1,
            borderColor: 'cyanBright',
            borderStyle: 'bold'
        }));
    
        RunBuild('dev');
    
    });
    
    watcher.on('change', (path) => {
    
        if (!IsReady())
        {
            return;
        }

        console.log(boxen(`Box2D changed: ${path}`, {
            padding: 1,
            margin: 1,
            borderColor: 'cyanBright',
            borderStyle: 'bold'
        }));
    
        RunBuild('dev');
    
    });
}