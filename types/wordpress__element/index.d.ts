// Type definitions for @wordpress/element
// Definitions by: Derek P Sifford <dereksifford@gmail.com>

import * as R from 'react';
import * as RD from 'react-dom';

declare global {
    namespace React {
        //
        // ReactDOM re-exports
        //
        export const createPortal: typeof RD.createPortal;
        export const findDOMNode: typeof RD.findDOMNode;
        export const render: typeof RD.render;
        export const unmountComponentAtNode: typeof RD.unmountComponentAtNode;

        /**
         * Component used as equivalent of Fragment with unescaped HTML, in cases where
         * it is desirable to render dangerous HTML without needing a wrapper element.
         * To preserve additional props, a `div` wrapper _will_ be created if any props
         * aside from `children` are passed.
         *
         * @param props.children - HTML to render.
         *
         * @return Dangerously-rendering element.
         */
        export function RawHTML(
            props: { children: string } & R.HTMLProps<HTMLDivElement>,
        ): JSX.Element;

        /**
         * Checks if the provided WP element is empty.
         *
         * @param element - WP element to check.
         * @return True when an element is considered empty.
         */
        export function isEmptyElement(element: R.ReactNode): boolean;

        /**
         * Serializes a React element to string.
         *
         * @param element       - Element to serialize.
         * @param context       - Context object.
         * @param legacyContext - Legacy context object.
         *
         * @return Serialized element.
         */
        export function renderToString(
            element: R.ReactNode,
            context?: any,
            legacyContext?: any,
        ): string;
    }
}

export = React;
