import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import MovieIcon from '@mui/icons-material/Movie';
import Stack from '@mui/material/Stack';
import { Check } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import { useThemeMode } from '../../../../Themes/ThemeContext';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// Define colors for each category
const categoryColors = [
    '#4CAF50', // Calendar - Green
    '#2196F3', // Notes - Blue
    '#FF9800', // Movie - Orange
    '#E91E63', // Music - Pink
    '#9C27B0', // News - Purple
];

export default function (props) {
    let { setCategory, setCategorySelected, categorySelected } = props
    let handleClick = (idx) => {
        setCategory(true);
        const newCategorySelected = categorySelected.map((c, i) => i === idx);
        setCategorySelected(newCategorySelected);
    };
    let clear = () => {
        setCategory(true)
        setCategorySelected([false, false, false, false, false])
    }
    const { mode } = useThemeMode();
    const iconColor = mode === 'dark' ? '#ffffff' : '#000000';

    // Function to get icon color based on selection state
    const getIconColor = (index, isSelected) => {
        return isSelected ? categoryColors[index] : iconColor;
    };

    // Function to get background color for selected items
    const getSelectedBackground = (index, isSelected) => {
        if (!isSelected) return 'transparent';
        return mode === 'dark' 
            ? `${categoryColors[index]}20` // 20 = 12.5% opacity in hex
            : `${categoryColors[index]}15`; // 15 = ~8% opacity in hex
    };

    return (
        <Stack 
            direction="row" 
            sx={{
                // 为整个分类栏添加毛玻璃背景
                backgroundColor: mode === 'dark' 
                    ? 'rgba(45, 45, 45, 0.6)' 
                    : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '8px',
                padding: '4px 8px',
                margin: '8px',
                border: '1px solid',
                borderColor: mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
            }}
        >
            <Checkbox
                {...label}
                id="category"
                icon={<PermContactCalendarOutlinedIcon sx={{ color: getIconColor(0, categorySelected[0]) }} />}
                checkedIcon={<PermContactCalendarIcon sx={{ color: getIconColor(0, categorySelected[0]) }} />}
                onChange={() => handleClick(0)}
                checked={categorySelected[0]}
                sx={{
                    backgroundColor: getSelectedBackground(0, categorySelected[0]),
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: categorySelected[0] 
                            ? `${categoryColors[0]}30`
                            : mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.05)',
                    }
                }}
            />

            <Checkbox
                id="category"
                {...label}
                icon={<SpeakerNotesOutlinedIcon sx={{ color: getIconColor(1, categorySelected[1]) }} />}
                checkedIcon={<SpeakerNotesIcon sx={{ color: getIconColor(1, categorySelected[1]) }} />}
                onChange={() => handleClick(1)}
                checked={categorySelected[1]}
                sx={{
                    backgroundColor: getSelectedBackground(1, categorySelected[1]),
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: categorySelected[1] 
                            ? `${categoryColors[1]}30`
                            : mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.05)',
                    }
                }}
            />

            <Checkbox
                id="category"
                {...label}
                icon={<MovieCreationOutlinedIcon sx={{ color: getIconColor(2, categorySelected[2]) }} />}
                checkedIcon={<MovieIcon sx={{ color: getIconColor(2, categorySelected[2]) }} />}
                onChange={() => handleClick(2)}
                checked={categorySelected[2]}
                sx={{
                    backgroundColor: getSelectedBackground(2, categorySelected[2]),
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: categorySelected[2] 
                            ? `${categoryColors[2]}30`
                            : mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.05)',
                    }
                }}
            />

            <Checkbox
                id="category"
                {...label}
                icon={<MusicNoteOutlinedIcon sx={{ color: getIconColor(3, categorySelected[3]) }} />}
                checkedIcon={<MusicNoteIcon sx={{ color: getIconColor(3, categorySelected[3]) }} />}
                onChange={() => handleClick(3)}
                checked={categorySelected[3]}
                sx={{
                    backgroundColor: getSelectedBackground(3, categorySelected[3]),
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: categorySelected[3] 
                            ? `${categoryColors[3]}30`
                            : mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.05)',
                    }
                }}
            />

            <Checkbox
                id="category"
                {...label}
                icon={<NewspaperOutlinedIcon sx={{ color: getIconColor(4, categorySelected[4]) }} />}
                checkedIcon={<NewspaperIcon sx={{ color: getIconColor(4, categorySelected[4]) }} />}
                onChange={() => handleClick(4)}
                checked={categorySelected[4]}
                sx={{
                    backgroundColor: getSelectedBackground(4, categorySelected[4]),
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: categorySelected[4] 
                            ? `${categoryColors[4]}30`
                            : mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.05)',
                    }
                }}
            />

            <IconButton 
                id="category" 
                onClick={clear}
                sx={{
                    '&:hover': {
                        backgroundColor: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(0, 0, 0, 0.05)',
                    }
                }}
            >
                <NotInterestedIcon sx={{ color: iconColor }} />
            </IconButton>
        </Stack>
    )
}