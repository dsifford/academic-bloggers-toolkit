import * as React from 'react';
import { Card } from './Card';

interface Props {
    readonly uncited: [string, CSL.Data][];
    readonly selected: string[];
    readonly onClick: Function;
}

interface State {
    readonly showUncited: boolean;
}

export class UncitedList extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            showUncited: false,
        };
    }

    toggle = () => {
        this.setState(
            Object.assign({}, this.state, {
                showUncited: !this.state.showUncited,
            })
        );
    }

    render() {
        const { uncited, selected, onClick } = this.props;
        return (
            <div>
                <div className='group-label' onClick={this.toggle}>
                    <div children='Uncited Items' />
                    <div className='badge' children={uncited.length} />
                </div>
                { this.state.showUncited &&
                    <div className='list uncited'>
                        {
                            uncited.map(r =>
                                <Card
                                    key={r[0]}
                                    html={r[1].title}
                                    isSelected={selected.indexOf(r[0]) > -1}
                                    onClick={onClick.bind(null, r[0], selected.indexOf(r[0]) > -1)} />
                            )
                        }
                    </div>
                }
            </div>
        );
    }
}
