import * as React from 'react';
import { Card } from './Card';

interface Props {
    readonly uncited: CSL.Data[];
    readonly selected: string[];
    readonly onClick: (id: string, isSelected: boolean) => any;
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
                                    key={r.id}
                                    CSL={r}
                                    isSelected={selected.indexOf(r.id) > -1}
                                    id={r.id}
                                    click={onClick} />
                            )
                        }
                    </div>
                }
            </div>
        );
    }
}
