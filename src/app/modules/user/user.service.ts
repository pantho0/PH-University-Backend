import config from '../../config';
import { TStudent } from '../student/student.interface';

import { User } from './user.model';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if default password not given
  userData.password = password || (config.default_pass as string);
  //set student role
  userData.role = 'student';
  //find out the academic semester info
  const academicSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateStudentId(
      academicSemester as TAcademicSemester,
    );
    //create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // this is mongoose built in static method

    //checking the user is created or not
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payload.id = newUser[0].id; //embedding id
    payload.user = newUser[0]._id; //refference _id

    //create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    //if everythin is ok now its time to commit the session
    await session.commitTransaction();
    //after commiting now end the session
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
  }

  // const student = new Student(studentData); // create an instance
  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error('User already exists');
  // }
  //const result = await student.save(); //built in instance method
};

export const UserServices = {
  createStudentIntoDB,
};
