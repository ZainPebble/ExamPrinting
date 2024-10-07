import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'; // import cors
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const app = express();
const prisma = new PrismaClient();
// ตั้งค่า multer สำหรับการอัปโหลดไฟล์
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const SECRET_KEY = 'your_secret_key';
// Enable CORS for requests from all origins
app.use(cors());
app.use(express.json());




// Middleware สำหรับตรวจสอบ JWT
const authenticateJWT = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1]; // รับ JWT token จาก header authorization

  if (!token) {
    return res.status(403).json({ error: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // เพิ่มข้อมูลผู้ใช้ที่ decode แล้วเข้าไปใน request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// API สำหรับการล็อกอิน
app.post('/login', async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    // ค้นหาผู้ใช้ตาม username
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // สร้าง JWT token พร้อมข้อมูล `username` และ `u_type`
    const token = jwt.sign({ username: user.username, u_type: user.u_type, name: user.Fname }, SECRET_KEY, { expiresIn: '1h' });

    // ส่ง JWT และ u_type กลับไป
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { username: user.username, u_type: user.u_type, name: user.Fname }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route ตัวอย่างที่ต้องการตรวจสอบ token
app.get('/profile', authenticateJWT, (req: any, res: Response) => {
  res.status(200).json({ message: 'Profile data', user: req.user });
});


{/* Users */ }
// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.post('/users', async (req, res) => {
  const { username, password, Fname, Lname, u_type } = req.body;

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, Fname, Lname, u_type },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Edit user
app.put('/users/:username', async (req, res) => {
  const { username } = req.params;
  const { password, Fname, Lname, u_type } = req.body;

  try {
    // เข้ารหัสรหัสผ่านใหม่ถ้ามีการอัปเดต
    let updatedData: any = { Fname, Lname, u_type };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: updatedData,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
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


{/* Subjects */ }
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


{/* Teacher */ }
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
            Tool_MfRuler: true,
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

// API สำหรับดึงข้อมูล Subject พร้อมรายละเอียดการสอบที่มี XD_ID มากที่สุด
app.get('/subject/:id', async (req, res) => {
  const id = req.params.id;

  try {
      const subject = await prisma.subject.findUnique({
          where: {
              S_ID: id
          },
          include: {
              exams: {
                  orderBy: {
                      XD_ID: 'desc' // จัดเรียงโดย XD_ID มากที่สุด
                  },
                  take: 1 // ดึงเฉพาะรายการแรกที่มี XD_ID สูงสุด
              }
          }
      });

      res.json(subject);
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// GET ทั้งหมดจากตาราง Backup
app.get('/backup', async (req, res) => {
  try {
      const backups = await prisma.backup.findMany();
      res.json(backups);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching backups' });
  }
});

app.delete('/backup/:S_ID', async (req, res) => {
  const { S_ID } = req.params;
  const { Year, Semester, XD_ID } = req.body; // รับค่าที่จำเป็นสำหรับ compound key

  try {
    await prisma.backup.delete({
      where: {
        S_ID_Year_Semester_XD_ID: {
          S_ID: S_ID,
          Year: Year,
          Semester: Semester,
          XD_ID: XD_ID
        }
      }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting backup' });
  }
});


app.get('/teachers/find', async (req: Request, res: Response) => {
  const { username } = req.query; // รับค่า username จาก query parameter
  try {
    const teacher = await prisma.teacher.findFirst({
      where: {
        username: String(username), // ค้นหาตาม username
      },
    });
    if (teacher) {
      res.json(teacher); // ส่งข้อมูลของอาจารย์กลับ
    } else {
      res.status(404).json({ error: 'Teacher not found' }); // ถ้าไม่พบข้อมูล
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

app.get('/subjects/find', async (req: Request, res: Response) => {
  const { t_id } = req.query;

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        T_ID: Number(t_id),  // ตรวจสอบว่าค่า t_id ถูกแปลงเป็นตัวเลข
      },
      select: {
        S_ID: true,
        S_name: true,
        Status: true,
      },
    });
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

app.post('/exam-details', upload.single('file'), async (req: any, res: any) => {
  console.log("Request body:", req.body); // ตรวจสอบค่าที่ได้รับ
  console.log("Uploaded file:", req.file);
  try {
    const {
      S_ID,
      Exam_period,
      Type_exam,
      Date: examDateInput, // เปลี่ยนชื่อตัวแปรเพื่อหลีกเลี่ยงการชนกัน
      Exam_start,
      Exam_end,
      Room,
      Side,
      Tool_Book,
      Tool_Calculator,
      Tool_MfRuler,
      Additional
    } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!S_ID || !Exam_period || !Type_exam || !examDateInput || !Exam_start || !Exam_end || !Room || !Side) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // คำนวณ XD_ID ใหม่ โดยนับจำนวนรายการที่มีอยู่แล้วใน S_ID
    const newXD_ID = await prisma.examDetail.count({ where: { S_ID } }) + 1;

    // สร้างตัวแปรวันที่
    const examDate = new Date(examDateInput); // ใช้ตัวแปร examDateInput
    const examStart = new Date(`1970-01-01T${Exam_start}Z`);
    const examEnd = new Date(`1970-01-01T${Exam_end}Z`);

    // ตรวจสอบการสร้างวันที่ว่าเป็นวันจริงหรือไม่
    if (isNaN(examDate.getTime()) || isNaN(examStart.getTime()) || isNaN(examEnd.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // ตรวจสอบว่ามีไฟล์หรือไม่
    const examFileBuffer = req.file ? req.file.buffer : Buffer.from([]); // ถ้ามีไฟล์ให้ใช้ buffer ของไฟล์ ถ้าไม่มีให้เป็น buffer ว่างเปล่า
    console.log("Buffer file:", req.file.buffer);
    // สร้างข้อมูล ExamDetail ใหม่ในฐานข้อมูล
    const examDetail = await prisma.examDetail.create({
      data: {
        S_ID,
        XD_ID: newXD_ID, // ใช้ XD_ID ที่คำนวณใหม่
        Exam_period: parseInt(Exam_period, 10),
        Type_exam: parseInt(Type_exam, 10),
        Date: examDate,
        Exam_start: examStart,
        Exam_end: examEnd,
        Room,
        Side: parseInt(Side, 10),
        Tool_Book: Tool_Book === 'true',
        Tool_Calculator: Tool_Calculator === 'true',
        Tool_MfRuler: Tool_MfRuler === 'true',
        Additional,
        ExamFile: examFileBuffer // ใช้ไฟล์ที่ถูกอัปโหลดหรือ buffer ว่างเปล่า
      },
    });

    // ส่ง Response กลับ
    return res.status(201).json({ message: 'Exam detail created successfully', examDetail });
  } catch (error) {
    // แสดงข้อผิดพลาดใน Console และคืนค่า Response
    console.error("Error creating exam detail:", error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/teachers/profile', async (req: Request, res: any) => {
  const { t_id } = req.query; // รับ T_ID จาก query parameter
  console.log("T_ID from query:", t_id);  // log ค่า T_ID ที่ส่งเข้ามา
  try {
    if (!t_id) {
      return res.status(400).json({ message: 'T_ID is required' });
    }

    // ค้นหาข้อมูลอาจารย์จาก T_ID
    const teacher = await prisma.teacher.findUnique({
      where: {
        T_ID: Number(t_id) // ตรวจสอบให้แน่ใจว่า T_ID เป็นตัวเลข
      },
      select: {
        T_ID: true,
        user: {
          select: {
            username: true,
            Fname: true,
            Lname: true,
          }
        },
        Email: true,
        Tel: true,
      }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // ส่งข้อมูลโปรไฟล์ของอาจารย์กลับไป
    return res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/teachers/update', async (req: any, res: any) => {
  const { T_ID, Fname, Lname, email, phone } = req.body;
  console.log(T_ID, Fname, Lname, email, phone)
  try {
      // ค้นหา Teacher ตาม T_ID
      const teacher = await prisma.teacher.findUnique({
          where: {
              T_ID: T_ID,
          },
          include: {
              user: true, // รวมข้อมูล User เพื่อทำการอัปเดต
          },
      });

      if (!teacher) {
          return res.status(404).json({ message: 'Teacher not found' });
      }

      // อัปเดตข้อมูล User
      const updatedUser = await prisma.user.update({
          where: { username: teacher.user.username }, // ใช้ username จาก teacher.user
          data: {
              Fname: Fname,
              Lname: Lname,
          },
      });

      // อัปเดตข้อมูล Teacher ถ้าจำเป็น
      const updatedTeacher = await prisma.teacher.update({
          where: { T_ID: T_ID },
          data: {
              Tel: phone,
              Email: email,
          },
      });

      return res.status(200).json({ message: 'Profile updated successfully', updatedTeacher, updatedUser });
  } catch (error) {
      console.error("Error updating teacher profile:", error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

// ในฝั่ง backend (Node.js / Express / Prisma)
app.get('/subjects/:S_ID/latest-exam', async (req: any, res: any) => {
  const { S_ID } = req.params;

  try {
      const latestExam = await prisma.examDetail.findFirst({
          where: { S_ID: String(S_ID) },
          orderBy: {
              XD_ID: 'desc', // ดึงไฟล์ที่มี XD_ID มากที่สุด
          },
      });

      if (!latestExam || !latestExam.ExamFile) {
          return res.status(404).json({ message: 'No exam found for this subject or file is missing' });
      }

      // ประเภทของไฟล์ (ปรับตามความเหมาะสมกับประเภทไฟล์ที่เก็บ)
      const fileType = 'application/pdf'; // ตัวอย่างสำหรับไฟล์ PDF

      // ส่งข้อมูล Binary ของไฟล์ไปให้ client
      res.set({
          'Content-Type': fileType,
          'Content-Disposition': `attachment; filename="exam_${S_ID}.pdf"`, // ตั้งชื่อไฟล์
          'Content-Length': latestExam.ExamFile.length
      });

      return res.send(Buffer.from(latestExam.ExamFile));
  } catch (error) {
      console.error('Error fetching latest exam:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});