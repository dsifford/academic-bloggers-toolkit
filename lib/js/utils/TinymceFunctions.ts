declare var ABT_locationInfo;

/** TODO */
export const referenceWindow = (editor: TinyMCE.Editor, callback: Function) => {
    editor.windowManager.open({
        title: 'Insert Formatted Reference',
        url: ABT_locationInfo.tinymceViewsURL + 'reference-window.html',
        width: 600,
        height: 10,
        params: {
            baseUrl: ABT_locationInfo.tinymceViewsURL,
            preferredStyle: ABT_locationInfo.preferredCitationStyle,
        },
        onclose: (e) => {
            callback(e.target.params.data as ABT.ReferencePayload);
        },
    } as TinyMCE.WindowMangerObject);
};



interface CitationData {
    currentIndex: number;
    locations: [[string, number][], [string, number][]];
}

/** TODO */
export function getCitationData(editor: TinyMCE.Editor): CitationData {
    const selection = editor.selection;
    const doc: Document = editor.dom.doc;

    const cursor = editor.dom.create('span', { id: 'CURSOR', class: 'abt_cite'});
    selection.getNode().appendChild(cursor);

    const citations = doc.getElementsByClassName('abt_cite');
    const payload: CitationData = {
        currentIndex: 0,
        locations: [[], []],
    };

    if (citations.length > 1) {
        let key = 0;
        Array.from(citations).forEach((el, i) => {
            if (el.id === 'CURSOR') {
                key = 1;
                payload.currentIndex = i;
                return;
            }
            payload.locations[key].push([el.id, i - key]);
        });
    }
    editor.dom.doc.getElementById('CURSOR').remove();
    return payload;
}

/** TODO */
export function insertInlineCitation(editor: TinyMCE.Editor, data) {
    const citation = editor.dom.create('span', {id: data[0][2], class: 'abt_cite noselect mceNonEditable'}, data[0][1]);
    editor.selection.getNode().appendChild(citation);
}
