import { Stack } from '@mui/material';
import Header from './Header';
import Contact from './Contact';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function SideBar() {
    let a = [1,2,3,5,6,7,8]
    return (
        <Stack sx={{width:"30%",boxShadow:1,  borderRadius: 2}} spacing={2}>
            <Header></Header>
            <Contact></Contact>
        </Stack>

    );
  }
