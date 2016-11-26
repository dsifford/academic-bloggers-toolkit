jest.mock('../../../utils/CSLProcessor');

import * as React from 'react';
import { mount } from 'enzyme';
import { ReferenceList } from '../ReferenceList';
import { Store } from '../../Store';
import * as MCE from '../../../utils/TinymceFunctions';
const reflistState = require('../../../../../../scripts/fixtures').reflistState;
const before = beforeAll;

window['ABT_Custom_CSL'] = { value: null };
window['ABT_CitationStyles'] = [{ label: 'Test', value: 'american-medical-association' }];
window['Rollbar'] = { error: () => null };
window['tinyMCE'] = {
    editors: {
        content: {
            setProgressState: () => null,
        },
    },
} as any;

const setup = () => {
    const store = new Store(reflistState as BackendGlobals.ABT_Reflist_State);
    const component = mount(
        <ReferenceList store={store} />
    );
    return {
        component,
        instance: (component.instance() as any),
    };
};

const setupDimentions = (scrollTop = 0, childHeights = [100, 100, 100]) => {
    document.body.scrollTop = scrollTop;
    const cited1 = document.getElementById('cited1') as any;
    const cited2 = document.getElementById('cited2') as any;
    const uncited1 = document.getElementById('uncited1') as any;
    cited1.clientHeight = childHeights[0];
    cited2.clientHeight = childHeights[1];
    uncited1.clientHeight = childHeights[2];
};

const setupInstance = (instance, {
    staticBibReturnBool = false,
    getStyle = 'defined',
    content = '',
    staticBibError = false,
} = {}) => {
    instance.selected = ['12345678'];
    instance.processor.makeBibliography = () => [{ html: '<div>test</div>', id: '12345678' }];
    instance.processor.citeproc = {
        opt: {
            xclass: 'in-text',
        },
        registry: {
            citationreg: {
                citationById: {
                    tester: {},
                },
            },
        },
    };
    instance.processor.init = () => new Promise(res => res(true));
    instance.editor = {
        dom: { doc: document },
        selection: {
            getContent: () => content,
        },
        setProgressState: () => null,
        windowManager: { alert: jest.fn() },
    };
    instance.processor.createStaticBibliography = staticBibError
        ? () => new Promise((_res, rej) => { rej(new Error('test error')); })
        : () => new Promise(res => staticBibReturnBool ? res(false) : res([{ html: '<div>test</div>', id: '11111' }]));
    switch (getStyle) {
        case 'defined':
            instance.editor.dom.getStyle = () => '0 0 50px';
            break;
        case 'undefined':
            instance.editor.dom.getStyle = () => undefined;
            break;
        default:
    }
    instance.editor.insertContent = () => null;
};

describe('<ReferenceList />', () => {
    before(() => {
        const main = document.createElement('div');
        const cited = document.createElement('div');
        const citedChild1 = document.createElement('div');
        citedChild1.id = 'cited1';
        const citedChild2 = document.createElement('div');
        citedChild2.id = 'cited2';
        const uncited = document.createElement('div');
        const uncitedChild = document.createElement('div');
        uncitedChild.id = 'uncited1';
        main.id = 'abt-reflist';
        cited.id = 'cited';
        uncited.id = 'uncited';
        cited.appendChild(citedChild1);
        cited.appendChild(citedChild2);
        uncited.appendChild(uncitedChild);
        main.appendChild(cited);
        main.appendChild(uncited);
        document.body.appendChild(main);
    });

    it('should render with loading spinner', () => {
        const { component } = setup();
        expect(component.find('Spinner').length).toBe(1);
    });

    describe('insertStaticBibliography()', () => {
        it('should work in standard form', () => {
            const { instance } = setup();
            setupInstance(instance);
            instance.insertStaticBibliography();
        });
        it('should throw/catch an error at getStyle - default margin to 0 0 28px', () => {
            const { instance } = setup();
            setupInstance(instance, {
                getStyle: '',
            });
            instance.insertStaticBibliography();
        });
        it('should default to margin 0 0 28px if getStyle returns falsy', () => {
            const { instance } = setup();
            setupInstance(instance, {
                getStyle: 'undefined',
            });
            instance.insertStaticBibliography();
        });
        it('should alert and exit if boolean returned from createStaticBibliography', () => {
            const { instance } = setup();
            setupInstance(instance, {
                content: '<div class="abt-static-bib"><div id="f7s9f7d5"></div></div>',
                staticBibReturnBool: true,
            });
            instance.insertStaticBibliography();
        });
        it('should throw error', () => {
            spyOn(MCE, 'parseInlineCitations').and.returnValue(
                new Promise(res => res(true))
            );
            const { instance } = setup();
            setupInstance(instance, {
                staticBibError: true,
            });
            instance.insertStaticBibliography();
        });
    });

    describe('insertInlineCitation()', () => {
        it('should preventDefault() and throw an error at the end', () => {
            spyOn(MCE, 'getRelativeCitationPositions').and.returnValue({
                currentIndex: 0,
                locations: [
                    [['00000000', 0], ['11111111', 1]],
                    [['22222222', 2]],
                ],
            });
            spyOn(MCE, 'parseInlineCitations').and.returnValue(new Promise(res => res(true)));
            const spy = jest.fn();
            const { instance } = setup();
            setupInstance(instance);
            instance.insertInlineCitation({ preventDefault: spy });
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should match the regex pattern and throw an error at clusters', () => {
            const { instance } = setup();
            setupInstance(instance, {
                content: '<span id="5k45h3l4j" class="abt-citation" data-reflist="[&quot;3j5k4j35&quot;]">test</span>',
            });
            spyOn(MCE, 'getRelativeCitationPositions').and.throwError('testing');
            instance.insertInlineCitation();
        });
    });

    describe('@actions', () => {
        it('deleteCitations', () => {
            const { instance } = setup();
            setupInstance(instance);
            instance.deleteCitations();
            instance.deleteCitations({ preventDefault: () => null });
            instance.selected = ['12345678'];
            instance.deleteCitations();
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
            const d = document.getElementById('abt-reflist');
            const { component, instance } = setup();
            instance.toggleLoading();

            // Default to unpinned
            expect(instance.fixed).toBe(false);
            expect(component.find('.dashicons.dashicons-admin-post.pin-reflist').length).toBe(1);
            expect(component.find('.dashicons.dashicons-admin-post.pin-reflist_fixed').length).toBe(0);

            // Toggle pinned
            instance.togglePinned();
            expect(instance.fixed).toBe(true);
            expect(d.classList.contains('fixed')).toBe(true);
            expect(component.find('.dashicons.dashicons-admin-post.pin-reflist').length).toBe(0);
            expect(component.find('.dashicons.dashicons-admin-post.pin-reflist_fixed').length).toBe(1);

            // Toggle unpinned
            instance.togglePinned();
            expect(instance.fixed).toBe(false);
            expect(d.classList.contains('fixed')).toBe(false);
            expect(component.find('.dashicons.dashicons-admin-post.pin-reflist').length).toBe(1);
            expect(component.find('.dashicons.dashicons-admin-post.pin-reflist_fixed').length).toBe(0);
        });
        it('toggleMenu()', () => {
            const { component, instance } = setup();
            instance.toggleLoading();

            // Starts closed
            expect(instance.menuOpen).toBe(false);
            expect(component.find('.dashicons.dashicons-menu.hamburger-menu').length).toBe(1);
            expect(component.find('.dashicons.dashicons-no-alt.hamburger-menu').length).toBe(0);
            expect(component.find('Menu').length).toBe(0);

            // Toggle open
            instance.toggleMenu();
            expect(instance.menuOpen).toBe(true);
            expect(component.find('.dashicons.dashicons-menu.hamburger-menu').length).toBe(0);
            expect(component.find('.dashicons.dashicons-no-alt.hamburger-menu').length).toBe(1);
            expect(component.find('Menu').length).toBe(1);

            // Toggle Closed (timeout due to CSS transition time)
            instance.toggleMenu();
            return new Promise(resolve => {
                setTimeout(resolve, 500); // tslint:disable-line
            })
            .then(() => {
                expect(instance.menuOpen).toBe(false);
                expect(component.find('.dashicons.dashicons-menu.hamburger-menu').length).toBe(1);
                expect(component.find('.dashicons.dashicons-no-alt.hamburger-menu').length).toBe(0);
                expect(component.find('Menu').length).toBe(0);
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
            expect(instance.uncitedListUI.maxHeight).toBe('263.1666666666667px');

            // New dimentions
            setupDimentions(150, [50, 50, 650]);
            instance.toggleMenu();
            instance.togglePinned();
            instance.togglePinned();
            expect(instance.citedListUI.maxHeight).toBe('102px');
            expect(instance.uncitedListUI.maxHeight).toBe('347px');
        });
    });
});
