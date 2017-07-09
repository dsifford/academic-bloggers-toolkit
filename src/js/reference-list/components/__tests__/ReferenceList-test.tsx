jest.mock('../../../utils/CSLProcessor');
jest.mock('../../../utils/TinymceFunctions');
jest.mock('../../API');

import { mount } from 'enzyme';
import * as React from 'react';
import { CSLProcessor } from '../../../utils/CSLProcessor';
import * as MCE from '../../../utils/TinymceFunctions';
import * as API from '../../API';
import { Store } from '../../Store';
import { ReferenceList } from '../ReferenceList';
const reflistState = require('../../../../../lib/fixtures').reflistState;

window['Rollbar'] = { error: jest.fn() };
window['tinyMCE'] = {
    editors: {
        content: {
            dom: {
                doc: document,
                getStyle: jest.fn(),
            },
            insertContent: jest.fn(),
            selection: {
                getContent: jest.fn(),
            },
            setProgressState: jest.fn(),
            windowManager: { alert: jest.fn() },
        },
    },
} as any;

const mocks = {
    alert: window['tinyMCE'].editors['content'].windowManager
        .alert as jest.Mock<any>,
    getContent: window['tinyMCE'].editors['content'].selection
        .getContent as jest.Mock<any>,
    getRemoteData: API.getRemoteData as jest.Mock<any>,
    getStyle: window['tinyMCE'].editors['content'].dom.getStyle as jest.Mock<
        any
    >,
    importWindow: MCE.importWindow as jest.Mock<any>,
    insertContent: window['tinyMCE'].editors['content']
        .insertContent as jest.Mock<any>,
    parseInlineCitations: MCE.parseInlineCitations as jest.Mock<any>,
    parseManualData: API.parseManualData as jest.Mock<any>,
    referenceWindow: MCE.referenceWindow as jest.Mock<any>,
    rollbar: window['Rollbar'].error as jest.Mock<any>,
    setBibliography: MCE.setBibliography as jest.Mock<any>,
    setProgressState: window['tinyMCE'].editors['content']
        .setProgressState as jest.Mock<any>,
};

const setup = () => {
    const store = new Store(reflistState as BackendGlobals.ABT_Reflist_State);
    const component = mount(<ReferenceList store={store} />);
    const instance = component.instance() as any;
    return {
        component,
        instance,
    };
};

const setupDimentions = (scrollTop = 0, childHeights = [100, 100, 100]) => {
    document.body.scrollTop = scrollTop;
    const cited1 = document.getElementById('cited1') as any;
    const cited2 = document.getElementById('cited2') as any;
    const uncited1 = document.getElementById('uncited1') as any;
    Object.defineProperty(uncited1, 'clientHeight', { writable: true });
    Object.defineProperty(cited1, 'clientHeight', { writable: true });
    Object.defineProperty(cited2, 'clientHeight', { writable: true });
    cited1.clientHeight = childHeights[0];
    cited2.clientHeight = childHeights[1];
    uncited1.clientHeight = childHeights[2];
};

describe('<ReferenceList />', () => {
    beforeAll(() => {
        window['ABT_Custom_CSL'] = { value: null };
    });
    beforeEach(() => {
        jest.resetAllMocks();
        spyOn(CSLProcessor.prototype, 'makeBibliography').and.callFake(
            () => ''
        );
        window['ABT_CitationStyles'] = [
            { label: 'Test', value: 'american-medical-association' },
        ];
        document.body.innerHTML = `
        <span id="htmlSpanId" class="abt-citation"></span>
        <div id="abt-reflist">
            <div id="cited">
                <div id="cited1"></div>
                <div id="cited2"></div>
            </div>
            <div id="uncited">
                <div id="uncited1"></div>
            </div>
        </div>
        `;
    });

    it('should render with loading spinner', () => {
        const { component } = setup();
        expect(component.find('Spinner').length).toBe(1);
    });
    describe('initProcessor', () => {
        it('should init', () => {
            spyOn(CSLProcessor.prototype, 'init').and.callFake(
                () => new Promise(res => res([[]]))
            );
            const { instance } = setup();
            instance.processor.citeproc = {
                opt: { xclass: 'in-text' },
            };
            mocks.parseInlineCitations.mockImplementationOnce(
                () => new Promise(res => res())
            );
            instance.initTinyMCE();
            instance.initProcessor();
            expect(instance.editor.setProgressState).toHaveBeenCalledTimes(2);
        });
        it('should handle errors on initialization', () => {
            spyOn(CSLProcessor.prototype, 'init').and.callFake(
                () => Promise.reject('err')
            );
            const { instance } = setup();
            instance.processor.citeproc = {
                opt: { xclass: 'in-text' },
            };
            instance.initTinyMCE();
            instance.initProcessor().catch(() => {
                return expect(mocks.rollbar).toHaveBeenCalledTimes(1);
            });
        });
    });
    describe('insertStaticBibliography()', () => {
        let instance;
        beforeEach(() => {
            jest.resetAllMocks();
            spyOn(
                CSLProcessor.prototype,
                'createStaticBibliography'
            ).and.callFake(
                () =>
                    new Promise(res =>
                        res([{ id: 'test-id', html: '<div>Test Bib</div>' }])
                    )
            );
            spyOn(CSLProcessor.prototype, 'init').and.callFake(
                () => new Promise(res => res([[]]))
            );
            (CSLProcessor.prototype
                .createStaticBibliography as jasmine.Spy).calls.reset();
            (CSLProcessor.prototype.init as jasmine.Spy).calls.reset();
            mocks.parseInlineCitations.mockImplementationOnce(
                () => new Promise(res => res())
            );
            ({ instance } = setup());
            instance.initTinyMCE();
        });
        it('should work in standard form', async () => {
            instance.toggleSelect('citationId', false);
            await instance.insertStaticBibliography();
            expect(instance.editor.insertContent).toHaveBeenCalledTimes(1);
            expect(instance.editor.insertContent).toHaveBeenCalledWith(
                `<div class="noselect mceNonEditable abt-static-bib" style="margin: 0px 0px 28px;">` +
                    `<div id="test-id">` +
                    `<div>Test Bib</div>` +
                    `</div>` +
                    `</div>`
            );
        });
        it('should throw/catch an error at getStyle - default margin to 0 0 28px', async () => {
            mocks.getStyle.mockImplementationOnce(() => {
                throw new Error('error');
            });
            await instance.insertStaticBibliography();
            expect(mocks.getStyle).toHaveBeenCalled();
            expect(mocks.insertContent).toHaveBeenCalledWith(
                `<div class="noselect mceNonEditable abt-static-bib" style="margin: 0px 0px 28px;">` +
                    `<div id="test-id">` +
                    `<div>Test Bib</div>` +
                    `</div>` +
                    `</div>`
            );
        });
        it('should alert and exit if boolean returned from createStaticBibliography', async () => {
            (CSLProcessor.prototype
                .createStaticBibliography as jasmine.Spy).and.callFake(
                () => new Promise(res => res(false))
            );
            await instance.insertStaticBibliography();
            expect(mocks.alert).toHaveBeenCalled();
            expect(mocks.insertContent).not.toHaveBeenCalled();
        });
        // it('should handle errors', async () => {
        //     spyOn(instance, 'clearSelection').and.throwError('test');
        //     await instance.insertStaticBibliography();
        // });
        it('should overwrite an existing static bib if selected', async () => {
            jest.resetAllMocks();
            mocks.getContent.mockImplementationOnce(
                () =>
                    '<div class="abt-static-bib"><div id="aaaaaaaa"></div></div>'
            );
            await instance.insertStaticBibliography();
            expect(
                (CSLProcessor.prototype
                    .createStaticBibliography as jasmine.Spy).calls.count()
            ).toBe(1);
            expect(
                (CSLProcessor.prototype
                    .createStaticBibliography as jasmine.Spy).calls.mostRecent()
                    .args[0][0].title
            ).toBe('Test Title');
            expect(mocks.alert).not.toHaveBeenCalled();
            expect(mocks.insertContent).toHaveBeenCalled();
        });
    });

    describe('insertInlineCitation()', () => {
        let instance;
        beforeEach(() => {
            jest.resetAllMocks();
            spyOn(CSLProcessor.prototype, 'init').and.callFake(
                () => new Promise(res => res([[]]))
            );
            spyOn(MCE, 'getRelativeCitationPositions').and.returnValue({
                currentIndex: 0,
                locations: [
                    [['00000000', 0], ['11111111', 1]],
                    [['22222222', 2]],
                ],
            });
            spyOn(
                CSLProcessor.prototype,
                'prepareInlineCitationData'
            ).and.returnValue({});
            mocks.parseInlineCitations.mockImplementationOnce(
                () => new Promise(res => res())
            );
            ({ instance } = setup());
            instance.initTinyMCE();
            instance.processor.citeproc = {
                opt: {
                    xclass: 'in-text',
                },
                registry: {
                    citationreg: {
                        citationById: {
                            citation: {},
                        },
                    },
                },
            };
            (CSLProcessor.prototype.init as jasmine.Spy).calls.reset();
            (CSLProcessor.prototype
                .prepareInlineCitationData as jasmine.Spy).calls.reset();
            (MCE.getRelativeCitationPositions as jasmine.Spy).calls.reset();
        });
        it('should insert citation from selection', async () => {
            spyOn(MCE, 'parseInlineCitations').and.returnValue(
                new Promise(res => res(true))
            );
            instance.toggleSelect('aaaaaaaa', false);
            const mockEvent = jest.fn();
            await instance.insertInlineCitation({ preventDefault: mockEvent });
            expect(mockEvent).toHaveBeenCalled();
            expect(mocks.setBibliography).toHaveBeenCalled();
            expect(mocks.alert).not.toHaveBeenCalled();
            expect(mocks.setProgressState.mock.calls[0][0]).toBe(true);
            expect(mocks.setProgressState.mock.calls[1][0]).toBe(false);
            expect(mocks.rollbar).not.toHaveBeenCalled();
        });
        it('should insert citation from array passed to function', async () => {
            spyOn(MCE, 'parseInlineCitations').and.returnValue(
                Promise.resolve(true)
            );
            const expectedData = [{ id: 'fakeid', title: 'faketitle' }];
            await instance.insertInlineCitation(null, expectedData);
            expect(
                (CSLProcessor.prototype
                    .prepareInlineCitationData as jasmine.Spy).calls.count()
            ).toBe(1);
            expect(
                (CSLProcessor.prototype
                    .prepareInlineCitationData as jasmine.Spy).calls.first()
                    .args[0]
            ).toEqual(expectedData);
            expect(mocks.setBibliography).toHaveBeenCalled();
            expect(mocks.alert).not.toHaveBeenCalled();
            expect(mocks.setProgressState.mock.calls[0][0]).toBe(true);
            expect(mocks.setProgressState.mock.calls[1][0]).toBe(false);
            expect(mocks.rollbar).not.toHaveBeenCalled();
        });
        it('should merge selected citations if selected', async () => {
            spyOn(MCE, 'parseInlineCitations').and.returnValue(
                new Promise(res => res(true))
            );
            instance.toggleSelect('aaaaaaaa', false);
            mocks.getContent.mockImplementationOnce(
                () =>
                    '<span class="abt-citation" data-reflist="[&quot;bbbbbbbb&quot;]"></span>'
            );
            await instance.insertInlineCitation();
            expect(
                (CSLProcessor.prototype
                    .prepareInlineCitationData as jasmine.Spy).calls.count()
            ).toBe(1);
            expect(
                (CSLProcessor.prototype
                    .prepareInlineCitationData as jasmine.Spy).calls.mostRecent()
                    .args[0][0].title
            ).toBe('Test Title');
            expect(
                (CSLProcessor.prototype
                    .prepareInlineCitationData as jasmine.Spy).calls.mostRecent()
                    .args[0][1].title
            ).toBe('Other Test Title');
            expect(mocks.setBibliography).toHaveBeenCalled();
            expect(mocks.alert).not.toHaveBeenCalled();
            expect(mocks.setProgressState.mock.calls[0][0]).toBe(true);
            expect(mocks.setProgressState.mock.calls[1][0]).toBe(false);
            expect(mocks.rollbar).not.toHaveBeenCalled();
        });
        it('should handle unexpected errors', async () => {
            jest.resetAllMocks();
            (CSLProcessor.prototype
                .prepareInlineCitationData as jasmine.Spy).and.throwError(
                'Unexpected'
            );
            await instance.insertInlineCitation();
            expect(mocks.rollbar).toHaveBeenCalled();
            expect(mocks.alert).toHaveBeenCalled();
            expect(mocks.setBibliography).not.toHaveBeenCalled();
        });
        it('should handle promise rejections', async () => {
            spyOn(MCE, 'parseInlineCitations').and.returnValue(
                Promise.reject('err')
            );
            await instance.insertInlineCitation();
        });
    });

    describe('openReferenceWindow', () => {
        beforeEach(() => {
            (jest as any).resetAllMocks();
            mocks.getRemoteData.mockImplementation(
                () =>
                    new Promise(res =>
                        res([
                            { id: 'yyyyyyyy', title: 'New Title', author: [] },
                        ])
                    )
            );
            mocks.parseManualData.mockImplementation(
                () =>
                    new Promise(res =>
                        res([
                            { id: 'bbbbbbbb', title: 'Test Title', author: [] },
                        ])
                    )
            );
        });
        afterEach(() => {
            (jest as any).resetAllMocks();
        });
        it('should handle non-duplicate manual data', async () => {
            const { instance } = setup();
            instance.insertInlineCitation = jest.fn();
            instance.editor = window['tinyMCE'].editors['content'];
            mocks.referenceWindow.mockImplementation(
                () => new Promise(res => res({ addManually: true }))
            );
            await instance.openReferenceWindow();
            expect(mocks.parseManualData).toHaveBeenCalled();
            expect(mocks.getRemoteData).not.toHaveBeenCalled();
        });
        it('should handle duplicate remote data, and attach inline', async () => {
            const { instance } = setup();
            instance.insertInlineCitation = jest.fn();
            instance.editor = window['tinyMCE'].editors['content'];
            mocks.referenceWindow.mockImplementation(
                () =>
                    new Promise(res =>
                        res({ attachInline: true, addManually: false })
                    )
            );
            await instance.openReferenceWindow();
            expect(mocks.getRemoteData).toHaveBeenCalled();
            expect(mocks.parseManualData).not.toHaveBeenCalled();
        });
        // it('should handle errors', async () => {
        //     jest.resetAllMocks();
        //     const { instance } = setup();
        //     instance.insertInlineCitation = jest.fn();
        //     instance.editor = window['tinyMCE'].editors['content'];
        //     mocks.referenceWindow.mockImplementation(
        //         () => new Promise(res => res())
        //     );
        //     await instance.openReferenceWindow();
        //     mocks.referenceWindow.mockImplementation(
        //         () => new Promise(res => res({ addManually: true }))
        //     );
        //     mocks.parseManualData.mockImplementation(
        //         () => new Promise(res => res())
        //     );
        //     await instance.openReferenceWindow();
        //     expect(mocks.rollbar).toHaveBeenCalled();
        // });
        it('should exit if data has 0 length', async () => {
            mocks.referenceWindow.mockImplementation(
                () => new Promise(res => res({ addManually: true }))
            );
            mocks.parseManualData.mockImplementation(
                () => new Promise(res => res([]))
            );
            const { instance } = setup();
            instance.insertInlineCitation = jest.fn();
            instance.editor = window['tinyMCE'].editors['content'];
            await instance.openReferenceWindow();
        });
        it('should exit if user exits early', async () => {
            const { instance } = setup();
            mocks.referenceWindow.mockImplementation(
                () => new Promise((_, rej) => rej())
            );
            await instance.openReferenceWindow();
            expect(mocks.alert).not.toHaveBeenCalled();
        });
    });

    describe('openImportWindow', () => {
        it('should exit if data is empty', () => {
            mocks.importWindow.mockImplementation(
                () => new Promise(res => res())
            );
            const { instance } = setup();
            expect(instance.props.store.citations.CSL.keys().length).toBe(3);
            instance.openImportWindow();
            expect(instance.props.store.citations.CSL.keys().length).toBe(3);
        });
        it('should import citations', async () => {
            mocks.importWindow.mockImplementation(
                () =>
                    new Promise(res =>
                        res([{ id: 'zzzzzzzz', title: 'Imported Citation' }])
                    )
            );
            const { instance } = setup();
            expect(instance.props.store.citations.CSL.keys().length).toBe(3);
            await instance.openImportWindow();
            expect(instance.props.store.citations.CSL.keys().length).toBe(4);
        });
    });

    describe('handleMenuSelection', () => {
        it('should return if "kind" is empty or invalid', () => {
            const { instance } = setup();
            instance.initProcessor = jest.fn();
            instance.openImportWindow = jest.fn();
            instance.reset = jest.fn();
            instance.insertStaticBibliography = jest.fn();
            instance.handleMenuSelection();
            expect(instance.initProcessor).not.toHaveBeenCalled();
            expect(instance.openImportWindow).not.toHaveBeenCalled();
            expect(instance.reset).not.toHaveBeenCalled();
            expect(instance.insertStaticBibliography).not.toHaveBeenCalled();
        });
        it('should change style', () => {
            const { instance } = setup();
            instance.initProcessor = jest.fn();
            instance.openImportWindow = jest.fn();
            instance.reset = jest.fn();
            instance.insertStaticBibliography = jest.fn();
            instance.handleMenuSelection('CHANGE_STYLE', 'apa-5th');
            expect(instance.props.store.citationStyle).toBe('apa-5th');
            expect(instance.initProcessor).toHaveBeenCalled();
            expect(instance.openImportWindow).not.toHaveBeenCalled();
            expect(instance.reset).not.toHaveBeenCalled();
            expect(instance.insertStaticBibliography).not.toHaveBeenCalled();
        });
        it('should trigger import window', () => {
            const { instance } = setup();
            instance.initProcessor = jest.fn();
            instance.openImportWindow = jest.fn();
            instance.reset = jest.fn();
            instance.insertStaticBibliography = jest.fn();
            instance.handleMenuSelection('IMPORT_RIS');
            expect(instance.initProcessor).not.toHaveBeenCalled();
            expect(instance.openImportWindow).toHaveBeenCalled();
            expect(instance.reset).not.toHaveBeenCalled();
            expect(instance.insertStaticBibliography).not.toHaveBeenCalled();
        });
        it('should trigger refresh', () => {
            const { instance } = setup();
            instance.initProcessor = jest.fn();
            instance.openImportWindow = jest.fn();
            instance.reset = jest.fn();
            instance.insertStaticBibliography = jest.fn();
            instance.editor = window['tinyMCE'].editors['content'];
            expect(instance.props.store.citations.byIndex.length).toBe(2);

            instance.handleMenuSelection('REFRESH_PROCESSOR');
            expect(instance.initProcessor).toHaveBeenCalled();
            expect(instance.openImportWindow).not.toHaveBeenCalled();
            expect(instance.reset).not.toHaveBeenCalled();
            expect(instance.insertStaticBibliography).not.toHaveBeenCalled();
            expect(instance.props.store.citations.byIndex.length).toBe(1);
        });
        it('should trigger reset', () => {
            const { instance } = setup();
            instance.initProcessor = jest.fn();
            instance.openImportWindow = jest.fn();
            instance.reset = jest.fn();
            instance.insertStaticBibliography = jest.fn();
            instance.handleMenuSelection('DESTROY_PROCESSOR');
            expect(instance.initProcessor).not.toHaveBeenCalled();
            expect(instance.openImportWindow).not.toHaveBeenCalled();
            expect(instance.reset).toHaveBeenCalled();
            expect(instance.insertStaticBibliography).not.toHaveBeenCalled();
        });
        it('should trigger insertStaticBibliography', () => {
            const { instance } = setup();
            instance.initProcessor = jest.fn();
            instance.openImportWindow = jest.fn();
            instance.reset = jest.fn();
            instance.insertStaticBibliography = jest.fn();
            instance.handleMenuSelection('INSERT_STATIC_BIBLIOGRAPHY');
            expect(instance.initProcessor).not.toHaveBeenCalled();
            expect(instance.openImportWindow).not.toHaveBeenCalled();
            expect(instance.reset).not.toHaveBeenCalled();
            expect(instance.insertStaticBibliography).toHaveBeenCalled();
        });
    });

    describe('@actions', () => {
        beforeEach(() => {
            (jest as any).resetAllMocks();
        });
        it('deleteCitations', () => {
            const { instance } = setup();
            instance.editor = window['tinyMCE'].editors['content'];
            instance.initProcessor = jest.fn();
            instance.toggleSelect('aaaaaaaa', false);
            expect(instance.props.store.citations.cited.length).toBe(2);
            instance.deleteCitations();
            instance.deleteCitations();
            expect(instance.props.store.citations.cited.length).toBe(1);
            expect(instance.initProcessor).toHaveBeenCalledTimes(1);
        });
        it('toggleLoading()', () => {
            const { instance } = setup();

            // Basic toggle
            expect(instance.loading).toBe(true);
            instance.toggleLoading();
            expect(instance.loading).toBe(false);

            // Explicit 'true'
            instance.toggleLoading();
            expect(instance.loading).toBe(true);
            instance.toggleLoading(true);
            expect(instance.loading).toBe(true);

            // Explicit 'false' repeated
            instance.toggleLoading(false);
            instance.toggleLoading(false);
            instance.toggleLoading(false);
            expect(instance.loading).toBe(false);
        });
        it('togglePinned()', () => {
            const d = document.getElementById('abt-reflist')!;
            const { component, instance } = setup();
            instance.toggleLoading();

            // Default to unpinned
            expect(instance.fixed).toBe(false);
            expect(
                component.find('.dashicons.dashicons-admin-post.pin-reflist')
                    .length
            ).toBe(1);
            expect(
                component.find(
                    '.dashicons.dashicons-admin-post.pin-reflist_fixed'
                ).length
            ).toBe(0);

            // Toggle pinned
            instance.togglePinned();
            expect(instance.fixed).toBe(true);
            expect(d.classList.contains('fixed')).toBe(true);
            expect(
                component.find('.dashicons.dashicons-admin-post.pin-reflist')
                    .length
            ).toBe(0);
            expect(
                component.find(
                    '.dashicons.dashicons-admin-post.pin-reflist_fixed'
                ).length
            ).toBe(1);

            // Toggle unpinned
            instance.togglePinned();
            expect(instance.fixed).toBe(false);
            expect(d.classList.contains('fixed')).toBe(false);
            expect(
                component.find('.dashicons.dashicons-admin-post.pin-reflist')
                    .length
            ).toBe(1);
            expect(
                component.find(
                    '.dashicons.dashicons-admin-post.pin-reflist_fixed'
                ).length
            ).toBe(0);
        });
        it('toggleMenu()', () => {
            const { component, instance } = setup();
            instance.toggleLoading();

            // Starts closed
            expect(instance.menuOpen).toBe(false);
            expect(
                component.find('.dashicons.dashicons-menu.hamburger-menu')
                    .length
            ).toBe(1);
            expect(
                component.find('.dashicons.dashicons-no-alt.hamburger-menu')
                    .length
            ).toBe(0);

            // Toggle open
            instance.toggleMenu();
            expect(instance.menuOpen).toBe(true);
            expect(
                component.find('.dashicons.dashicons-menu.hamburger-menu')
                    .length
            ).toBe(0);
            expect(
                component.find('.dashicons.dashicons-no-alt.hamburger-menu')
                    .length
            ).toBe(1);

            // Toggle Closed (timeout due to CSS transition time)
            instance.toggleMenu();
            return new Promise(resolve => {
                setTimeout(resolve, 500); // tslint:disable-line
            }).then(() => {
                expect(instance.menuOpen).toBe(false);
                expect(
                    component.find('.dashicons.dashicons-menu.hamburger-menu')
                        .length
                ).toBe(1);
                expect(
                    component.find('.dashicons.dashicons-no-alt.hamburger-menu')
                        .length
                ).toBe(0);
            });
        });
        it('toggleList()', () => {
            const { instance } = setup();

            // Defaults to cited: open, uncited: closed
            expect(instance.citedListUI.isOpen).toBe(true);
            expect(instance.uncitedListUI.isOpen).toBe(false);

            // Open uncited
            instance.toggleList('uncited');
            expect(instance.citedListUI.isOpen).toBe(true);
            expect(instance.uncitedListUI.isOpen).toBe(true);

            // "Explode" uncited (close cited)
            instance.toggleList('uncited', true);
            expect(instance.citedListUI.isOpen).toBe(false);
            expect(instance.uncitedListUI.isOpen).toBe(true);

            // Close uncited (both closed now)
            instance.toggleList('uncited');
            expect(instance.citedListUI.isOpen).toBe(false);
            expect(instance.uncitedListUI.isOpen).toBe(false);

            // Open cited
            instance.toggleList('cited');
            expect(instance.citedListUI.isOpen).toBe(true);
            expect(instance.uncitedListUI.isOpen).toBe(false);

            // Open uncited
            instance.toggleList('uncited');
            expect(instance.citedListUI.isOpen).toBe(true);
            expect(instance.uncitedListUI.isOpen).toBe(true);

            // "Explode" cited
            instance.toggleList('cited', true);
            expect(instance.citedListUI.isOpen).toBe(true);
            expect(instance.uncitedListUI.isOpen).toBe(false);

            // Do nothing -- invalid
            instance.toggleList('nothing');
            expect(instance.citedListUI.isOpen).toBe(true);
            expect(instance.uncitedListUI.isOpen).toBe(false);
        });
        it('toggleSelect()', () => {
            const { instance } = setup();
            expect(instance.selected.length).toBe(0);
            instance.toggleSelect('first', false);
            instance.toggleSelect('second', false);
            expect(instance.selected.peek()).toEqual(['first', 'second']);
            instance.toggleSelect('first', true);
            expect(instance.selected.peek()).toEqual(['second']);
            instance.toggleSelect('second', true);
            expect(instance.selected.length).toBe(0);
        });
        it('clearSelection()', () => {
            const { instance } = setup();
            expect(instance.selected.length).toBe(0);
            instance.toggleSelect('first', false);
            instance.toggleSelect('second', false);
            instance.clearSelection();
            expect(instance.selected.length).toBe(0);
        });
        it('handleScroll()', () => {
            const { instance } = setup();
            setupDimentions();
            instance.toggleLoading();

            // Open uncited
            instance.toggleList('uncited');
            expect(instance.citedListUI.isOpen).toBe(true);
            expect(instance.uncitedListUI.isOpen).toBe(true);

            // Toggle pinned state
            instance.togglePinned();
            expect(instance.citedListUI.maxHeight).toBe('392px');
            expect(instance.uncitedListUI.maxHeight).toBe('101px');

            // New dimentions
            setupDimentions(100, [200, 250, 500]);
            instance.togglePinned();
            instance.togglePinned();
            expect(instance.citedListUI.maxHeight).toBe('263.1666666666667px');
            expect(instance.uncitedListUI.maxHeight).toBe(
                '263.1666666666667px'
            );

            // New dimentions
            setupDimentions(150, [50, 50, 650]);
            instance.toggleMenu();
            instance.togglePinned();
            instance.togglePinned();
            expect(instance.citedListUI.maxHeight).toBe('102px');
            expect(instance.uncitedListUI.maxHeight).toBe('347px');
        });
        it('reset()', () => {
            (MCE.reset as jest.Mock<any>).mockImplementationOnce(() => null);
            const { instance } = setup();
            instance.editor = window['tinyMCE'].editors['content'];
            instance.initProcessor = jest.fn();
            instance.reset();
            expect(MCE.reset as jest.Mock<any>).toHaveBeenCalled();
            expect(mocks.setProgressState).toHaveBeenCalled();
            expect(instance.initProcessor).toHaveBeenCalled();
        });
    });
});
