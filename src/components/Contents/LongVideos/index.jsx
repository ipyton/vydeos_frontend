import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import LongVideo from "./LongVideo";

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';


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
  return (


    
    <div >
      <Stack sx={{marginLeft:"10%", marginTop:"10%",width:"80%"}}>
        <Item>
          <Stack direction="row" spacing={2}>
          <Item sx={{width:"70%",height:"20%"}}>
            <Stack spacing={2}>
              <Item></Item>
              <Item>          <LongVideo></LongVideo></Item>

            </Stack>

          </Item>
          <Item>
            yaoyaolingxian
          </Item>
          </Stack>
        </Item>

        <Item>

          yaoyaolingxian
        </Item>


      </Stack>
    </div>

  );
}
