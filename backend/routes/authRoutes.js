import express from 'express';
import { registerVolunteer, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerVolunteer);
router.post('/login', loginUser);

export default router;
