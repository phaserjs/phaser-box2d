import { ClearInfo, StartTimer } from './BuildData.mjs';

export const OnStartPlugin = {
    name: 'on-start',
    setup (build)
    {
        build.onStart(() => {

            ClearInfo();
            StartTimer();

        });
    }
};
