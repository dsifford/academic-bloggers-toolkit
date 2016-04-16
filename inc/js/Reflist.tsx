import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { parseInlineCitationString } from './utils/HelperFunctions';

declare var tinyMCE: tinyMCE;

interface State {
    loading: boolean
    references: string[]
    selected: number[]
}

class Reflist extends React.Component<{}, State> {

    private bib: HTMLOListElement;
    private editor: tinyMCEEditor;

    constructor() {
        super();
        this.state = {
            loading: true,
            references: [],
            selected: [],
        };
    }

    componentDidMount() {
        setTimeout(this.gatherReferences.bind(this), 500);
        addEventListener('REFERENCE_ADDED', this.addReference.bind(this));
    }

    componentWillUnmount() {
        removeEventListener('REFERENCE_ADDED', this.addReference);
    }

    addReference(e) {
        this.setState(
            Object.assign({}, this.state, {
                references: [
                    ...this.state.references,
                    e.detail
                ]
            })
        )
    }

    handleClick(e: MouseEvent) {
        let num = parseInt((e.target as HTMLDivElement).dataset['num']);
        let newSelected = [...this.state.selected];
        let i = newSelected.indexOf(num);

        switch (i) {
            case -1:
                newSelected.push(num);
                newSelected.sort((a,b) => a - b);
                break;
            default:
                newSelected = [
                    ...newSelected.slice(0, i),
                    ...newSelected.slice(i + 1)
                ];
        }

        this.setState(
            Object.assign({}, this.state, {
                selected: newSelected
            })
        );
    }

    clearSelection() {
        this.setState(
            Object.assign({}, this.state, {
                selected: []
            })
        );
    }

    insertInline() {
        let citeString = parseInlineCitationString(this.state.selected.map(i => i + 1));
        this.editor.insertContent(`[cite num="${citeString}"]`);
        this.clearSelection();
    }

    dragStart(e: DragEvent) {
        e.dataTransfer.setData('text/plain', (e.target as HTMLDivElement).dataset['num']);
        e.dataTransfer.dropEffect = 'move';
    }

    dragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        (e.target as HTMLDivElement).style.backgroundColor = '#0073AA';
        (e.target as HTMLDivElement).style.color = '#FFF';
    }


    dragLeave(e: DragEvent) {
        e.preventDefault();
        (e.target as HTMLDivElement).style.backgroundColor = '';
        (e.target as HTMLDivElement).style.color = 'inherit';
    }

    drop(e: DragEvent) {
        e.preventDefault();
        (e.target as HTMLDivElement).style.backgroundColor = '';
        (e.target as HTMLDivElement).style.color = 'inherit';
        let before = parseInt(e.dataTransfer.getData('text'));
        let after = parseInt((e.target as HTMLDivElement).dataset['num']);
        let refCard = this.state.references[before];
        let newRefList = [
            ...this.state.references.slice(0, before),
            ...this.state.references.slice(before + 1)
        ];

        newRefList = [
            ...newRefList.slice(0, after),
            refCard,
            ...newRefList.slice(after)
        ];

        this.setState(
            Object.assign({}, this.state, {
                references: newRefList
            })
        );

        this.adjustBibliography(newRefList);

    }

    adjustBibliography(refs: string[]) {
        let doc: HTMLDocument = tinyMCE.activeEditor.dom.doc;
        this.bib.innerHTML = refs.map(r => `<li>${r}</li>`).join('');
    }

    gatherReferences() {
        this.bib = tinyMCE.activeEditor.dom.doc.getElementById('abt-smart-bib');
        this.editor = tinyMCE.activeEditor;
        let children = this.bib.children;
        let references: string[] = [];
        for (let i = 0; i < children.length; i++) {
            references.push(children[i].innerHTML);
        }
        this.setState({
            loading: false,
            references,
            selected: [],
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
                        <Card
                            key={i}
                            dragLeave={this.dragLeave.bind(this)}
                            dragStart={this.dragStart.bind(this)}
                            dragOver={this.dragOver.bind(this)}
                            drop={this.drop.bind(this)}
                            onClick={this.handleClick.bind(this)}
                            isSelected={this.state.selected}
                            num={i}
                            html={r} />
                    )
                }
                <div style={{display: 'flex', paddingTop: '10px'}}>
                    <div style={{flex: 1, textAlign: 'center'}}>
                        <input
                            type='button'
                            style={{minWidth: '75%'}}
                            className='button'
                            value='Insert Inline'
                            disabled={this.state.selected.length === 0}
                            onClick={this.insertInline.bind(this)} />
                    </div>
                    <div style={{flex: 1, textAlign: 'center'}}>
                        <input
                            type='button'
                            style={{minWidth: '75%'}}
                            className='button'
                            value='Clear Selection'
                            disabled={this.state.selected.length === 0}
                            onClick={this.clearSelection.bind(this)} />
                    </div>
                </div>
            </div>
        )
    }
}

interface CardProps extends React.HTMLProps<HTMLDivElement> {
    dragStart()
    dragOver()
    dragLeave()
    drop()
    onClick()
    num: number
    isSelected: number[]
    html: string
}

const Card = (props: CardProps) => {

    const style: React.CSSProperties = {
        borderBottom: '1px solid #E5E5E5',
        padding: '5px',
        cursor: 'pointer',
    }

    const { dragStart, dragOver, dragLeave,
        onClick, drop, num, html, isSelected } = props;

    return (
        <div
            draggable={true}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            onDrop={drop}
            onClick={onClick}
            data-num={num}
            style={
                isSelected.indexOf(num) === -1
                ? style
                : Object.assign({}, style, {
                    backgroundColor: 'rgba(243, 255, 62, 0.2)',
                    textShadow: '0px 0px 0.1px',
                })}>
            <strong children={`${num+1}.`} />
            <span style={{pointerEvents: 'none'}} dangerouslySetInnerHTML={{ __html: html }} data-num={num} />
        </div>
    )
}




ReactDOM.render(
    <Reflist />,
    document.getElementById('abt-reflist')
);
