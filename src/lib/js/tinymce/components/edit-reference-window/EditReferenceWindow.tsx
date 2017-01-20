import * as React from 'react';
import { observable, action, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { People } from '../reference-window/components/People';
import { MetaFields } from '../reference-window/components/MetaFields';
import { Modal } from '../../../utils/Modal';
import { PERSON_TYPE_KEYS, DATE_TYPE_KEYS } from '../../../utils/Constants';
import DevTools from '../../../utils/DevTools';

const DevTool = DevTools();

@observer
export class EditReferenceWindow extends React.Component<{}, {}> {

    labels = top.ABT_i18n.tinymce.editReferenceWindow;
    modal: Modal = new Modal(this.labels.title);
    params = top.tinyMCE.activeEditor.windowManager.windows[0].settings.params;

    @observable
    people = observable<CSL.TypedPerson>([]);

    @observable
    primitives = observable.map<string>();

    @observable
    loading = true;

    constructor(props) {
        super(props);
        this.initialize();
    }

    componentDidMount() {
        this.modal.resize();
        reaction(
            () => [this.people.length, this.loading],
            () => this.modal.resize(),
            { fireImmediately: false, delay: 100 },
        );
    }

    @action
    initialize = () => {
        for (const key of Object.keys(this.params.reference)) {
            if (typeof this.params.reference[key] !== 'object') {
                this.primitives.set(key, `${this.params.reference[key]}`);
            }
            if (DATE_TYPE_KEYS.indexOf(key) > -1) {
                this.primitives.set(key, this.params.reference[key]['date-parts'][0].join('/'));
            }
            if (PERSON_TYPE_KEYS.indexOf(key) > -1) {
                for (const person of this.params.reference[key]) {
                    const p: CSL.TypedPerson = {...person, type: key};
                    this.people.push(p);
                }
            }
        }
        this.loading = false;
    }

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const wm = top.tinyMCE.activeEditor.windowManager;
        wm.setParams({
            data: {
                manualData: this.primitives.toJS(),
                people: this.people.slice(),
            }
        });
        wm.close();
    }

    render() {
        if (this.loading) return null;

        return (
            <form onSubmit={this.handleSubmit}>
                <DevTool />
                <People
                    citationType={this.primitives.get('type') as CSL.CitationType}
                    people={this.people}
                />
                <MetaFields meta={this.primitives} />
                <div id="button-row" className="row" style={{justifyContent: 'flex-end'}}>
                    <div>
                        <input
                            id="submit-btn"
                            type="submit"
                            className="abt-btn abt-btn_submit"
                            value={this.labels.confirm}
                        />
                    </div>
                </div>
            </form>
        );
    }
}
