import StyleStore from '../csl-cache';

const Worker = () => ({
    addEventListener: jest.fn(),
    postMessage: jest.fn(),
});

const fetchMock = jest.fn();

(<any>window).Worker = Worker;
(<any>window).fetch = fetchMock;
(<any>window).sessionStorage = new (<any>window).StorageMock();

const fetchResponse = (txt: string, ok = true) => ({
    ok,
    text: async () => Promise.resolve(txt),
});

describe('StyleCache', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (<any>window).sessionStorage = new (<any>window).StorageMock();
    });
    it('should instantiate', () => {
        const store = new StyleStore();
        expect(store).toBeDefined();
    });
    it('should fetch', async () => {
        fetchMock.mockImplementation(async () =>
            Promise.resolve(fetchResponse('world')),
        );
        const store = new StyleStore();
        const res = await store.fetch('hello');
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect((<any>store).cache.get('hello')).toBe('world');
        expect(res).toEqual('world');
    });
    it('should use existing cache if available', async () => {
        fetchMock.mockImplementation(async () =>
            Promise.resolve(fetchResponse('world')),
        );
        const store = new StyleStore();
        let res = await store.fetch('en-US');
        expect((<any>store).cache.get('en-US')).toBe('world');
        expect(res).toEqual('world');
        expect(fetchMock).toHaveBeenCalledTimes(1);

        res = await store.fetch('en-US');
        expect(res).toEqual('world');
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    it('should throw errors on bad requests', async () => {
        fetchMock.mockImplementation(async () =>
            Promise.resolve(fetchResponse('', false)),
        );
        const store = new StyleStore();
        try {
            await store.fetch('foo');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            return;
        }
        // should not get here
        expect(true).toBe(false);
    });
});
