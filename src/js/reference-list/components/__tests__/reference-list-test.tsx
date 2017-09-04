jest.mock('utils/CSLProcessor');
jest.mock('../../api');

import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';

import EditorDriver from 'drivers/base';
import { getRemoteData, parseManualData } from '../../api';
import Store from '../../store';
import ReferenceList, { StorageField } from '../reference-list';

const mocks = {
    parseManualData: parseManualData as jest.Mock<any>,
    getRemoteData: getRemoteData as jest.Mock<any>,
    editorMock: jest.fn(),
};

Object.defineProperty(window, 'Rollbar', {
    value: {
        error: jest.fn(),
    },
});

document.body.innerHTML = `
    <div id="abt-reflist">
        <div id="cited"></div>
        <div id="uncited"></div>
    </div>
`;
class MockEditor extends EditorDriver {
    private _clusters: Citeproc.CitationResult[] = [];
    private _selection: string = '';
    // End mock helpers ===================

    get citationIds() {
        return this._clusters.map(([_, __, id]) => id);
    }
    get citationsByIndex() {
        return [];
    }
    get relativeCitationPositions() {
        const randomStartPoint = Math.floor(Math.random() * (this._clusters.length - 1));
        const positions: any = [...this._clusters].map(([index, _, id]) => [id, index]);
        return {
            itemsPreceding: positions.slice(0, randomStartPoint),
            itemsFollowing: positions.slice(randomStartPoint),
        };
    }
    get selection() {
        return this._selection;
    }
    // Mock helper
    set selection(selection: string) {
        this._selection = selection;
    }
    alert() {
        mocks.editorMock('alert');
    }
    composeCitations() {
        mocks.editorMock('composeCitations');
    }
    async init() {
        return Promise.resolve();
    }
    removeItems(idList: string[]) {
        this._clusters = this._clusters.filter(([_, __, id]) => !idList.includes(id));
        mocks.editorMock('removeItems');
    }
    reset() {
        this._clusters = [];
    }
    setBibliography() {
        mocks.editorMock('setBibliography');
    }
    setLoadingState() {
        mocks.editorMock('setLoadingState');
    }
    protected bindEvents() {
        return void 0;
    }
}

const blankState: BackendGlobals.ABT_Reflist_State = {
    bibOptions: {
        heading: '',
        headingLevel: 'h3',
        style: 'fixed',
    },
    cache: {
        style: 'american-medical-association',
        links: 'always',
        locale: 'en_US',
    },
    citationByIndex: [],
    CSL: {},
};
let store = new Store({ ...blankState });

const setup = () => {
    store = new Store({ ...blankState });
    const component = shallow(<ReferenceList editor={Promise.resolve(MockEditor)} store={store} />);
    const instance = component.instance() as ReferenceList;
    instance.editor = new MockEditor();
    return {
        component,
        instance: component.instance() as ReferenceList,
    };
};

describe('<ReferenceList />', async () => {
    beforeEach(() => jest.resetAllMocks());
    describe('snapshots', () => {
        beforeEach(() => jest.resetAllMocks());
        it('initial mount with empty state', () => {
            const { component, instance } = setup();

            // Loading state
            expect(toJSON(component)).toMatchSnapshot();

            instance.loading.set(false);
            component.update();

            // Loaded state
            expect(toJSON(component)).toMatchSnapshot();
        });
        it('menu toggled open', () => {
            const { component, instance } = setup();
            instance.loading.set(false);
            instance.toggleMenu();
            component.update();
            expect(toJSON(component)).toMatchSnapshot();
        });
        it('pinned state toggled', () => {
            const { component, instance } = setup();
            instance.loading.set(false);
            instance.togglePinned();
            component.update();
            expect(toJSON(component)).toMatchSnapshot();
        });
        it('cited and uncited list populated', () => {
            const { component, instance } = setup();
            instance.loading.set(false);
            store.citations.CSL.merge([
                ['1', { id: '1', title: 'citation 1' }],
                ['1', { id: '2', title: 'citation 2' }],
                ['1', { id: '3', title: 'citation 3' }],
            ]);
            component.update();
            expect(toJSON(component)).toMatchSnapshot();

            store.citations.init([
                {
                    citationItems: [
                        { id: '1', item: { id: '1', title: 'citation 1' } },
                        { id: '2', item: { id: '2', title: 'citation 2' } },
                    ],
                    properties: {
                        index: 0,
                    },
                },
            ] as any);
            component.update();
            expect(toJSON(component)).toMatchSnapshot();
        });
        it('should match StorageField snapshot', () => {
            store = new Store({ ...blankState });
            const component = shallow(<StorageField store={store} />);
            expect(toJSON(component)).toMatchSnapshot();
        });
    });
    describe('Button actions', () => {
        beforeEach(() => jest.resetAllMocks());
        it('should open dialogs', () => {
            const { component, instance } = setup();
            instance.toggleLoading();
            component.update();
            const button = component.find('Button').at(1);
            expect(instance.currentDialog.get()).toBe('');

            button.simulate('click', 'FOO');
            expect(instance.currentDialog.get()).toBe('FOO');

            button.simulate('click', {
                currentTarget: { dataset: { dialog: 'BAR' } },
            });
            expect(instance.currentDialog.get()).toBe('BAR');

            button.simulate('click', { currentTarget: { dataset: {} } });
            expect(instance.currentDialog.get()).toBe('');
        });
        it('should remove citations', () => {
            const { component, instance } = setup();
            instance.toggleLoading();
            component.update();
            const button = component.find('Button').at(2);

            // Returns quickly if no items are selected
            button.simulate('click');
            expect(mocks.editorMock).not.toHaveBeenCalled();

            instance.selected.replace(['1']);
            button.simulate('click');
            expect(mocks.editorMock).toHaveBeenCalledTimes(3);
            expect(mocks.editorMock).toHaveBeenCalledWith('setLoadingState');
            expect(mocks.editorMock).toHaveBeenCalledWith('removeItems');
            expect(mocks.editorMock).toHaveBeenCalledWith('setLoadingState');
        });
    });
    describe('Dialog submit handlers', () => {
        beforeEach(() => jest.resetAllMocks());
        it('add reference', async () => {
            mocks.getRemoteData
                .mockReturnValue(Promise.resolve([[]]))
                .mockReturnValueOnce(Promise.resolve([[]]))
                .mockReturnValueOnce(Promise.resolve([[{ id: '1', title: 'hello world' }]]))
                .mockReturnValueOnce(
                    Promise.resolve([[{ id: '1', title: 'hello world' }], 'Some error']),
                )
                .mockReturnValueOnce(Promise.reject(new Error('Some error occurred')));

            mocks.parseManualData.mockReturnValue([[{ id: '2', title: 'reference 2' }]]);

            const { instance } = setup();
            instance.insertInlineCitation = jest.fn();
            jest.clearAllMocks();

            instance.currentDialog.set('ADD');

            expect(store.citations.lookup.ids.length).toBe(0);
            expect(mocks.editorMock).not.toHaveBeenCalled();

            jest.clearAllMocks();
            await instance.addReferences({});
            expect(store.citations.lookup.ids.length).toBe(0);
            expect(mocks.editorMock).not.toHaveBeenCalled();

            jest.clearAllMocks();
            await instance.addReferences({});
            expect(store.citations.lookup.ids.length).toBe(1);
            expect(mocks.editorMock).not.toHaveBeenCalledWith('alert');

            jest.clearAllMocks();
            await instance.addReferences({});
            expect(store.citations.lookup.ids.length).toBe(1);
            expect(mocks.editorMock).toHaveBeenCalledTimes(1);
            expect(mocks.editorMock).toHaveBeenCalledWith('alert');

            jest.clearAllMocks();
            await instance.addReferences({});
            expect(store.citations.lookup.ids.length).toBe(1);
            expect(mocks.editorMock).toHaveBeenCalledTimes(1);

            jest.clearAllMocks();
            await instance.addReferences({
                addManually: true,
                attachInline: true,
            });
            expect(store.citations.lookup.ids.length).toBe(2);
            expect(instance.insertInlineCitation).toHaveBeenCalledTimes(1);
        });
        it('import and edit', () => {
            const { instance } = setup();
            instance.initProcessor = jest.fn();
            instance.addReferences = jest.fn();

            instance.currentDialog.set('ADD');
            expect(store.citations.lookup.ids.length).toBe(0);
            instance.handleDialogSubmit({});
            expect(instance.addReferences).toHaveBeenCalledTimes(1);

            instance.currentDialog.set('IMPORT');
            expect(store.citations.lookup.ids.length).toBe(0);
            instance.handleDialogSubmit([{ id: '1', title: 'hello world' }]);
            expect(store.citations.lookup.ids.length).toBe(1);
            expect(store.citations.CSL.get('1')!.title).toBe('hello world');
            expect(instance.initProcessor).not.toHaveBeenCalled();

            instance.editReference('1');
            instance.handleDialogSubmit({ id: '1', title: 'foobar' });
            expect(store.citations.lookup.ids.length).toBe(1);
            expect(store.citations.CSL.get('1')!.title).toBe('foobar');
            expect(instance.initProcessor).toHaveBeenCalledTimes(1);
            expect(instance.addReferences).toHaveBeenCalledTimes(1);

            expect(instance.currentDialog.get()).toBe('');
        });
    });
    describe('Menu selections', () => {
        beforeEach(() => jest.resetAllMocks());
        it('CHANGE_STYLE', () => {
            const { component, instance } = setup();
            instance.initProcessor = jest.fn();
            instance.loading.set(false);
            component.update();

            const menu = component.find('Menu');
            expect(store.citationStyle.get()).toBe('american-medical-association');

            menu.simulate('submit', { kind: 'CHANGE_STYLE', data: 'apa' });
            expect(store.citationStyle.get()).toBe('apa');
            expect(instance.initProcessor).toHaveBeenCalledTimes(1);
        });
        it('IMPORT_RIS', () => {
            const { component, instance } = setup();
            instance.initProcessor = jest.fn();
            instance.loading.set(false);
            component.update();

            const menu = component.find('Menu');
            expect(instance.currentDialog.get()).toBe('');

            menu.simulate('submit', { kind: 'OPEN_IMPORT_DIALOG' });
            expect(instance.currentDialog.get()).toBe('IMPORT');
        });
        it('REFRESH_PROCESSOR', () => {
            const { component, instance } = setup();
            instance.initProcessor = jest.fn();
            instance.loading.set(false);
            component.update();
            store.citations.pruneOrphanedCitations = jest.fn();

            const menu = component.find('Menu');
            menu.simulate('submit', { kind: 'REFRESH_PROCESSOR' });
            expect(store.citations.pruneOrphanedCitations).toHaveBeenCalled();
            expect(instance.initProcessor).toHaveBeenCalled();
        });
        it('DESTROY_PROCESSOR', () => {
            const { component, instance } = setup();
            instance.loading.set(false);
            instance.initProcessor = jest.fn();
            component.update();

            const menu = component.find('Menu');
            expect(instance.initProcessor).not.toHaveBeenCalled();
            menu.simulate('submit', { kind: 'DESTROY_PROCESSOR' });
            expect(instance.initProcessor).toHaveBeenCalled();
        });
        it('INSERT_STATIC_BIBLIOGRAPHY', () => {
            const { component, instance } = setup();
            instance.loading.set(false);
            instance.insertStaticBibliography = jest.fn();
            component.update();

            const menu = component.find('Menu');
            expect(instance.insertStaticBibliography).not.toHaveBeenCalled();
            menu.simulate('submit', { kind: 'INSERT_STATIC_BIBLIOGRAPHY' });
            expect(instance.insertStaticBibliography).toHaveBeenCalled();
        });
        it('unknown value', () => {
            const { component, instance } = setup();
            instance.loading.set(false);
            instance.initProcessor = jest.fn();
            component.update();

            const menu = component.find('Menu');
            menu.simulate('submit', 'foo');
            expect(instance.initProcessor).not.toHaveBeenCalled();
        });
    });
    describe('Lifecycle methods', () => {
        it('componentDidMount', () => {
            const { instance } = setup();
            const windowAddEventListener = window.addEventListener;
            const documentAddEventListener = document.addEventListener;
            window.addEventListener = jest.fn();
            document.addEventListener = jest.fn();
            instance.componentDidMount();
            expect(window.addEventListener).toHaveBeenCalledTimes(6);
            expect(document.addEventListener).toHaveBeenCalledTimes(1);
            window.addEventListener = windowAddEventListener;
            document.addEventListener = documentAddEventListener;
        });
        it('componentWillUnmount', () => {
            const { instance } = setup();
            const windowRemoveEventListener = window.removeEventListener;
            const documentRemoveEventListener = document.removeEventListener;
            window.removeEventListener = jest.fn();
            document.removeEventListener = jest.fn();
            instance.componentWillUnmount();
            expect(window.removeEventListener).toHaveBeenCalledTimes(6);
            expect(document.removeEventListener).toHaveBeenCalledTimes(1);
            window.removeEventListener = windowRemoveEventListener;
            document.removeEventListener = documentRemoveEventListener;
        });
    });
    describe('Insert inline citations', () => {
        let { component, instance } = setup();
        beforeEach(() => {
            jest.resetAllMocks();
            ({ component, instance } = setup());
            store.citations.CSL.set('1', {
                id: '1',
                title: 'test citation',
                type: 'article-journal',
            });
            instance.loading.set(false);
            instance.processor.prepareInlineCitationData = jest.fn();
            instance.processor.processCitationCluster = jest.fn();
            component.update();
        });
        it('insert from selected items in reference list, none selected in editor', () => {
            instance.selected.push('1');
            const preventDefault = jest.fn();
            const e = ({ preventDefault } as any) as React.MouseEvent<any>;
            instance.insertInlineCitation(e, []);
            expect(preventDefault).toHaveBeenCalled();
            expect(mocks.editorMock).toHaveBeenCalledWith('setLoadingState');
            expect(mocks.editorMock).toHaveBeenCalledWith('composeCitations');
            expect(mocks.editorMock).toHaveBeenCalledWith('setBibliography');
            expect(instance.selected.length).toBe(0);
            expect(
                (instance.processor.prepareInlineCitationData as jest.Mock<any>).mock.calls[0][0],
            ).toEqual([{ id: '1', title: 'test citation', type: 'article-journal' }]);
        });
        it('insert from editor selection, selection is empty', () => {
            (instance.editor as MockEditor).selection =
                '<span class="abt-citation" data-reflist="[&quot;1&quot;]"></span>';
            instance.insertInlineCitation(undefined, [
                { id: '2', title: 'citation 2', type: 'article-journal' },
            ]);
            expect(
                (instance.processor.prepareInlineCitationData as jest.Mock<any>).mock.calls[0][0],
            ).toEqual([
                { id: '2', title: 'citation 2', type: 'article-journal' },
                { id: '1', title: 'test citation', type: 'article-journal' },
            ]);
        });
        it('error handling', () => {
            // instance.processor.processCitationCluster = jest.fn().mockImplementation(() => {
            //     throw new Error('Some error occurred');
            // });
            // await instance.insertInlineCitation();
            // expect(Rollbar.error).toHaveBeenCalled();
            // expect(mocks.editorMock).not.toHaveBeenCalledWith('composeCitations');

            jest.resetAllMocks();
            instance.editor.setBibliography = jest.fn().mockImplementationOnce(() => {
                throw new Error('Some error occurred');
            });
            instance.insertInlineCitation();
            expect(mocks.editorMock).toHaveBeenCalledWith('composeCitations');
        });
    });
    describe('Insert static bibliography', () => {
        let instance: ReferenceList;
        const citations: any = {
            a: { id: 'a', title: 'citation a', type: 'article-journal' },
            b: { id: 'b', title: 'citation b', type: 'article-journal' },
        };
        const createStaticBibliography = jest.fn();
        beforeEach(() => {
            jest.resetAllMocks();
            ({ instance } = setup());
            store.citations.CSL.set('aaaaaaaaa', { ...citations.a });
            store.citations.CSL.set('bbbbbbbbb', { ...citations.b });
            instance.processor.createStaticBibliography = createStaticBibliography;
        });
        it('single selection, without static bib selected', async () => {
            instance.selected.push('aaaaaaaaa');
            await instance.insertStaticBibliography();
            expect(createStaticBibliography).toHaveBeenCalledWith([citations.a]);
            expect(mocks.editorMock).toHaveBeenCalledWith('setBibliography');
        });
        it('nothing selected, with static bibliography containing one item selected', async () => {
            (instance.editor as MockEditor).selection = `<div class="abt-static-bib" data-reflist="[&quot;bbbbbbbbb&quot;]">
                <div id="bbbbbbbbb"></div>
            </div>`;
            await instance.insertStaticBibliography();
            expect(createStaticBibliography).toHaveBeenCalledWith([citations.b]);
            expect(mocks.editorMock).toHaveBeenCalledWith('setBibliography');
        });
        it('nothing selected, no static bib selected', async () => {
            createStaticBibliography.mockReturnValue(
                Promise.reject(new Error('Some error occurred')),
            );
            await instance.insertStaticBibliography();
            expect(mocks.editorMock).toHaveBeenCalledTimes(5);
            expect(mocks.editorMock.mock.calls[4][0]).toBe('alert');
        });
    });
    describe('scrollHander', () => {
        let instance: ReferenceList;
        Object.defineProperty(window, 'innerHeight', {
            value: 1000,
        });
        const setHeights = (cited: number, uncited: number) => {
            const citedDiv = document.getElementById('cited')!;
            const uncitedDiv = document.getElementById('uncited')!;
            for (const child of citedDiv.querySelectorAll('div')) {
                Object.defineProperty(child, 'clientHeight', {
                    value: cited,
                });
            }
            for (const child of uncitedDiv.querySelectorAll('div')) {
                Object.defineProperty(child, 'clientHeight', {
                    value: uncited,
                });
            }
        };
        beforeEach(() => {
            jest.resetAllMocks();
            document.body.innerHTML = `
                <div id="abt-reflist">
                    <div id="cited">
                        <div id="1">Citation 1</div>
                    </div>
                    <div id="uncited">
                        <div id="2">Citation 2</div>
                        <div id="3">Citation 3</div>
                    </div>
                </div>
            `;
            ({ instance } = setup());
            store.citations.CSL.merge([
                ['1', { id: '1', title: 'citation 1' }],
                ['2', { id: '2', title: 'citation 2' }],
                ['3', { id: '3', title: 'citation 3' }],
            ]);
            const cited: Citeproc.Citation[] = [
                {
                    citationID: 'first',
                    citationItems: [{ id: '1' }],
                    // FIXME: remove this when the bug is fixed.
                    properties: {},
                },
            ];
            store.citations.init(cited);
            instance.togglePinned();
        });
        afterAll(() => {
            document.body.innerHTML = `
                <div id="abt-reflist">
                    <div id="cited"></div>
                    <div id="uncited></div>
                </div>
            `;
        });
        it('list not pinned, menu closed', async () => {
            instance.ui.cited.isOpen.set(false);
            instance.togglePinned();
            (instance as any).handleScroll();
            expect(instance.ui.cited.maxHeight.get()).toBe('400px');
            expect(instance.ui.uncited.maxHeight.get()).toBe('400px');
            expect(document.getElementById('abt-reflist')!.style.top).toBe('');
        });
        it('both lists closed, menu closed', () => {
            instance.ui.cited.isOpen.set(false);
            (instance as any).handleScroll();
            expect(instance.ui.cited.maxHeight.get()).toBe('calc(100vh - 273px)');
            expect(instance.ui.uncited.maxHeight.get()).toBe('calc(100vh - 273px)');
            expect(document.getElementById('abt-reflist')!.style.top).toBe('93px');
        });
        it('cited list open, menu closed', async () => {
            (instance as any).handleScroll();
            expect(instance.ui.cited.maxHeight.get()).toBe('calc(100vh - 273px)');
            expect(instance.ui.uncited.maxHeight.get()).toBe('calc(100vh - 273px)');
            expect(document.getElementById('abt-reflist')!.style.top).toBe('93px');
        });
        it('cited list open, menu open', async () => {
            instance.toggleMenu();
            (instance as any).handleScroll();
            expect(instance.ui.cited.maxHeight.get()).toBe('calc(100vh - 357px)');
            expect(instance.ui.uncited.maxHeight.get()).toBe('calc(100vh - 357px)');
            expect(document.getElementById('abt-reflist')!.style.top).toBe('93px');
        });
        it('both lists open, menu closed, uncited list height > cited list', async () => {
            instance.ui.uncited.isOpen.set(true);
            setHeights(19, 29);
            (instance as any).handleScroll();
            expect(instance.ui.cited.maxHeight.get()).toBe('20px');
            expect(instance.ui.uncited.maxHeight.get()).toBe('707px');
            expect(document.getElementById('abt-reflist')!.style.top).toBe('93px');
        });
        it('both lists open, menu closed, cited list height > uncited height', async () => {
            instance.ui.uncited.isOpen.set(true);
            setHeights(199, 29);
            (instance as any).handleScroll();
            expect(instance.ui.cited.maxHeight.get()).toBe('667px');
            expect(instance.ui.uncited.maxHeight.get()).toBe('60px');
            expect(document.getElementById('abt-reflist')!.style.top).toBe('93px');
        });
        it('both lists open, menu closed, allocated height > remaining height', async () => {
            instance.ui.uncited.isOpen.set(true);
            setHeights(2000, 1000);
            (instance as any).handleScroll();
            expect(instance.ui.cited.maxHeight.get()).toBe('363.5px');
            expect(instance.ui.uncited.maxHeight.get()).toBe('363.5px');
            expect(document.getElementById('abt-reflist')!.style.top).toBe('93px');
        });
        it('cited list or uncited list for some reason doesnt exist', async () => {
            instance.ui.uncited.isOpen.set(true);
            document.getElementById('cited')!.remove();
            document.getElementById('uncited')!.remove();
            (instance as any).handleScroll();
            expect(instance.ui.cited.maxHeight.get()).toBe('0px');
            expect(instance.ui.uncited.maxHeight.get()).toBe('727px');
            expect(document.getElementById('abt-reflist')!.style.top).toBe('93px');
        });
    });
    describe('Misc', () => {
        it('should handle init errors', async () => {
            const { instance } = setup();
            instance.processor.init = jest
                .fn()
                .mockReturnValueOnce(Promise.reject(new Error('Some error occurred')));
            await instance.initProcessor();
            expect(Rollbar.error).toHaveBeenCalled();
        });
    });
});
