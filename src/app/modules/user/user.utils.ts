import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    { role: 'student' },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent?.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString(); //default 0000
  // we got there full id (ex:2030010001)
  const lastStudentId = await findLastStudentId();
  // we got 01 as semester code
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  // we got 2030 as year code
  const lastStudentYear = lastStudentId?.substring(0, 4);
  //we got current year from the payload
  const currentYear = payload.year;
  //we got current semester code from the payload
  const currentSemesterCode = payload.code;
  //compare the current year with the last student year and current semester code with the last student semester code
  if (
    lastStudentId &&
    lastStudentYear === currentYear &&
    lastStudentSemesterCode === currentSemesterCode
  ) {
    currentId = lastStudentId.substring(6);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
