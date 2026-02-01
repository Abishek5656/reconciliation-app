import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import FileUpload from '../components/FileUpload';

const UploadPage = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: '900', letterSpacing: '-0.05rem' }}>
                    Data Upload
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    Upload your Statement and Settlement files to begin.
                </Typography>
            </Box>
            
            <Box sx={{ width: '100%' }}>
                <FileUpload />
            </Box>
        </Container>
    );
};

export default UploadPage;
