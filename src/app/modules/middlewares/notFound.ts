/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction): any => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Api not found',
    error: '',
  });
};

export default notFound;
