import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

// Production-ready CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://sitegenie.vercel.app', 'https://www.sitegenie.vercel.app'] : '*',
  credentials: true,
}));

// JSON middleware
app.use(express.json());

// Centralized error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).send('API is healthy');
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Test API route working!' });
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = await prisma.project.create({ data: req.body });
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

export default app;