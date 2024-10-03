import React from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';
import { Edit, Delete, Add, PermIdentity, MenuBook } from '@mui/icons-material';

const AdminDashboard = () => {
    const users = [
        { username: '0000001', name: 'สมพงศ์ ชลสาร', role: 'Admin' },
        { username: '1000001', name: 'มาฆศรี คณิตเดช', role: 'อาจารย์' },
        { username: '1000002', name: 'กฤติน สมบูรณ์', role: 'อาจารย์' },
        { username: '2000001', name: 'กฤติน กริมย์', role: 'เจ้าหน้าที่ดำเนินการสอบ' },
        { username: '2000002', name: 'ปวริศ หัวข้าว', role: 'เจ้าหน้าที่ดำเนินการสอบ' },
        { username: '2000003', name: 'ปณณ คงน่วม', role: 'เจ้าหน้าที่ดำเนินการสอบ' },
        { username: '3000001', name: 'จักรพงศ์ คนหลัก', role: 'หน่วยเทคโนโลยีการศึกษา' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar */}
            <Box sx={{ width: '250px', backgroundColor: '#001e3c', color: '#fff', position: 'fixed' }}>
                <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginTop: '35px', marginBottom: '5px', textAlign: 'center' }}>Welcome</Typography>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '35px', textAlign: 'center' }}>Admin</Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#0f4c81', mb: 2, py: 1.5, marginTop: '20px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                        <IconButton sx={{ color: '#fff', fontSize: '1.5rem', mr: 1 }}>
                            <PermIdentity />
                        </IconButton>
                        User
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: '#0f4c81', py: 1.5, width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                        <IconButton sx={{ color: '#fff' }}>
                            <MenuBook />
                        </IconButton>
                        Backup Course
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: '20px' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>User Dashboard</Typography>

                {/* Search and Add User */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>List Users</Typography>
                    <TextField placeholder="Search for Users" variant="outlined" size="small" sx={{ width: '300px' }} />
                    <Button variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#001e3c', py: 1.5 }}>Add</Button>
                </Box>

                {/* User Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.username}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: user.role === 'Admin' ? '#001e3c' : '#0f4c81',
                                                color: '#fff',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                textTransform: 'none',
                                                padding: '4px 12px'
                                            }}
                                        >
                                            {user.role}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
