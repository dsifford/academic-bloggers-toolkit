function chooseRandom<T>(items: T[]): T {
    const i = Math.floor(Math.random() * items.length);
    return items[i];
}

export class Processor {
    citeproc: any = {
        registry: {
            citationreg: {
                citationById: {},
                citationByIndex: [],
                citationsByItemId: {},
            },
        },
        sys: {
            retrieveItem: jest.fn(),
            retrieveLocale: jest.fn(),
        },
        opt: {
            xclass: chooseRandom(['in-text', 'note']),
        },
        makeBibliography: jest.fn(),
        processCitationCluster: jest.fn(),
        rebuildProcessorState: jest.fn(),
    };
    init = jest.fn().mockReturnValue(Promise.resolve([]));
    makeBibliography = jest.fn().mockReturnValue([]);
}
