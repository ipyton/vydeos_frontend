import Article from "./Article";
import React, {useEffect, useState} from "react";
import { useNavigate ,Navigate} from "react-router-dom";
import IOUtil from "../../../util/ioUtil";
import { Box } from "@mui/material";
import { List } from "@mui/material";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';

function Item(props) {
  const [articles, setArticles] = React.useState([1,2,3,4,5]);
  const [count, setCount] = React.useState(99);
  let {login, setLogin} = props
  const [expanded, setExpanded] = React.useState(false)
  const [atList, setAtList] = React.useState([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' }])
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const handleDelete = () => {
    // setAtList((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleSend = ()=> {
    
  }

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));
  login = true
  let init = () => {
    document.addEventListener("scroll", () => {
      console.log(
        "scroll"
      )
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // 页面高度
      var documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // 滚动条位置
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if ((windowHeight + scrollTop + 2) >= documentHeight) {
        console.log('页面滚动到达底部');
        RequestData()
      }
    });
  }
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() =>{init()},[]);
  let RequestData = function()  {
    console.log("loading")
  }
  if (null === login) return <div></div>
  if (login !== true && localStorage.getItem("token") !== null) {
    console.log("both none")
    IOUtil.verifyTokens(setLogin) 
    .catch(err=>{
      props.setBarState({...props.barState, message:"please login first" + err, open:true})
    })
      }
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

  ];
 
  if(login !== true || localStorage.getItem("token") === null ) 
  {
    console.log(localStorage.getItem("token"))
    return <Navigate to="/login" replace/>
  }
 
if (articles.length === 0) {
  RequestData()
}
  const style = {
    margin: 0,
    top: 'auto',
    right: 40,
    bottom: 40,
    left: 'auto',
    position: 'fixed',
  };


  // React.useEffect(() => {
  //   console.log("is doing");
  //     return () => {
  //       console.log("trigger when loading")
  //     }
  //   })
  return (

    <Box display="flex" justifyContent="center">
      <List>
      {articles&&articles.map(x=>{
        return (<ListItem key={x}><Article></Article></ListItem>)
      })}    
      </List>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Share Your Thoughts</DialogTitle>
        <DialogContent>
          <TextField
            id="filled-multiline-static"
            label="Say Something"
            multiline
            rows={4}
            defaultValue="Default Value"
            variant="filled"
            sx={{width:"100%"}}
          />
          <ImageList sx={{ width: "100%", height: 500 }} cols={3} rowHeight={164} display="flex" justifyContent="center">
            {itemData.map((item) => (
              <ImageListItem key={item.img} sx={{padding:0}}>
                <img
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>

        </DialogContent>

        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              Location
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Configure a location</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TextField
                id="outlined-helperText"
                label="Search Location"
              />
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>Notice Someone.</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              <List style={{ display: 'flex', flexDirection: 'row', padding: 0, overflow:"auto" }}>
                <ListItem style={{ padding: 0 }}> 
                  <Chip
                    avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
                    label="Avatar"
                    variant="outlined"
                    onDelete={handleDelete}
                  />
                
                </ListItem>
                <ListItem style={{ padding: 0 }}>
                  <Chip
                    avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
                    label="Avatar"
                    variant="outlined"
                    onDelete={handleDelete}
                  />

                </ListItem>

              </List>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography display="flex" justifyContent="center">
              <TextField
                id="outlined-helperText"
                label="Search People"
              />
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper',overflow:"auto"}}>

                <ListItem >
                  <ListItemAvatar>
                    <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary="小明"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem >
                  <ListItemAvatar>
                    <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary="小明"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem >
                  <ListItemAvatar>
                    <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary="小明"
                  />
                </ListItem>
                <ListItem >
                  <ListItemAvatar>
                    <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary="小明"
                  />
                </ListItem>
              </List>

            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              Who Can See
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Public By Default.
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Exclude</Typography>
                <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                <Typography>Include</Typography>
              </Stack>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {[0, 1, 2, 3].map((value) => {
                  const labelId = `checkbox-list-label-${value}`;

                  return (
                    <ListItem
                      key={value}
                      secondaryAction={
                        <IconButton edge="end" aria-label="comments">
                          <CommentIcon />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSend} type="submit">Send</Button>
        </DialogActions>
      </Dialog>
      <Fab color="primary" style={style} onClick={handleClickOpen}  aria-label="add">
        <AddIcon />
      </Fab>
    </Box>


  )
}
export default Item