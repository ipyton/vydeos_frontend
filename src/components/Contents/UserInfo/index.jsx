import React, { useState, useEffect } from 'react';
import { 
  Avatar, 
  Button, 
  CssBaseline, 
  TextField, 
  Select, 
  InputLabel, 
  MenuItem, 
  Grid, 
  Box, 
  Typography, 
  Container, 
  IconButton, 
  FormControl 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNotification } from '../../../Providers/NotificationProvider';

import PictureUtil from '../../../util/io_utils/FileUtil';
import AccountUtil from '../../../util/io_utils/AccountUtil';

const defaultTheme = createTheme();

// Country list moved inline for simplicity
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


export default function UserInfo(props) {
  const { login, setLogin } = props.status;
  const { showNotification } = useNotification();

  const [userInfo, setUserInfo] = useState({
    avatar: "",
    gender: null, // null represents "prefer not to say"
    dateOfBirth: dayjs().subtract(18, 'year').format('YYYY-MM-DD'),
    userName: "",
    location: "",
    introduction: "",
    language: "",
    country: ""
  });

  const [avatar, setAvatar] = useState(null);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user info
        const userInfoResponse = await AccountUtil.getOwnerInfo(userInfo, setUserInfo);
        if (userInfoResponse && userInfoResponse.data && userInfoResponse.data.code !== -1) {
          const content = JSON.parse(userInfoResponse.data.message);
          setUserInfo(content);
          localStorage.setItem("userInfo", JSON.stringify(content));
        }

        // Fetch avatar
        await AccountUtil.getAvatar(avatar, setAvatar);

        // Fetch languages
        await AccountUtil.getLanguages(setLanguages);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (newDate) => {
    setUserInfo(prevState => ({
      ...prevState,
      dateOfBirth: newDate ? newDate.format('YYYY-MM-DD') : prevState.dateOfBirth
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setAvatar(avatarUrl);
      AccountUtil.uploadAvatar(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Save to local storage
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    // Update user info via API
    AccountUtil.updateUserInfo(
      userInfo.introduction, 
      userInfo.userName, 
      userInfo.location, 
      null, 
      dayjs(userInfo.dateOfBirth).format('YYYY-MM-DD'), 
      userInfo.gender, 
      userInfo.language, 
      userInfo.country
    );
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
            <input 
              id="uploadPic" 
              type="file" 
              onChange={handleAvatarUpload} 
              hidden 
              accept="image/*"
            />
            <label htmlFor="uploadPic">
              <IconButton component="span">
                <Avatar 
                  id="avatar" 
                  src={avatar} 
                  sx={{ bgcolor: deepOrange[500] }}
                >
                  {userInfo.userName ? userInfo.userName[0] : 'N'}
                </Avatar>
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
                  fullWidth
                  label="Nickname"
                  value={userInfo.userName}
                  onChange={handleChange}
                  variant="filled"
                  color="success"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="location"
                  fullWidth
                  label="Region"
                  value={userInfo.location}
                  onChange={handleChange}
                  variant="filled"
                  color="success"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="introduction"
                  fullWidth
                  label="Introduction"
                  value={userInfo.introduction}
                  onChange={handleChange}
                  variant="filled"
                  color="success"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    name="gender"
                    labelId="gender-select-label"
                    value={userInfo.gender ?? ''}
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Male</MenuItem>
                    <MenuItem value={false}>Female</MenuItem>
                    <MenuItem value="">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <DatePicker
                  label="Date of Birth"
                  value={dayjs(userInfo.dateOfBirth)}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    name="language"
                    value={userInfo.language}
                    onChange={handleChange}
                  >
                    {languages.map((lang) => (
                      <MenuItem 
                        key={`${lang.language}-${lang.country}`} 
                        value={lang.language}
                      >
                        {lang.language}/{lang.country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Country/Region</InputLabel>
                  <Select
                    name="country"
                    value={userInfo.country}
                    onChange={handleChange}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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