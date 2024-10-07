import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { PermIdentity, MenuBook, BorderColorOutlined, AssessmentOutlined } from '@mui/icons-material';
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
    const name = localStorage.getItem('name');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [printOpen, setPrintOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedOption, setSelectedOption] = useState('ข้อสอบ');
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

    const handlePrintClick = (subject: Subject) => {
        setSelectedSubject(subject);
        setPrintOpen(true);
    };

    const handlePrintClose = () => {
        setPrintOpen(false);
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleSidebarButtonClick = () => {
        window.location.href = '/backup'; // เปลี่ยนเส้นทางไปยังหน้า Tech
    };

    const handleDownloadClick = async (S_ID: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/subjects/${S_ID}/latest-exam`, {
                responseType: 'blob'
            });

            const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
            const fileURL = URL.createObjectURL(fileBlob);

            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `exam_${S_ID}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const handlePrintConfirm = () => {
        if (selectedOption === 'ข้อสอบ') {
            if (selectedSubject) {
                // ฟังก์ชันสำหรับการโหลดข้อสอบ
                console.log("Load exam file");
                handleDownloadClick(selectedSubject.S_ID); // เรียกใช้ฟังก์ชันดาวน์โหลดไฟล์ข้อสอบ
            } else {
                console.error("No subject selected for downloading exam.");
            }
        } else if (selectedOption === 'ใบปะหน้าซอง') {
            if (selectedSubject) {
                // ฟังก์ชันสำหรับไปยังหน้าปริ้นส์
                console.log("Navigate to print page");
                navigate(`/print/${selectedSubject.S_ID}`); // นำทางไปยังหน้าปริ้นใบปะหน้าซอง
            } else {
                console.error("No subject selected for printing cover page.");
            }
        }
        setPrintOpen(false); // ปิด Dialog หลังจากทำงานเสร็จ
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

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>{error}</Typography>;
    }

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
                            <AssessmentOutlined />
                        </IconButton>
                        Exams
                    </Button>
                    <Button variant="contained" onClick={handleSidebarButtonClick} sx={{ backgroundColor: '#001e3c', py: 1.5, width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                        <IconButton sx={{ color: '#fff' }}>
                            <MenuBook />
                        </IconButton>
                        Backup Course
                    </Button>
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1, padding: '20px' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Exam Status</Typography>
                {/* Search and Add Subject */}
                <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold',mr:'40px' }}>List Exam</Typography>
                    <TextField placeholder="Search for Subjects" variant="outlined" size="small" sx={{ width: '300px' }} />
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>รหัสวิชา</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '40%' }}>ชื่อวิชา</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '10%' }}>Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '10%' }}></TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((subject) => (
                                <TableRow key={subject.S_ID}>
                                    <TableCell align="center">{subject.S_ID}</TableCell>
                                    <TableCell align="center">{subject.S_name}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: subject.Status === 1 ? '#EF870C' : subject.Status === 2 ? '#F30000' : subject.Status === 3 ? '#E7D000' : subject.Status === 4 ? '#E7D000' : subject.Status === 5 ? '#40EC24' : '#40EC24',
                                                color: '#fff',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                textTransform: 'none',
                                                padding: '4px 12px',
                                                width: '160px', // ขนาดปุ่มคงที่
                                                minWidth: '160px', // ป้องกันขนาดเล็กเกินไป
                                                textAlign: 'center'
                                            }}
                                        >
                                            {subject.Status === 1 ? 'ยังไม่ได้รับไฟล์ข้อสอบ' : subject.Status === 2 ? 'รอตรวจสอบ' : subject.Status === 3 ? 'รอจัดพิมพ์' : subject.Status === 4 ? 'ข้อสอบมีปัญหา' : subject.Status === 5 ? 'จัดพิมพ์แล้ว' : 'จัดส่งข้อสอบแล้ว'}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            onClick={() => handleEditOpen(subject)}
                                            sx={{
                                                padding: '4px', // ทำให้ปุ่มเล็กลง
                                                minWidth: '0', // ป้องกันปุ่มให้ใหญ่ขึ้น
                                                width: '24px', // ขนาดที่ต้องการให้เล็กลง
                                                height: '24px',
                                                color: '#000'
                                            }}
                                        >
                                            <BorderColorOutlined fontSize="small" />
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
                                            onClick={() => handlePrintClick(subject)}
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
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#0f4c81', color: 'white' }}>Status</DialogTitle>
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
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Print Dialog */}
            <Dialog
                open={printOpen}
                onClose={handlePrintClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        padding: '16px',
                        backgroundColor: '#FFFFFF'
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'left', fontWeight: 'bold', fontSize: '24px', color: '#000' }}>
                    Printing
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                        <Typography sx={{ mb: 2, fontSize: '16px', color: '#8E8E8E' }}>ต้องการที่จะสั่งพิมพ์สิ่งใด?</Typography>
                        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                            <FormControlLabel
                                value="ข้อสอบ"
                                control={<Radio sx={{ color: '#1E2F97', '&.Mui-checked': { color: '#1E2F97' } }} />}
                                label="ข้อสอบ"
                            />
                            <FormControlLabel
                                value="ใบปะหน้าซอง"
                                control={<Radio sx={{ color: '#1E2F97', '&.Mui-checked': { color: '#1E2F97' } }} />}
                                label="ใบปะหน้าซอง"
                            />
                        </RadioGroup>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
                    <Button
                        onClick={handlePrintClose}
                        sx={{
                            backgroundColor: '#E0E0E0',
                            color: '#000',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '8px',
                            padding: '8px 24px'
                        }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handlePrintConfirm}
                        sx={{
                            backgroundColor: '#1E2F97',
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: '8px',
                            padding: '8px 24px'
                        }}
                    >
                        พิมพ์
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TechDashboard;
