import { ImageList, ImageListItem,  Avatar } from "@mui/material";
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

export default function(){
    const itemData = [
        {
          img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
          title: 'Breakfast',
        },
        {
          img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
          title: 'Burger',
        },
        {
          img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
          title: 'Camera',
        },
        {
          img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
          title: 'Coffee',
        },
        {
          img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
          title: 'Hats',
        },
        {
          img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
          title: 'Honey',
        },
        {
          img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
          title: 'Basketball',
        },
        {
          img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
          title: 'Fern',
        },
        {
          img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
          title: 'Mushrooms',
        },
        {
          img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
          title: 'Tomato basil',
        },
        {
          img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
          title: 'Sea star',
        },
        {
          img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
          title: 'Bike',
        },
      ];


      return (
        <Stack sx={{width:"70%", boxShadow:1, overflow:"scroll"}}>

        <Stack direction="row"justifyContent="end" sx={{width:"80%",marginLeft:"10%"}}>
            <ListItem alignItems="flex-start" >
          <ListItemAvatar>
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </ListItemAvatar>
          <ListItemText 
            primary="Tim"
          
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                </Typography>
                {"人之初性本善"}
              </React.Fragment>
            }
          />

        </ListItem>


            <ButtonGroup sx={{ marginTop:"3%",height:"50%"}} aria-label="Basic button group" >
              <Button>unfollow</Button>
              <Button>contact</Button>
          </ButtonGroup>
            </Stack>


        <Stack sx={{width:"70%",marginLeft:"15%"}}>
          <TextField
            id="outlined-required"
            label="Gender"
            defaultValue="Female"
            variant="standard"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="outlined-required"
            label="Age"
            defaultValue="69"
            variant="standard"

            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="outlined-required"
            label="Location"
            defaultValue="美国加利福尼亚"
            variant="standard"
            InputProps={{
              readOnly: true,
            }}

          />
          <TextField            
           id="outlined-required"
            label="NickName"
            defaultValue="bbbbb"
            variant="standard" type="search" />



        </Stack>

              <ImageList sx={{ width: "80%", marginLeft:"10%"}} cols={3} >
                  {itemData.map((item) => (
                  <ImageListItem key={item.img}>
                      <img
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                      />
                  </ImageListItem>
                  ))}
              </ImageList>
        </Stack>

      )

}