import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Teacher, Homework } from '../Models/TeacherModule.js';

// Teacher Registration
export const registerTeacher = async (req, res) => {
    const { teacherName, password, email, subject } = req.body;
 
    try {
        // Check if the email already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = new Teacher({
            teacherName,
            password: hashedPassword,
            email,
            subject
        });

        const savedTeacher = await teacher.save();
        res.status(201).json(savedTeacher);
    } catch (error) {
        res.status(400).json({ message: 'Error registering teacher', error });
    }
};

// Teacher Login
export const loginTeacher = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the teacher by email
        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, teacher.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: teacher._id, teacherName: teacher.teacherName },
            'your_jwt_secret', // Replace with your actual secret
            { expiresIn: '1h' }
        );

        // Respond with the token
        res.status(200).json({ token, teacher: { id: teacher._id, teacherName: teacher.teacherName, email: teacher.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add Homework
export const addHomework = async (req, res) => {
    const { title, description, dueDate } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your actual secret
        const teacherId = decoded.id;

        const homework = new Homework({
            title,
            description,
            dueDate,
            assignedBy: teacherId
        });

        const savedHomework = await homework.save();
        res.status(201).json(savedHomework);
    } catch (error) {
        res.status(500).json({ message: 'Error adding homework', error });
    }
};

// Get Teacher Profile
export const getTeacherProfile = async (req, res) => {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify and decode token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your actual secret
        const teacherId = decoded.id;

        // Find teacher by ID from token payload
        const teacher = await Teacher.findById(teacherId).select('-password'); // Exclude password field

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Respond with teacher data
        res.status(200).json({ teacher });
    } catch (error) {
        console.error('Error fetching teacher profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Homework
export const getHomework = async (req, res) => {
    try {
        // Fetch all homework assignments from the database
        const homeworkList = await Homework.find().populate('assignedBy', 'teacherName email'); // Optionally populate the teacher who assigned it

        if (!homeworkList.length) {
            return res.status(404).json({ message: 'No homework found' });
        }

        // Respond with the list of homework assignments
        res.status(200).json({ homework: homeworkList });
    } catch (error) {
        console.error('Error fetching homework:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete Homework
export const deleteHomework = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your actual secret
        const teacherId = decoded.id;

        // Find the homework by ID and ensure it was assigned by the logged-in teacher
        const homework = await Homework.findOne({ _id: id, assignedBy: teacherId });

        if (!homework) {
            return res.status(404).json({ message: 'Homework not found or unauthorized to delete' });
        }

        // Delete the homework
        await Homework.findByIdAndDelete(id);
        
        // Respond with success message
        res.status(200).json({ message: 'Homework deleted successfully' });
    } catch (error) {
        console.error('Error deleting homework:', error);
        res.status(500).json({ message: 'Error deleting homework', error });
    }
};
