import { frontendJS } from '../frontend';
const before = beforeAll;
document.body.innerHTML =
`
<span id="citation-1" class="abt-citation" data-reflist='["aaaaaaaa","cccccccc"]'></span>
<span id="citation-2" class="abt_cite" data-reflist='["bbbbbbbb"]'></span>
<span id="citation-3" class="abt-citation" data-reflist='["cccccccc"]'></span>
<div id="abt-bibliography">
    <h3 class="abt-bibliography__heading">Bibliography</h3>
    <div id="abt-bibliography__container" class="abt-bibliography__container">
        <div id="aaaaaaaa">Test reference 1</div>
        <div id="bbbbbbbb">Test reference 2</div>
        <div id="cccccccc">Test reference 3</div>
    </div>
</div>
`;
describe('Frontend', () => {
    describe('Toggle Disabled', () => {
        before(() => {
            frontendJS();
        });
        it('should render appropriately', () => {
            const citation1 = document.getElementById('citation-1')!;
            expect(citation1.getAttribute('data-citations')).toBe(
                `<div id="aaaaaaaa">Test reference 1</div><div id="cccccccc">Test reference 3</div>`,
            );
        });
        it('should create a tooltip on click', () => {
            expect(document.getElementById('abt-tooltip')).toBeNull;
            const citation3 = document.getElementById('citation-3')!;
            citation3.click();
            expect(document.getElementById('abt-tooltip')).not.toBeNull;
        });
        it('should destroy tooltips on close button click', () => {
            const citation2 = document.getElementById('citation-2')!;
            citation2.click();
            const closeBtn = <HTMLDivElement>document.querySelector('.abt-tooltip__close-button-container');
            expect(document.getElementById('abt-tooltip')).not.toBeNull;
            closeBtn.click();
            expect(document.getElementById('abt-tooltip')).toBeNull;
        });
    });
    describe('Toggle Enabled', () => {
        before(() => {
            document.querySelector('.abt-bibliography__heading')!.classList.add('abt-bibliography__heading_toggle');
            frontendJS();
        });
        it('should toggle on click', () => {
            const heading = <HTMLHeadingElement>document.querySelector('.abt-bibliography__heading');
            const bibContainer = <HTMLHeadingElement>document.querySelector('.abt-bibliography__container');
            expect(heading.classList.contains('abt-bibliography__heading_toggle--closed')).toBe(true);
            expect(bibContainer.classList.contains('abt-bibligraphy__container--hidden')).toBe(true);
            heading.click();
            expect(heading.classList.contains('abt-bibliography__heading_toggle--closed')).toBe(false);
            expect(bibContainer.classList.contains('abt-bibligraphy__container--hidden')).toBe(false);
            heading.click();
            expect(heading.classList.contains('abt-bibliography__heading_toggle--closed')).toBe(true);
            expect(bibContainer.classList.contains('abt-bibligraphy__container--hidden')).toBe(true);
        });
    });
});
