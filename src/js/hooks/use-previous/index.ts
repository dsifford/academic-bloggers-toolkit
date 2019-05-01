import { useEffect, useRef } from '@wordpress/element';

/**
 * Hook to allow comparison of the current props with the previous props after
 * an update.
 *
 * @see https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 */
export default function usePrevious<T>(value: T): T {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current || value;
}
