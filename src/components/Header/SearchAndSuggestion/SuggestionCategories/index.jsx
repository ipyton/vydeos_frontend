import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import Stack from '@mui/material/Stack';
import { Check } from '@mui/icons-material';



const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


export default function(props) {
    let {setCategory, setCategorySelected, categorySelected} = props
    let handleClick = (idx) => {
        setCategory(true)
        return () => {
            const newCategorySelected = categorySelected.map((c, i) => {
                if (i === idx ) {
                    return true
                }
                else {
                    return false
                }

            })
            setCategorySelected(newCategorySelected)
        }
    }

    return (
    <Stack direction="row">
        <Checkbox {...label} id="category" icon={<PermContactCalendarOutlinedIcon/>} checkedIcon={<PermContactCalendarIcon/>} onChange={handleClick(0)} checked={categorySelected[0]} />
        <Checkbox
            id="category"
            {...label}
            icon={<SpeakerNotesOutlinedIcon />}
            checkedIcon={<SpeakerNotesIcon />}
            onChange={handleClick(1) }
            checked={categorySelected[1]}
        />
    </Stack> )
}
