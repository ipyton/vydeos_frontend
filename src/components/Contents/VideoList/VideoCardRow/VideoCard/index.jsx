import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function(props) {
  const content = props.content
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("/videoIntroduction", { state:content })
  }

  return (
  <Card sx={{ width:"25%",height:"auto" }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          image={content.poster}
          alt="poster"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {content.movieName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {content.releaseYear}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}