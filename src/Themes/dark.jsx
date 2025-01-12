import { createMuiTheme } from '@material-ui/core/styles';

export const themeOptions = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: 'rgba(142,142,142,0.35)',
            light: 'rgba(129,129,131,0.2)',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#000000',
            paper: 'rgba(0,0,0,0.6)',
        },
    },
    shape: {
        borderRadius: 20,
    },
});
