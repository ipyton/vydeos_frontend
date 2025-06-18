import ListItemIcon from '@mui/material/ListItemIcon';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItem from '@mui/material/ListItem';
import CardMedia from '@mui/material/CardMedia';
import * as React from 'react';
import { useThemeMode } from '../../../../Themes/ThemeContext';

export default function (props) {
    let { title, introduction, pics, type } = props.searchResult
    let { setSuggestionOpen } = props
    const { mode } = useThemeMode();
    let miniture = (<div></div>)
    
    // 毛玻璃效果颜色配置
    const bgColor = mode === 'dark' 
        ? 'rgba(42, 42, 42, 0.7)' 
        : 'rgba(255, 255, 255, 0.7)';
    const textColor = mode === 'dark' ? '#fff' : '#000';
    const secondaryTextColor = mode === 'dark' ? '#aaa' : '#555';
    
    // hover 状态的毛玻璃效果
    const hoverBgColor = mode === 'dark' 
        ? 'rgba(60, 60, 60, 0.8)' 
        : 'rgba(240, 240, 240, 0.8)';

    const handleSuggestionSelection = (event) => {
        setSuggestionOpen(null)
    }
    
    if (type === "contact") {
        miniture = (
            <ListItemAvatar>
                <Avatar 
                    alt="Cindy Baker" 
                    src={pics}
                    sx={{
                        // 为头像添加轻微的毛玻璃边框效果
                        border: '2px solid',
                        borderColor: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : 'rgba(0, 0, 0, 0.1)',
                        boxShadow: mode === 'dark' 
                            ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
                            : '0 4px 16px rgba(0, 0, 0, 0.1)',
                    }}
                />
            </ListItemAvatar>
        )
    } else if (type === "movie") {
        miniture = (
            <ListItemAvatar>
                <Avatar
                    variant="square"
                    src={"https://handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg"}
                    alt="Paella dish"
                    sx={{
                        borderRadius: '8px', // 给方形头像添加圆角
                        border: '2px solid',
                        borderColor: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : 'rgba(0, 0, 0, 0.1)',
                        boxShadow: mode === 'dark' 
                            ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
                            : '0 4px 16px rgba(0, 0, 0, 0.1)',
                    }}
                />
            </ListItemAvatar>
        )
    }

    return (
        <ListItemButton 
            onClick={handleSuggestionSelection} 
            sx={{ 
                backgroundColor: bgColor,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: '8px',
                margin: '4px 8px',
                border: '1px solid',
                borderColor: mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    backgroundColor: hoverBgColor,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderColor: mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: mode === 'dark' 
                        ? '0 6px 20px rgba(0, 0, 0, 0.4)' 
                        : '0 6px 20px rgba(0, 0, 0, 0.15)',
                },
                '&:active': {
                    transform: 'translateY(0px)',
                    boxShadow: mode === 'dark' 
                        ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                }
            }}
        >
            <ListItem alignItems="flex-start" sx={{ padding: '8px 0' }}>
                {miniture}
                <ListItemText
                    primary={title}
                    secondary={
                        <React.Fragment>
                            {introduction}
                        </React.Fragment>
                    }
                    primaryTypographyProps={{ 
                        sx: { 
                            color: textColor,
                            fontWeight: 500, // 稍微加粗标题
                        } 
                    }}
                    secondaryTypographyProps={{ 
                        sx: { 
                            color: secondaryTextColor,
                            opacity: 0.8, // 稍微降低副文本透明度
                        } 
                    }}
                />
            </ListItem>
        </ListItemButton>
    )
}