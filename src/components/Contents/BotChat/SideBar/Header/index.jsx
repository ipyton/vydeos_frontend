import * as React from 'react';
import Chip from '@mui/material/Chip';
import { Button } from '@mui/material';

export default function Header(){
    return (<Button sx={{height:"80px"}}  component="a" href="#basic-chip">Start a new session</Button>)
}