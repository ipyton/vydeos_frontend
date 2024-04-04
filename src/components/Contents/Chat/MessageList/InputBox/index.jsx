import TextField from '@mui/material/TextField';
import * as React from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import YouTubeIcon from '@mui/icons-material/YouTube';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MessageUtil from '../../../../../util/io_utils/MessageUtil';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function (props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [text, setText] = React.useState(null);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);

  };
  const handleSend = () => {
    if (!text) {
      return
    }
    MessageUtil.sendMessage()
    console.log(text);
  }
  const picUploadHandler = () => {
    console.log("sdubfiuebfuie")
  }
  const voiUploadHandler = () => {
    console.log("sdubfiuebfuie")
  }
  const vidUploadHandler = () => {
    console.log("sdubfiuebfuie")
  }



  return (
    <Stack direction="row" sx={{ width: "90%", marginLeft: 2, marginBottom: 2 }} spacing={2}>
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Attachments
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >

          <input id="uploadPic" type="file" onChange={picUploadHandler} hidden></input>
          <input id="uploadVid" type="file" onChange={vidUploadHandler} hidden></input>
          <input id="uploadVoi" type="file" onChange={voiUploadHandler} hidden></input>

          <label htmlFor="uploadPic">
            <MenuItem onClick={handleClose}><AddPhotoAlternateIcon></AddPhotoAlternateIcon>Pictures</MenuItem>
          </label>

          <label htmlFor="uploadVid">
            <MenuItem onClick={handleClose}><YouTubeIcon></YouTubeIcon>Videos</MenuItem>
          </label>

          <label htmlFor="uploadVoi">
            <MenuItem onClick={handleClose}><KeyboardVoiceIcon></KeyboardVoiceIcon>Voices</MenuItem>

          </label>

        </Menu>
      </div>
      <TextField sx={{ width: "70%" }} onChange={(event) => {
        setText(event.target.value);
      }} />
      <Button sx={{ width: "20%" }} variant="outlined" onClick={handleSend}>Send</Button>
    </Stack>

  );
}