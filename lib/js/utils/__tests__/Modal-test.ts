jest.unmock('../Modal');

import { Modal, } from '../Modal';

const setup = (
    title: string
) => {
    document.body.innerHTML = `
        <div class="mce-floatpanel" aria-label="${title}" id="test" style="height: 100px; width: 100px;">
            <div id="mce-reset"></div>
            <div id="test-body">
                <div id="main-container"></div>
            </div>
        </div>
    `;
};

describe('Modal', () => {
    it('should render', () => {
        setup('test');
        new Modal('test');
    });
    it('should resize', () => {
        setup('test');
        const modal = new Modal('test');
        modal.resize();
    });
});
