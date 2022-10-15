import axios from '../axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Post } from '../components/Post';
function TagPosts() {
  const userData = useSelector((state) => state.auth.data);
  const { name } = useParams();
  const [data, setData] = React.useState();

  React.useEffect(() => {
    axios
      .get(`/tag/${name}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.warn(err);
        alert('Error');
      });
  }, []);
  console.log(data);
  return (
    <>
      {data
        ? data.map((item, i) => (
            <Post
              _id={item._id}
              title={item.title}
              imageUrl={item.imageUrl ? `http://localhost:4444${item.imageUrl}` : ''}
              user={item.user}
              createdAt={item.createdAt}
              viewsCount={item.viewsCount}
              commentsCount={3}
              tags={item.tags}
              isEditable={userData?._id == item.user._id}
            />
          ))
        : 'loading'}
    </>
  );
}

export default TagPosts;
