import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import LongVideo from "./LongVideo";

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Comments from "./Comments";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,

}));



export default function LongVideos(props) {

//   const videoRef = React.useRef(null);
//   const playerRef = React.useRef(null);
//   const { options, onReady } = props;

//   React.useEffect(() => {
//     // make sure Video.js player is only initialized once
//     if (!playerRef.current) {
//       const videoElement = videoRef.current;
//       if (!videoElement) return;

//       const player = playerRef.current = videojs(videoElement, options, () => {
//         console.log("player is ready");
//         onReady && onReady(player);
//       });
//     } else {
//       // you can update player here [update player through props]
//       // const player = playerRef.current;
//       // player.autoplay(options.autoplay);
//       // player.src(options.sources);
//     }
//   }, [options, videoRef]);

//   // Dispose the Video.js player when the functional component unmounts
//   React.useEffect(() => {
//     const player = playerRef.current;

//     return () => {
//       if (player) {
//         player.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, [playerRef]);
    let a =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,25,324,543,52,34]
    const playerRef = React.useRef(null);
    videojs.Vhs.xhr.beforeRequest = function (options) {
      let headers = options.headers || {};
      headers["token"] = "J2LqH1mnoXE0ZL5typ3VT3n4fe7RFYAO";
    
      options.headers = headers;
    
      console.log("options", options);
    
      return options;
    }
    const videoJsOptions = {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      fill: true,
      sources: [{
        src: "http://192.168.23.129/videos/longvideos/output/a.m3u8",
        type: "application/x-mpegURL"
      }]
      ,playbackRates:[1,2,3]
    }
    const handlePlayerReady = (player) => {
      playerRef.current = player;

      // You can handle player events here, for example:
      player.on('waiting', () => {
        videojs.log('player is waiting');
      });
      
      player.on('dispose', () => {
        videojs.log('player will dispose');
      });
    }

    let playList = false

  return (
    <div >
      <Stack sx={{marginLeft:"10%",width:"80%"}}>
        <Item sx={{ boxShadow: 0 }}>
          <Stack direction="row" spacing={2}>
            <Item sx={{ width: "70%", height: "20%", boxShadow: 0 }}>
            <Stack spacing={2}>
                <Item sx={{ textAlign: "left", fontSize: 20, boxShadow: 0 }}>this is a title</Item>
              <Item>
                <LongVideo options={videoJsOptions} onReady={handlePlayerReady}></LongVideo>
              </Item>
            </Stack>

          </Item>
          <Item sx={{textAlign:"left", width:"30%"}}>
            PlayList
            <Stack>
              <Item >sdif</Item>
              <Item>afdis</Item>
            </Stack>
          </Item>
          </Stack>
        </Item>
        <Item sx={{ textAlign: "left", boxShadow: 0 }}> 
          Comments
        </Item>
        <Item sx={{ boxShadow: 0 }}>
          <Comments commentList={[]}></Comments>
        </Item>


      </Stack>
    </div>

  );
}
