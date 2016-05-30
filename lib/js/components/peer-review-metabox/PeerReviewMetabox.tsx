import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReviewRow, } from './ReviewRow';
import { abtPRFieldMapping, } from '../../utils/Constants';

declare var wp;

interface DOMEvent extends Event {
    target: HTMLInputElement;
}

interface Props {
    data: ABT.PRMetaPayload;
}

export class PeerReviewMetabox extends React.Component<Props, ABT.PRMetaState> {

    private optionText: string[] = [
        'Select Number of Reviewers',
        'One Reviewer',
        'Two Reviewers',
        'Three Reviewers',
    ];

    private blankState: ABT.PRMetaState = abtPRFieldMapping;

    constructor(props) {
        super(props);
        wp.media.frames.abt_reviewer_photos = {
            1: {
                review: null,
                response: null,
            },
            2: {
                review: null,
                response: null,
            },
            3: {
                review: null,
                response: null,
            },
        };

        let state: ABT.PRMetaState = Object.assign({}, this.blankState, {
            hidden: {
                1: this.props.data['1'].response.name === ''
                    || !this.props.data['1'].response.name,
                2: this.props.data['2'].response.name === ''
                    || !this.props.data['2'].response.name,
                3: this.props.data['3'].response.name === ''
                    || !this.props.data['3'].response.name,
            },
        });

        if (this.props.data.selection) {
            state.selection = this.props.data.selection;
        }

        for (let i = 1; i < 4; i++) {
            state[i].heading.value = this.props.data[i].heading;
            if (!Array.isArray(this.props.data[i].review)) {
                Object.keys(this.props.data[i].review).forEach(key => {
                    state[i].review[key] = this.props.data[i].review[key];
                });
            }
            if (!Array.isArray(this.props.data[i].response)) {
                Object.keys(this.props.data[i].response).forEach(key => {
                    state[i].response[key] = this.props.data[i].response[key];
                });
            }
        }

        this.state = state;
    }

    handleSelectChange(e: DOMEvent) {
        this.setState(
            Object.assign({}, this.state, {
                selection: e.target.value,
            })
        );
    }

    handleInputChange(topfield: string, fieldname: string, num: number, e: DOMEvent) {
        let newState = Object.assign({}, this.state);
        newState[num][topfield][fieldname] = e.target.value;
        this.setState(newState);
    }

    toggleHidden(num: number, e: DOMEvent) {
        let newState = Object.assign({}, this.state);
        newState.hidden[num] = !newState.hidden[num];
        this.setState(newState);
    }

    handleUpload(topfield: string, num: number, e: DOMEvent) {

        if (wp.media.frames.abt_reviewer_photos[num][topfield]) {
            wp.media.frames.abt_reviewer_photos[num][topfield].open();
            return;
        }

        wp.media.frames.abt_reviewer_photos[num][topfield] = new wp.media({
            title: 'Choose or Upload an Image',
            button: { text:  'Use this image', },
            library: { type: 'image', },
        });

        wp.media.frames.abt_reviewer_photos[num][topfield].on('select', () => {
            let mediaAttachment = wp.media.frames.abt_reviewer_photos[num][topfield]
                .state().get('selection').first().toJSON();
            let newState = Object.assign({}, this.state);
            newState[num][topfield].image = mediaAttachment.url;
            this.setState(newState);
        });

        wp.media.frames.abt_reviewer_photos[num][topfield].open();
    }


    render() {
        return (
            <div>
                <select
                    style={{ width: '100%', }}
                    value={this.state.selection}
                    name='reviewer_selector'
                    onChange={this.handleSelectChange.bind(this)}>
                    {
                        this.optionText.map((text: string, i: number) =>
                            <option key={i} value={i}>{text}</option>
                        )
                    }
                </select>
                { ['1', '2', '3', ].indexOf(this.state.selection) > -1 &&
                    <div>
                        <h3 children='Review 1' />
                        <ReviewRow
                            rowData={this.state['1']}
                            num='1'
                            onChange={this.handleInputChange.bind(this)}
                            hidden={this.state.hidden['1']}
                            toggleHidden={this.toggleHidden.bind(this)}
                            uploadHandler={this.handleUpload.bind(this)} />
                    </div>
                }
                { ['2', '3', ].indexOf(this.state.selection) > -1 &&
                    <div>
                        <h3 children='Review 2' />
                        <ReviewRow
                            rowData={this.state['2']}
                            num='2'
                            onChange={this.handleInputChange.bind(this)}
                            hidden={this.state.hidden['2']}
                            toggleHidden={this.toggleHidden.bind(this)}
                            uploadHandler={this.handleUpload.bind(this)} />
                    </div>
                }
                { this.state.selection === '3' &&
                    <div>
                        <h3 children='Review 3' />
                        <ReviewRow
                            rowData={this.state['3']}
                            num='3'
                            onChange={this.handleInputChange.bind(this)}
                            hidden={this.state.hidden['3']}
                            toggleHidden={this.toggleHidden.bind(this)}
                            uploadHandler={this.handleUpload.bind(this)} />
                    </div>
                }
            </div>
        );
    }
}
