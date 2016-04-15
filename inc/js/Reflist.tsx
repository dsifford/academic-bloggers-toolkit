import * as React from 'react'
import * as ReactDOM from 'react-dom'

declare var tinyMCE: tinyMCE;

interface State {
    loading: boolean
    references: string[]
}

class Reflist extends React.Component<{}, State> {

    private bib: HTMLOListElement;

    constructor() {
        super();
        this.state = {
            loading: true,
            references: [],
        };
    }

    componentDidMount() {
        setTimeout(this.gatherReferences.bind(this), 500);
        addEventListener('REFERENCE_ADDED', this.testEvent.bind(this));
    }

    componentWillUnmount() {
        removeEventListener('REFERENCE_ADDED', this.testEvent);
    }

    testEvent(e) {
        this.setState(
            Object.assign({}, this.state, {
                references: [
                    ...this.state.references,
                    e.detail
                ]
            })
        )
    }

    gatherReferences() {
        this.bib = tinyMCE.activeEditor.dom.doc.getElementById('abt-smart-bib');
        let children = this.bib.children;
        let references: string[] = [];
        for (let i = 0; i < children.length; i++) {
            references.push(children[i].innerHTML);
        }
        this.setState({
            loading: false,
            references
        });
    }

    render() {

        if (this.state.loading) {
            return(
                <div>
                    <h1>Loading...</h1>
                </div>
            );
        }

        return (
            <div>
                {
                    this.state.references.map((r: string, i: number) =>
                        <div
                            key={i}
                            style={{ borderBottom: '1px solid #E5E5E5', padding: '5px 0', }}>
                            <strong>{i+1}. </strong><span dangerouslySetInnerHTML={{__html: r}}/>
                        </div>
                    )
                }
            </div>
        )
    }
}





ReactDOM.render(
    <Reflist />,
    document.getElementById('abt-reflist')
);
