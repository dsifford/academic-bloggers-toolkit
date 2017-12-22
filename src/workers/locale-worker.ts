interface GithubItemDescriptor {
    name: string;
    [k: string]: string;
}

interface GithubContentsResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GithubItemDescriptor[];
}

((self: DedicatedWorkerGlobalScope): void => {
    async function fetchSingleLocale(file: string): Promise<{}> {
        return new Promise<{}>((resolve, reject): void => {
            const req = new XMLHttpRequest();
            req.onreadystatechange = (): void => {
                if (req.readyState === 4) {
                    if (req.status !== 200) reject(new Error(req.responseText));
                    const match = file.match(/locales-(.+).xml/);
                    if (!match || !match[1]) {
                        return resolve();
                    }
                    const key = match[1];
                    self.postMessage([key, req.responseText]);
                    resolve();
                }
            };
            req.open(
                'GET',
                `https://raw.githubusercontent.com/citation-style-language/locales/master/${file}`,
            );
            req.send(null);
        });
    }

    (async (): Promise<void> => {
        return new Promise<GithubContentsResponse>((resolve, reject): void => {
            const req = new XMLHttpRequest();
            req.onreadystatechange = (): void => {
                if (req.readyState === 4) {
                    if (req.status !== 200) reject(new Error(req.responseText));
                    resolve(JSON.parse(req.responseText));
                }
            };
            req.open(
                'GET',
                'https://api.github.com/search/code?q=repo%3Acitation-style-language%2Flocales%20extension%3Axml&per_page=100',
            );
            req.send(null);
        })
            .then(data => {
                const promises: Array<Promise<{}>> = [];
                data.items.forEach(item => {
                    promises.push(fetchSingleLocale(item.name));
                });
                Promise.all(promises).then(() => {
                    self.postMessage(['done']);
                    self.close();
                });
            })
            .catch(e => e);
    })();
})(<any>self);
