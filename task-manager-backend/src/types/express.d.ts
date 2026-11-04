import { IUserDoc } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDoc;
    }
  }
}

