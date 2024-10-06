import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Edit, Delete, Add, PermIdentity, MenuBook } from '@mui/icons-material';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate } from 'react-router-dom';

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

const TechDashboard = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
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
    const [editOpen, setEditOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const navigate = useNavigate();

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
        fetchSubjects();
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

    const handlePrintClick = (subjectId: string) => {
        // เมื่อกดปุ่ม Print จะเปลี่ยนหน้าไปยังหน้าการปริ้นส์
        navigate(`/print/${subjectId}`);
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
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '35px', textAlign: 'center' }}>User</Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#0f4c81', mb: 2, py: 1.5, marginTop: '20px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                        <IconButton sx={{ color: '#fff', fontSize: '1.5rem', mr: 1 }}>
                            <PermIdentity />
                        </IconButton>
                        Exams
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: '#001e3c', py: 1.5, width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                        <IconButton sx={{ color: '#fff' }}>
                            <MenuBook />
                        </IconButton>
                        Backup Course
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: '20px' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Exam Status</Typography>

                {/* Search and Add Subject */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>List Exam</Typography>
                    <TextField placeholder="Search for Subjects" variant="outlined" size="small" sx={{ width: '300px' }} />
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
                                        <IconButton color="primary" onClick={() => handleEditOpen(subject)}>
                                            <Edit />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">

                                        <Button
                                            variant="outlined"
                                            startIcon={<PrintIcon />}
                                            sx={{
                                                color: 'black',
                                                borderColor: 'lightgray',
                                                '&:hover': {
                                                    borderColor: 'black',
                                                },
                                            }}
                                            onClick={() => handlePrintClick(subject.S_ID)}
                                        >
                                            Print
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Dialog Edit Subject */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle sx={{ backgroundColor: '#0f4c81', color: 'white' }}>Edit Subject</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} sx={{ color: '#6c757d' }}>Cancel</Button>
                    <Button variant="contained" onClick={() => handleEditSubject()} sx={{ backgroundColor: '#0f4c81' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TechDashboard;
