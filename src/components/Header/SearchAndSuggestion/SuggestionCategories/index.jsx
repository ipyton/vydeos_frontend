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

    return (
        <Stack direction="row">
            <Checkbox
  {...label}
  id="category"
  icon={<PermContactCalendarOutlinedIcon sx={{ color: iconColor }} />}
  checkedIcon={<PermContactCalendarIcon sx={{ color: iconColor }} />}
  onChange={() => handleClick(0)}
  checked={categorySelected[0]}
/>

<Checkbox
  id="category"
  {...label}
  icon={<SpeakerNotesOutlinedIcon sx={{ color: iconColor }} />}
  checkedIcon={<SpeakerNotesIcon sx={{ color: iconColor }} />}
  onChange={() => handleClick(1)}
  checked={categorySelected[1]}
/>

<Checkbox
  id="category"
  {...label}
  icon={<MovieCreationOutlinedIcon sx={{ color: iconColor }} />}
  checkedIcon={<MovieIcon sx={{ color: iconColor }} />}
  onChange={() => handleClick(2)}
  checked={categorySelected[2]}
/>

<Checkbox
  id="category"
  {...label}
  icon={<MusicNoteOutlinedIcon sx={{ color: iconColor }} />}
  checkedIcon={<MusicNoteIcon sx={{ color: iconColor }} />}
  onChange={() => handleClick(3)}
  checked={categorySelected[3]}
/>

<Checkbox
  id="category"
  {...label}
  icon={<NewspaperOutlinedIcon sx={{ color: iconColor }} />}
  checkedIcon={<NewspaperIcon sx={{ color: iconColor }} />}
  onChange={() => handleClick(4)}
  checked={categorySelected[4]}
/>

<IconButton id="category" onClick={clear}>
  <NotInterestedIcon sx={{ color: iconColor }} />
</IconButton>
        </Stack>)
}
