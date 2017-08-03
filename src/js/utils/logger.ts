import * as rollbar from 'rollbar/dist/rollbar.umd';

declare const ABT_wp: BackendGlobals.ABT_wp;

const config = {
    accessToken: 'd4a261f761fb47ecaef17670b3c59f32',
    captureUncaught: false,
    payload: {
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'test',
        ...ABT_wp.info,
    },
    transform: (payload: any) => {
        const trace = payload.body.trace;
        if (trace && trace.frames) {
            for (const [i, frame] of trace.frames.entries()) {
                const filename = frame.filename;
                if (filename) {
                    const name = filename.replace(window.location.hostname, 'dynamichost');
                    trace.frames[i].filename = name;
                }
            }
        }
    },
};

export default new rollbar(config);
