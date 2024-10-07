import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface ExamDetail {
    XD_ID: number;
    Exam_period: number;
    Type_exam: number;
    Date: string;
    Exam_start: string;
    Exam_end: string;
    Room: string;
    Tool_Book: boolean;
    Tool_Calculator: boolean;
    Tool_MfRuler: boolean;
    Additional: string;
}

interface Teacher {
    T_ID: number;
    username: string;
    Email: string;
    Tel: string;
}

interface Subject {
    S_ID: string;
    S_name: string;
    Year: number;
    Semester: number;
    Sec: number;
    exams: ExamDetail[];
    n_std: number;
    teachers: Teacher[];
}

const PrintForm: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (subjectId) {
            axios.get<Subject>(`http://localhost:3000/subject/${subjectId}`)
                .then((response) => setSubject(response.data))
                .catch((error) => {
                    console.error('Error fetching subject details:', error);
                    setError('Failed to fetch subject details.');
                });
        }
    }, [subjectId]);

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);

        // Get hours and minutes
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        // Adjust for GMT+7 by subtracting 7 hours
        hours = (hours - 7 + 24) % 24; // Ensure hours wrap around correctly (0-23 range)

        // Convert hours to string and pad it for output
        const paddedHours = hours.toString().padStart(2, '0');

        // Return the formatted time with dot separator and 'น.'
        return `${paddedHours}.${minutes}น.`;
    };


    if (error) {
        return <div>{error}</div>;
    }

    if (!subject) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Tahoma, sans-serif', maxWidth: '900px', margin: '0 auto', border: '2px solid black' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '20px' }}>Print Exam Details</h1>
            {subject.exams.length > 0 ? (
                subject.exams.map((exam) => (
                    <div key={exam.XD_ID} style={{ padding: '20px', border: '2px solid black', marginBottom: '20px', position: 'relative' }}>
                        <div style={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>
                            <p><strong>การสอบวิชา:</strong> {subject.S_name} <strong>รหัสวิชา {subject.S_ID}</strong></p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ flex: '0 0 50%' }}>
                                <p><strong>สอบวันที่:</strong> {new Date(exam.Date).toLocaleDateString()}</p>
                                <p><strong>เวลา:</strong> {formatTime(exam.Exam_start)} - {formatTime(exam.Exam_end)}</p>
                            </div>
                            <div style={{ flex: '0 0 50%' }}>
                                <p><strong>ห้องสอบ:</strong> {exam.Room}</p>
                                <p><strong>จำนวนนักศึกษา:</strong> {subject.n_std} คน</p>
                            </div>
                        </div>

                        {/* Equipment Section */}
                        <div style={{ marginBottom: '20px', borderTop: '1px solid black', borderBottom: '1px solid black', padding: '10px 0' }}>
                            <p><strong>อุปกรณ์ที่ใช้หรือคำแนะนำผู้คุมสอบเพิ่มเติม:</strong></p>
                            <p style={{ marginLeft: '30px' }}>
                                {exam.Tool_Book ? ' หนังสือ,' : ''} 
                                {exam.Tool_Calculator ? ' เครื่องคิดเลข,' : ''} 
                                {exam.Tool_MfRuler ? ' ไม้บรรทัด,' : ''} 
                                {!exam.Tool_Book && !exam.Tool_Calculator && !exam.Tool_MfRuler ? ' ไม่มี' : ''} 
                            </p>
                            <p style={{ marginLeft: '30px' }}>{exam.Additional}</p>
                        </div>

                        {/* Teacher and Contact Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ flex: '0 0 50%' }}>
                                <p><strong>ผู้ออกข้อสอบ:</strong> {}</p>
                            </div>
                            <div style={{ flex: '0 0 50%' }}>
                                <p><strong>ห้องทำงาน:</strong> {}</p>
                                <p><strong>โทรศัพท์/มือถือ:</strong> {}</p>
                            </div>
                        </div>

                        {/* Attendance Section */}
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>จำนวนนักศึกษาที่เข้าสอบ</strong>.........................คน&nbsp;&nbsp;&nbsp;<br /><br />
                                <strong>จำนวนนักศึกษาที่ขาดสอบ</strong>........................คน
                            </p>
                        </div>

                        {/* Student ID and Names */}
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>รหัส</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>ชื่อ-สกุล</strong></p>
                            <p>........................................................&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;........................................................</p>
                            <p>........................................................&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;........................................................</p>
                            <p>........................................................&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;........................................................</p>
                        </div>

                        {/* Invigilator Section */}
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>1.</strong>........................................................&nbsp;&nbsp;&nbsp;<strong>ผู้คุมสอบ</strong></p>
                            <p><strong>2.</strong>........................................................&nbsp;&nbsp;&nbsp;<strong>ผู้คุมสอบ</strong></p>
                            <p><strong>3.</strong>........................................................&nbsp;&nbsp;&nbsp;<strong>ผู้คุมสอบ</strong></p>
                        </div>

                        {/* Notes Section */}
                        <div>
                            <p><strong>หมายเหตุ:</strong>...................................................................................................................</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No exam details available for this subject.</p>
            )}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button onClick={() => window.print()} style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                    Print this page
                </button>
            </div>
        </div>
    );
};

export default PrintForm;