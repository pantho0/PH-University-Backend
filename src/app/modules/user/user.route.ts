import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../middlewares/validateRequest';
import createstudentValidationSchema from '../student/student.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(createstudentValidationSchema),
  UserController.createStudent,
);

export const UserRoutes = router;
