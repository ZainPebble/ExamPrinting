import express, { Request, Response } from 'express';
import cors from 'cors'; // import cors
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Enable CORS for requests from all origins
app.use(cors());
app.use(express.json());

{/* Users */}
// Get all users
app.get('/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  });

// Add new user
app.post('/users', async (req, res) => {
    const { username, password, Fname, Lname, u_type } = req.body;
    try {
      const newUser = await prisma.user.create({
        data: { username, password, Fname, Lname, u_type },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  });

// Edit user
app.put('/users/:username', async (req, res) => {
    const { username } = req.params;
    const { password, Fname, Lname, u_type } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { username },
        data: { password, Fname, Lname, u_type },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  });
  

// Delete user
app.delete('/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
      await prisma.user.delete({ where: { username } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  });
  

  {/* Subjects */}
  // Get all subjects
app.get('/subjects', async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subjects' });
  }
});

// Add new subject
app.post('/subjects', async (req: Request, res: Response) => {
  const { S_ID, S_name, Year, Semester, Sec, Credit, Major, n_std, Status, T_ID } = req.body;
  try {
    const newSubject = await prisma.subject.create({
      data: { S_ID, S_name, Year, Semester, Sec, Credit, Major, n_std, Status, T_ID },
    });
    res.status(201).json(newSubject);
  } catch (error) {
    console.error('Error creating subject:', error);  // ดูว่า Prisma แจ้ง error อย่างไร
    res.status(500).json({ error: 'Error creating subject' });
  }
});

// Edit subject
app.put('/subjects/:S_ID', async (req: Request, res: Response) => {
  const { S_ID } = req.params;
  const { S_name, Year, Semester, Sec, Credit, Major, n_std, Status, T_ID } = req.body;
  try {
    const updatedSubject = await prisma.subject.update({
      where: { S_ID },
      data: { S_name, Year, Semester, Sec, Credit, Major, n_std, Status, T_ID },
    });
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ error: 'Error updating subject' });
  }
});

// Delete subject
app.delete('/subjects/:S_ID', async (req: Request, res: Response) => {
  const { S_ID } = req.params;
  try {
    await prisma.subject.delete({ where: { S_ID } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting subject' });
  }
});


{/* Teacher */}
// GET all teachers
app.get('/teachers', async (req, res) => {
  try {
      const teachers = await prisma.teacher.findMany({
          include: {
              user: {
                  select: {
                      Fname: true,
                  }
              }
          }
      });

      // แปลงข้อมูลที่ส่งกลับเพื่อให้ตรงกับ Interface ที่กำหนด
      const formattedTeachers = teachers.map(teacher => ({
          T_ID: teacher.T_ID,
          Fname: teacher.user.Fname
      }));

      res.json(formattedTeachers);
  } catch (error) {
      console.error('Error fetching teachers:', error);
      res.status(500).json({ error: 'Error fetching teachers' });
  }
});

// Backup
app.post('/backup', async (req: any, res: any) => {
  try {
      // ดึงข้อมูลจากตาราง Subject และ ExamDetail
      const subjects = await prisma.subject.findMany({
          include: {
              exams: {
                select: {
                  XD_ID: true,
                  Additional: true,
                  Date: true,
                  ExamFile: true,
                  Exam_end: true,
                  Exam_period: true,
                  Exam_start: true,
                  Room: true,
                  Side: true,
                  Tool_Book: true,
                  Tool_Calculator: true,
                  Tool_MfRuler:  true,
                  Type_exam: true
                }
              }
          },
      });

      // เตรียมข้อมูลสำหรับเพิ่มเข้าในตาราง Backup
      const backupData = subjects.flatMap((subject) => {
          return subject.exams.map((exam) => ({
              S_ID: subject.S_ID,
              Year: subject.Year,
              Semester: subject.Semester,
              XD_ID: exam.XD_ID,
              Exam_period: exam.Exam_period,
              S_name: subject.S_name,
              Credit: subject.Credit,
              Sec: subject.Sec,
              Major: subject.Major,
              n_std: subject.n_std,
              T_ID: subject.T_ID,
              Additional: exam.Additional,
              Type_exam: exam.Type_exam,
              Exam_start: exam.Exam_start,
              Exam_end: exam.Exam_end,
              Room: exam.Room,
              Date: exam.Date,
              Side: exam.Side,
              ExamFile: exam.ExamFile,
          }));
      });

      // เพิ่มข้อมูลเข้าในตาราง Backup
      await prisma.backup.createMany({
          data: backupData,
          skipDuplicates: true, // ป้องกันการเพิ่มข้อมูลที่ซ้ำ
      });

      return res.status(200).json({ message: 'Backup successful' });
  } catch (error) {
      console.error('Error during backup:', error);
      return res.status(500).json({ error: 'Error creating backup' });
  }
});

// API สำหรับดึงข้อมูล Subject พร้อมรายละเอียดการสอบ
app.get('/subject/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const subject = await prisma.subject.findUnique({
      where: {
        S_ID: id
      },
      include: {
        exams: true // รวมข้อมูลจาก ExamDetail
      }
    });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
