import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setimageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      console.log(data);
      setimageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert('error uploading of file');
    }
  };

  const onClickRemoveImage = () => {
    setimageUrl('');
  };

  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);
  const onSubmit = async () => {
    setLoading(true);
    const fields = {
      title,
      imageUrl,
      text,
      tags,
    };
    const { data } = isEditing
      ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post('/posts', fields);
    const _id = isEditing ? id : data._id;
    navigate(`/posts/${_id}`);
    try {
    } catch (error) {
      console.warn(error);
      alert('error of create a post');
    }
  };
  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setimageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.warn(err);
          alert('Error of receive of post');
        });
    }
  });
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Post'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
