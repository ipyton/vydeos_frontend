import * as React from 'react';
import { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PictureUtil from '../../../util/io_utils/FileUtil';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import dayjs from 'dayjs';

const defaultTheme = createTheme();

export default function UserInfo(props) {
  const { login, setLogin } = props.status;

  // Consolidated userInfo state
  const [userInfo, setUserInfo] = useState({
    avatar: "",
    gender: false, // false = Female, true = Male, null = Not to tell
    dateOfBirth: '2022-04-10',
    userName: "",
    location: "",
    introduction: "",
  });

  const [avatar, setAvatar] = useState()
  useEffect(() => {
    // Fetch initial user info from API or local data
    AccountUtil.getOwnerInfo(userInfo, setUserInfo);
    AccountUtil.getAvatar(avatar, setAvatar)
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setUserInfo((prevState) => ({
      ...prevState,
      dateOfBirth: newDate,
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    const avatarUrl = URL.createObjectURL(file);

    setAvatar(avatarUrl)
    AccountUtil.uploadAvatar(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Validation and submission logic here
    console.log(data.get("intro"), data.get("nickname"), data.get("region"), data.get("pictures"), dayjs(userInfo.dateOfBirth).format('YYYY-MM-DD'), userInfo.gender);
    AccountUtil.updateUserInfo(userInfo.introduction, userInfo.userName, userInfo.location, null, dayjs(userInfo.dateOfBirth).format('YYYY-MM-DD'), userInfo.gender);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div>
            <input id="uploadPic" type="file" onChange={handleAvatarUpload} hidden />
            <label htmlFor="uploadPic">
              <IconButton component="span">
                <Avatar id="avatar" src={avatar} sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
              </IconButton>
            </label>
          </div>
          <Typography component="h1" variant="h5">
            User Information
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="userName"
                  focused
                  fullWidth
                  id="outlined-nickname"
                  label="Nickname"
                  value={userInfo.userName}
                  onChange={handleChange}
                  variant="filled" color="success"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="outlined-region"
                  label="Region"
                  name="location"
                  value={userInfo.location}
                  onChange={handleChange}
                  variant="filled" color="success"
                  focused
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  focused
                  name="introduction"
                  label="Introduction"
                  id="outlined-required"
                  value={userInfo.introduction}
                  onChange={handleChange}
                  variant="filled" color="success"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    id="gender"
                    name="gender"
                    value={userInfo.gender}
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Male</MenuItem>
                    <MenuItem value={false}>Female</MenuItem>
                    <MenuItem value={null}>Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  value={dayjs(userInfo.dateOfBirth)}
                  onChange={handleDateChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
