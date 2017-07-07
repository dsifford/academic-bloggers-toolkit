interface HasElement {
    element: HTMLElement;
}

/**
 * Prevents the wheel event from bubbling through to parent elements.
 *
 * In order for this function to work, the component of interest's "this" must
 * be bound and there must be an "element" property in the component.
 *
 * @this HasElement
 * @param e - React Wheel Event
 */
export function preventScrollPropagation(this: HasElement, e: React.WheelEvent<HTMLElement>): void {
    e.stopPropagation();
    const atTopAndScrollingUp: boolean =
        this.element.scrollTop === 0 && e.deltaY < 0;
    const atBottomAndScollingDown: boolean =
        Math.floor(this.element.scrollTop + this.element.offsetHeight) ===
            this.element.scrollHeight && e.deltaY > 0;
    if (atTopAndScrollingUp || atBottomAndScollingDown) {
        e.preventDefault();
    }
}
