import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.const';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicSemesterSchema = new Schema<TAcademicSemester>({
  name: { type: String, required: true, enum: AcademicSemesterName },
  code: { type: String, required: true, enum: AcademicSemesterCode },
  year: { type: String, required: true },
  startMonth: { type: String, required: true, enum: Months },
  endMonth: { type: String, required: true, enum: Months },
});

academicSemesterSchema.pre('save', async function () {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemesterExists) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Semester Already Exists',
    );
  }
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
