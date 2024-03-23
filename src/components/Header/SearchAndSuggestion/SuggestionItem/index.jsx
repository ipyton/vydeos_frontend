
import ListItemIcon from '@mui/material/ListItemIcon';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItem from '@mui/material/ListItem';
import CardMedia from '@mui/material/CardMedia';
import * as React from 'react';

export default function(props) {
    let {title, introduction, pics, type} = props.searchResult
    let {setSuggestionOpen} = props

    let miniture = (<div></div>)

    //console.log(setSuggestionOpen)

    const handleSuggestionSelection = (event) => {
      //console.log(setSuggestionOpen)
      setSuggestionOpen(null)
  } 
    if (type === "contact") {
      miniture = (
      <ListItemAvatar>
        <Avatar alt="Cindy Baker" src={pics} />
      </ListItemAvatar>)
    } else if (type === "movie") {
      miniture = (
        <ListItemAvatar>
      <Avatar
        variant="square"
        src={"https://handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg"}
        alt="Paella dish"
      />
      </ListItemAvatar>)
    } else if (type === "") {

    }


    return (
    <ListItemButton onClick={handleSuggestionSelection}>
            <ListItem alignItems="flex-start">
                {
                    miniture
                }
              <ListItemText
                primary={title}
                secondary={
                  <React.Fragment>
                    {introduction}
                  </React.Fragment>
                }
              />
            </ListItem>
    </ListItemButton>
    ) 
}