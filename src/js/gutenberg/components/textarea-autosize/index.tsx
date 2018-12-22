import {
    ChangeEvent,
    ChangeEventHandler,
    Component,
    createRef,
    FocusEvent,
    FocusEventHandler,
    HTMLProps,
} from '@wordpress/element';
import classNames from 'classnames';

import styles from './style.scss';

interface State {
    offset: number;
}

interface Props extends HTMLProps<HTMLTextAreaElement> {
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    onBlur: FocusEventHandler<HTMLTextAreaElement>;
}

export default class Textarea extends Component<Props, State> {
    static defaultProps = {
        onBlur: () => void 0,
        onChange: () => void 0,
    };

    private ref = createRef<HTMLTextAreaElement>();

    componentDidMount() {
        const { current: textarea } = this.ref;
        if (!textarea) {
            return;
        }
        const offset = textarea.offsetHeight - textarea.clientHeight;
        this.setState({ offset });
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + offset}px`;
    }

    render() {
        const { className, ...props } = this.props;
        return (
            <textarea
                {...props}
                className={classNames(styles.textarea, className)}
                ref={this.ref}
                rows={1}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
            />
        );
    }

    private handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
        e.currentTarget.value = e.currentTarget.value.trim();
        this.handleChange(e);
        this.props.onBlur(e);
    };

    private handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { offset } = this.state;
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight +
            offset}px`;
        this.props.onChange(e);
    };
}
