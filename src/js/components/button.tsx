import { oneLine } from 'common-tags';
import * as React from 'react';

import { colors, outline, shadows, transitions } from 'utils/styles';

import Tooltip, { TooltipParentProp, TooltipParentState } from 'components/tooltip';

interface Props extends React.HTMLProps<HTMLButtonElement> {
    /** Flat button variant */
    flat?: boolean;
    /** Should button have focus outline? */
    focusable?: boolean;
    /** Dashicon to use for button */
    icon?: Dashicon;
    /** Button aria-label if icon button, otherwise button text */
    label: string;
    /** Primary button variant */
    primary?: boolean;
    /** Information describing the tooltip if one is needed */
    tooltip?: TooltipParentProp;
    onClick?(e: React.MouseEvent<HTMLButtonElement>): void;
}

type State = TooltipParentState;

export default class Button extends React.PureComponent<Props, State> {
    static defaultProps: Partial<Props> = {
        type: 'button',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            isShowingTooltip: false,
            transform: '',
        };
    }

    hideTooltip = (): void => {
        this.setState(prev => ({ ...prev, isShowingTooltip: false }));
    };

    openLink = (): void => {
        window.open(this.props.href, '_blank');
    };

    showTooltip = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const { position } = this.props.tooltip!;
        const rect = e.currentTarget.getBoundingClientRect();
        this.setState(() => ({
            transform: Tooltip.transform(position, rect),
            isShowingTooltip: true,
        }));
    };

    // Below is disabled because the class fallbacks aren't complexity-adding.
    // tslint:disable-next-line cyclomatic-complexity
    render(): JSX.Element {
        const {
            flat,
            focusable,
            href,
            icon,
            label,
            onClick,
            primary,
            tooltip,
            ...buttonProps,
        } = this.props;
        const { isShowingTooltip, transform } = this.state;
        const btnClass = oneLine`
            ${focusable ? 'focusable' : ''}
            ${primary ? 'btn-primary' : ''}
            ${flat ? 'btn-flat' : ''}
            ${icon ? 'btn-icon' : ''}
        `;
        const tipId = label.replace(/\s/g, '_');
        return (
            <div>
                {tooltip && (
                    <Tooltip
                        active={isShowingTooltip}
                        id={tipId}
                        text={tooltip.text}
                        transform={transform}
                    />
                )}
                <button
                    {...buttonProps}
                    aria-describedby={tooltip ? tipId : undefined}
                    aria-label={icon ? label : undefined}
                    className={btnClass}
                    onMouseEnter={tooltip ? this.showTooltip : undefined}
                    onMouseLeave={tooltip ? this.hideTooltip : undefined}
                    onClick={href ? this.openLink : onClick}
                >
                    {icon ? <span className={`dashicons dashicons-${icon}`} /> : label}
                </button>
                <style jsx>{`
                    button {
                        -webkit-appearance: none;
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        background: white;
                        box-sizing: border-box;
                        color: ${colors.dark_gray};
                        background-image: none;
                        border: none;
                        border-radius: 2px;
                        box-shadow: ${shadows.depth_1};
                        cursor: pointer;
                        display: inline-block;
                        font-size: 13px;
                        font-weight: 500;
                        height: 36px;
                        line-height: 36px;
                        min-width: 64px;
                        outline: 0;
                        padding: 0 16px;
                        text-align: center;
                        text-decoration: none;
                        text-transform: uppercase;
                        transition: ${transitions.buttons};
                        vertical-align: middle;
                        white-space: nowrap;
                    }
                    button:hover {
                        box-shadow: ${shadows.depth_2};
                    }
                    button:active {
                        box-shadow: ${shadows.depth_2};
                    }
                    button:active:hover {
                        box-shadow: ${shadows.depth_3};
                        background: ${colors.border};
                    }
                    button:disabled {
                        pointer-events: none !important;
                        color: ${colors.disabled} !important;
                    }
                    button.focusable:focus {
                        outline: ${outline};
                        outline-offset: 2px;
                    }
                    button.focusable:focus:active {
                        outline: 0;
                    }
                    .btn-flat,
                    .btn-flat.btn-primary {
                        background: rgba(0, 0, 0, 0);
                        box-shadow: none !important;
                    }
                    .btn-flat:hover,
                    .btn-flat.btn-primary:hover {
                        background: rgba(158, 158, 158, 0.2);
                    }
                    .btn-flat:active,
                    .btn-flat.btn-primary:active {
                        background: ${colors.border.lighten(5)};
                    }
                    .btn-flat:hover:active,
                    .btn-flat.btn-primary:hover:active {
                        background: ${colors.border};
                    }
                    .btn-flat.btn-primary {
                        color: ${colors.blue};
                    }
                    .btn-primary {
                        background: ${colors.blue};
                        color: white;
                    }
                    .btn-primary:active:hover {
                        background: ${colors.blue.darken(3)};
                    }
                    .btn-primary:disabled {
                        opacity: 0.6;
                        box-shadow: none;
                        color: white !important;
                    }
                    .btn-icon {
                        border-radius: 50%;
                        font-size: 24px;
                        height: 32px;
                        margin: auto 0;
                        min-width: 32px;
                        width: 32px;
                        padding: 0;
                        line-height: normal;
                    }
                    .btn-icon:hover {
                        color: ${colors.dark_gray};
                    }

                    .dashicons {
                        line-height: 32px !important;
                        width: 32px;
                        height: 32px;
                    }
                    .dashicons-migrate {
                        transform: rotateY(180deg);
                        padding-left: 5px;
                    }
                    .dashicons-minus {
                        font-weight: 900;
                    }
                    .dashicons-menu,
                    .dashicons-no-alt {
                        font-size: 25px;
                    }
                    .dashicons-plus {
                        padding-top: 2px;
                    }
                `}</style>
            </div>
        );
    }
}

/** All available Dashicon types */
type Dashicon =
    | 'admin-appearance'
    | 'admin-collapse'
    | 'admin-comments'
    | 'admin-customizer'
    | 'admin-generic'
    | 'admin-home'
    | 'admin-links'
    | 'admin-media'
    | 'admin-multisite'
    | 'admin-network'
    | 'admin-page'
    | 'admin-plugins'
    | 'admin-post'
    | 'admin-settings'
    | 'admin-site-alt'
    | 'admin-site-alt2'
    | 'admin-site-alt3'
    | 'admin-site'
    | 'admin-tools'
    | 'admin-users'
    | 'album'
    | 'align-center'
    | 'align-left'
    | 'align-none'
    | 'align-right'
    | 'analytics'
    | 'archive'
    | 'arrow-down-alt'
    | 'arrow-down-alt2'
    | 'arrow-down'
    | 'arrow-left-alt'
    | 'arrow-left-alt2'
    | 'arrow-left'
    | 'arrow-right-alt'
    | 'arrow-right-alt2'
    | 'arrow-right'
    | 'arrow-up-alt'
    | 'arrow-up-alt2'
    | 'arrow-up'
    | 'art'
    | 'awards'
    | 'backup'
    | 'book-alt'
    | 'book'
    | 'buddicons-activity'
    | 'buddicons-buddypress-logo'
    | 'buddicons-community'
    | 'buddicons-forums'
    | 'buddicons-friends'
    | 'buddicons-groups'
    | 'buddicons-pm'
    | 'buddicons-replies'
    | 'buddicons-topics'
    | 'buddicons-tracking'
    | 'buddipress-bbpress-logo'
    | 'building'
    | 'businessman'
    | 'calendar-alt'
    | 'calendar'
    | 'camera'
    | 'carrot'
    | 'cart'
    | 'category'
    | 'chart-area'
    | 'chart-bar'
    | 'chart-line'
    | 'chart-pie'
    | 'clipboard'
    | 'clock'
    | 'cloud'
    | 'controls-back'
    | 'controls-forward'
    | 'controls-pause'
    | 'controls-play'
    | 'controls-repeat'
    | 'controls-skipback'
    | 'controls-skipforward'
    | 'controls-volumeoff'
    | 'controls-volumeon'
    | 'dashboard'
    | 'desktop'
    | 'dismiss'
    | 'download'
    | 'edit'
    | 'editor-aligncenter'
    | 'editor-alignleft'
    | 'editor-alignright'
    | 'editor-bold'
    | 'editor-break'
    | 'editor-code'
    | 'editor-contract'
    | 'editor-customchar'
    | 'editor-expand'
    | 'editor-help'
    | 'editor-indent'
    | 'editor-insertmore'
    | 'editor-italic'
    | 'editor-justify'
    | 'editor-kitchensink'
    | 'editor-ol'
    | 'editor-outdent'
    | 'editor-paragraph'
    | 'editor-paste-text'
    | 'editor-paste-word'
    | 'editor-quote'
    | 'editor-removeformatting'
    | 'editor-rtl'
    | 'editor-spellcheck'
    | 'editor-strikethrough'
    | 'editor-table'
    | 'editor-textcolor'
    | 'editor-ul'
    | 'editor-underline'
    | 'editor-unlink'
    | 'editor-video'
    | 'email-alt'
    | 'email-alt2'
    | 'email'
    | 'excerpt-view'
    | 'external'
    | 'facebook-alt'
    | 'facebook'
    | 'feedback'
    | 'filter'
    | 'flag'
    | 'format-aside'
    | 'format-audio'
    | 'format-chat'
    | 'format-gallery'
    | 'format-image'
    | 'format-quote'
    | 'format-status'
    | 'format-video'
    | 'forms'
    | 'googleplus'
    | 'grid-view'
    | 'groups'
    | 'hammer'
    | 'heart'
    | 'hidden'
    | 'id-alt'
    | 'id'
    | 'image-crop'
    | 'image-filter'
    | 'image-flip-horizontal'
    | 'image-flip-vertical'
    | 'image-rotate-left'
    | 'image-rotate-right'
    | 'image-rotate'
    | 'images-alt'
    | 'images-alt2'
    | 'index-card'
    | 'info'
    | 'laptop'
    | 'layout'
    | 'leftright'
    | 'lightbulb'
    | 'list-view'
    | 'location-alt'
    | 'location'
    | 'lock'
    | 'marker'
    | 'media-archive'
    | 'media-audio'
    | 'media-code'
    | 'media-default'
    | 'media-document'
    | 'media-interactive'
    | 'media-spreadsheet'
    | 'media-text'
    | 'media-video'
    | 'megaphone'
    | 'menu-alt'
    | 'menu'
    | 'microphone'
    | 'migrate'
    | 'minus'
    | 'money'
    | 'move'
    | 'nametag'
    | 'networking'
    | 'no-alt'
    | 'no'
    | 'palmtree'
    | 'paperclip'
    | 'performance'
    | 'phone'
    | 'playlist-audio'
    | 'playlist-video'
    | 'plus-alt'
    | 'plus-light'
    | 'plus'
    | 'portfolio'
    | 'post-status'
    | 'pressthis'
    | 'products'
    | 'randomize'
    | 'redo'
    | 'rss'
    | 'schedule'
    | 'screenoptions'
    | 'search'
    | 'share-alt'
    | 'share-alt2'
    | 'share'
    | 'shield-alt'
    | 'shield'
    | 'slides'
    | 'smartphone'
    | 'smiley'
    | 'sort'
    | 'sos'
    | 'star-empty'
    | 'star-filled'
    | 'star-half'
    | 'sticky'
    | 'store'
    | 'tablet'
    | 'tag'
    | 'tagcloud'
    | 'testimonial'
    | 'text'
    | 'thumbs-down'
    | 'thumbs-up'
    | 'tickets-alt'
    | 'tickets'
    | 'translation'
    | 'trash'
    | 'twitter'
    | 'undo'
    | 'universal-access-alt'
    | 'universal-access'
    | 'unlock'
    | 'update'
    | 'upload'
    | 'vault'
    | 'video-alt'
    | 'video-alt2'
    | 'video-alt3'
    | 'visibility'
    | 'warning'
    | 'welcome-add-page'
    | 'welcome-comments'
    | 'welcome-learn-more'
    | 'welcome-view-site'
    | 'welcome-widgets-menus'
    | 'welcome-write-blog'
    | 'wordpress-alt'
    | 'wordpress'
    | 'yes';
