import React from 'react';
import { useState, useEffect, useRef, CSSProperties } from 'react';

// Components
import PostCard from './PostCard';

// Styles
import styles from "./styles.css";

interface InfoHubProps {
  keywordsV2: Array<TopicAndPosts>
  uglyList: Array<PrettyTitle>
}

interface TopicAndPosts {
  topic: string
  key: number
  posts: Array<PostObject>
}

interface TopicAndKey {
  topic: string
  key: number
}

interface PostObject {
  title: string,
  image: string,
  url: string
}

interface PrettyTitle {
  ugly: string;
  pretty: string;
}

const InfoHub: StorefrontFunctionComponent<InfoHubProps> = ({ keywordsV2, uglyList }) => {
  const postName: string = "Articles";
  const appWrapperRef = useRef<HTMLDivElement>(null!);
  const [infoTopic, setInfoTopic] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Array<PostObject> | undefined>(undefined);
  const [seeMoreSeeLessText, setSeeMoreSeeLessText] = useState<string>(`See More ${postName}`);
  const [seeMoreSeeLessVisible, setSeeMoreSeeLessVisible] = useState<boolean>(false);
  const [appExpanded, setappExpanded] = useState<boolean>(false);

  // @ts-expect-error
  const windowWidth: number = window.innerWidth;
  const desktopColumns: number = 5;
  const mobileColumns: number = 2;
  const mobileMaximumPosts: number = 6;
  const desktopMaximumPosts: number = 10;
  const pageBreakWidth: number = 1026;

  const heightOfPosts: number = 6;
  const gridRowGap: number = 1;
  const heightOfPostRow: number = heightOfPosts;
  const infoTopicFontSize: number = 1.5;
  const infoTopicMarginBottom: number = 0.5;
  const numberOfGridColums: number = windowWidth >= pageBreakWidth ? desktopColumns : mobileColumns;
  const heightOfSeeMoreSeeLessButton: number = seeMoreSeeLessVisible ? 1.5 : 0;
  const extraPadding: number = 1.25;
  const appWrapperNaturalHeight: number = infoTopicFontSize + infoTopicMarginBottom + heightOfPosts + gridRowGap + heightOfSeeMoreSeeLessButton;

  const infoTopicStyle: CSSProperties = {
    fontSize: `${infoTopicFontSize}rem`,
    marginBottom: `${infoTopicMarginBottom}rem`
  }

  const postLinkStyle: CSSProperties = {
    height: `${heightOfPosts}rem`
  }

  const postCardStyle: CSSProperties = {
    height: `${heightOfPosts}rem`
  }

  let displayType: string = "";
  let contentType: string = "";
  if (allPosts) {
    displayType = allPosts.length <= numberOfGridColums ? `flex` : `grid`;
    contentType = allPosts.length <= numberOfGridColums ? `space-around` : ``;
  }

  const postGridSyle: CSSProperties = {
    display: displayType,
    justifyContent: contentType,
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

  let priorityPostsLocation: number | undefined = undefined;
  let defaultPostsLocation: number | undefined = undefined;
  let priorityPosts: Array<PostObject> = [];
  for (let i = 0; i < keywordsV2.length; i++) {
    if (keywordsV2[i].topic === "Priority") priorityPostsLocation = i;
    if (keywordsV2[i].topic === "Default") defaultPostsLocation = i;
  }

  if (typeof priorityPostsLocation === "number") priorityPosts = keywordsV2[priorityPostsLocation].posts;

  useEffect(() => {
    console.clear();

    console.log(uglyList);

    // @ts-expect-error
    const currentUserURL: string = window.location.href.split(".com/")[1];

    // Empty Array for Keywords found in URL --
    const keywordsFoundInURL: Array<TopicAndPosts> = [];

    // Empty Arrays for Keywords from Backend --
    const singleTopics: Array<TopicAndKey> = [];
    const multipleTopics: Array<TopicAndKey> = [];

    // Find All topics with multiple keywords and populate multipleTopics Array --
    for (let i = 0; i < keywordsV2.length; i++) {
      const topicFromBackend: string = keywordsV2[i].topic;
      const topicListFromBackend: Array<string> = topicFromBackend.split(", ");
      if (topicListFromBackend.length > 1) {
        for (let j = 0; j < topicListFromBackend.length; j++) {
          multipleTopics.push({ topic: topicListFromBackend[j], key: i });
        }
      } else {
        singleTopics.push({ topic: keywordsV2[i].topic, key: i });
      }
    }

    // Combine both arrays --
    const keywordsToSearchFor: Array<TopicAndKey> = singleTopics.concat(multipleTopics);

    // Loop through Keywords Array topics --
    for (let i = 0; i < keywordsToSearchFor.length; i++) {
      // RegEx looking for keywords without case dependance --
      const topic = new RegExp(keywordsToSearchFor[i].topic, "i");

      // Boolean for if Regex has found match --
      const stringFoundBoolean = topic.test(currentUserURL);

      if (stringFoundBoolean) {
        // If true, populate Array with topic and Array of posts --
        keywordsFoundInURL.push({ topic: keywordsToSearchFor[i].topic, key: keywordsToSearchFor[i].key, posts: keywordsV2[keywordsToSearchFor[i].key].posts });
      }
    }

    if (keywordsFoundInURL.length > 0) {
      // Empty Posts to Show Array --
      let postsToShow: Array<PostObject> = [];

      // Empty Topic String --
      let infoTopicString: string = "";

      // Loop through keywords Array and push the posts array items --
      for (let i = 0; i < keywordsFoundInURL.length; i++) {
        postsToShow.push(...keywordsFoundInURL[i].posts);

        // Populate InfoTopicString with all Topic Found in URL --
        infoTopicString = infoTopicString === "" ? keywordsFoundInURL[i].topic : infoTopicString + " and " + keywordsFoundInURL[i].topic;
      }

      // Format Ugly Titles List --
      const sortArray = (x: PrettyTitle, y: PrettyTitle) => {
        if (x.ugly < y.ugly) return -1;
        if (x.ugly > y.ugly) return 1;
        return 0;
      };
      const sortedUglyList: Array<PrettyTitle> = uglyList.sort(sortArray);

      // Catching Unsightly Edge Cases --
      let topicStringEdgeRemoval: string = "";
      for (let i = 0; i < sortedUglyList.length; i++) {
        topicStringEdgeRemoval = infoTopicString.replace(sortedUglyList[i].ugly, sortedUglyList[i].pretty);
        infoTopicString = topicStringEdgeRemoval;
      }

      // Removed duplicates from postsToShow Array based on their title --
      postsToShow = postsToShow.filter((value, index, self) =>
        index === self.findIndex((post) => (
          post.title === value.title
        ))
      );

      if (infoTopic != infoTopicString) {
        // If infoTopic does not already match the infoTopicString just made, show new posts --
        // This prevents an infinate loop --
        setInfoTopic(infoTopicString);
        unmountToMountArray(postsToShow);
      }
    } else {
      // If no keywords are found in URL, set topic and posts to default --
      if (typeof defaultPostsLocation === "number") {
        if (infoTopic != keywordsV2[defaultPostsLocation].topic) {
          setInfoTopic(keywordsV2[defaultPostsLocation].topic);
          unmountToMountArray(keywordsV2[defaultPostsLocation].posts, true);
        }
      }
    }
  });

  const unmountToMountArray = (postsToShow: Array<PostObject>, noKeywordsFound?: boolean) => {
    setAllPosts(undefined);
    setSeeMoreSeeLessText(`See More ${postName}`);
    setappExpanded(false);

    setTimeout(() => {
      if (noKeywordsFound) { // Do not render (04/19/2022) - LM
        // Show Priority and Defaults - LM
        // if (typeof priorityPostsLocation === "number" && typeof defaultPostsLocation === "number") {
        //   setAllPosts(priorityPosts.concat(keywordsV2[defaultPostsLocation].posts));
        // } else if (typeof priorityPostsLocation === undefined && typeof defaultPostsLocation === "number") {
        //   setAllPosts(keywordsV2[defaultPostsLocation].posts);
        // }
      } else {
        // Show Priority, Chosen Topic(s) and Defaults - LM
        if (windowWidth <= pageBreakWidth) {
          // Mobile Rules --
          if (typeof priorityPostsLocation === "number" && typeof defaultPostsLocation === "number") {
            let truncateArray: Array<PostObject> = priorityPosts.concat(postsToShow.concat(keywordsV2[defaultPostsLocation].posts));
            truncateArray.length = mobileMaximumPosts;
            setAllPosts(truncateArray);
          } else if (typeof priorityPostsLocation === "undefined" && typeof defaultPostsLocation === "number") {
            let truncateArray: Array<PostObject> = postsToShow.concat(keywordsV2[defaultPostsLocation].posts);
            truncateArray.length = mobileMaximumPosts;
            setAllPosts(truncateArray);
          }
        } else {
          // Desktop Rules --
          if (typeof priorityPostsLocation === "number" && typeof defaultPostsLocation === "number") {
            setAllPosts(priorityPosts.concat(postsToShow.concat(keywordsV2[defaultPostsLocation].posts)));
          } else if (typeof priorityPostsLocation === "undefined" && typeof defaultPostsLocation === "number") {
            setAllPosts(postsToShow.concat(keywordsV2[defaultPostsLocation].posts));
          }
        }
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
    if (!appExpanded) {
      setappExpanded(true);
      setSeeMoreSeeLessText(`See Fewer ${postName}`);

      let maximumAppHeight: number;
      if (allPosts) {
        const numberOfGridRows: number = Math.ceil(allPosts.length / numberOfGridColums);
        maximumAppHeight = (numberOfGridRows * heightOfPosts) + (gridRowGap * numberOfGridRows) + infoTopicMarginBottom + heightOfSeeMoreSeeLessButton + extraPadding;
      }

      // @ts-expect-error
      appWrapperRef.current.style.height = `${maximumAppHeight}rem`;

    } else {
      setappExpanded(false);
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
      <div className={styles.appContainer}>
        <div style={appWrapperStyle} className={styles.appWrapper} ref={appWrapperRef}>
          <p style={infoTopicStyle} className={styles.infoTopic}>
            Related Articles
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
      </div>
    )
  } else {
    return <></>
  }
}

InfoHub.schema = {
  title: 'editor.infohub.title',
  description: 'editor.infohub.description',
  type: 'object',
  properties: {}
}

export default InfoHub;
