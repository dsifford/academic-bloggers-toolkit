import * as rollbar from 'rollbar/dist/rollbar.umd';

const config = {
    accessToken: process.env.ROLLBAR_CLIENT_TOKEN,
    enabled: process.env.NODE_ENV === 'production',
    captureUncaught: false,
    payload: {
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'test',
        client: {
            javascript: {
                source_map_enabled: true,
                code_version: process.env.COMMIT_HASH,
            },
        },
        ...top.ABT.wp.info,
    },
    transform: (payload: any): void => {
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
