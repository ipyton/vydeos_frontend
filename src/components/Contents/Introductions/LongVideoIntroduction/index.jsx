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
import { useThemeMode } from "../../../../Themes/ThemeContext";
import {ArrowBack as ArrowBackIcon} from "@mui/icons-material";

// Image component with consistent styling
function MovieImage({ src, alt }) {
  const { mode } = useThemeMode();
  
  return (
    <Box
      component="img"
      sx={{
        width: "100%",
        height: "auto",
        objectFit: "cover",
        borderRadius: 1,
        boxShadow: mode === "dark" ? "0px 3px 8px rgba(0, 0, 0, 0.5)" : 2,
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
  const { mode } = useThemeMode();
  const [playable, setPlayable] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const position = props.position || "center";
  const { showNotification } = useNotification();
  const isMobile = props.isMobile || false;

  // Theme colors based on mode
  const themeColors = {
    background: mode === "dark" ? "#121212" : "#ffffff",
    paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
    cardBg: mode === "dark" ? "#2d2d2d" : "#f5f5f5",
    text: {
      primary: mode === "dark" ? "#ffffff" : "#000000",
      secondary: mode === "dark" ? "#b0b0b0" : "#666666",
    },
    divider: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    icon: mode === "dark" ? "#90caf9" : "#1976d2",
  };

  // Common button styles for consistency
  const buttonStyles = {
    minWidth: { xs: "100%", sm: "140px" },
    height: { xs: "48px", sm: "40px" },
    fontSize: { xs: "0.875rem", sm: "0.875rem" },
    fontWeight: "medium",
    textTransform: "none",
    borderRadius: 1,
    "&.Mui-disabled": {
      color: mode === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
      bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
      borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    }
  };

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
  console.log(details);

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
  };

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

          VideoUtil.isPlayable(videoIdentifier)
            .then((res) => {
              try {
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
                setLoading(false);  // Execute regardless of success or failure
              }
            })
            .catch(error => {
              showNotification("Internal Error", "warning");
              setLoading(false);
            });
          
          setLoading(false);
        });
    }
  }, [videoIdentifier]);

  // Process genres into readable string
  const genresList = details?.genre_list?.join(", ") || "";

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh",
        color: themeColors.text.primary,
        bgcolor: themeColors.background
      }}>
        <CircularProgress color={mode === "dark" ? "info" : "primary"} />
        <Typography sx={{ ml: 2 }}>Loading movie details...</Typography>
      </Box>
    );
  }

  if (!details) {
    return (
      <Box sx={{ 
        textAlign: "center", 
        py: 4,
        color: themeColors.text.primary,
        bgcolor: themeColors.background
      }}>
        <Typography variant="h6">
          No movie details available
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="none" sx={{ 
      py: 4, 
      width: isMobile === true ? "100%" : '100%',
      bgcolor: themeColors.background,
    }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 2, 
        overflow: "hidden", 
        bgcolor: 'transparent',
        color: themeColors.text.primary
      }}>
        {/* Movie Details Section */}
        <Box >
          <Stack 
            direction={{ xs: "column", sm: "row" }}
            spacing={4} 
            sx={{ width: "100%" }}
          >
            {isMobile && props.onBack && (
              <IconButton
                onClick={() => props.onBack()}
                sx={{
                  color: themeColors.icon,
                  "&:hover": {
                    color: mode === "dark" ? "#b3e5fc" : "#0d47a1",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            {/* Movie Poster */}
            <Box sx={{ width: { xs: "100%", sm: "30%" }, mb: { xs: 2, sm: 0 } }}>
              <MovieImage src={details.poster} alt={details.movie_name} />
              
              {/* Action Buttons - Optimized for consistency */}
              <Box sx={{ mt: 2 }}>
                <Stack 
                  direction={{ xs: "column", sm: "column" }} 
                  spacing={1.5}
                  sx={{ width: "100%" }}
                >
                  <Button 
                    color={isStared ? "warning" : "primary"}
                    variant="contained"
                    onClick={isStared ? handleRemove : handleStar}
                    startIcon={isStared ? <StarIcon /> : <StarBorderIcon />}
                    sx={{
                      ...buttonStyles,
                      boxShadow: mode === "dark" ? '0px 3px 5px rgba(0, 0, 0, 0.5)' : 2,
                      "&:hover": {
                        boxShadow: mode === "dark" ? '0px 4px 8px rgba(0, 0, 0, 0.7)' : 4,
                      }
                    }}
                  >
                    {isStared ? "Remove Star" : "Add Star"}
                  </Button>
                  
                  <Button 
                    color="secondary"
                    variant="contained"
                    onClick={sendRequest} 
                    disabled={isDisabled}
                    startIcon={<MovieIcon />}
                    sx={{
                      ...buttonStyles,
                      boxShadow: mode === "dark" ? '0px 3px 5px rgba(0, 0, 0, 0.5)' : 2,
                      "&:hover": {
                        boxShadow: !isDisabled ? (mode === "dark" ? '0px 4px 8px rgba(0, 0, 0, 0.7)' : 4) : undefined,
                      }
                    }}
                  >
                    {isDisabled ? "Requested" : "Request Movie"}
                  </Button>
                </Stack>
              </Box>
            </Box>
            
            {/* Movie Info */}
            <Stack direction="column" spacing={2} sx={{ width: { xs: "100%", sm: "70%" } }}>
              {/* Movie Title and Tags */}
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {details.movie_name + " (" + details.type + ")"}
                  <IconButton 
                    color="primary" 
                    aria-label="play" 
                    size="large" 
                    disabled={!playable} 
                    onClick={handlePlay}
                    sx={{
                      color: playable ? themeColors.icon : (mode === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)"),
                      "&:hover": {
                        color: playable ? (mode === "dark" ? "#b3e5fc" : "#0d47a1") : undefined,
                      }
                    }}
                  >
                    <PlayCircleOutlineIcon />
                  </IconButton>
                </Typography>
                
                {details.tag && (
                  <Chip 
                    label={details.tag} 
                    size="small" 
                    color="primary" 
                    sx={{ 
                      mr: 1,
                      bgcolor: mode === "dark" ? "#0d47a1" : undefined,
                      color: mode === "dark" ? "#ffffff" : undefined
                    }} 
                  />
                )}
              </Box>
              
              <Divider sx={{ borderColor: themeColors.divider, padding: "0 16px"
               }} />
              
              {/* Movie Details */}
              <Stack spacing={2}>
                {/* Release Year */}
                <Card variant="outlined" sx={{ 
                  bgcolor: themeColors.cardBg,
                  borderColor: themeColors.divider
                }}>
                  <CardContent sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    py: 1, 
                    "&:last-child": { pb: 1 },
                    color: themeColors.text.primary
                  }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: themeColors.icon }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Release Year: {details.release_year}
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Genre */}
                <Card variant="outlined" sx={{ 
                  bgcolor: themeColors.cardBg,
                  borderColor: themeColors.divider
                }}>
                  <CardContent sx={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    py: 1, 
                    "&:last-child": { pb: 1 },
                    color: themeColors.text.primary
                  }}>
                    <CategoryIcon sx={{ mr: 1, mt: 0.5, color: themeColors.icon }} />
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
                            sx={{
                              borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.23)" : undefined,
                              color: themeColors.text.primary
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                {/* Introduction */}
                <Card variant="outlined" sx={{ 
                  bgcolor: themeColors.cardBg,
                  borderColor: themeColors.divider
                }}>
                  <CardContent sx={{ 
                    py: 1, 
                    "&:last-child": { pb: 1 },
                    color: themeColors.text.primary
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <DescriptionIcon sx={{ mr: 1, color: themeColors.icon }} />
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
                  <Card variant="outlined" sx={{ 
                    bgcolor: themeColors.cardBg,
                    borderColor: themeColors.divider
                  }}>
                    <CardContent sx={{ 
                      py: 1, 
                      "&:last-child": { pb: 1 },
                      color: themeColors.text.primary
                    }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Production Team
                      </Typography>
                      <List dense>
                        {Object.entries(details.makerList).map(([role, person], index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <Typography variant="body2" sx={{ 
                              fontWeight: "medium", 
                              width: "30%",
                              color: themeColors.text.primary
                            }}>
                              {role}:
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              ml: 2,
                              color: themeColors.text.secondary
                            }}>
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
        
        <Divider sx={{ borderColor: themeColors.divider, padding:"5px"}} />
        
        {/* Cast Section - Optimized for mobile */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ 
            display: "flex", 
            alignItems: "center",
            mb: 3,
            color: themeColors.text.primary
          }}>
            <StarIcon sx={{ mr: 1, color: mode === "dark" ? "#ffd54f" : "gold" }} />
            Cast Members
          </Typography>
          
          <ImageList
            sx={{
              gridTemplateColumns: {
                xs: "repeat(auto-fill, minmax(140px, 1fr))", // Increased from 140px for mobile
                sm: "repeat(auto-fill, minmax(200px, 1fr))",
                md: "repeat(auto-fill, minmax(220px, 1fr))", // Better spacing on larger screens
              },
              gap: { xs: 1.5, sm: 2 }, // Responsive gap
            }}
            cols={0} // Let CSS Grid handle the columns
          >
            {details.actressList.map((actor) => (
              <ImageListItem 
                key={actor.name} 
                sx={{ 
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: mode === "dark" ? "0px 3px 8px rgba(0, 0, 0, 0.5)" : 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  minHeight: { xs: "280px", sm: "320px" }, // Ensure consistent height
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: mode === "dark" ? "0px 6px 12px rgba(0, 0, 0, 0.7)" : 4,
                  }
                }}
              >
                <MovieImage src={actor.avatar} alt={actor.name} />
                <ImageListItemBar
                  title={actor.name}
                  subtitle={actor.character ? `Character: ${actor.character}` : ""}
                  sx={{
                    "& .MuiImageListItemBar-title": { 
                      fontWeight: "bold",
                      color: "#ffffff",
                      fontSize: { xs: "0.875rem", sm: "1rem" }, // Responsive font size
                    },
                    "& .MuiImageListItemBar-subtitle": {
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Responsive font size
                    },
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)",
                    "& .MuiImageListItemBar-titleWrap": {
                      padding: { xs: "8px 12px", sm: "12px 16px" }, // More padding on mobile
                    }
                  }}
                  actionIcon={
                    <IconButton
                      sx={{ 
                        color: "rgba(255, 255, 255, 0.8)",
                        size: { xs: "small", sm: "medium" }, // Responsive icon button size
                      }}
                      aria-label={`info about ${actor.name}`}
                    >
                      <InfoIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
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