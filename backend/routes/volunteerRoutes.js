import express from 'express';
import {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getDashboardStats
} from '../controllers/volunteerController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get stats - must be placed BEFORE /:id
router.get('/stats', protect, adminOnly, getDashboardStats);

// GET all and POST (create) volunteer
router.route('/')
  .get(protect, adminOnly, getVolunteers)
  .post(protect, adminOnly, createVolunteer);

// GET, PUT, DELETE individual volunteer
router.route('/:id')
  .get(protect, getVolunteerById)
  .put(protect, updateVolunteer)
  .delete(protect, protect, adminOnly, deleteVolunteer);

export default router;
