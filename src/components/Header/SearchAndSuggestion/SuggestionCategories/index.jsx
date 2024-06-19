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

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export default function (props) {
    let { setCategory, setCategorySelected, categorySelected } = props
    let handleClick = (idx) => {
        setCategory(true)

        return () => {
            const newCategorySelected = categorySelected.map((c, i) => {
                if (i === idx) {
                    return true
                }
                else {
                    return false
                }
            })
            setCategorySelected(newCategorySelected)
        }
    }
    let clear = () => {
        setCategory(true)
        setCategorySelected([false, false, false, false, false])
    }

    return (
        <Stack direction="row">
            <Checkbox {...label} id="category" icon={<PermContactCalendarOutlinedIcon />}
                checkedIcon={<PermContactCalendarIcon />} onChange={handleClick(0)} checked={categorySelected[0]} />
            <Checkbox
                id="category"
                {...label}
                icon={<SpeakerNotesOutlinedIcon />}
                checkedIcon={<SpeakerNotesIcon />}
                onChange={handleClick(1)}
                checked={categorySelected[1]} />
            <Checkbox
                id="category"
                {...label}
                icon={<MovieCreationOutlinedIcon />}
                checkedIcon={<MovieIcon />}
                onChange={handleClick(2)}
                checked={categorySelected[2]} />
            {/* music */}
            <Checkbox
                id="category"
                {...label}
                icon={<MusicNoteOutlinedIcon />}
                checkedIcon={<MusicNoteIcon />}
                onChange={handleClick(3)}
                checked={categorySelected[3]} />
            {/* posts */}
            <Checkbox
                id="category"
                {...label}
                icon={<NewspaperOutlinedIcon />}
                checkedIcon={<NewspaperIcon />}
                onChange={handleClick(4)}
                checked={categorySelected[4]} />

            <IconButton id="category"
                onClick={clear}
            >
                <NotInterestedIcon id="category" />
            </IconButton>
        </Stack>)
}
