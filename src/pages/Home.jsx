import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import TabContext from '@mui/lab/TabContext';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, fetchPopularPosts, fetchNewPosts } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments';
export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);

  const isPostsLoading = posts.status == 'loading';
  const isTagsLoading = tags.status == 'loading';
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);
  console.log(tags);
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    if (newValue == 1) {
      dispatch(fetchPosts());
    }
    if (newValue == 2) {
      dispatch(fetchPopularPosts());
    }
  };
  console.log(comments.items);
  return (
    <>
      <TabContext value={value}>
        <TabList
          style={{ marginBottom: 15 }}
          onChange={handleChange}
          aria-label="lab API tabs example">
          <Tab label="Новые" value="1" />
          <Tab label="Популярные" value="2" />
        </TabList>
      </TabContext>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                _id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id == obj.user._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={comments.items} isLoading={false} />
        </Grid>
      </Grid>
    </>
  );
};
