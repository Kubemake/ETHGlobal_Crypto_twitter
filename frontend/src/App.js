import './App.scss';
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {Main} from "./components/Main";
import {BrowserRouter} from 'react-router-dom';
import {Grid} from './components/_UI/Grid/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#3f78b5'
        }
    }
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <Grid>
                    <Header/>
                    <Main/>
                    <Footer/>
                </Grid>
            </BrowserRouter>
        </MuiThemeProvider>
    )
}

export default App;
