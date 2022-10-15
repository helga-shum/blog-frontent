import React from 'react';
import { Navigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectAuth } from '../../redux/slices/auth';
export const Registration = () => {
  const isAuth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,

    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: 'Helga Neimer',
      email: 'helga.neimer@gmail.com',
      password: '1234',
    },
    mode: 'onChange',
  });
  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    if (!data.payload) {
      return alert('you do not sign up');
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Write your fullname' })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Write your email' })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />

        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register('password', { required: 'Write your password' })}
          className={styles.field}
          label="Password"
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
