import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import axios, { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token); // เก็บ JWT token ใน localStorage
            localStorage.setItem('name', user.name); // เก็บชื่อผู้ใช้
            localStorage.setItem('u_type', user.u_type); // เก็บประเภทผู้ใช้
            localStorage.setItem('username', user.username);

            // นำทางผู้ใช้ไปยังหน้าแต่ละประเภทตาม u_type
            switch (user.u_type) {
                case 1:
                    navigate('/admin');
                    break;
                case 2:
                    navigate('/teacher');
                    break;
                case 3:
                    navigate('/officer');
                    break;
                case 4:
                    navigate('/tech');
                    break;
                default:
                    setError('Unknown user type');
            }
        } catch (err) {
            // ตรวจสอบว่าข้อผิดพลาดเป็น AxiosError
            if (err instanceof AxiosError) {
              setError('Login failed: ' + err.response?.data.message);
            } else {
              setError('An unknown error occurred');
            }
          }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                backgroundColor: 'white',
                padding: 4,
                borderRadius: 4,
                textAlign: 'center',
                boxShadow: 3,
                mt: 10,
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Exam Printing System
            </Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Enter Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Enter Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={handleLogin} // แก้ไขตรงนี้
                >
                    Login
                </Button>
                {error && <p>{error}</p>}
            </Box>
        </Container>
    );
};

export default LoginPage;
