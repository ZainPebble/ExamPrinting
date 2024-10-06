// UploadFile.tsx
import React from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Checkbox,
} from '@mui/material';

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

interface UploadFileProps {
    open: boolean;
    onClose: () => void;
    onUpload: (examDetail: ExamDetail) => void; // ปรับให้ไม่มี file
    examDetail: ExamDetail;
    setExamDetail: React.Dispatch<React.SetStateAction<ExamDetail>>;
}

const UploadFile: React.FC<UploadFileProps> = ({ open, onClose, onUpload, examDetail, setExamDetail }) => {
    const handleExamDetailChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type } = event.target;
        const value = type === 'checkbox' ? (event.target as HTMLInputElement).checked : (event.target as HTMLInputElement).value;

        setExamDetail((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Upload Exam Detail</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Exam Period"
                    name="Exam_period"
                    value={examDetail.Exam_period}
                    onChange={handleExamDetailChange}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Type of Exam"
                    name="Type_exam"
                    value={examDetail.Type_exam}
                    onChange={handleExamDetailChange}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Date"
                    name="Date"
                    type="date"
                    value={examDetail.Date}
                    onChange={handleExamDetailChange}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Start Time"
                    name="Exam_start"
                    type="time"
                    value={examDetail.Exam_start}
                    onChange={handleExamDetailChange}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="End Time"
                    name="Exam_end"
                    type="time"
                    value={examDetail.Exam_end}
                    onChange={handleExamDetailChange}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Room"
                    name="Room"
                    value={examDetail.Room}
                    onChange={handleExamDetailChange}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Side"
                    name="Side"
                    value={examDetail.Side}
                    onChange={handleExamDetailChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="Tool_Book"
                            checked={examDetail.Tool_Book}
                            onChange={handleExamDetailChange}
                        />
                    }
                    label="Tool Book"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="Tool_Calculator"
                            checked={examDetail.Tool_Calculator}
                            onChange={handleExamDetailChange}
                        />
                    }
                    label="Tool Calculator"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="Tool_MfRuler"
                            checked={examDetail.Tool_MfRuler}
                            onChange={handleExamDetailChange}
                        />
                    }
                    label="Tool MfRuler"
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Additional Information"
                    name="Additional"
                    value={examDetail.Additional}
                    onChange={handleExamDetailChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => onUpload(examDetail)} variant="contained" color="primary"> {/* ปรับให้ส่งเฉพาะ examDetail */}
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadFile;
