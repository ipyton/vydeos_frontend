import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import VideoUtil from '../../../../util/io_utils/VideoUtil';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 8,
});



export default function UploadMovie() {
    let [state, setState] = React.useState({ "total_percent": 0, "state": "uploading" })
    let [title, setTitle] = React.useState("")
    let [introduction, setIntroduction] = React.useState("")


    let submit = (event) => {
        if (event.target.files[0] == null) {
            return false
        }
        let fileName = event.target.files[0].name
        let nameSlices = fileName.split(".")

        let extensionName = nameSlices[nameSlices.length - 1]
        let supportExtensionNames = ["avi", "mp4", "flv"]
        if (String.prototype.toLowerCase(extensionName) in supportExtensionNames) {
            VideoUtil.uploadVideos(title, introduction, event.target.files[0], setState)
        }
        else {
            return false
        }
    }

    let changeState = (changeState) => {
        return (event) => {
            changeState(event.target.value)
        }
    }


    return (
        <div>
            <Box sx={{ flexGrow: 1, marginLeft: "10%", width: "80%", marginTop: "5%" }}>
                <Stack spacing={{ xs: 1, sm: 2 }} useFlexGap flexWrap="wrap">
                    <Item><TextField onChange={changeState(setTitle)} id="outlined-basic" label="Video Title" variant="outlined" sx={{ width: "100%" }} /></Item>
                    <Item> <TextField onChange={changeState(setIntroduction)}
                        id="outlined-multiline-static"
                        label="Introduction"
                        multiline
                        rows={4}
                        sx={{ width: "100%" }} />
                    </Item>

                    <Item><Button component="label" variant="contained" startIcon={<CloudUploadIcon />} onChange={submit}>
                        Upload file
                        <VisuallyHiddenInput type="file" />
                    </Button></Item>

                </Stack>
            </Box>
        </div>
    );
}






