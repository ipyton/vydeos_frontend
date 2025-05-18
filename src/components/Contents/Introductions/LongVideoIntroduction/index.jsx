import React, { useState, useEffect } from "react";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  List,
  ListItem,
  Divider,
  ListItemText,
  Typography,
  ButtonGroup,
  Paper,
  Button,
  Box,
  IconButton,
  Card,
  CardContent,
  Chip,
  Avatar,
  CircularProgress,
  Container,
} from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import InfoIcon from "@mui/icons-material/Info";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MovieIcon from "@mui/icons-material/Movie";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import { useLocation, useNavigate } from "react-router-dom";
import VideoUtil from "../../../../util/io_utils/VideoUtil";
import { useNotification } from "../../../../Providers/NotificationProvider";

// Image component with consistent styling
function MovieImage({ src, alt }) {
  return (
    <Box
      component="img"
      sx={{
        width: "100%",
        height: "auto",
        objectFit: "cover",
        borderRadius: 1,
        boxShadow: 2,
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
      alt={alt || "Movie image"}
      src={src}
      loading="lazy"
    />
  );
}

export default function MovieDetails(props) {
  const [details, setDetails] = useState(null);
  const [videoIdentifier, setVideoIdentifier] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isStared, setIsStared] = useState(false);
  const [loading, setLoading] = useState(true);

  const [playable, setPlayable] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()
  const position = props.position || "center";
  const { showNotification } = useNotification();
  

  // Handle initialization from props or route state
  useEffect(() => {
    if (location.state) {
      console.log("Location state:", location.state);
      //resourceId: videoIdentifier.id, type: videoIdentifier.type
      setVideoIdentifier({resource_id: location.state.resourceId, type: location.state.type});
    }
    
    if (props.content) {
      console.log("Props content:", props.content);

      setVideoIdentifier(props.content);
    }
  }, [props.content, location.state]);
  console.log(details)

  // Handle star/favorite action
  const handleStar = () => {
    VideoUtil.star(videoIdentifier).then(function (response) {
      if (!response) {
        console.log("Error starring movie");
        return;
      }
      
      if (response.data === "success") {
        setIsStared(true);
      }
    });
  };

  // Handle remove from favorites action
  const handleRemove = () => {
    VideoUtil.removeStar(videoIdentifier).then(function (response) {
      if (!response) {
        console.log("Error removing star");
        return;
      }
      
      if (response.data === "success") {
        setIsStared(false);
      }
    });
  };

  // Handle request movie action
  const sendRequest = () => {
    VideoUtil.sendRequest(videoIdentifier).then(() => {
      setIsDisabled(true);
    });
  };

  const handlePlay = () => {
    navigate("/longvideos", { state: videoIdentifier });
  }

  // Load movie data and status
  useEffect(() => {
    if (videoIdentifier) {
      setLoading(true);
      
      VideoUtil.getVideoInformation(videoIdentifier, setDetails)
        .then((res) => {
          
          setIsDisabled(false);
          
          // Check if already requested
          VideoUtil.isRequested(videoIdentifier).then((res) => {
            if (res.data === true) {
              setIsDisabled(true);
            }
          });
          
          // Check if already starred
          VideoUtil.isStared(videoIdentifier).then((res) => {
            if (res.data.code === 0) {
              if (res.data.message === "stared") {
                setIsStared(true);

              } else {
                setIsStared(false);
              }
            } else {
              setIsStared(false);
            }
          });

          VideoUtil.isPlayable(videoIdentifier).then((res) => {
            try {
              console.log(res.data)
                if (res.data && res.data.code === 0) {
                    if (res.data.message === "true") {
                        setPlayable(true);
                    } else {
                        setPlayable(false);
                    }
                }
            } catch (err) {
                showNotification(`Error: ${err.message}`, "error");
                setPlayable(false);
            } finally {
                setLoading(false);  // 无论成功或失败都执行
            }
        })
        .catch(error => {
            showNotification("Internal Error", "warning");
            setLoading(false);
        });
          
          setLoading(false);
        })

    }
  }, [videoIdentifier]);

  // Process genres into readable string
  const genresList = details?.genre_list?.join(", ") || "";

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading movie details...</Typography>
      </Box>
    );
  }

  if (!details) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No movie details available
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="none"  sx={{ py: 4,    width: 'calc(100% - 80px)', }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Movie Details Section */}
        <Box sx={{ p: 3 }}>
          <Stack 
            direction={{ xs: "column", sm: "row" }}
            spacing={4} 
            sx={{ width: "100%" }}
          >
            {/* Movie Poster */}
            <Box sx={{ width: { xs: "100%", sm: "30%" }, mb: { xs: 2, sm: 0 } }}>
              <MovieImage src={details.poster} alt={details.movie_name} />
              
              {/* Action Buttons */}
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <ButtonGroup variant="contained" sx={{ boxShadow: 2 }}>
                  <Button 
                    color={isStared ? "warning" : "primary"}
                    onClick={isStared ? handleRemove : handleStar}
                    startIcon={isStared ? <StarIcon /> : <StarBorderIcon />}
                  >
                    {isStared ? "Unstar" : "Star"}
                  </Button>
                  <Button 
                    color="secondary"
                    onClick={sendRequest} 
                    disabled={isDisabled}
                    startIcon={<MovieIcon />}
                  >
                    Request
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
            
            {/* Movie Info */}
            <Stack direction="column" spacing={2} sx={{ width: { xs: "100%", sm: "70%" } }}>
              {/* Movie Title and Tags */}
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {details.movie_name + "("+ details.type + ")"}
                  <IconButton color="primary" aria-label="delete" size="large" disabled={!playable}  onClick={handlePlay}>
                  <PlayCircleOutlineIcon/>
</IconButton>
                </Typography>
                
                {details.tag && (
                  <Chip 
                    label={details.tag} 
                    size="small" 
                    color="primary" 
                    sx={{ mr: 1 }} 
                  />
                )}
              </Box>
              
              <Divider />
              
              {/* Movie Details */}
              <Stack spacing={2}>
                {/* Release Year */}
                <Card variant="outlined" sx={{ bgcolor: "background.paper" }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", py: 1, "&:last-child": { pb: 1 } }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Release Year: {details.release_year}
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Genre */}
                <Card variant="outlined" sx={{ bgcolor: "background.paper" }}>
                  <CardContent sx={{ display: "flex", alignItems: "flex-start", py: 1, "&:last-child": { pb: 1 } }}>
                    <CategoryIcon sx={{ mr: 1, mt: 0.5, color: "primary.main" }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Genres:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                        {details.genre_list.map((genre, index) => (
                          <Chip 
                            key={index} 
                            label={genre} 
                            size="small" 
                            variant="outlined" 
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                {/* Introduction */}
                <Card variant="outlined" sx={{ bgcolor: "background.paper" }}>
                  <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        Introduction
                      </Typography>
                    </Box>
                    <Typography variant="body2" component="div" sx={{ pl: 3 }}>
                      {details.introduction}
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Creators/Makers List */}
                {details.makerList && Object.keys(details.makerList).length > 0 && (
                  <Card variant="outlined" sx={{ bgcolor: "background.paper" }}>
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Production Team
                      </Typography>
                      <List dense>
                        {Object.entries(details.makerList).map(([role, person], index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: "medium", width: "30%" }}>
                              {role}:
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 2 }}>
                              {person}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
        
        <Divider />
        
        {/* Cast Section */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ 
            display: "flex", 
            alignItems: "center",
            mb: 3 
          }}>
            <StarIcon sx={{ mr: 1, color: "gold" }} />
            Cast Members
          </Typography>
          
          <ImageList
            sx={{
              gridTemplateColumns: {
                xs: "repeat(auto-fill, minmax(140px, 1fr))",
                sm: "repeat(auto-fill, minmax(200px, 1fr))",
              },
              gap: 2,
            }}
            cols={5}
          >
            {details.actressList.map((actor) => (
              <ImageListItem 
                key={actor.name} 
                sx={{ 
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  }
                }}
              >
                <MovieImage src={actor.avatar} alt={actor.name} />
                <ImageListItemBar
                  title={actor.name}
                  subtitle={actor.character ? `Character: ${actor.character}` : ""}
                  sx={{
                    "& .MuiImageListItemBar-title": { fontWeight: "bold" },
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                      aria-label={`info about ${actor.name}`}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Paper>
    </Container>
  );
}