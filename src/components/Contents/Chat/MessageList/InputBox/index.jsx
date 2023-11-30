import TextField from '@mui/material/TextField';
import * as React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';


export default function() {
    return (
        <Stack direction="row" sx={{width:"90%", marginBottom:0, marginLeft:"10%"}} spacing={2}>
            <TextField sx={{width:"70%"}}  />
            <Button sx={{width:"20%"}}  variant="outlined">Send</Button>
        </Stack>
          
      );
}