import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Edit, Delete, Add, PermIdentity, MenuBook } from '@mui/icons-material';
import axios from 'axios';

interface User {
    username: string;
    Fname: string;
    Lname: string;
    u_type: number;
}

const AdminDashboard = () => {
    const name = localStorage.getItem('name');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        role: ''
    });
    const [editOpen, setEditOpen] = useState(false);  // สำหรับ Edit User Dialog
    const [editconfirmationOpen, setEditconfirmationOpen] = useState(false);  // สำหรับ Edit Confirmation Dialog
    const [selectedUser, setSelectedUser] = useState<User | null>(null);  // เก็บข้อมูลผู้ใช้ที่เลือก
    const [deleteOpen, setDeleteOpen] = useState(false);  // สำหรับ Delete Confirmation Dialog

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users');
                setUsers(response.data);
                setLoading(false); // หยุดโหลดข้อมูลเมื่อเสร็จสิ้น
            } catch (err) {
                setError('Error fetching users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users');
            setUsers(response.data);
        } catch (err) {
            setError('Error fetching users');
        }
    };

    // แสดงสถานะการโหลดข้อมูล
    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    // แสดง error ถ้ามีปัญหากับการดึงข้อมูล
    if (error) {
        return <Typography>{error}</Typography>;
    }

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleConfirmationClose = () => setConfirmationOpen(false);

    // ฟังก์ชันตรวจสอบรหัสผ่าน
    const isPasswordValid = (password: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        return passwordRegex.test(password);
    };

    const handleAddUser = async () => {
        if (!isPasswordValid(userData.password)) {
            setPasswordError("รหัสผ่านต้องมีความยาว 8-16 ตัวอักษร และต้องมีตัวอักษรพิมพ์ใหญ่ ตัวเลข และอักขระพิเศษอย่างน้อย 1 ตัว");
            return; // ถ้ารหัสผ่านไม่ผ่านเงื่อนไข ให้หยุดการทำงาน
        }

        try {
            const response = await axios.post('http://localhost:3000/users', {
                username: userData.username,
                password: userData.password,
                Fname: userData.firstName,
                Lname: userData.lastName,
                u_type: userData.role
            });

            if (response.status === 201) {
                setOpen(false);
                setConfirmationOpen(false);
                setPasswordError(null); // รีเซ็ตข้อผิดพลาด
                await fetchUsers(); // รีเฟรชข้อมูลหลังจากเพิ่ม
            }
        } catch (error) {
            console.error("Error adding user", error);
        }
    };

    const handleEditOpen = (user: User) => {
        setSelectedUser(user);  // เก็บข้อมูลผู้ใช้ที่ต้องการแก้ไข
        setUserData({
            username: user.username,
            password: '',
            firstName: user.Fname,
            lastName: user.Lname,
            role: user.u_type.toString()
        });
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);
    const handleEditconfirmationClose = () => setEditconfirmationOpen(false);

    const handleEditUser = async () => {
        if (!isPasswordValid(userData.password)) {
            setPasswordError("รหัสผ่านต้องมีความยาว 8-16 ตัวอักษร และต้องมีตัวอักษรพิมพ์ใหญ่ ตัวเลข และอักขระพิเศษอย่างน้อย 1 ตัว");
            return; // ถ้ารหัสผ่านไม่ผ่านเงื่อนไข ให้หยุดการทำงาน
        }

        try {
            const response = await axios.put(`http://localhost:3000/users/${selectedUser?.username}`, {
                username: userData.username, // เพิ่มการอัปเดต username
                ...(userData.password && { password: userData.password }), // ถ้ามีการกรอก password ถึงจะส่ง
                Fname: userData.firstName,
                Lname: userData.lastName,
                u_type: Number(userData.role),
            });

            if (response.status === 200) {
                setEditOpen(false);
                setEditconfirmationOpen(true);
                setPasswordError(null); // รีเซ็ตข้อผิดพลาด
                // อัปเดตข้อมูลผู้ใช้ในตาราง
                setUsers(users.map(user => (user.username === selectedUser?.username ? { ...user, username: userData.username, Fname: userData.firstName, Lname: userData.lastName, u_type: Number(userData.role) } : user)));
                await fetchUsers(); // รีเฟรชข้อมูลหลังจากเพิ่ม
            }
        } catch (error) {
            console.error("Error editing user", error);
        }
    };

    const handleDeleteOpen = (user: User) => {
        setSelectedUser(user);  // เก็บข้อมูลผู้ใช้ที่เลือก
        setDeleteOpen(true);    // เปิด Dialog
    };

    const handleDeleteUser = async () => {
        try {
            if (selectedUser) {
                await axios.delete(`http://localhost:3000/users/${selectedUser.username}`);
                setDeleteOpen(false);
                await fetchUsers(); // รีเฟรชข้อมูลหลังจากลบ
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSidebarButtonClick = () => {
        window.location.href = '/backup'; // เปลี่ยนเส้นทางไปยังหน้า Tech
    };

    const handleChange = (e: any) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar */}
            <Box sx={{ width: '250px', backgroundColor: '#001e3c', color: '#fff' }}>
                <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginTop: '35px', marginBottom: '5px', textAlign: 'center' }}>Welcome</Typography>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '35px', textAlign: 'center' }}>{name}</Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#0f4c81', mb: 2, py: 1.5, marginTop: '20px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                        <IconButton sx={{ color: '#fff', fontSize: '1.5rem', mr: 1 }}>
                            <PermIdentity />
                        </IconButton>
                        User
                    </Button>
                    <Button variant="contained" onClick={handleSidebarButtonClick} sx={{ backgroundColor: '#001e3c', py: 1.5, width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
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
                    <Button variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#001e3c', py: 1.5 }} onClick={handleClickOpen}>
                        Add
                    </Button>
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
                                    <TableCell>{`${user.Fname} ${user.Lname}`}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: user.u_type === 1 ? '#001e3c' : '#0f4c81',
                                                color: '#fff',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                textTransform: 'none',
                                                padding: '4px 12px'
                                            }}
                                        >
                                            {user.u_type === 1 ? 'Admin' : user.u_type === 2 ? 'อาจารย์' : user.u_type === 3 ? 'เจ้าหน้าที่ดำเนินการสอบ' : 'หน่วยเทคโนโลยีการศึกษา'}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEditOpen(user)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDeleteOpen(user)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Dialog Add User */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: '#0f4c81', color: 'white' }}>Add Authorized User</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <TextField
                            label="Username"
                            name="username"
                            required
                            value={userData.username}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            name="password"
                            required
                            type="password"
                            value={userData.password}
                            onChange={handleChange}
                            fullWidth
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            label="Role"
                            name="role"
                            value={userData.role}
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>Admin</MenuItem>
                            <MenuItem value={2}>อาจารย์</MenuItem>
                            <MenuItem value={3}>เจ้าหน้าที่ดำเนินการสอบ</MenuItem>
                            <MenuItem value={4}>หน่วยเทคโนโลยีการศึกษา</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#6c757d' }}>Cancel</Button>
                    <Button variant="contained" onClick={() => setConfirmationOpen(true)} sx={{ backgroundColor: '#0f4c81' }}>Add User</Button>
                </DialogActions>
            </Dialog>

            {/* Pop-up ยืนยันการเพิ่ม User */}
            <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
                <DialogTitle>Confirm Adding New User</DialogTitle>
                <DialogActions>
                    <Button onClick={handleConfirmationClose}>Cancel</Button>
                    <Button onClick={handleAddUser} variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Edit User */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle sx={{ backgroundColor: '#0f4c81', color: 'white' }}>Edit Existing User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={userData.password}
                        onChange={handleChange}
                        fullWidth
                        error={!!passwordError}
                        helperText={passwordError}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={userData.role}
                            name="role"
                            onChange={handleChange}
                        >
                            <MenuItem value="1">Admin</MenuItem>
                            <MenuItem value="2">อาจารย์</MenuItem>
                            <MenuItem value="3">เจ้าหน้าที่ดำเนินการสอบ</MenuItem>
                            <MenuItem value="4">หน่วยเทคโนโลยีการศึกษา</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} sx={{ color: '#6c757d' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditUser} sx={{ backgroundColor: '#0f4c81' }}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Pop-up ยืนยันการแก้ไข User */}
            <Dialog open={editconfirmationOpen} onClose={handleEditconfirmationClose}>
                <DialogTitle>Confirm Editing User</DialogTitle>
                <DialogActions>
                    <Button onClick={handleEditconfirmationClose}>Cancel</Button>
                    <Button onClick={handleEditconfirmationClose} variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Delete User */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteUser} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default AdminDashboard;
