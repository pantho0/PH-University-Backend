import config from '../../config';
import { TStudent } from '../student/student.interface';

import { User } from './user.model';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //   if (await Student.isUserExists(studentData.id)) {
  //     throw new Error('User already exists');
  //   }

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
  userData.id = await generateStudentId(academicSemester as TAcademicSemester);
  //create a user
  const newUser = await User.create(userData); // this is mongoose built in static method

  //create a student
  if (Object.keys(newUser).length) {
    payload.id = newUser.id; //embedding id
    payload.user = newUser._id; //refference _id

    const newStudent = await Student.create(payload);
    return newStudent;
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
