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

interface Subject {
    S_ID: string;
    S_name: string;
    Year: number;
    Semester: number;
    Sec: number;
    exams: ExamDetail[];
}

const PrintForm: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const [subject, setSubject] = useState<Subject | null>(null);

    useEffect(() => {
        console.log("Subject ID:", subjectId);
        if (subjectId) {
          axios.get(`http://localhost:3000/subject/${subjectId}`)
            .then((response) => setSubject(response.data))
            .catch((error) => console.error('Error fetching subject details:', error));
        }
      }, [subjectId]);  

    if (!subject) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', border: '1px solid gray', width: '80%', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Print Exam Details</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <p><strong>Subject Name:</strong> {subject.S_name}</p>
                    <p><strong>Year:</strong> {subject.Year}</p>
                    <p><strong>Semester:</strong> {subject.Semester}</p>
                </div>
                <div>
                    <p><strong>Section:</strong> {subject.Sec}</p>
                </div>
            </div>

            <div>
                <h2>Exam Details:</h2>
                {subject.exams.length > 0 ? (
                    subject.exams.map((exam) => (
                        <div key={exam.XD_ID} style={{
                            border: '1px solid #ccc',
                            padding: '20px',
                            marginBottom: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p><strong>Exam Period:</strong> {exam.Exam_period}</p>
                            <p><strong>Type of Exam:</strong> {exam.Type_exam}</p>
                            <p><strong>Date:</strong> {new Date(exam.Date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {exam.Exam_start} - {exam.Exam_end}</p>
                            <p><strong>Room:</strong> {exam.Room}</p>
                            <p><strong>Tools Allowed:</strong>
                                {exam.Tool_Book ? ' Book,' : ''}
                                {exam.Tool_Calculator ? ' Calculator,' : ''}
                                {exam.Tool_MfRuler ? ' Multifunction Ruler,' : ''}
                                {!exam.Tool_Book && !exam.Tool_Calculator && !exam.Tool_MfRuler ? ' None' : ''}
                            </p>
                            <p><strong>Additional Information:</strong> {exam.Additional}</p>
                        </div>
                    ))
                ) : (
                    <p>No exam details available for this subject.</p>
                )}
            </div>

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