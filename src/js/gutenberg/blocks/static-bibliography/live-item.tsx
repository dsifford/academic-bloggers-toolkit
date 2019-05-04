import { RichText } from '@wordpress/block-editor';
import { IconButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import styles from './style.scss';

interface Props {
    id: string;
    content: string;
    onRemove(): void;
    onMoveDown?(): void;
    onMoveUp?(): void;
}

export default function LiveItem({
    id,
    content,
    onRemove,
    onMoveDown,
    onMoveUp,
}: Props) {
    return (
        <div key={id} className={styles.row}>
            <RichText.Content
                className={classNames('csl-entry', styles.item)}
                data-id={id}
                style={{ display: 'list-item' }}
                tagName="div"
                value={content}
            />
            <div className={styles.buttonList}>
                <IconButton
                    disabled={!onMoveUp}
                    icon="arrow-up-alt2"
                    label={__('Move item up', 'academic-bloggers-toolkit')}
                    onClick={onMoveUp}
                />
                <IconButton
                    icon="trash"
                    label={__('Remove item', 'academic-bloggers-toolkit')}
                    onClick={onRemove}
                />
                <IconButton
                    disabled={!onMoveDown}
                    icon="arrow-down-alt2"
                    label={__('Move item down', 'academic-bloggers-toolkit')}
                    onClick={onMoveDown}
                />
            </div>
        </div>
    );
}
