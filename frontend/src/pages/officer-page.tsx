import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Edit, Delete, Add, PermIdentity, MenuBook } from '@mui/icons-material';
import axios from 'axios';

interface Subject {
    S_ID: string;
    T_ID: number;
    S_name: string;
    Year: number;
    Semester: number;
    Sec: number;
    Credit: number;
    Major: number;
    n_std: number;
    Status: number;
}

interface Teacher {
    T_ID: number;
    Fname: string;
}

const OfficerDashboard = () => {
    const name = localStorage.getItem('name');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subjectData, setSubjectData] = useState<Subject>({
        S_ID: '',
        T_ID: 1,
        S_name: '',
        Year: new Date().getFullYear(),
        Semester: new Date().getFullYear(),
        Sec: 1,
        Credit: 3,
        Major: 1,
        n_std: 0,
        Status: 1
    });
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [backupOpen, setBackupOpen] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:3000/subjects');
                setSubjects(response.data);
            } catch (err) {
                setError('Error fetching subjects');
            } finally {
                setLoading(false);
            }
        };

        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/teachers'); // Change the endpoint if needed
                setTeachers(response.data);
            } catch (err) {
                console.error('Error fetching teachers:', err);
            }
        };

        fetchSubjects();
        fetchTeachers();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://localhost:3000/subjects');
            setSubjects(response.data);
        } catch (err) {
            setError('Error fetching subjects');
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

    const handleAddSubject = async () => {
        try {
            const response = await axios.post('http://localhost:3000/subjects', subjectData);
            if (response.status === 201) {
                setOpen(false);
                await fetchSubjects(); // รีเฟรชข้อมูลหลังจากเพิ่ม
            }
        } catch (error: any) {
            console.error("Error adding subject", error.response ? error.response.data : error.message);
        }
    };


    const handleEditOpen = (subject: Subject) => {
        setSelectedSubject(subject);
        setSubjectData(subject);
        setEditOpen(true);
    };

    const handleEditClose = () => setEditOpen(false);

    const handleEditSubject = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/subjects/${selectedSubject?.S_ID}`, subjectData);

            if (response.status === 200) {
                setEditOpen(false);
                await fetchSubjects(); // รีเฟรชข้อมูลหลังจากแก้ไข
            }
        } catch (error) {
            console.error("Error editing subject", error);
        }
    };

    const handleDeleteOpen = (subject: Subject) => {
        setSelectedSubject(subject);
        setDeleteOpen(true);
    };

    const handleDeleteSubject = async () => {
        try {
            if (selectedSubject) {
                await axios.delete(`http://localhost:3000/subjects/${selectedSubject.S_ID}`);
                setDeleteOpen(false);
                await fetchSubjects(); // รีเฟรชข้อมูลหลังจากลบ
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    const handleBackupOpen = () => setBackupOpen(true);

    const handleBackup = async () => {
        try {
            // เรียกใช้ API /backup โดยใช้ axios
            const response = await axios.post('http://localhost:3000/backup');

            // ตรวจสอบคำตอบจากเซิร์ฟเวอร์
            if (response.status === 200) {
                setBackupOpen(false);
                alert('Backup successful: ' + response.data.message);
            } else {
                alert('Backup failed');
            }
        } catch (error) {
            console.error('Error during backup:', error);
            alert('Error: Unable to backup');
        }
    };

    const handleSidebarButtonClick = () => {
        window.location.href = '/backup'; // เปลี่ยนเส้นทางไปยังหน้า Tech
    };

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;

        setSubjectData({
            ...subjectData,
            [name]:
                name === 'Year' || name === 'Semester' || name === 'Sec' || name === 'Credit' || name === 'Major' || name === 'n_std' || name === 'T_ID'
                    ? parseInt(value, 10) // แปลงเป็น int สำหรับฟิลด์ที่ต้องการ
                    : value
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
                        Course
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
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Course Management</Typography>

                {/* Search and Add Subject */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>List Course</Typography>
                    <TextField placeholder="Search for Subjects" variant="outlined" size="small" sx={{ width: '300px' }} />
                    <Button variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#001e3c', py: 1.5, ml: '550px' }} onClick={handleClickOpen}>
                        Add
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ py: 1.5 }}
                        onClick={handleBackupOpen}
                    >
                        Backup
                    </Button>
                </Box>

                {/* Subject Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>รหัสวิชา</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ชื่อวิชา</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((subject) => (
                                <TableRow key={subject.S_ID}>
                                    <TableCell>{subject.S_ID}</TableCell>
                                    <TableCell>{subject.S_name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: subject.Status === 1 ? '#EF870C' : subject.Status === 2 ? '#F30000' : subject.Status === 3 ? '#E7D000' : subject.Status === 4 ? '#E7D000' : subject.Status === 5 ? '#40EC24' : '#40EC24',
                                                color: '#fff',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                textTransform: 'none',
                                                padding: '4px 12px'
                                            }}
                                        >
                                            {subject.Status === 1 ? 'ยังไม่ได้รับไฟล์ข้อสอบ' : subject.Status === 2 ? 'รอตรวจสอบ' : subject.Status === 3 ? 'รอจัดพิมพ์' : subject.Status === 4 ? 'ข้อสอบมีปัญหา' : subject.Status === 5 ? 'จัดพิมพ์แล้ว' : 'จัดส่งข้อสอบแล้ว'}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEditOpen(subject)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDeleteOpen(subject)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {/* Dialog Add Subject */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: '#0f4c81', color: 'white' }}>Add Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Subject ID"
                        name="S_ID"
                        value={subjectData.S_ID}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        required
                    />
                    <TextField
                        label="Subject Name"
                        name="S_name"
                        value={subjectData.S_name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        required
                    />
                    <TextField
                        label="Year"
                        name="Year"
                        type="number"
                        value={subjectData.Year}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        required
                    />
                    <TextField
                        label="Semester"
                        name="Semester"
                        type="number"
                        value={subjectData.Semester}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Section"
                        name="Sec"
                        type="number"
                        value={subjectData.Sec}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Credit"
                        name="Credit"
                        type="number"
                        value={subjectData.Credit}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Major</InputLabel>
                        <Select
                            label="Major"
                            name="Major"
                            value={subjectData.Major}
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>วิทยาศาสตร์กายภาพ</MenuItem>
                            <MenuItem value={2}>วิทยาศาสตร์ชีวภาพ</MenuItem>
                            <MenuItem value={3}>วิทยาศาสตร์การคำนวณ</MenuItem>
                            <MenuItem value={4}>วิทยาศาสตร์สุขภาพและวิทยาศาสตร์ประยุกต์</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Number of Students"
                        name="n_std"
                        type="number"
                        value={subjectData.n_std}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            name="Status"
                            value={subjectData.Status}
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>ยังไม่ได้รับไฟล์</MenuItem>
                            <MenuItem value={2}>รอตรวจสอบไฟล์</MenuItem>
                            <MenuItem value={3}>รอจัดพิมพ์</MenuItem>
                            <MenuItem value={4}>ไฟล์มีปัญหา</MenuItem>
                            <MenuItem value={5}>จัดพิมพ์แล้ว</MenuItem>
                            <MenuItem value={6}>จัดส่งข้อสอบแล้ว</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Select สำหรับ T_ID (Teacher ID) */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Teacher ID</InputLabel>
                        <Select
                            label="Teacher ID"
                            name="T_ID"
                            value={subjectData.T_ID}
                            onChange={handleChange}
                        >
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.T_ID} value={teacher.T_ID}>
                                    {teacher.Fname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#6c757d' }}>Cancel</Button>
                    <Button variant="contained" onClick={() => handleAddSubject()} sx={{ backgroundColor: '#0f4c81' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Edit Subject */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle sx={{ backgroundColor: '#0f4c81', color: 'white' }}>Edit Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Subject ID"
                        name="S_ID"
                        value={subjectData.S_ID}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        required
                    />
                    <TextField
                        label="Subject Name"
                        name="S_name"
                        value={subjectData.S_name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        required
                    />
                    <TextField
                        label="Year"
                        name="Year"
                        type="number"
                        value={subjectData.Year}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        required
                    />
                    <TextField
                        label="Semester"
                        name="Semester"
                        type="number"
                        value={subjectData.Semester}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Section"
                        name="Sec"
                        type="number"
                        value={subjectData.Sec}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Credit"
                        name="Credit"
                        type="number"
                        value={subjectData.Credit}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Major"
                        name="Major"
                        type="number"
                        value={subjectData.Major}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Number of Students"
                        name="n_std"
                        type="number"
                        value={subjectData.n_std}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            name="Status"
                            value={subjectData.Status}
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>ยังไม่ได้รับไฟล์</MenuItem>
                            <MenuItem value={2}>ไฟล์มีปัญหา</MenuItem>
                            <MenuItem value={3}>รอตรวจสอบไฟล์</MenuItem>
                            <MenuItem value={4}>รอจัดพิมพ์</MenuItem>
                            <MenuItem value={5}>จัดพิมพ์แล้ว</MenuItem>
                            <MenuItem value={6}>จัดส่งข้อสอบแล้ว</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Select สำหรับ T_ID (Teacher ID) */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Teacher ID</InputLabel>
                        <Select
                            label="Teacher ID"
                            name="T_ID"
                            value={subjectData.T_ID}
                            onChange={handleChange}
                        >
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.T_ID} value={teacher.T_ID}>
                                    {teacher.Fname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} sx={{ color: '#6c757d' }}>Cancel</Button>
                    <Button variant="contained" onClick={() => handleEditSubject()} sx={{ backgroundColor: '#0f4c81' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Delete Confirmation */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle sx={{ backgroundColor: '#d32f2f', color: 'white' }}>Delete Subject</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this subject?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} sx={{ color: '#6c757d' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleDeleteSubject} sx={{ backgroundColor: '#d32f2f' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Backup Confirmation */}
            <Dialog open={backupOpen} onClose={() => setBackupOpen(false)}>
                <DialogTitle>Backup Course?</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to backup course?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBackupOpen(false)} sx={{ color: '#6c757d' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleBackup} sx={{ backgroundColor: '#0f4c81' }}>
                        Backup
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OfficerDashboard;
