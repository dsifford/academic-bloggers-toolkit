import { observer } from 'mobx-react';
import React from 'react';
import { SuggestionSelectedEventData } from 'react-autosuggest';

import UIStore from 'stores/ui/reference-list';
import { MenuActionType } from 'utils/constants';

import Button from 'components/button';
import StyleInput from 'components/style-input';

import Styles from './menu.scss';

export type MenuAction = StyleTypeChange | MenuButtonClick;

type MenuButtonKind =
    | MenuActionType.DESTROY_PROCESSOR
    | MenuActionType.INSERT_STATIC_BIBLIOGRAPHY
    | MenuActionType.OPEN_IMPORT_DIALOG
    | MenuActionType.REFRESH_PROCESSOR;

interface StyleTypeChange {
    kind: MenuActionType.CHANGE_STYLE;
    data: ABT.CitationStyle;
}

interface MenuButtonClick {
    kind: MenuButtonKind;
}

type SSED = SuggestionSelectedEventData<ABT.CitationStyle>;

interface Props {
    data: {
        citationStyle: ABT.CitationStyle;
    };
    ui: UIStore;
    onSubmit(action: MenuAction): void;
}

@observer
export default class Menu extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.reference_list.menu;
    static readonly styles: ABT.CitationStyle[] = [
        ...top.ABT.styles.styles,
        ...(top.ABT.options.citation_style.kind === 'custom'
            ? [top.ABT.options.citation_style]
            : []),
    ];
    static getSuggestionValue = ({ label }: ABT.CitationStyle): string => label;

    handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const menuAction: MenuAction = {
            kind: e.currentTarget.id as MenuButtonKind,
        };
        this.props.onSubmit(menuAction);
    };

    handleStyleChange = (_e: any, { suggestion }: SSED): void => {
        const data: MenuAction = {
            kind: MenuActionType.CHANGE_STYLE,
            data: suggestion,
        };
        this.props.onSubmit(data);
    };

    render(): JSX.Element {
        return (
            <div className={Styles.menuContainer}>
                <div className={Styles.subpanel}>
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
                <StyleInput
                    styles={Menu.styles}
                    currentStyle={this.props.data.citationStyle}
                    onSelected={this.handleStyleChange}
                />
            </div>
        );
    }
}
