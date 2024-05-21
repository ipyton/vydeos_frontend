import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import VideoUtil from '../../../util/io_utils/VideoUtil';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
export default function Downloads() {
    const [checked, setChecked] = React.useState([]);
    const [downloadsRecords, setDownloadsRecords] = React.useState([1, 2, 3, 4, 5, 6])

    // React.useEffect(() => {
    //     VideoUtil.check_current_download_status(setDownloadsRecords)
    // })

    React.useEffect(() => {
        VideoUtil.check_current_download_status(setDownloadsRecords)
    }, [])


    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const handleStop = () => {
        VideoUtil.batchStop(checked, downloadsRecords, setDownloadsRecords)
        console.log(checked)
    }

    const handlePause = () => {
        console.log(checked)
        // for (let i = 0; i < checked.length; i++) {

        //     list.push(downloadsRecords[checked[i]])
        // }
        VideoUtil.batchPause(checked, downloadsRecords, setDownloadsRecords)
    }

    const handleContinue = () => {
        VideoUtil.batchContinue(checked, downloadsRecords, setDownloadsRecords)
    }


    const handleRemove = () => {
        VideoUtil.batchRemove(checked, downloadsRecords, setDownloadsRecords)
    }

    console.log(downloadsRecords)
    return (
        <Stack spacing={2} direction="column" alignItems="center"
            justifyContent="center" >
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={handleStop}>stop</Button>
                <Button variant="contained" onClick={handlePause}>pause</Button>
                <Button variant="contained" onClick={handleContinue}>continue</Button>
                <Button variant="contained" onClick={handleRemove}>remove</Button>

            </Stack>

            <List dense sx={{ width: '80%', marginLeft: "10%", bgcolor: 'background.paper' }}>
                {downloadsRecords.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value}`;
                    return (
                        <ListItem
                            key={value.gid}
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    onChange={handleToggle(value)}
                                    checked={checked.indexOf(value) !== -1}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            }
                            spacing={2}
                        >


                            <Box sx={{ position: 'relative', display: 'inline-flex', }}>
                                <CircularProgress variant="determinate" value={value.total_size === 0 ? 0 : value.complete_size / value.total_size} />
                                <Box
                                    sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography variant="caption" component="div" color="text.secondary">
                                        {`${Math.round(value.total_size === 0 ? 0 : value.complete_size / value.total_size)}%`}
                                    </Typography>
                                </Box>
                            </Box>

                            <ListItemText id={labelId} primary={value.name} sx={{ paddingLeft: 2 }} secondary={value.speed + "kbps   " + value.complete_size + "k/" + value.total_size + "k" + "      " + value.status} />

                        </ListItem>
                    );
                })}
            </List>
        </Stack>


    );
}