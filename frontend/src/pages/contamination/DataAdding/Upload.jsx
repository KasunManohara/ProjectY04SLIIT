import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from './firebase';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const Upload = () => {
    const [uploading, setUploading] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [textInput, setTextInput] = useState("");
    const [dateInput, setDateInput] = useState("");

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    }

    async function handleUpload() {
        if (!selectedFile) return;

        try {
            setUploading(true);
            const storage = getStorage(app);
            const storageRef = ref(storage, "images/" + selectedFile.name);
            await uploadBytes(storageRef, selectedFile);
            const downloadURL = await getDownloadURL(storageRef);
            
            setImageURL(downloadURL);

            const dataToSend = {
                text: textInput,
                date: dateInput,
                imageUrl: downloadURL,
            };

            const response = await fetch('http://127.0.0.1:4085/execute/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Response from server:', responseData);

        } catch (error) {
            console.log(error);
        } finally {
            setUploading(false);
            window.location.reload();
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper 
                elevation={3}
                sx={{
                    mt: 4,
                    p: 4,
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                }}
            >
                <Typography 
                    variant="h5" 
                    sx={{
                        mb: 4,
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'center'
                    }}
                >
                    Upload Image to Firebase
                </Typography>

                <Stack spacing={3}>
                    {/* File Upload Section */}
                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            bgcolor: 'primary.lighter',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'primary.50'
                            }
                        }}
                    >
                        <input
                            accept="image/*"
                            id="upload-file"
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="upload-file">
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                                    Click or drag to upload image
                                </Typography>
                            </Box>
                        </label>
                    </Box>

                    {/* Selected File Display */}
                    {fileName && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: 'grey.50'
                            }}
                        >
                            <InsertDriveFileIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {fileName}
                            </Typography>
                        </Box>
                    )}

                    {/* Text Input */}
                    <TextField
                        fullWidth
                        label="Enter some text"
                        variant="outlined"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5
                            }
                        }}
                    />

                    {/* Date Input */}
                    <TextField
                        fullWidth
                        type="date"
                        label="Select Date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5
                            }
                        }}
                    />

                    {/* Upload Button */}
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: 2,
                            '&:hover': {
                                boxShadow: 4
                            }
                        }}
                    >
                        {uploading ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}

export default Upload;