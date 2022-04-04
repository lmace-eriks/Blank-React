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
    const toolTipRef = useRef<HTMLParagraphElement>(null!);

    const showToolTip = () => {
        // @ts-expect-error
        if (toolTipRef.current.innerHTML.length > 30) {
            // @ts-expect-error
            toolTipRef.current.style.display = "block";
        }
    }

    const hideToolTip = () => {
        // @ts-expect-error
        toolTipRef.current.style.display = "none";
    }

    return (
        <a href={url} style={propStyles.postLinkStyle} className={styles.postLink} onMouseOver={showToolTip} onMouseOut={hideToolTip}>
            <div style={propStyles.postCardStyle} className={styles.postCard}>
                <p className={styles.postTitle}>{title}</p>
                <p ref={toolTipRef} className={styles.toolTip}>{title}</p>
                <img src={image} className={styles.postImage} />
            </div>
        </a>
    )
}

export default PostCard;