import { action, computed, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { spring, TransitionMotion } from 'react-motion';
import VSelect from 'react-virtualized-select';

import { MenuActionType } from 'utils/constants';

import Button from 'components/button';

type MenuButtonKind =
    | MenuActionType.DESTROY_PROCESSOR
    | MenuActionType.INSERT_STATIC_BIBLIOGRAPHY
    | MenuActionType.OPEN_IMPORT_DIALOG
    | MenuActionType.REFRESH_PROCESSOR;

interface StyleTypeChange {
    kind: MenuActionType.CHANGE_STYLE;
    data: string;
}

interface MenuButtonClick {
    kind: MenuButtonKind;
}

export type MenuAction = StyleTypeChange | MenuButtonClick;

interface Props {
    isOpen: IObservableValue<boolean>;
    cslStyle: IObservableValue<string>;
    itemsSelected: boolean;
    onSubmit(action: MenuAction): void;
}

interface StyleOption {
    label: string;
    value: string;
}

const openedStyle = [
    {
        key: 'menu',
        style: {
            height: spring(85, { stiffness: 300, damping: 20 }),
            scale: spring(1, { stiffness: 300, damping: 20 }),
        },
    },
];

@observer
export default class Menu extends React.PureComponent<Props> {
    static readonly labels = top.ABT_i18n.referenceList.menu;

    static willEnter() {
        return {
            height: 0,
            scale: 0,
        };
    }

    static willLeave() {
        return {
            height: spring(0, { stiffness: 300, damping: 25 }),
            scale: spring(0, { stiffness: 300, damping: 25 }),
        };
    }

    readonly styles: StyleOption[];

    @computed
    get selected() {
        return {
            label: this.styles.find(d => d.value === this.props.cslStyle.get())!.label,
            value: this.props.cslStyle.get(),
        };
    }

    constructor(props: Props) {
        super(props);

        /**
         * ABT_Custom_CSL.value is `null` if there is either no provided file path
         * or if the path to the file is invalid.
         */
        if (ABT_Custom_CSL.value === null) {
            this.styles = ABT_CitationStyles;
        } else {
            this.styles = [
                { label: 'Custom Style', value: 'header' },
                { label: ABT_Custom_CSL.label, value: ABT_Custom_CSL.value! },
                { label: 'Pre-defined Styles', value: 'header' },
                ...ABT_CitationStyles,
            ];
        }
    }

    @action
    toggleMenu = () => {
        this.props.isOpen.set(false);
    };

    handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.toggleMenu();
        const menuAction: MenuAction = {
            kind: e.currentTarget.id as MenuButtonKind,
        };
        this.props.onSubmit(menuAction);
    };

    handleSelect = (data: StyleOption | never[]) => {
        if (Array.isArray(data)) return;
        const menuAction: MenuAction = {
            kind: MenuActionType.CHANGE_STYLE,
            data: data.value,
        };
        this.props.onSubmit(menuAction);
        this.forceUpdate();
    };

    render() {
        const transitionStyle = this.props.isOpen.get() ? openedStyle : [];
        return (
            <TransitionMotion
                willLeave={Menu.willLeave}
                willEnter={Menu.willEnter}
                styles={transitionStyle}
            >
                {styles =>
                    styles.length > 0
                        ? (
                              <div
                                  key={styles[0].key}
                                  className="menu"
                                  style={{
                                      height: styles[0].style.height,
                                      maxHeight: styles[0].style.height,
                                      opacity: styles[0].style.opacity,
                                      transform: `scaleY(${styles[0].style.scale})`,
                                      transformOrigin: 'top',
                                  }}
                              >
                                  <div className="subpanel">
                                      <Button
                                          flat
                                          id={MenuActionType.OPEN_IMPORT_DIALOG}
                                          icon="media-code"
                                          label={Menu.labels.tooltips.importRIS}
                                          tooltip={{
                                              text: Menu.labels.tooltips.importRIS,
                                              position: 'bottom',
                                          }}
                                          onClick={this.handleClick}
                                      />
                                      <Button
                                          flat
                                          id={MenuActionType.REFRESH_PROCESSOR}
                                          icon="update"
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
                                          disabled={!this.props.itemsSelected}
                                          id={MenuActionType.INSERT_STATIC_BIBLIOGRAPHY}
                                          icon="list-view"
                                          label={Menu.labels.tooltips.staticPubList}
                                          tooltip={{
                                              text: Menu.labels.tooltips.staticPubList,
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
                                  <div className="style-row">
                                      <VSelect
                                          id="style-select"
                                          onChange={this.handleSelect}
                                          value={this.selected}
                                          optionRenderer={renderer}
                                          optionHeight={dynamicOptionHeightHandler}
                                          options={this.styles}
                                          clearable={false}
                                      />
                                  </div>
                                  <style jsx>{`
                                      .menu {
                                          padding: 0;
                                          position: relative;
                                          z-index: 555;
                                      }
                                      .subpanel {
                                          display: flex;
                                          padding: 5px 0;
                                          justify-content: space-around;
                                      }
                                      .style-row {
                                          padding: 0 5px;
                                      }
                                  `}</style>
                              </div>
                          ) as any
                        : null}
            </TransitionMotion>
        );
    }
}

export function dynamicOptionHeightHandler({ option }: { option: StyleOption }) {
    switch (true) {
        case option.label.length > 110:
            return 90;
        case option.label.length > 90:
            return 70;
        case option.label.length > 80:
            return 60;
        case option.label.length > 65:
            return 50;
        case option.label.length > 35:
            return 40;
        default:
            return 30;
    }
}

interface RendererParams {
    focusedOption: any;
    focusOption: (p?: any) => void;
    option: any;
    selectValue: (p?: any) => void;
    key?: string;
    style: any;
}

/**
 * Custom render function for React Virtualized Select
 * @param  {Object} focusedOption The option currently focused in the dropdown
 * @param  {Function} focusOption Callback to update the focused option. (on mouseover)
 * @param  {Object} option        The option to be rendered
 * @param  {Function} selectValue Callback to update the selected values. (on click)
 */
export function renderer({
    focusedOption,
    focusOption,
    key,
    option,
    selectValue,
    style,
}: RendererParams) {
    style.alignItems = 'center';
    style.fontWeight = 300;
    style.cursor = 'default';
    style.borderBottom = '1px solid #ddd';
    style.display = 'flex';
    style.padding = '0 5px';

    if (option.value === 'header') {
        style.backgroundColor = '#eee';
        style.fontWeight = 400;
        style.height = 30;
        style.cursor = 'default';
        return <div key={key} style={style} children={option.label} />;
    }

    switch (true) {
        case option.label.length > 110:
            style.height = 90;
            break;
        case option.label.length > 90:
            style.height = 70;
            break;
        case option.label.length > 80:
            style.height = 60;
            break;
        case option.label.length > 65:
            style.height = 50;
            break;
        case option.label.length > 35:
            style.height = 40;
            break;
        default:
            style.height = 30;
    }

    if (option === focusedOption) {
        style.backgroundColor = '#f5f5f5';
    }

    const click = () => selectValue(option);
    const focus = () => focusOption(option);

    return (
        <div
            key={key}
            style={style}
            role="option"
            aria-selected={option === focusedOption}
            onClick={click}
            onMouseOver={focus}
            children={option.label}
        />
    );
}
