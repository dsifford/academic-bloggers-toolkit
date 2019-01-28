import fs from 'fs';
import path from 'path';

import webpack from 'webpack';

import oldDependencies from '../src/dependencies.json';
import getConfig from '../webpack.config';

const config = getConfig(undefined, { mode: 'production', json: true });

interface Stats {
    entrypoints: Array<{ chunks: number[] }>;
    chunks: Array<{ modules: Module[] }>;
}

interface Module {
    name: string;
}

interface Item {
    name: string;
    scripts: string[];
}

function isInBundleRoot([name]: [string, any]) {
    return path.dirname(name) === 'bundle';
}

function isExternalModule({ name }: Module) {
    return name.startsWith('external ');
}

function parseHandle({ name }: Module) {
    const match = name.match(/^external "(.+)"/);
    if (!match) {
        throw new Error(`Module "${name}" is not external`);
    }
    const handle = match[1];
    if (handle.startsWith('wp.')) {
        return handle
            .replace(/\./g, '-')
            .replace(/[A-Z]/g, str => `-${str.toLowerCase()}`);
    }
    return handle;
}

function itemSorter(a: Item, b: Item): number {
    if (a.name > b.name) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    return 0;
}

console.log('Checking to see if external dependencies have changed...');
webpack(config, (_err, statistics) => {
    const stats: Stats = statistics.toJson();
    const dependencies = JSON.stringify(
        [...Object.entries(stats.entrypoints)]
            .filter(isInBundleRoot)
            .map(([name, { chunks }]) => {
                const { modules } = stats.chunks[chunks[0]];
                return {
                    name: path.basename(name),
                    scripts: [
                        'wp-polyfill',
                        ...modules.filter(isExternalModule).map(parseHandle),
                    ].sort(),
                };
            })
            .sort(itemSorter)
            .reduce(
                (obj, { name, scripts }) => ({
                    ...obj,
                    [name]: scripts,
                }),
                {},
            ),
        null,
        4,
    );
    if (dependencies !== JSON.stringify(oldDependencies, null, 4)) {
        fs.writeFileSync(
            path.join(__dirname, '../src/dependencies.json'),
            dependencies,
        );
        console.error(
            'Dependencies have changed! Add the changes to your last commit before pushing.',
        );
        process.exit(1);
    }
});
