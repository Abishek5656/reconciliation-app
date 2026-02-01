import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline, ThemeProvider, createTheme, CircularProgress } from '@mui/material';

const UploadPage = lazy(() => import('./pages/UploadPage'));
const ClassificationPage = lazy(() => import('./pages/ClassificationPage'));

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        background: {
            default: '#f5f7fa',
        },
    },
    typography: {
        fontFamily: '"OnePlus Sans Display", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(20px)', borderBottom: '1px solid #eee' }}>
                        <Toolbar>
                            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
                                Reconciliation App
                            </Typography>
                            <Button component={Link} to="/" color="inherit">Upload</Button>
                            <Button component={Link} to="/report" color="inherit">Report</Button>
                        </Toolbar>
                    </AppBar>

                    <Suspense fallback={
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <CircularProgress />
                        </Box>
                    }>
                        <Routes>
                            <Route path="/" element={<UploadPage />} />
                            <Route path="/report" element={<ClassificationPage />} />
                        </Routes>
                    </Suspense>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;
