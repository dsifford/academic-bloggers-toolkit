jest.unmock('../Modal');

import { Modal } from '../Modal';
import * as sinon from 'sinon';

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
    it('should resize appropriately if modal is large', () => {
        setup('test');
        const modal = new Modal('test');
        const el = document.getElementById('main-container');
        const x = sinon.stub(el, 'getBoundingClientRect');
        x.returns({height: 10000});
        modal.resize();
        x.restore();
    });
});
