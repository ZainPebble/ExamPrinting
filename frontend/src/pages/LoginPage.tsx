import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                backgroundColor: '#152259',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: 4,
                    textAlign: 'center',
                    boxShadow: 3,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontSize: '3rem', // ปรับขนาดตัวอักษร
                        color: '#152259', // สีตัวอักษร
                        mt:'30px',
                        mb:'30px',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // เพิ่มเงาเล็กน้อย
                    }}
                >
                    Exam Printing System
                </Typography>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '60%' }, // ปรับความกว้างของ TextField
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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        sx={{
                            width: '60%', // ปรับความกว้างของปุ่ม
                            mt:'10px',
                            mb:'60px',
                            height: '3rem', // ปรับความสูงของปุ่ม
                            backgroundColor: '#1e2a78', // สีน้ำเงินเข้มกว่า #152259
                            '&:hover': {
                                backgroundColor: '#152259', // เปลี่ยนสีเมื่อ hover
                            },
                        }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                    {error && <p>{error}</p>}
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
