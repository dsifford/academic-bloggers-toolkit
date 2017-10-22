if (!top._babelPolyfill) {
    require('babel-polyfill');
}

((global: any) => {
    if (typeof global.CustomEvent === 'function') return;

    function CustomEvent(event: any, params: any) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = global.Event.prototype;

    global.CustomEvent = CustomEvent;
})(top);
