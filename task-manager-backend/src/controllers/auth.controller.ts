import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ResponseFormatter } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class AuthController {
  /**
   * User registration handler
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await AuthService.register(req.body);
    return ResponseFormatter.created(
      res,
      { user, token },
      'Account created successfully.'
    );
  });

  /**
   * User login handler
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await AuthService.login(req.body);
    return ResponseFormatter.success(
      res,
      { user, token },
      'Logged in successfully.'
    );
  });

  /**
   * Google OAuth handler
   */
  static googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;
    const { user, token } = await AuthService.googleAuth(idToken);
    return ResponseFormatter.success(
      res,
      { user, token },
      'Google sign-in successful.'
    );
  });

  /**
   * Get current authenticated user profile
   */
  static getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getUserById(req.user!._id.toString());
    return ResponseFormatter.success(res, { user }, 'User profile retrieved.');
  });

  /**
   * Update user custom columns
   */
  static updateColumns = asyncHandler(async (req: Request, res: Response) => {
    const columns = await AuthService.updateColumns(req.user!._id.toString(), req.body.columns);
    return ResponseFormatter.success(res, { columns }, 'Columns updated successfully.');
  });
}

