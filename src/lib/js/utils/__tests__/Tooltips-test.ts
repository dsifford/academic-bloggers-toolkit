import { createTooltip, destroyTooltip } from '../Tooltips';

describe('Tooltips.ts', () => {
    describe('createTooltip', () => {
        it('should create tooltip on bottom', () => {
            const container = document.createElement('div');
            container.id = 'main';
            createTooltip(container, 'testing', 'bottom');
            const tip = document.getElementById('abt-tooltip');
            expect(tip.style.top).toBe('10px');
            expect(tip.style.left).toBe('0px');
            expect(tip.style.marginLeft).toBe('0px');
            destroyTooltip();
            container.remove();
        });
        it('should create tooltip on top', () => {
            const container = document.createElement('div');
            container.id = 'main';
            spyOn(container, 'getBoundingClientRect').and.returnValue({
                bottom: 0,
                height: 0,
                left: -500,
                right: 0,
                top: 0,
                width: 0,
                x: 0,
                y: 0,
            });
            createTooltip(container, 'testing', 'top');
            const tip = document.getElementById('abt-tooltip');
            expect(tip.style.left).toBe('0px');
            expect(tip.style.marginLeft).toBe('0px');
            destroyTooltip();
            container.remove();
        });
        it('should create tooltip on left', () => {
            const container = document.createElement('div');
            container.id = 'main';
            spyOn(container, 'getBoundingClientRect').and.returnValue({
                bottom: 0,
                height: 0,
                left: -500,
                right: 0,
                top: 0,
                width: 0,
                x: 0,
                y: 0,
            });
            createTooltip(container, 'testing', 'left');
            const tip = document.getElementById('abt-tooltip');
            expect(tip.style.top).toBe('0px');
            expect(tip.style.marginTop).toBe('0px');
            destroyTooltip();
            container.remove();
        });
        it('should create tooltip on right', () => {
            const container = document.createElement('div');
            container.id = 'main';
            spyOn(container, 'getBoundingClientRect').and.returnValue({
                bottom: 0,
                height: 0,
                left: 0,
                right: 0,
                top: -500,
                width: 0,
                x: 0,
                y: 0,
            });
            createTooltip(container, 'testing', 'right');
            const tip = document.getElementById('abt-tooltip');
            expect(tip.style.top).toBe('0px');
            expect(tip.style.marginTop).toBe('0px');
            destroyTooltip();
            container.remove();
        });
    });
});
