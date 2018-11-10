// tslint:disable:max-classes-per-file
import { observable } from 'mobx';

import { DialogType } from '_legacy/dialogs';

class ItemListUI {
    @observable isOpen: boolean;
    @observable maxHeight: string = '400px';
    constructor(isOpen: boolean) {
        this.isOpen = isOpen;
    }
}

export default class UIStore {
    selected = observable<string>([]);
    @observable currentDialog: DialogType = DialogType.NONE;
    @observable pinned = false;
    @observable menuOpen = false;
    @observable loading: boolean;
    cited: ItemListUI;
    uncited: ItemListUI;
    constructor(isLoading: boolean) {
        this.loading = isLoading;
        this.cited = new ItemListUI(true);
        this.uncited = new ItemListUI(false);
    }
}
