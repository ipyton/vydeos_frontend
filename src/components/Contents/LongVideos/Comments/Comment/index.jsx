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
import { useThemeMode } from '../../../../../Themes/ThemeContext'; 

// 动态样式化的评论容器
const CommentContainer = styled(Paper)(({ theme, isDarkMode }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: isDarkMode ? '#1e1e1e' : theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  border: isDarkMode ? '1px solid #333' : 'none',
  color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: isDarkMode ? '#252525' : theme.palette.action.hover,
    transform: 'translateY(-1px)',
    boxShadow: isDarkMode 
      ? '0 4px 8px rgba(0,0,0,0.3)' 
      : theme.shadows[2]
  }
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

// 动态样式化的头像
const StyledAvatar = styled(Avatar)(({ theme, isDarkMode }) => ({
  width: 48,
  height: 48,
  alignSelf: 'flex-start',
  backgroundColor: isDarkMode ? '#404040' : theme.palette.primary.main,
  color: isDarkMode ? '#ffffff' : 'white',
  border: isDarkMode ? '2px solid #555' : 'none',
  transition: 'all 0.2s ease'
}));

// 动态样式化的图标按钮
const StyledIconButton = styled(IconButton)(({ theme, isDarkMode }) => ({
  color: isDarkMode ? '#b0b0b0' : theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: isDarkMode ? '#333' : theme.palette.action.hover,
    color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
    transform: 'scale(1.1)'
  }
}));

// 动态样式化的喜欢按钮
const LikeButton = styled(IconButton)(({ theme, isDarkMode }) => ({
  color: theme.palette.error.main,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: isDarkMode 
      ? 'rgba(244, 67, 54, 0.1)' 
      : 'rgba(244, 67, 54, 0.04)',
    transform: 'scale(1.1)'
  }
}));

export default function Comment({
  avatar = "unknown",
  name = "Unknown User", 
  content = "No content",
  likes = 0,
  subComments = []
}) {
  const { mode } = useThemeMode();
  const isDarkMode = mode === 'dark';

  // 动态文字样式
  const getTextStyles = () => ({
    userName: {
      color: isDarkMode ? '#ffffff' : 'text.primary',
      fontWeight: 'bold'
    },
    content: {
      color: isDarkMode ? '#e0e0e0' : 'text.secondary'
    },
    likes: {
      color: isDarkMode ? '#b0b0b0' : 'text.secondary'
    }
  });

  const textStyles = getTextStyles();

  return (
    <CommentContainer 
      elevation={isDarkMode ? 3 : 0} 
      isDarkMode={isDarkMode}
    >
      <StyledAvatar
        src={typeof avatar === 'string' ? avatar : undefined}
        isDarkMode={isDarkMode}
      >
        {typeof avatar !== 'string' ? avatar : name[0]}
      </StyledAvatar>
      
      <CommentContent>
        <Typography
          variant="subtitle2"
          sx={textStyles.userName}
        >
          {name}
        </Typography>
        
        <Typography
          variant="body2"
          sx={textStyles.content}
          paragraph
        >
          {content}
        </Typography>
        
        <ActionSection>
          <Typography
            variant="caption"
            sx={textStyles.likes}
          >
            {likes} Likes
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <StyledIconButton 
              size="small"
              isDarkMode={isDarkMode}
              aria-label="分享评论"
            >
              <ShareIcon fontSize="small" />
            </StyledIconButton>
            
            <LikeButton 
              size="small"
              isDarkMode={isDarkMode}
              aria-label="点赞评论"
            >
              <FavoriteIcon fontSize="small" />
            </LikeButton>
          </Box>
        </ActionSection>

        {/* 子评论区域 */}
        {subComments && subComments.length > 0 && (
          <Box 
            sx={{ 
              mt: 2, 
              pl: 2, 
              borderLeft: `2px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f9f9f9',
              borderRadius: 1,
              padding: 1
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: isDarkMode ? '#b0b0b0' : 'text.secondary',
                fontWeight: 'medium'
              }}
            >
              {subComments.length} replies
            </Typography>
            
            <Stack spacing={1} sx={{ mt: 1 }}>
              {subComments.slice(0, 3).map((subComment, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 1, 
                    backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
                    borderRadius: 1,
                    border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode ? '#ffffff' : 'text.primary',
                      fontWeight: 'medium'
                    }}
                  >
                    {subComment.name || 'Anonymous'}:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? '#e0e0e0' : 'text.secondary',
                      ml: 1,
                      display: 'inline'
                    }}
                  >
                    {subComment.content || 'No content'}
                  </Typography>
                </Box>
              ))}
              
              {subComments.length > 3 && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isDarkMode ? '#4fc3f7' : 'primary.main',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  See {subComments.length - 3} replies...
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </CommentContent>
    </CommentContainer>
  );
}