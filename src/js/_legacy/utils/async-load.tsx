// TODO: deprecate this file
import React from 'react';

interface Props {
    component: Promise<React.ComponentClass<any>>;
    [k: string]: any;
}

interface State {
    component: React.ComponentClass<any> | null;
}

export default class AsyncLoad extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            component: null,
        };
        this.onResolve();
    }

    render(): JSX.Element | null {
        const Component = this.state.component;
        const { component, ...props } = this.props;
        return Component === null ? null : <Component {...props} />;
    }

    private async onResolve(): Promise<void> {
        this.props.component.then(component => {
            this.setState(prevState => ({ ...prevState, component }));
        });
    }
}
