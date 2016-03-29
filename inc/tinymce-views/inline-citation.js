var InlineCitationWindow = (function () {
    function InlineCitationWindow() {
        this.editorContent = top.tinymce.activeEditor.dom.doc.body;
        var test = this.editorContent.children;
        for (var i = test.length - 1; i > 0; i--) {
            if (test[i].tagName === 'OL') {
                this.refList = test[i];
                break;
            }
        }
        console.log(this.refList);
    }
    return InlineCitationWindow;
}());
new InlineCitationWindow;
