import { IconButton } from '@wordpress/components';
import { Component } from '@wordpress/element';
import classNames from 'classnames';

import styles from './style.scss';

interface PersonProps {
    people: Array<{
        type: string;
        label: string;
    }>;
}

interface PersonState {
    isLiteral: boolean;
}

export default class Person extends Component<PersonProps, PersonState> {
    state = {
        isLiteral: false,
    };
    render() {
        const { isLiteral } = this.state;
        const { people } = this.props;
        return (
            <div
                role="group"
                className={classNames(styles.person, {
                    [styles.personLiteral]: isLiteral,
                })}
            >
                <select name="person">
                    {people.map(({ type, label }) => (
                        <option key={type} value={type}>
                            {label}
                        </option>
                    ))}
                </select>
                <input required type="text" name="family" />
                {!isLiteral && <input required type="text" name="given" />}
                <input
                    type="hidden"
                    name="person-literal"
                    value={isLiteral ? 1 : 0}
                />
                <IconButton
                    type="button"
                    icon={isLiteral ? 'groups' : 'admin-users'}
                    onClick={() =>
                        this.setState(state => ({
                            isLiteral: !state.isLiteral,
                        }))
                    }
                />
            </div>
        );
    }
}
