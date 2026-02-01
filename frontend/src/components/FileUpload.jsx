import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Paper, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Alert,
    CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '../api/transactions.api';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file || !source) {
            setError('Please select both a file and a source.');
            return;
        }

        const formData = new FormData();
        formData.append('source', source);
        formData.append('file', file);

        setLoading(true);
        // Debug FormData
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            await uploadFile(formData);
            setMessage(`Successfully uploaded ${source} file.`);
            setFile(null);
            // Optional: reset source?
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Upload Records
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400, mx: 'auto', mt: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Source Type</InputLabel>
                    <Select
                        value={source}
                        label="Source Type"
                        onChange={(e) => setSource(e.target.value)}
                    >
                        <MenuItem value="STATEMENT">Statement File</MenuItem>
                        <MenuItem value="SETTLEMENT">Settlement File</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ p: 2, borderStyle: 'dashed' }}
                >
                    {file ? file.name : 'Choose Excel File'}
                    <input type="file" hidden accept=".xlsx, .csv" onChange={handleFileChange} />
                </Button>

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleUpload}
                    disabled={loading}
                    sx={{ 
                        py: 1.5, 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
                </Button>
            </Box>

            {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
    );
};

export default FileUpload;
