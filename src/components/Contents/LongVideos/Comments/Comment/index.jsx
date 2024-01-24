import { Stack } from "@mui/material";
import { Paper } from "@mui/material";

import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  

export default function Comment(params) {

    let {avatar, name, content, likes, subComments} = params
    if (undefined === avatar) {
        avatar = "unknown"
    }

    if (undefined === name) {
        name = "unknown"
    }
    if (undefined === content) {
        content = "unknown"
    }
    
    return (
        <Stack  direction="row">
            <Item >
                {avatar}
            </Item>
            <Item sx={{width:"90%"}}>
                <Stack>
                    <Item sx={{textAlign:"left"}}>{name}</Item>
                    <Item sx={{textAlign:"left"}}>{content}</Item>
                    <Item>share/likes</Item>
                </Stack>
            </Item>
        </Stack>

    )    
}