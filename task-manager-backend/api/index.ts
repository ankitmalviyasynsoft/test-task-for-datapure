import type { Request, Response } from 'express';
import app from '../src/app';
import { connectDatabase } from '../src/config/db';

export default async function handler(req: Request, res: Response) {
  await connectDatabase();
  return app(req, res);
}
