import { observer } from 'mobx-react';
import React from 'react';

import UIStore from '_legacy/stores/ui/reference-list';
import { MenuActionType } from '_legacy/utils/constants';

import Button from '_legacy/components/button';

import StyleSearch from 'components/style-search';
import { Style, StyleJSON } from 'stores/data';

import styles from './menu.scss';

declare const ABT: {
    styles: StyleJSON;
};

export type MenuAction = StyleTypeChange | MenuButtonClick;

type MenuButtonKind =
    | MenuActionType.DESTROY_PROCESSOR
    | MenuActionType.INSERT_STATIC_BIBLIOGRAPHY
    | MenuActionType.OPEN_IMPORT_DIALOG
    | MenuActionType.REFRESH_PROCESSOR;

interface StyleTypeChange {
    kind: MenuActionType.CHANGE_STYLE;
    data: Style;
}

interface MenuButtonClick {
    kind: MenuButtonKind;
}

interface Props {
    data: {
        citationStyle: Style;
    };
    ui: UIStore;
    onSubmit(action: MenuAction): void;
}

@observer
export default class Menu extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.reference_list.menu;

    handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const menuAction: MenuAction = {
            kind: e.currentTarget.id as MenuButtonKind,
        };
        this.props.onSubmit(menuAction);
    };

    handleStyleChange = (style: Style): void => {
        const data: MenuAction = {
            kind: MenuActionType.CHANGE_STYLE,
            data: style,
        };
        this.props.onSubmit(data);
    };

    render(): JSX.Element {
        return (
            <div className={styles.menuContainer}>
                <div className={styles.subpanel}>
                    <Button
                        flat
                        id={MenuActionType.OPEN_IMPORT_DIALOG}
                        icon="media-code"
                        label={Menu.labels.tooltips.import}
                        tooltip={{
                            text: Menu.labels.tooltips.import,
                            position: 'bottom',
                        }}
                        onClick={this.handleClick}
                    />
                    <Button
                        flat
                        id={MenuActionType.REFRESH_PROCESSOR}
                        icon="image-rotate"
                        label={Menu.labels.tooltips.refresh}
                        tooltip={{
                            text: Menu.labels.tooltips.refresh,
                            position: 'bottom',
                        }}
                        onClick={this.handleClick}
                    />
                    <Button
                        flat
                        id={MenuActionType.DESTROY_PROCESSOR}
                        icon="trash"
                        label={Menu.labels.tooltips.destroy}
                        tooltip={{
                            text: Menu.labels.tooltips.destroy,
                            position: 'bottom',
                        }}
                        onClick={this.handleClick}
                    />
                    <Button
                        flat
                        disabled={!this.props.ui.selected}
                        id={MenuActionType.INSERT_STATIC_BIBLIOGRAPHY}
                        icon="list-view"
                        label={Menu.labels.tooltips.static_publist}
                        tooltip={{
                            text: Menu.labels.tooltips.static_publist,
                            position: 'bottom',
                        }}
                        onClick={this.handleClick}
                    />
                    <Button
                        flat
                        href="https://github.com/dsifford/academic-bloggers-toolkit/wiki"
                        role="link"
                        icon="editor-help"
                        label={Menu.labels.tooltips.help}
                        tooltip={{
                            text: Menu.labels.tooltips.help,
                            position: 'bottom',
                        }}
                    />
                </div>
                <StyleSearch
                    styleJSON={ABT.styles}
                    value={this.props.data.citationStyle}
                    onChange={this.handleStyleChange}
                />
            </div>
        );
    }
}
