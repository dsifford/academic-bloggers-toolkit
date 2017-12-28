interface BaseAttribute {
    source: string;
    selector?: string;
}

/**
 * Use `attribute` to extract the value of an attribute from markup.
 */
interface AttributeAttr extends BaseAttribute {
    source: 'attribute';
    attribute: any;
}

/**
 * Use `children` to extract child nodes of the matched element, returned as an
 * array of virtual elements. This is most commonly used in combination with
 * the `Editable` component.
 */
interface ChildrenAttr extends BaseAttribute {
    source: 'children';
}

/**
 * Use `html` to extract the inner HTML from markup.
 */
interface HtmlAttr extends BaseAttribute {
    source: 'html';
}

/**
 * Attributes may be obtained from a post’s meta rather than from the block’s
 * representation in saved post content. For this, an attribute is required to
 * specify its corresponding meta key under the `meta` key.
 */
interface MetaAttribute extends BaseAttribute {
    source: 'meta';
    type: string;
    meta: string;
}

/**
 * Use `query` to extract an array of values from markup. Entries of the array
 * are determined by the selector argument, where each matched element within
 * the block will have an entry structured corresponding to the second
 * argument, an object of attribute sources.
 */
interface QueryAttribute extends BaseAttribute {
    source: 'query';
    query: {
        [k: string]: BlockAttribute;
    };
}

/**
 * Use `text` to extract the inner text from markup.
 */
interface TextAttr extends BaseAttribute {
    source: 'text';
}

type BlockAttribute =
    | AttributeAttr
    | ChildrenAttr
    | HtmlAttr
    | MetaAttribute
    | QueryAttribute
    | TextAttr;

interface BlockAttributes {
    [key: string]: BlockAttribute;
}

interface BlockSupports {
    /**
     * Anchors let you link directly to a specific block on a page. This
     * property adds a field to define an id for the block and a button to copy
     * the direct link.
     * @default false
     */
    anchor?: boolean;
    /**
     * This property adds a field to define a custom
     * className for the block’s wrapper.
     * @default true
     */
    customClassName?: boolean;
    /**
     * By default, Gutenberg adds a class with the form
     * `.wp-block-your-block-name` to the root element of your saved markup. This
     * helps having a consistent mechanism for styling blocks that themes and
     * plugins can rely on. If for whatever reason a class is not desired on
     * the markup, this functionality can be disabled.
     * @default true
     */
    className?: boolean;
    /**
     * By default, Gutenberg will allow a block’s markup to be edited
     * individually.
     * @default true
     */
    html?: boolean;
}

interface EditParams {
    /**
     * This property surfaces all the available attributes and their
     * corresponding values, as described by the `attributes` property when the
     * block type was registered.
     */
    attributes?: BlockAttributes;
    /**
     * This property returns the class name for the wrapper element. This is
     * automatically added in the `save` method, but not on `edit`, as the root
     * element may not correspond to what is visually the main element of the
     * block. You can request it to add it to the correct element in your
     * function.
     */
    className?: string;
    // FIXME: Clarify the shape of this
    /**
     * The focus property is an object that communicates whether the block is
     * currently focused, and which children of the block may be in focus.
     */
    focus?: boolean;
    /**
     * Allows the block to update individual attributes based on user
     * interactions.
     */
    setAttributes?(attrs: { [k: string]: any }): void;
    /**
     * FIXME: update when documentation is added
     */
    setFocus?(): void;
}

interface SaveParams {
    /**
     * It operates the same way as it does on `edit` and allows to save certain
     * attributes directly to the markup, so they don’t have to be computed on
     * the server. This is how most static blocks are expected to work.
     */
    attributes?: BlockAttributes;
}

interface BlockConfiguration {
    /**
     * This is the display title for your block, which can be translated with
     * our translation functions. The block inserter will show this name.
     */
    title: string;
    /**
     * Blocks are grouped into categories to help users browse and discover
     * them.
     */
    category: 'common' | 'formatting' | 'layout' | 'widgets' | 'embed';
    /**
     * An icon property should be specified to make it easier to identify a
     * block. These can be any of WordPress’ Dashicons, or a custom svg
     * element.
     */
    icon?: WordPress.Dashicon | any;
    /**
     * Sometimes a block could have aliases that help users discover it while
     * searching. For example, an image block could also want to be discovered
     * by photo. You can do so by providing an array of terms (which can be
     * translated). It is only allowed to add as much as three terms per block.
     */
    keywords?: string[];
    /**
     * Attributes provide the structured data needs of a block. They can exist
     * in different forms when they are serialized, but they are declared
     * together under a common interface.
     */
    attributes?: BlockAttributes;
    /**
     * TODO: Work in progress
     */
    transforms?: any;
    /**
     * Whether a block can only be used once per post.
     */
    useOnce?: boolean;
    /**
     * Optional block extended support features.
     */
    supports?: BlockSupports;
    /**
     * Describes the structure of your block in the context of the editor. This
     * represents what the editor will render when the block is used.
     */
    edit(params: EditParams): any;
    /**
     * The save function defines the way in which the different attributes
     * should be combined into the final markup, which is then serialized by
     * Gutenberg into `post_content`.
     *
     * This function can return a `null` value, in which case the block is
     * considered to be dynamic—that means that only an HTML comment with
     * attributes is serialized and the server has to provide the render
     * function. (This is the equivalent to purely dynamic shortcodes, with the
     * advantage that the grammar parsing it is assertive and they can remain
     * invisible in contexts that are unable to compute them on the server,
     * instead of showing gibberish as text.)
     */
    save(params: SaveParams): any | null;
}

type GutenbergHook =
    /**
     * Used to filter the block settings. It receives the block settings and the
     * name of the block the registered block as arguments.
     */
    | 'blocks.registerBlockType'
    /**
     * A filter that applies to all blocks returning a WP Element in the save
     * function. This filter is used to add extra props to the root element of the
     * save function. For example: to add a className, an id, or any valid prop for
     * this element. It receives the current props of the save element, the block
     * Type and the block attributes as arguments.
     */
    | 'blocks.getSaveContent.extraProps'
    /**
     * Used to modify the block’s edit component. It receives the original block
     * edit component and returns a new wrapped component.
     */
    | 'blocks.BlockEdit';

interface WP {
    blocks: {
        registerBlockType(blockName: string, block: BlockConfiguration): void;
    };
    element: {
        createElement(): void;
        render(): void;
    };
    hooks: {
        addAction(
            hook: GutenbergHook,
            functionName: string,
            callback: (props: { [k: string]: any }) => void,
            priority?: number,
        ): void;
        addFilter(
            hook: GutenbergHook,
            functionName: string,
            callback: (props: { [k: string]: any }) => void,
            priority?: number,
        ): void;
        createHooks(): WP['hooks'];
        removeAction(hookName: GutenbergHook, functionName: string): void;
        removeFilter(hookName: GutenbergHook, functionName: string): void;
        removeAllActions(hookName: GutenbergHook): void;
        removeAllFilters(hookName: GutenbergHook): void;
        doAction(hookName: GutenbergHook, ...args: any[]): void;
        applyFilters(
            hookName: GutenbergHook,
            content: string,
            ...args: any[]
        ): void;
        doingAction(hookName: GutenbergHook): boolean;
        doingFilter(hookName: GutenbergHook): boolean;
        didAction(hookName: GutenbergHook): boolean;
        didFilter(hookName: GutenbergHook): boolean;
        hasAction(hookName: GutenbergHook): boolean;
        hasFilter(hookName: GutenbergHook): boolean;
        actions: {
            [actionName: string]: Array<{
                handlers: Array<() => void>;
                runs: number;
            }>;
        };
        filters: {
            [filterName: string]: Array<{
                handlers: Array<() => void>;
                runs: number;
            }>;
        };
    };
}

declare const wp: WP;

declare namespace WordPress {
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
}
