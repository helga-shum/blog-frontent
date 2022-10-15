import React from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostComments } from '../redux/slices/comments';

export const FullPost = () => {
  const dispatch = useDispatch();

  const { comments } = useSelector((state) => state.comments);
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();

  const postComments = comments.items.filter((item) => item.postId == id);

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Error');
      });
    // dispatch(fetchPostComments(id));
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={`http://localhost:4444${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={postComments} isLoading={false}>
        <Index postId={data._id} user={data.user} />
      </CommentsBlock>
    </>
  );
};
