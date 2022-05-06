import React from 'react';
import { useRef, CSSProperties } from 'react';

import styles from "./styles.css";

interface PostCardProps {
    title: string
    image: string
    url: string
    propStyles: propStyles
}

interface propStyles {
    postLinkStyle: CSSProperties
    postCardStyle: CSSProperties
}

const PostCard: StorefrontFunctionComponent<PostCardProps> = ({ title, image, url, propStyles }) => {
    return (
        <a href={url} style={propStyles.postLinkStyle} target="_blank" rel="noreferrer" className={styles.postLink}>
            <div style={propStyles.postCardStyle} className={styles.postCard}>
                <div style={{ backgroundImage: `url(${image})` }} className={styles.titleContainer}>
                    <div className={styles.titleWrapper}>
                        <p className={styles.postTitle}>{title}</p>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default PostCard;