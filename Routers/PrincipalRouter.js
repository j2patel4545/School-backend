import express from 'express';
import { loginPrincipal, addNotice, getPrincipalProfile, showNotices, registerPrincipal } from '../Controlers/Principal.js';

const router = express.Router();

// Principal login
router.post('/login', loginPrincipal);

// Principal registration
router.post('/register', registerPrincipal);

// Add notice
router.post('/notice/add', addNotice);

// Get principal profile
router.get('/profile', getPrincipalProfile);

// Show/Print notices
router.get('/notices', showNotices);

export default router;
