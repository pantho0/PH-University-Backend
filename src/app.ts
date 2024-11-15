/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { UserRoutes } from './app/modules/user/user.route';
import { StudentRoutes } from './app/modules/student/student.route';
import globalErrorHandler from './app/modules/middlewares/globalErrorHandler';
import notFound from './app/modules/middlewares/notFound';
import router from './app/routes/index';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

//app routes
app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  // Promise.reject();
};

app.get('/', test);

//global error handler
app.use(globalErrorHandler);
//not-route
app.use(notFound);

export default app;
