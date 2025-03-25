import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function(props) {
  const {movieId, movie_name, release_year,poster} = props
  console.log(props)
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("/videoIntroduction", { state: movieId })
  }

  return (
  <Card sx={{ width:"25%",height:"auto" }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          image={poster}
          alt="poster"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {movie_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {release_year}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}