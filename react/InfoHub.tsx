import React from 'react';
import { useState, useEffect, useRef, CSSProperties } from 'react';

// Components
import PostCard from './PostCard';

// Styles
import styles from "./styles.css";

interface InfoHubProps {
  keywordsV2: Array<TopicAndPosts>
}

interface TopicAndPosts {
  topic: string
  posts: Array<PostObject>
}

interface PostObject {
  title: string,
  image: string,
  url: string
}

const InfoHub: StorefrontFunctionComponent<InfoHubProps> = ({ keywordsV2 }) => {
  const postName: string = "Posts";
  const appWrapperRef = useRef<HTMLDivElement>(null!);
  const [infoTopic, setInfoTopic] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Array<PostObject> | undefined>(undefined);
  const [seeMoreSeeLessText, setSeeMoreSeeLessText] = useState<string>(`See More ${postName}`);
  const [seeMoreSeeLessVisible, setSeeMoreSeeLessVisible] = useState<boolean>(false);
  const [appOpen, setAppOpen] = useState<boolean>(false);

  const heightOfPosts: number = 6;
  const gridRowGap: number = 1;
  const heightOfPostRow: number = heightOfPosts;
  const infoTopicFontSize: number = 1.5;
  const numberOfGridColums: number = 3;
  const heightOfSeeMoreSeeLessButton: number = seeMoreSeeLessVisible ? 1.5 : 0;
  const extraPadding: number = 1;
  const appWrapperNaturalHeight: number = infoTopicFontSize + heightOfPosts + gridRowGap + heightOfSeeMoreSeeLessButton;

  const infoTopicStyle: CSSProperties = {
    fontSize: `${infoTopicFontSize}rem`
  }

  const postLinkStyle: CSSProperties = {
    height: `${heightOfPosts}rem`
  }

  const postCardStyle: CSSProperties = {
    height: `${heightOfPosts}rem`
  }

  const postGridSyle: CSSProperties = {
    height: `${heightOfPostRow}rem`,
    gridTemplateColumns: `repeat(${numberOfGridColums}, 1fr)`,
    gridRowGap: `${gridRowGap}rem`
  }

  const seeMoreSeeLessButtonStyle: CSSProperties = {
    height: `${heightOfSeeMoreSeeLessButton}rem`
  }

  const appWrapperStyle: CSSProperties = {
    height: `${appWrapperNaturalHeight}rem`
  }

  useEffect(() => {
    // @ts-expect-error
    const currentUserURL: string = window.location.href;
    const keywordsFoundInURL: Array<TopicAndPosts> = [];

    for (let i = 0; i < keywordsV2.length; i++) {
      const topic = new RegExp(keywordsV2[i].topic, "i");
      console.log(topic);
      const stringFoundBoolean = topic.test(currentUserURL);
      if (stringFoundBoolean) {
        keywordsFoundInURL.push({ topic: keywordsV2[i].topic, posts: keywordsV2[i].posts });
      }
    }

    if (keywordsFoundInURL.length > 0) {
      let postsToShow: Array<PostObject> = [];
      let infoTopicString: string = "";
      for (let i = 0; i < keywordsFoundInURL.length; i++) {
        postsToShow.push(...keywordsFoundInURL[i].posts);
        infoTopicString = infoTopicString === "" ? keywordsFoundInURL[i].topic : infoTopicString + " and " + keywordsFoundInURL[i].topic;
      }
      if (infoTopic != infoTopicString) {
        setInfoTopic(infoTopicString);
        unmountToMountArray(postsToShow);
      }
    } else {
      if (infoTopic != keywordsV2[keywordsV2.length - 1].topic) {
        setInfoTopic(keywordsV2[keywordsV2.length - 1].topic);
        unmountToMountArray(keywordsV2[keywordsV2.length - 1].posts, true);
      }
    }
  });

  const unmountToMountArray = (postsToShow: Array<PostObject>, noKeywordsFound?: boolean) => {
    setAllPosts(undefined);
    setSeeMoreSeeLessText(`See More ${postName}`);

    setTimeout(() => {
      if (noKeywordsFound) {
        // Show Default Posts - LM
        setAllPosts(keywordsV2[keywordsV2.length - 1].posts);
      } else {
        // Show Chosen Topic(s) Posts and Defaults - LM
        setAllPosts(postsToShow.concat(keywordsV2[keywordsV2.length - 1].posts));
      }
    }, 1000);
  }

  useEffect(() => {
    // Toggles visibility of the See More / See Less Button - LM
    if (allPosts) {
      setSeeMoreSeeLessVisible(allPosts.length <= numberOfGridColums ? false : true);
    }
  }, [allPosts]);

  const handleSeeMore = () => {
    if (!appOpen) {
      setAppOpen(true);
      setSeeMoreSeeLessText(`See Fewer ${postName}`);

      let maximumAppHeight: number;
      if (allPosts) {
        const numberOfGridRows: number = Math.ceil(allPosts.length / numberOfGridColums);
        maximumAppHeight = (numberOfGridRows * heightOfPosts) + (gridRowGap * numberOfGridRows) + heightOfSeeMoreSeeLessButton + extraPadding;
      }

      // @ts-expect-error
      appWrapperRef.current.style.height = `${maximumAppHeight}rem`;

    } else {
      setAppOpen(false);
      setSeeMoreSeeLessText(`See More ${postName}`);
      // @ts-expect-error
      appWrapperRef.current.style.height = `${appWrapperNaturalHeight}rem`;
    }
  }

  const uniqueID = (title: string) => {
    return title + "-" + Math.random();
  }

  if (allPosts) {
    return (
      <div style={appWrapperStyle} className={styles.appWrapper} ref={appWrapperRef}>
        <p style={infoTopicStyle} className={styles.infoTopic}>
          {infoTopic != "Default" ? infoTopic : "More"} {postName}
        </p>
        <div style={postGridSyle} className={styles.postGrid}>
          {allPosts?.map(post => (
            <PostCard key={uniqueID(post.title)} url={post.url} title={post.title} image={post.image} propStyles={{ postLinkStyle, postCardStyle }} />
          ))}
        </div>
        <div className={styles.centerRow}>
          {seeMoreSeeLessVisible &&
            <div className={styles.seeMoreButtonContainer}>
              <div className={styles.seeMoreButtonWrapper}>
                <button onClick={handleSeeMore} style={seeMoreSeeLessButtonStyle} className={styles.seeMoreSeeLessButton}>{seeMoreSeeLessText}</button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  } else {
    return <><p>Loading...</p></>
  }
}

InfoHub.schema = {
  title: 'editor.infohub.title',
  description: 'editor.infohub.description',
  type: 'object',
  properties: {}
}

export default InfoHub;
