import { preventScrollPropagation } from '../';

describe('preventScrollPropagation()', () => {
    class TestComponent {
        element;
        constructor(o, h, t) {
            this.element = {
                offsetHeight: o,
                scrollHeight: h,
                scrollTop: t,
            };
        }
    }

    const setup = (o, h, t, d) => {
        const stopPropagation = jest.fn();
        const preventDefault = jest.fn();
        return {
            component: new TestComponent(o, h, t),
            e: {
                stopPropagation,
                preventDefault,
                deltaY: d,
            },
            stopPropagation,
            preventDefault,
        };
    };

    it('should stop at top and scrolling up', () => {
        const { component, e, preventDefault, stopPropagation } = setup(12, 15, 0, -10);
        preventScrollPropagation.call(component, e);
        expect(stopPropagation).toBeCalled();
        expect(preventDefault).toBeCalled();
    });
    it('should stop at bottom and scrolling down', () => {
        const { component, e, preventDefault, stopPropagation } = setup(50, 100, 50, 10);
        preventScrollPropagation.call(component, e);
        expect(stopPropagation).toBeCalled();
        expect(preventDefault).toBeCalled();
    });
    it('should not stop when conditions are not met', () => {
        const { component, e, preventDefault, stopPropagation } = setup(15, 10, 560, 10);
        preventScrollPropagation.call(component, e);
        expect(stopPropagation).toBeCalled();
        expect(preventDefault).not.toBeCalled();
    });
});
