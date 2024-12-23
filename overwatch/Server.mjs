import { Init } from './BuildData.mjs';
import { RunBuild } from './RunBuild.mjs';
import { StartBox2DWatcher } from './StartBox2DWatcher.mjs';
import esbuild from 'esbuild';

async function startServer() {

    const ctx = await esbuild.context({});

    const { host, port } = await ctx.serve({
        servedir: 'examples'
    });

    console.log(`Server running at http://localhost:${port}`);
}

startServer().catch((err) => {
    console.error(err);
});
