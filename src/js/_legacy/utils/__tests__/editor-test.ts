import Editor from '../editor';

class TestEditor extends Editor {}

describe('Editor abstract class', () => {
    describe('createBibliographyElement()', () => {
        it('should create bibliographies with headings of varying levels', () => {
            let bib = TestEditor.createBibliographyElement(
                {
                    bib_heading: 'Hello World',
                },
                [
                    { id: '1', html: '<div>Item 1</div>' },
                    { id: '2', html: '<div>Item 2</div>' },
                    { id: '3', html: '<div>Item 3</div>' },
                ],
                ['my-custom-class'],
            );
            expect(bib.outerHTML).toMatchSnapshot();
            bib = TestEditor.createBibliographyElement(
                {
                    bib_heading: 'Hello World',
                    bib_heading_level: 'h1',
                },
                [
                    { id: '1', html: '<div>Item 1</div>' },
                    { id: '2', html: '<div>Item 2</div>' },
                    { id: '3', html: '<div>Item 3</div>' },
                ],
                ['my-custom-class'],
            );
            expect(bib.outerHTML).toMatchSnapshot();
        });
        it('should create bibliographies with toggle headings', () => {
            const bib = TestEditor.createBibliographyElement(
                {
                    bib_heading: 'Hello World',
                    bib_heading_level: 'h5',
                    bibliography: 'toggle',
                },
                [
                    { id: '1', html: '<div>Item 1</div>' },
                    { id: '2', html: '<div>Item 2</div>' },
                    { id: '3', html: '<div>Item 3</div>' },
                ],
                ['my-custom-class'],
            );
            expect(bib.outerHTML).toMatchSnapshot();
        });
        it('should create bibliographies without headings', () => {
            const bib = TestEditor.createBibliographyElement({}, [
                { id: '1', html: '<div>Item 1</div>' },
                { id: '2', html: '<div>Item 2</div>' },
                { id: '3', html: '<div>Item 3</div>' },
            ]);
            expect(bib.outerHTML).toMatchSnapshot();
        });
        it('should create static bibliographies', () => {
            const bib = TestEditor.createBibliographyElement(
                {},
                [
                    { id: '1', html: '<div>Item 1</div>' },
                    { id: '2', html: '<div>Item 2</div>' },
                    { id: '3', html: '<div>Item 3</div>' },
                ],
                [`${TestEditor.staticBibClass}`, 'my-custom-class'],
            );
            expect(bib.outerHTML).toMatchSnapshot();
        });
        it('should print warning if static bib set without items', () => {
            const bib = TestEditor.createBibliographyElement(
                {},
                [],
                [`${TestEditor.staticBibClass}`, 'my-custom-class'],
            );
            expect(bib.outerHTML).toMatchSnapshot();
        });
    });
    describe('createFootnoteSection()', () => {
        it('should create footnotes with extra classnames', () => {
            const note = TestEditor.createFootnoteSection(
                ['<div>Item 1</div>', '<div>Item 2</div>', '<div>Item 3</div>'],
                ['my-custom-class'],
            );
            expect(note.outerHTML).toMatchSnapshot();
        });
        it('should create footnotes without extra classnames', () => {
            const note = TestEditor.createFootnoteSection([
                '<div>Item 1</div>',
                '<div>Item 2</div>',
                '<div>Item 3</div>',
            ]);
            expect(note.outerHTML).toMatchSnapshot();
        });
    });
    describe('createInlineElement()', () => {
        it('should create a citation element', () => {
            const el = TestEditor.createInlineElement({
                classNames: ['my-custom-class'],
                id: 'citation-1',
                innerHTML: '<span>Hello World</span>',
                kind: 'in-text',
                reflist: JSON.stringify(['12345', '54321']),
            });
            expect(el.innerHTML).toMatchSnapshot();
        });
        it('should create a footnote element', () => {
            const el = TestEditor.createInlineElement({
                id: 'citation-1',
                innerHTML: '<span>Hello World</span>',
                kind: 'note',
                reflist: JSON.stringify(['12345', '54321']),
            });
            expect(el.innerHTML).toMatchSnapshot();
        });
    });
});
