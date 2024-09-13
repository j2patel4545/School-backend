import User from '../Models/UserModel.js';
import bcrypt from 'bcrypt'; // For hashing and comparing passwords
import jwt from 'jsonwebtoken'; // For generating JWT tokens

// Registration Controller
export const CreateUser = async (req, res) => {
    const { userName, password, email, mobileNumber, createdDate, updatedDate } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userName,
            password: hashedPassword, // Save the hashed password
            email,
            mobileNumber,
            createdDate,
            updatedDate
        });

        const userSaved = await user.save();
        res.status(201).json(userSaved); // Respond with created status and user data
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
};

// Login Controller
export const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token (replace 'your_jwt_secret' with your actual secret)
        const token = jwt.sign(
            { id: user._id, userName: user.userName },
            'your_jwt_secret', // Replace with your JWT secret key
            { expiresIn: '1h' }
        );

        // Respond with success and token
        res.status(200).json({ token, user: { id: user._id, userName: user.userName, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Profile Controller
export const getUserProfile = async (req, res) => {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify and decode token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your JWT secret key

        // Find user by ID from token payload
        const user = await User.findById(decoded.id).select('-password'); // Exclude password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
