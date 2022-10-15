import React from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import axios from '../../axios';

export const Index = ({ user, postId }) => {
  const [text, setText] = React.useState('');
  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);
  const onComment = async () => {
    const fields = {
      user,
      postId,
      text,
    };

    await axios.post('/comment', fields);

    try {
    } catch (error) {
      console.warn(error);
      alert('error of create a comment');
    }
  };
  console.log(user, postId);
  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={user.avatarUrl} />
        <div className={styles.form}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button variant="contained" onClick={onComment}>
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
