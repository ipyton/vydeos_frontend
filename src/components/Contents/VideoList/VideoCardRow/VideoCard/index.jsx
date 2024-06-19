import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import VideoUtil from '../../../../../util/io_utils/VideoUtil';
import { useNavigate } from 'react-router-dom';

export default function(props) {
  const {movieId, title, intro, actors, poster} = props
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("videoIntroduction", { state: movieId })
  }

  return (
  <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="140"
          image={poster}
          alt="poster"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {intro}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {actors}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}