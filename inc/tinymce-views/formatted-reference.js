HTMLElement.prototype.showHide = function (option) {
    switch (option) {
        case 'show':
            this.style.display = '';
            break;
        case 'hide':
            this.style.display = 'none';
            break;
        default:
            this.style.display = this.style.display == 'none' ? '' : 'none';
    }
    return this.style.display;
};
var Modal = (function () {
    function Modal() {
        this._getModal();
        this.initialSize = {
            outer: parseInt(this.outer.style.height.substr(0, this.outer.style.height.length - 2)),
            inner: parseInt(this.inner.style.height.substr(0, this.inner.style.height.length - 2)),
        };
    }
    Modal.prototype.resize = function () {
        var height = this.mainRect.getBoundingClientRect().height;
        var position = "calc(50% - " + (height + 66) / 2 + "px)";
        this.outer.style.height = height + 66 + 'px';
        this.inner.style.height = height + 30 + 'px';
        this.outer.style.top = position;
    };
    ;
    Modal.prototype._getModal = function () {
        var outerModalID = top.document.querySelector('div.mce-floatpanel[aria-label="Insert Formatted Reference"]').id;
        var innerModalID = outerModalID + "-body";
        this.outer = top.document.getElementById(outerModalID);
        this.inner = top.document.getElementById(innerModalID);
        this.mainRect = document.getElementById('main-container');
    };
    return Modal;
}());
var ReferenceWindow = (function () {
    function ReferenceWindow() {
        this.modal = new Modal;
        this.buttons = {
            toggleAddManually: document.getElementById('add-manually'),
            addAuthor: document.getElementById('add-author'),
        };
        this.containers = {
            mainContainer: document.getElementById('main-container'),
            pubmedContainer: document.getElementById('pubmed-container'),
            manualContainer: document.getElementById('manual-container'),
        };
        this.form = document.getElementById('main-form');
        this.tables = {
            authorTable: document.getElementById('author-table'),
        };
        this.inputs = {
            pmidInput: document.getElementById('pmid-input'),
            includeLink: document.getElementById('include-link'),
        };
        this.manualComponents = {
            journal: document.getElementById('manual-journal'),
            website: document.getElementById('manual-website'),
            book: document.getElementById('manual-book'),
        };
        this.selections = {
            manualCitationType: document.getElementById('manual-type-selection'),
        };
        this.modal.resize();
        this._addAuthorRow();
        this.buttons.toggleAddManually.addEventListener('click', this._toggleAddManually.bind(this));
        this.buttons.addAuthor.addEventListener('click', this._addAuthorRow.bind(this));
        this.selections.manualCitationType.addEventListener('change', this._manualCitationChange.bind(this));
        this.form.addEventListener('submit', this._submitForm.bind(this));
    }
    ReferenceWindow.prototype._manualCitationChange = function (e) {
        var selection = this.selections.manualCitationType.value;
        for (var key in this.manualComponents) {
            if (key == selection || key == '') {
                continue;
            }
            this.manualComponents[key].showHide('hide');
        }
        if (selection !== '') {
            this.manualComponents[selection].showHide('show');
        }
        this._adjustRequiredFields(selection);
        this.modal.resize();
    };
    ReferenceWindow.prototype._toggleAddManually = function () {
        this.containers.pubmedContainer.showHide();
        this.containers.manualContainer.showHide();
        this.inputs.pmidInput.disabled = !this.inputs.pmidInput.disabled;
        this.inputs.includeLink.disabled = !this.inputs.includeLink.disabled;
        this.selections.manualCitationType.disabled = !this.selections.manualCitationType.disabled;
        if (this.selections.manualCitationType.disabled === true) {
            this._adjustRequiredFields('REQUIRE NONE');
        }
        else {
            this._adjustRequiredFields(this.selections.manualCitationType.value);
        }
        this.buttons.toggleAddManually.value =
            this.buttons.toggleAddManually.value === 'Add Reference Manually'
                ? 'Add Reference with PMID'
                : 'Add Reference Manually';
        this.modal.resize();
    };
    ReferenceWindow.prototype._adjustRequiredFields = function (selection) {
        for (var key in this.manualComponents) {
            var fields = document.querySelectorAll("input[id^=" + key + "-][data-required]");
            var required = key === selection ? true : false;
            for (var i = 0; i < fields.length; i++) {
                document.getElementById(fields[i].id).required = required;
            }
        }
    };
    ReferenceWindow.prototype._addAuthorRow = function () {
        var _this = this;
        var newRow = this.tables.authorTable.insertRow();
        newRow.insertCell().appendChild(document.createTextNode('First Name'));
        var rowNum = this.tables.authorTable.rows.length;
        var firstNameInput = document.createElement('input');
        firstNameInput.type = 'text';
        firstNameInput.id = "author-fname-" + rowNum;
        newRow.insertCell().appendChild(firstNameInput);
        newRow.insertCell().appendChild(document.createTextNode('Last Name'));
        var lastNameInput = document.createElement('input');
        lastNameInput.type = 'text';
        lastNameInput.id = "author-lname-" + rowNum;
        newRow.insertCell().appendChild(lastNameInput);
        var removeRowButton = document.createElement('input');
        removeRowButton.type = 'button';
        removeRowButton.className = 'btn';
        removeRowButton.value = 'x';
        removeRowButton.addEventListener('click', function (e) {
            var row = e.srcElement.parentElement.parentElement;
            row.remove();
            _this.modal.resize();
        });
        newRow.insertCell().appendChild(removeRowButton);
        this.modal.resize();
    };
    ReferenceWindow.prototype._submitForm = function (e) {
        e.preventDefault();
        var wm = top.tinymce.activeEditor.windowManager;
        var formElement = e.srcElement;
        var payload = {};
        var authorList = {};
        for (var i = 0; i < formElement.length; i++) {
            var el = formElement[i];
            if (el.type == 'button'
                || el.type == 'submit'
                || el.value == ''
                || el.disabled) {
                continue;
            }
            if (el.type == 'checkbox') {
                payload[el.id] = el.checked;
                continue;
            }
            if (el.id.search(/^author-fname/) > -1 || el.id.search(/^author-lname/) > -1) {
                var capitalizedName = el.value[0].toUpperCase() + el.value.substr(1).toLowerCase();
                authorList[el.id] = capitalizedName;
                continue;
            }
            payload[el.id] = el.value;
        }
        payload['authors'] = [];
        for (var i = 0; i < (Object.keys(authorList).length / 2); i++) {
            var author = {
                name: authorList[("author-fname-" + (i + 1))] + ' ' + authorList[("author-lname-" + (i + 1))]
            };
            payload['authors'].push(author);
        }
        wm.setParams({ data: payload });
        wm.close();
    };
    return ReferenceWindow;
}());
new ReferenceWindow;
