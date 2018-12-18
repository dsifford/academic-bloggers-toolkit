import { Button } from '@wordpress/components';
import { Component } from '@wordpress/element';

import Person from './person';
import styles from './style.scss';

interface Props {
    people: Array<{
        type: string;
        label: string;
    }>;
}

interface State {
    count: number;
}

export default class PersonFields extends Component<Props, State> {
    state = {
        count: 1,
    };
    render() {
        const { count } = this.state;
        const { people } = this.props;
        return (
            <>
                <h2>Contributors</h2>
                <div className={styles.people}>
                    {[...Array(count)].map((_, i) => (
                        <Person people={people} key={i} />
                    ))}
                    <div className={styles.buttons}>
                        <Button
                            isDefault
                            disabled={this.state.count === 0}
                            onClick={() =>
                                this.setState(state => ({
                                    count: state.count - 1,
                                }))
                            }
                        >
                            Remove contributor
                        </Button>
                        <Button
                            isDefault
                            onClick={() =>
                                this.setState(state => ({
                                    count: state.count + 1,
                                }))
                            }
                        >
                            Add contributor
                        </Button>
                    </div>
                </div>
            </>
        );
    }
}
