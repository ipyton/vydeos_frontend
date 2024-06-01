import Article from "./Article";
import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
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
import Fingerprint from '@mui/icons-material/Fingerprint';
import { createSvgIcon } from '@mui/material/utils';
import PostUtil from "../../../util/io_utils/PostUtil";
import ButtonGroup from '@mui/material/ButtonGroup';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
const PlusIcon = createSvgIcon(
  // credit: plus icon from https://heroicons.com/
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>,
  'Plus',
);
function Item(props) {
  const [articles, setArticles] = React.useState([1, 2, 3, 4, 5]);
  const [count, setCount] = React.useState(99);
  const [content, setContent] = React.useState("")
  let { login, setLogin } = props
  const [expanded, setExpanded] = React.useState(false)
  const [atList, setAtList] = React.useState([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' }])
  
  const [checked, setChecked] = React.useState([0]);
  const [picsUrl, setPicsUrl] = useState([])
  const [postPics, setPostPics] = useState([])
  const [notice, setNotice] = useState([])
  const [who_can_see, set_who_can_see] = useState([])
  const [location,setLocation] = useState("")
  

  const [page,setPage] = useState("friend")


  useEffect(()=> {
    if (page === "friend") {
      PostUtil.getFriendPosts(articles, setArticles)
    }
    else if (page === "my") {
      PostUtil.getPostsById(localStorage.getItem("userId"), articles, setArticles)
    }
  },[page])


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
  
  const handleEditChange = (event) => {

  }

  const handleDelete = () => {
    // setAtList((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleSend = () => {
    PostUtil.sendPost(content, picsUrl, notice, who_can_see, location, articles, setArticles)
  }

  const handlePicUpload = (event) => {
    console.log(event.target.files[0])
    let file = event.target.files[0]
    let reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setPostPics([...postPics, { pic: URL.createObjectURL(event.target.files[0]), width: img.width, height: img.height }])
      };
      PostUtil.uploadPicture(file, picsUrl, setPicsUrl)
    };

    if (file) {
      reader.readAsDataURL(file);
    }

  }
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
    height: 1
  });

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
    setPostPics([])
    setPicsUrl([])
    setOpen(false);
  };

  useEffect(() => { init() }, []);
  let RequestData = function () {
    console.log("loading")
  }
  if (null === login) return <div></div>
  if (login !== true && localStorage.getItem("token") !== null) {
    console.log("both none")
    IOUtil.verifyTokens(setLogin)
      .catch(err => {
        props.setBarState({ ...props.barState, message: "please login first" + err, open: true })
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

  ];

  if (login !== true || localStorage.getItem("token") === null) {
    console.log(localStorage.getItem("token"))
    return <Navigate to="/login" replace />
  }

  if (articles.length === 0) {
    RequestData()
  }
  const style = {
    margin: 1,
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

  const handleFriends = ()=>{
    if (page === "friend") {
      return 
    }
    else {
      setPage("friend")
    }

  }
  const handleMy = () => {
    if (page === "my") {
      return
    }
    else {
      setPage("my")
    }
  }
  return (

    <Box  justifyContent="center">
      <List sx={{ width: "80%", marginLeft: "10%" }}>
      {articles&&articles.map((x,idx)=>{
        return (<ListItem key={idx} ><Article></Article></ListItem>)
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
            value={content}
            onChange={(event)=>{
              setContent(event.target.value)
            }}
            variant="filled"
            sx={{width:"100%"}}
          />
          <ImageList sx={{ width: 500}} cols={3} rowHeight={164}  >
            {postPics.map((item,idx) => (
              <ImageListItem key={idx} sx={{ overflow: 'hidden',padding:0}}>

                <Box
                  component="img"
                  sx={{
                    width: '100%',   
                    height: '100%', 
                    objectFit: 'cover', 
                    padding:0
                  }}

                  src={item.pic} 
                />


              </ImageListItem>
            ))}

            {postPics.length < 9 ? <ImageListItem key={30}><Button
              component="label"
              variant="contained"
              sx={{ width: 1, height: 1 }}

            >
              <PlusIcon />
              <VisuallyHiddenInput type="file" onChange={handlePicUpload}/>
            </Button> </ImageListItem>:<div></div>}
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
                <ListItem key={1} style={{ padding: 0 }}> 
                  <Chip
                    avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
                    label="Avatar"
                    variant="outlined"
                    onDelete={handleDelete}
                  />
                
                </ListItem>
                <ListItem key={2} style={{ padding: 0 }}>
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
                {
                  articles.map((item, idx) => {
                    return (
                      <ListItem key={1} >
                        <ListItemAvatar>
                          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="小明"
                        />
                      </ListItem>)
                  })
                }
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
                {[0, 1, 2, 3].map((value, idx) => {
                  const labelId = `checkbox-list-label-${value}`;

                  return (
                    <ListItem
                      key={idx}
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
      <Box style={style}>
        <Fab color="primary" sx={{margin:1}} onClick={handleClickOpen} aria-label="add">
          <AddIcon />
        </Fab>
        <Fab variant="extended" sx={{ margin: 1 }} onClick={handleFriends} color="secondary"  aria-label="edit">
          <EditIcon />
          Friends'
        </Fab>
        <Fab sx={{  margin: 1 }} onClick={handleMy} variant="extended">
          <NavigationIcon  />
          My
        </Fab>

      </Box>
      
    </Box >


  )
}
export default Item