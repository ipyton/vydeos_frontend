import { Stack } from "@mui/material";
import { Paper } from "@mui/material";

import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton } from "rsuite";

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
    if (undefined === likes) {
        likes = 0
    }
    return (
        <Stack direction="row">
            <Item sx={{ boxShadow: 0 }}>
                {avatar}
            </Item>
            <Item sx={{width:"90%"}}>
                <Stack>
                    <Item sx={{ textAlign: "left", boxShadow: 0 }}>{name}</Item>
                    <Item sx={{ textAlign: "left", boxShadow: 0 }}>{content}</Item>
                    <Item sx={{ boxShadow: 0 }}>
                        <Stack direction="row" justifyContent="flex-end">
                            <Item sx={{ boxShadow: 0 }}>
                                <IconButton>
                                    <ShareIcon fontSize="small">
                                    </ShareIcon>
                                </IconButton>
                            </Item>
                            <Item sx={{ boxShadow: 0 }}>
                                {likes}
                                <IconButton>
                                    
                                    <FavoriteIcon fontSize="small">
                                    </FavoriteIcon>
                                </IconButton>
                            </Item>
                        </Stack>
                    </Item>
                </Stack>
            </Item>
        </Stack>

    )    
}