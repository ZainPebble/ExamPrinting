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
} from '@mui/material';
import { Add, PermIdentity, MenuBook } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UploadFile from './UploadFile';

// กำหนดประเภทสำหรับ Subject
interface Subject {
    S_ID: string;
    S_name: string;
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
        console.log("T_ID:", T_ID); // ตรวจสอบว่าได้ค่า T_ID หรือไม่

        const fetchSubjects = async () => {
            if (T_ID !== null) { // ตรวจสอบว่า T_ID มีค่าก่อน
                try {
                    const response = await axios.get<Subject[]>(`http://localhost:3000/subjects/find?t_id=${T_ID}`);
                    console.log("Subjects fetched:", response.data); // log ข้อมูลที่ดึงมา
                    setSubjects(response.data);
                } catch (error) {
                    console.error("Error fetching subjects:", error);
                }
            }
        };

        fetchSubjects();
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
            S_ID: selectedSubject.S_ID, // แทนที่ด้วย ID ที่ถูกต้อง
            Exam_period: parseInt(examDetail.Exam_period, 10), // เปลี่ยนให้เป็น number
            Type_exam: parseInt(examDetail.Type_exam, 10), // เปลี่ยนให้เป็น number
            Date: examDetail.Date, // ต้องเป็น string ในรูปแบบวันที่
            Exam_start: examDetail.Exam_start, // ต้องเป็น string ในรูปแบบเวลา
            Exam_end: examDetail.Exam_end, // ต้องเป็น string ในรูปแบบเวลา
            Room: examDetail.Room, // ต้องเป็น string
            Side: parseInt(examDetail.Side, 10), // เปลี่ยนให้เป็น number
            Tool_Book: Boolean(examDetail.Tool_Book), // ต้องเป็น boolean
            Tool_Calculator: Boolean(examDetail.Tool_Calculator), // ต้องเป็น boolean
            Tool_MfRuler: Boolean(examDetail.Tool_MfRuler), // ต้องเป็น boolean
            Additional: examDetail.Additional // ต้องเป็น stringF
        };

        console.log("Request Data:", requestData); // เพิ่ม log ที่นี่

        try {
            const response = await axios.post('http://localhost:3000/exam-details', requestData);
            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Error uploading exam detail:');
        }
    };


    if (loading) return <Typography>Loading...</Typography>;

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
                        <IconButton sx={{ color: '#fff', fontSize: '1.5rem', mr: 1 }}><PermIdentity /></IconButton>
                        Exams
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: '#001e3c', py: 1.5, width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'left' }} onClick={() => navigate('/backup')}>
                        <IconButton sx={{ color: '#fff' }}><MenuBook /></IconButton>
                        Backup Course
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: '20px' }}>
                <Typography variant="h4">Manage Subjects</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject ID</TableCell>
                                <TableCell>Subject Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((subject) => (
                                <TableRow key={subject.S_ID}>
                                    <TableCell>{subject.S_ID}</TableCell>
                                    <TableCell>{subject.S_name}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleUploadDialogOpen(subject)}
                                            startIcon={<Add />}
                                        >
                                            Upload Exam Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Upload Exam Detail Dialog */}
                <UploadFile
                    open={uploadDialogOpen}
                    onClose={handleUploadDialogClose}
                    onUpload={handleExamDetailUpload} // เรียกใช้ฟังก์ชันนี้เมื่อทำการอัปโหลดข้อมูล
                    examDetail={examDetail}
                    setExamDetail={setExamDetail}
                />
            </Box>
        </Box>
    );
};

export default TeacherDashboard;
