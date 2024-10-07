// TeacherDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { PermIdentity, MenuBook, DescriptionOutlined, EditOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// กำหนดประเภทสำหรับ Subject
interface Subject {
    S_ID: string;
    S_name: string;
    Status: number;
}

// กำหนดประเภทสำหรับ ExamDetail
interface ExamDetail {
    Exam_period: string;
    Type_exam: string;
    Date: string;
    Exam_start: string;
    Exam_end: string;
    Room: string;
    Side: string;
    Tool_Book: boolean;
    Tool_Calculator: boolean;
    Tool_MfRuler: boolean;
    Additional: string;
}

interface User {
    username: string;
    Fname: string;
    Lname: string;
}

interface TeacherProfile {
    T_ID: number;
    user: User; // รักษาชื่อผู้ใช้, ชื่อจริง, และนามสกุลไว้ใน user
    Email: string;
    Tel: string;
}


const TeacherDashboard: React.FC = () => {
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [T_ID, setT_ID] = useState<number | null>(null);
    const [examDetail, setExamDetail] = useState<ExamDetail>({
        Exam_period: '',
        Type_exam: '',
        Date: '',
        Exam_start: '',
        Exam_end: '',
        Room: '',
        Side: '',
        Tool_Book: false,
        Tool_Calculator: false,
        Tool_MfRuler: false,
        Additional: '',
    });
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
    const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeacherId = async () => {
            if (username) {
                try {
                    const response = await axios.get(`http://localhost:3000/teachers/find?username=${username}`);
                    if (response.data && response.data.T_ID) {
                        setT_ID(response.data.T_ID);
                    } else {
                        console.warn("T_ID not found in response");
                    }
                } catch (error) {
                    console.error("Error fetching teacher ID:", error);
                } finally {
                    setLoading(false); // หยุดแสดงสถานะการโหลด
                }
            } else {
                setLoading(false); // ถ้าไม่มี username ก็ตั้งให้หยุดโหลดได้เช่นกัน
            }
        };

        fetchTeacherId();
    }, [username]);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (T_ID !== null) { // ตรวจสอบว่า T_ID มีค่าก่อน
                try {
                    const response = await axios.get<Subject[]>(`http://localhost:3000/subjects/find?t_id=${T_ID}`);
                    setSubjects(response.data);
                } catch (error) {
                    console.error("Error fetching subjects:", error);
                }
            }
        };

        fetchSubjects();
    }, [T_ID]);

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            if (T_ID !== null) {
                try {
                    const response = await axios.get<TeacherProfile>(`http://localhost:3000/teachers/profile?t_id=${T_ID}`);
                    setTeacherProfile(response.data);
                } catch (err) {
                    console.error("Error fetching teacher profile:", err);
                    setError('Failed to fetch teacher profile.');
                }
            }
        };

        fetchTeacherProfile();
    }, [T_ID]);



    const handleUploadDialogOpen = (subject: Subject) => {
        setSelectedSubject(subject);
        setUploadDialogOpen(true);
        setExamDetail({
            Exam_period: '',
            Type_exam: '',
            Date: '',
            Exam_start: '',
            Exam_end: '',
            Room: '',
            Side: '',
            Tool_Book: false,
            Tool_Calculator: false,
            Tool_MfRuler: false,
            Additional: '',
        });
        setSelectedFile(null); // เคลียร์ไฟล์ที่เลือกเมื่อเปิด Dialog
    };

    const handleUploadDialogClose = () => {
        setUploadDialogOpen(false);
    };

    const handleExamDetailUpload = async () => {
        if (!selectedSubject) {
            console.error("No subject selected");
            return; // หยุดทำงานถ้าไม่มี subject ที่เลือก
        }

        const requestData = {
            S_ID: selectedSubject.S_ID,
            Exam_period: examDetail.Exam_period,
            Type_exam: examDetail.Type_exam,
            Date: examDetail.Date,
            Exam_start: examDetail.Exam_start,
            Exam_end: examDetail.Exam_end,
            Room: examDetail.Room,
            Side: examDetail.Side,
            Tool_Book: examDetail.Tool_Book,
            Tool_Calculator: examDetail.Tool_Calculator,
            Tool_MfRuler: examDetail.Tool_MfRuler,
            Additional: examDetail.Additional,
        };

        try {
            const formData = new FormData();
            formData.append('S_ID', selectedSubject.S_ID);
            formData.append('Exam_period', requestData.Exam_period);
            formData.append('Type_exam', requestData.Type_exam);
            formData.append('Date', requestData.Date);
            formData.append('Exam_start', requestData.Exam_start);
            formData.append('Exam_end', requestData.Exam_end);
            formData.append('Room', requestData.Room);
            formData.append('Side', requestData.Side);
            formData.append('Tool_Book', String(requestData.Tool_Book));
            formData.append('Tool_Calculator', String(requestData.Tool_Calculator));
            formData.append('Tool_MfRuler', String(requestData.Tool_MfRuler));
            formData.append('Additional', requestData.Additional);

            // Append the file with the key 'file' to match the API requirement
            if (selectedFile) {
                formData.append('file', selectedFile); // Ensure this key matches the API's expectation
            }

            // อัปโหลดข้อมูลทั้งหมดที่รวมทั้งรายละเอียดข้อสอบและไฟล์
            const response = await axios.post('http://localhost:3000/exam-details', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Exam details upload successful:', response.data);
            handleUploadDialogClose(); // ปิด Dialog หลังอัปโหลดสำเร็จ
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file); // ตั้งค่าไฟล์ที่เลือก
    };

    const handleProfileDialogOpen = () => {
        setProfileDialogOpen(true);
    };

    const handleProfileDialogClose = () => {
        setProfileDialogOpen(false);
    };

    const handleProfileUpdate = async () => {
        if (!teacherProfile) return; // ตรวจสอบว่า teacherProfile มีข้อมูลหรือไม่

        try {
            const response = await axios.put(`http://localhost:3000/teachers/update`, {
                T_ID: teacherProfile.T_ID, // ใช้ T_ID ที่ถูกต้อง
                Fname: teacherProfile.user.Fname, // เข้าถึง Fname ผ่าน user
                Lname: teacherProfile.user.Lname, // เข้าถึง Lname ผ่าน user
                email: teacherProfile.Email, // ใช้ Email ตรงๆ
                phone: teacherProfile.Tel, // ใช้ Tel ตรงๆ
            });
            console.log("Profile updated:", response.data);
            handleProfileDialogClose();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };


    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar */}
            <Box sx={{ width: '250px', backgroundColor: '#001e3c', color: '#fff' }}>
                <Box sx={{ width: '100%', borderBottom: '1px solid #fff' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginTop: '35px', marginBottom: '5px', textAlign: 'center' }}>Welcome</Typography>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>{name}</Typography>
                    <Button
                        variant="contained"
                        startIcon={<EditOutlined />}
                        sx={{
                            backgroundColor: '#fff',
                            color: '#001e3c', // สีข้อความ
                            py: 1.5,
                            borderRadius: '25px', // ขอบมนมากขึ้น
                            width: '70%', // ขนาดกว้าง 70%
                            mx: 'auto', // จัดให้อยู่ตรงกลางในแนวนอน
                            textAlign: 'center', // ข้อความอยู่ตรงกลาง
                            fontSize: '12px',
                            mb:'20px',
                            ml:'37px',
                        }}
                        onClick={handleProfileDialogOpen}
                    >
                        แก้ไขข้อมูลส่วนตัว
                    </Button>

                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#0f4c81', mb: 2, py: 1.5, marginTop: '20px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                        <IconButton sx={{ color: '#fff', fontSize: '1.5rem', mr: 1 }}><PermIdentity /></IconButton>
                        Exams
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: '20px' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Upload Exam</Typography>
                {/* Search and Add Subject */}
                <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mr: '40px' }}>List Course</Typography>
                    <TextField placeholder="Search for Subjects" variant="outlined" size="small" sx={{ width: '300px' }} />
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>Subject ID</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>Subject Name</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>Status</TableCell>
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
                                    <TableCell align="center">
                                        <Button sx={{ backgroundColor: '#001e3c' }} startIcon={<DescriptionOutlined />} variant="contained" onClick={() => handleUploadDialogOpen(subject)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Dialog for Uploading Exam Details */}
            <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose}>
                <DialogTitle>Upload Exam Detail and File</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Exam Period"
                        fullWidth
                        value={examDetail.Exam_period}
                        onChange={(e) => setExamDetail({ ...examDetail, Exam_period: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Type of Exam"
                        fullWidth
                        value={examDetail.Type_exam}
                        onChange={(e) => setExamDetail({ ...examDetail, Type_exam: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Date"
                        fullWidth
                        type="date"
                        value={examDetail.Date}
                        onChange={(e) => setExamDetail({ ...examDetail, Date: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Exam Start"
                        fullWidth
                        type="time"
                        value={examDetail.Exam_start}
                        onChange={(e) => setExamDetail({ ...examDetail, Exam_start: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Exam End"
                        fullWidth
                        type="time"
                        value={examDetail.Exam_end}
                        onChange={(e) => setExamDetail({ ...examDetail, Exam_end: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Room"
                        fullWidth
                        value={examDetail.Room}
                        onChange={(e) => setExamDetail({ ...examDetail, Room: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Side"
                        fullWidth
                        value={examDetail.Side}
                        onChange={(e) => setExamDetail({ ...examDetail, Side: e.target.value })}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={examDetail.Tool_Book} onChange={(e) => setExamDetail({ ...examDetail, Tool_Book: e.target.checked })} />}
                        label="Tools: Book"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={examDetail.Tool_Calculator} onChange={(e) => setExamDetail({ ...examDetail, Tool_Calculator: e.target.checked })} />}
                        label="Tools: Calculator"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={examDetail.Tool_MfRuler} onChange={(e) => setExamDetail({ ...examDetail, Tool_MfRuler: e.target.checked })} />}
                        label="Tools: Mf Ruler"
                    />
                    <TextField
                        label="Additional Notes"
                        fullWidth
                        multiline
                        rows={4}
                        value={examDetail.Additional}
                        onChange={(e) => setExamDetail({ ...examDetail, Additional: e.target.value })}
                        margin="normal"
                    />
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        style={{ marginTop: '10px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadDialogClose}>Cancel</Button>
                    <Button onClick={handleExamDetailUpload} variant="contained" color="primary" disabled={!selectedSubject || !selectedFile}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Profile Edit Dialog */}
            <Dialog open={profileDialogOpen} onClose={handleProfileDialogClose}>
                <DialogTitle>Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        label="รหัสอาจารย์"
                        fullWidth
                        value={teacherProfile?.user.username} // เข้าถึง username ผ่าน user
                        disabled
                        margin="normal"
                    />
                    <TextField
                        label="First Name"
                        fullWidth
                        value={teacherProfile?.user.Fname || ''} // เข้าถึง Fname ผ่าน user
                        onChange={(e) => setTeacherProfile({ ...teacherProfile!, user: { ...teacherProfile!.user, Fname: e.target.value } })} // อัปเดต Fname ผ่าน user
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        value={teacherProfile?.user.Lname || ''} // เข้าถึง Lname ผ่าน user
                        onChange={(e) => setTeacherProfile({ ...teacherProfile!, user: { ...teacherProfile!.user, Lname: e.target.value } })} // อัปเดต Lname ผ่าน user
                        margin="normal"
                    />
                    <TextField
                        label="E-mail"
                        fullWidth
                        value={teacherProfile?.Email || ''} // ใช้ Email ตรงๆ
                        onChange={(e) => setTeacherProfile({ ...teacherProfile!, Email: e.target.value })} // อัปเดต Email ตรงๆ
                        margin="normal"
                    />
                    <TextField
                        label="Tel."
                        fullWidth
                        value={teacherProfile?.Tel || ''} // ใช้ Tel ตรงๆ
                        onChange={(e) => setTeacherProfile({ ...teacherProfile!, Tel: e.target.value })} // อัปเดต Tel ตรงๆ
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleProfileDialogClose}>Cancel</Button>
                    <Button onClick={handleProfileUpdate} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default TeacherDashboard;
