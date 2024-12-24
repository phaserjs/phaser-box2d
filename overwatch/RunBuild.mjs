import { GetOutFile, GetSrcJS, SetBuildPaths, SetFilename, WriteMetaFile } from './BuildData.mjs';

import { OnEndPlugin } from './OnEndPlugin.mjs';
import { OnProdEndPlugin } from './OnProdEndPlugin.mjs';
import { OnStartPlugin } from './OnStartPlugin.mjs';
import esbuild from 'esbuild';
import path from 'path';

export async function RunBuild (mode)
{
    if (mode === 'dev')
    {
        SetBuildPaths(
            `src${path.sep}main.js`,
            `${process.cwd()}${path.sep}dist${path.sep}`
        );

        SetFilename('PhaserBox2D-Debug.js');
    
        console.log('runBuild', GetSrcJS(), GetOutFile());
    
        await esbuild.build({
            plugins: [ OnStartPlugin, OnEndPlugin ],
            entryPoints: [ GetSrcJS() ],
            outfile: GetOutFile(),
            target: 'esnext',
            sourcemap: true,
            minify: false,
            bundle: true,
            format: 'esm',
            metafile: false,
            logLevel: 'silent',
            legalComments: 'none'
        });
    }
    else if (mode === 'render')
    {
        SetBuildPaths(
            `src${path.sep}main.js`,
            `${process.cwd()}${path.sep}dist${path.sep}`
        );

        SetFilename('PhaserBox2D-Render.js');
    
        console.log('runBuild', GetSrcJS(), GetOutFile());
    
        await esbuild.build({
            plugins: [ OnStartPlugin, OnEndPlugin ],
            entryPoints: [ GetSrcJS() ],
            outfile: GetOutFile(),
            target: 'esnext',
            sourcemap: true,
            minify: false,
            bundle: true,
            format: 'esm',
            metafile: false,
            logLevel: 'silent',
            legalComments: 'none',
            drop: ['console']
        });
    }
    else if (mode === 'prod')
    {
        SetBuildPaths(
            `src${path.sep}main-prod.js`,
            `${process.cwd()}${path.sep}dist${path.sep}`
        );

        SetFilename('PhaserBox2D.js');
   
        await esbuild.build({
            plugins: [ OnStartPlugin, OnProdEndPlugin ],
            entryPoints: [ GetSrcJS() ],
            outfile: GetOutFile(),
            target: 'esnext',
            sourcemap: false,
            minify: false,
            bundle: true,
            format: 'esm',
            metafile: false,
            logLevel: 'silent',
            legalComments: 'none',
            drop: ['console']
        });

        SetFilename('PhaserBox2D.min.js');
    
        await esbuild.build({
            plugins: [ OnStartPlugin, OnProdEndPlugin ],
            entryPoints: [ GetSrcJS() ],
            outfile: GetOutFile(),
            target: 'esnext',
            sourcemap: false,
            minify: true,
            bundle: true,
            format: 'esm',
            metafile: false,
            logLevel: 'silent',
            legalComments: 'none',
            drop: ['console']
        });

    }
}
