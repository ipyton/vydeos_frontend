import * as React from 'react';
import { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import FormControl from '@mui/material/FormControl';


const defaultTheme = createTheme();

export default function UserInfo(props) {
  const { login, setLogin } = props.status;

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", 
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
    "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", 
    "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", 
    "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", 
    "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", 
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", 
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", 
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", 
    "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
    "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", 
    "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", 
    "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", 
    "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", 
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", 
    "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", 
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", 
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];


  // Consolidated userInfo state
  const [userInfo, setUserInfo] = useState({
    avatar: "",
    gender: false, // false = Female, true = Male, null = Not to tell
    dateOfBirth: '2022-04-10',
    userName: "",
    location: "",
    introduction: "",
    language:"",
    country:""
  });

  const [avatar, setAvatar] = useState()

  const[ languages, setLanguages] = useState([])



  useEffect(() => {
    // Fetch initial user info from API or local data
    AccountUtil.getOwnerInfo(userInfo, setUserInfo).then(response => {
      if (!response || !response.data) {
        return
      }
      if (response.data.code === -1) {
        console.log(response.data.message)
        return
      }
      let content = response.data.message
      let decoded = JSON.parse(content)
      setUserInfo(decoded)
      localStorage.setItem("userInfo", JSON.stringify(decoded))
    })
    AccountUtil.getAvatar(avatar, setAvatar)
    AccountUtil.getLanguages(setLanguages)
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name +  value)
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
    localStorage.setItem("userInfo", JSON.stringify(userInfo))
    AccountUtil.updateUserInfo(userInfo.introduction, userInfo.userName, userInfo.location, null, dayjs(userInfo.dateOfBirth).format('YYYY-MM-DD'), userInfo.gender, userInfo.language, userInfo.country);
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
              <Grid item xs={12}>
              <Box sx={{ minWidth: 120 }}>
              <Grid item xs={12}>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">language</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={userInfo.language}
          name='language'
          onChange={handleChange}
        >
          {languages.map((language) => (
            (<MenuItem value={language.language}>{language.language}/{language.country}</MenuItem>)
          ))}
          
        </Select>
      </FormControl>
      </Grid>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">country/region</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={userInfo.country}
          name='country'
          onChange={handleChange}
        >
          {countries.map((country) => (
            <MenuItem value={country}>{country}</MenuItem>
          ))}
          
        </Select>
      </FormControl>
    </Box>
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
