import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrincipalLogin, Principal, PrincipalNotice } from '../Models/PrincipalModels.js';

// Define your JWT secret key
const JWT_SECRET = 'your_secret_key';

// Principal Login
export const loginPrincipal = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the principal by username
        const principal = await PrincipalLogin.findOne({ username });

        if (!principal) {
            return res.status(404).json({ message: 'Principal not found' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, principal.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token with the hardcoded secret
        const token = jwt.sign(
            { id: principal._id, username: principal.username },
            JWT_SECRET, // Use the hardcoded secret key
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            principal: { id: principal._id, username: principal.username }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Principal Registration
export const registerPrincipal = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingPrincipal = await PrincipalLogin.findOne({ username });

        if (existingPrincipal) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new PrincipalLogin instance
        const newPrincipal = new PrincipalLogin({
            username,
            password: hashedPassword
        });

        // Save the new principal
        await newPrincipal.save();

        res.status(201).json({ message: 'Principal registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add Notice
export const addNotice = async (req, res) => {
    const { title, content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token with the hardcoded secret
        const decoded = jwt.verify(token, JWT_SECRET);
        const principalId = decoded.id;

        const notice = new PrincipalNotice({
            title,
            content,
            createdBy: principalId
        });

        const savedNotice = await notice.save();
        res.status(201).json(savedNotice);
    } catch (error) {
        console.error('Error adding notice:', error);
        res.status(500).json({ message: 'Error adding notice', error: error.message });
    }
};

// Get Principal Profile
export const getPrincipalProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token with the hardcoded secret
        const decoded = jwt.verify(token, JWT_SECRET);
        const principalId = decoded.id;

        const principal = await Principal.findById(principalId).populate('login', 'username');

        if (!principal) {
            return res.status(404).json({ message: 'Principal not found' });
        }

        res.status(200).json({ principal });
    } catch (error) {
        console.error('Error fetching principal profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Show/Print Notices
export const showNotices = async (req, res) => {
    try {
        const notices = await PrincipalNotice.find().populate('createdBy', 'name');

        res.status(200).json({ notices });
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).json({ message: 'Error fetching notices', error: error.message });
    }
};
