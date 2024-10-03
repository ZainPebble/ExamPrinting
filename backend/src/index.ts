import express, { Request, Response } from 'express';
import cors from 'cors'; // import cors
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Enable CORS for requests from all origins
app.use(cors());
app.use(express.json());

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
  

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
