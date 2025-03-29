import React from 'react';
import { 
  Stack, 
  Paper, 
  Avatar, 
  Typography, 
  IconButton, 
  Box 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const CommentContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2)
}));

const CommentContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: theme.spacing(2)
}));

const ActionSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1)
}));

export default function Comment({
  avatar = "unknown",
  name = "Unknown User",
  content = "No content",
  likes = 0,
  subComments = []
}) {
  return (
    <CommentContainer elevation={0}>
      <Avatar 
        src={typeof avatar === 'string' ? avatar : undefined}
        sx={{ 
          width: 48, 
          height: 48, 
          alignSelf: 'flex-start' 
        }}
      >
        {typeof avatar !== 'string' ? avatar : name[0]}
      </Avatar>

      <CommentContent>
        <Typography 
          variant="subtitle2" 
          fontWeight="bold" 
          color="text.primary"
        >
          {name}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
        >
          {content}
        </Typography>

        <ActionSection>
          <Typography 
            variant="caption" 
            color="text.secondary"
          >
            {likes} Likes
          </Typography>

          <Box>
            <IconButton size="small">
              <ShareIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error">
              <FavoriteIcon fontSize="small" />
            </IconButton>
          </Box>
        </ActionSection>
      </CommentContent>
    </CommentContainer>
  );
}