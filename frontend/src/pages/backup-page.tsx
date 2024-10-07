import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField
} from '@mui/material';
import { PermIdentity, MenuBook,Delete,AssessmentOutlined } from '@mui/icons-material';
import axios from 'axios';

interface Backup {
    S_ID: string;
    Year: number;         // เพิ่มฟิลด์ Year
    Semester: number;     // เพิ่มฟิลด์ Semester
    XD_ID: number;        // เพิ่มฟิลด์ XD_ID
    Exam_period: number;  // เพิ่มฟิลด์ Exam_period
    S_name: string;
    Credit: number;
    Sec: number;
    Major: number;
    n_std: number;
    T_ID: number;         // FK
    Additional: string;
    Type_exam: number;
    Exam_start: string;   // ใช้เป็น string เพื่อเก็บเวลา
    Exam_end: string;     // ใช้เป็น string เพื่อเก็บเวลา
    Room: string;
    Date: string;         // ใช้เป็น string เพื่อเก็บวัน
    Side: number;
    ExamFile: Blob | null; // อาจจะไม่ใช้ในที่นี้
}

const BackupDashboard = () => {
    const name = localStorage.getItem('name');
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ดึงข้อมูลจาก localStorage เพื่อใช้ใน Sidebar
    const userType = localStorage.getItem('u_type');

    useEffect(() => {
        const fetchBackups = async () => {
            try {
                const response = await axios.get('http://localhost:3000/backup');
                setBackups(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching backups');
                setLoading(false);
            }
        };

        fetchBackups();
    }, []);

    const handleSidebarButtonClick = () => {
        switch (userType) {
            case '1':
                window.location.href = '/admin'; // เปลี่ยนเส้นทางไปยังหน้า Admin
                break;
            case '3':
                window.location.href = '/officer'; // เปลี่ยนเส้นทางไปยังหน้า Officer
                break;
            case '4':
                window.location.href = '/tech'; // เปลี่ยนเส้นทางไปยังหน้า Tech
                break;
            default:
                console.error('Invalid user type');
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


    // ฟังก์ชันสำหรับการลบข้อมูล
    const handleDeleteClick = async (backup: Backup) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this backup?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/backup/${backup.S_ID}`, {
                    data: { // ส่งข้อมูลที่จำเป็นสำหรับ compound key
                        Year: backup.Year,
                        Semester: backup.Semester,
                        XD_ID: backup.XD_ID,
                    },
                });
                setBackups(backups.filter(b => b.S_ID !== backup.S_ID)); // อัปเดตข้อมูลใน frontend
            } catch (err) {
                console.error('Error deleting backup:', err);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar */}
            <Box sx={{ width: '250px', backgroundColor: '#001e3c', color: '#fff' }}>
                <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginTop: '35px', marginBottom: '5px', textAlign: 'center' }}>
                        Welcome
                    </Typography>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '35px', textAlign: 'center' }}>
                        {name}
                    </Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Conditional Button */}
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#001e3c', mb: 2, py: 1.5, marginTop: '20px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}
                        onClick={handleSidebarButtonClick}
                    >
                        <IconButton sx={{ color: '#fff', fontSize: '1.5rem', mr: 1 }}>
                            {userType === '1' && <PermIdentity/>}
                            {userType === '3' && <MenuBook/>}
                            {userType === '4' && <AssessmentOutlined/>}
                        </IconButton>
                        {userType === '1' && 'User'}
                        {userType === '3' && 'Course'}
                        {userType === '4' && 'Exams'}
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
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Backup Dashboard</Typography>
                {/* Search and Add Subject */}
                <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold',mr:'40px' }}>List Course</Typography>
                    <TextField placeholder="Search for Subjects" variant="outlined" size="small" sx={{ width: '300px' }} />
                </Box>

                {/* Backup Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>รหัสวิชา</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ชื่อวิชา</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {backups.map((backup) => (
                                <TableRow key={backup.S_ID}>
                                    <TableCell>{backup.S_ID}</TableCell>
                                    <TableCell>{backup.S_name}</TableCell>
                                    <TableCell align="center">
                                        {/* ปุ่มสำหรับ Delete */}
                                        <IconButton color="secondary" onClick={() => handleDeleteClick(backup)}>
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

export default BackupDashboard;
