import { ImageList, ImageListItem, Avatar } from "@mui/material";
import Stack from '@mui/material/Stack';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function (props) {
  let { intro, name, pic, gender, birthdate, location, nickname, imageData } = props


  imageData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    }
  ];


  // width: "70%", boxShadow: 1,              
  // direction = "column"
  // justifyContent = "center"
  // alignItems = "center"
  // spacing = { 0.5}
  return (
    <Stack sx={{ overflow: "scroll",width: "70%", boxShadow: 1, }}>
      <Stack direction="row" justifyContent="end" sx={{ width: "80%", marginLeft: "10%" }}>
        <ListItem alignItems="flex-start" >
          <ListItemAvatar>
            <Avatar alt={name} src={pic} />
          </ListItemAvatar>
          <ListItemText
            primary={name}

            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                </Typography>
                {intro}
              </React.Fragment>
            }
          />

        </ListItem>


        <ButtonGroup sx={{ marginTop: "3%", height: "50%" }} aria-label="Basic button group" >
          <Button>Unfollow</Button>
          <Button>Contact</Button>
        </ButtonGroup>
      </Stack>


      <Stack sx={{ width: "80%", marginLeft: "15%" }}>
        <TextField
          id="outlined-required"
          label="Gender"
          defaultValue={gender}
          variant="standard"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-required"
          label="Age"
          defaultValue={birthdate}
          variant="standard"

          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-required"
          label="Location"
          defaultValue={location}
          variant="standard"
          InputProps={{
            readOnly: true,
          }}

        />

        {nickname === undefined ? <div></div> : <TextField
          id="outlined-required"
          label="NickName"
          defaultValue="bbbbb"
          variant="standard" type="search" />}

      </Stack>


      {imageData === undefined ? <div></div> : <ImageList sx={{ width: "80%", marginLeft: "10%" }} cols={3} >
        {imageData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>}
    </Stack>

  )

}