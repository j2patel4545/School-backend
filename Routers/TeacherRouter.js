import express from 'express';
import { registerTeacher, loginTeacher, addHomework, getTeacherProfile, getHomework, deleteHomework } from '../Controlers/Teacher.js';

const router = express.Router();

router.post('/register', registerTeacher); // Endpoint for teacher registration
router.post('/login', loginTeacher); // Endpoint for teacher login
router.post('/homework/add', addHomework); // Endpoint for adding homework
router.get('/profile', getTeacherProfile); // Endpoint for fetching teacher profile
router.get('/homework', getHomework); // Endpoint for fetching homework assignments
router.delete('/homework/:id', deleteHomework); // Endpoint for deleting a homework assignment

export default router;
