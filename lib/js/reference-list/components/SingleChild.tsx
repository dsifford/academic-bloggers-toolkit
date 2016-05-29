import * as React from 'react';

/**
 * Small helper component used to render single animated elements
 */
export const SingleChild = (props) => {
    const children = React.Children.toArray(props.children);
    return (
        children[0] || null
    );
};
