import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { List } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

const style = {
    py: 0,
    width: '100%',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
    alignItems:"center",
    justify:"center"


};


export default function Trends() {


    let list = [{ title: "title", introduction: "this is an introduction", pic:""}, { title: "title", introduction: "this is an introduction", pic:"" }, { title: "title", introduction: "this is an introduction", pic:"" },
        { title: "title", introduction: "this is an introduction", pic: "" }, { title: "title", introduction: "this is an introduction", pic: "" }, { title: "title", introduction: "this is an introduction", pic: "" },
        { title: "title", introduction: "this is an introduction", pic: "" }, { title: "title", introduction: "this is an introduction", pic: "" }, { title: "title", introduction: "this is an introduction", pic: "" },
        { title: "title", introduction: "this is an introduction", pic: "" }, { title: "title", introduction: "this is an introduction", pic: "" }, { title: "title", introduction: "this is an introduction", pic: "" }
     ]

    return (<List sx={style} >

        {
            list.map((item,idx)=>{
                return (<ListItemButton
                    sx={{ left: "25%", width: "50%" }}
                >
                    <Card variant="outlined" sx={{ width: "100%" }} >
                        <Box sx={{ p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography gutterBottom variant="h6" component="div">
                                    {
                                        "#" + (idx  +1)
                                    }
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div">
                                    {
                                    item.title
                                    }
                                </Typography>

                            </Stack>
                            <Typography color="text.secondary" variant="body2">
                                {
                                    item.introduction
                                }
                            </Typography>
                        </Box>

                    </Card>
                </ListItemButton>)




            }) 
        }

    </List>)

}