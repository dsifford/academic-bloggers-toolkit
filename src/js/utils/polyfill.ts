((global: any): void => {
    if (typeof global.CustomEvent === 'function') return;

    function CustomEvent(event: any, params: any): CustomEvent {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = global.Event.prototype;

    global.CustomEvent = CustomEvent;
})(top);
