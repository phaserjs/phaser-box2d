import esbuild from 'esbuild';

async function startServer ()
{
    const ctx = await esbuild.context({});

    const { host, port } = await ctx.serve({
        servedir: 'docs'
    });

    console.log(`Phaser Box2D API Docs Server running at http://localhost:${port}`);
}

startServer().catch((err) => {
    console.error('Failed to start the server:', err);
});
