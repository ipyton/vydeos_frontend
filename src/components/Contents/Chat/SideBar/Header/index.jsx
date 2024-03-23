import * as React from 'react';
import Chip from '@mui/material/Chip';

export default function Header(){
    return (<Chip sx={{height:"80px"}} label="Contacts" component="a" href="#basic-chip"/>)
}