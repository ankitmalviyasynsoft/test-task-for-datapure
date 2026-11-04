import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model';
import { ApiError } from '../utils/apiError';
import { signToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { env } from '../config/env';
import { IUserDoc } from '../types';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export class AuthService {
  /**
   * Register a new user with email and password
   */
  static async register(data: RegisterInput): Promise<{ user: IUserDoc; token: string }> {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      provider: 'local',
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return { user, token };
  }

  /**
   * Login with email and password
   */
  static async login(data: LoginInput): Promise<{ user: IUserDoc; token: string }> {
    const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    if (user.provider === 'google' && !user.password) {
      throw ApiError.badRequest('This account was created with Google Sign-In. Please sign in with Google.');
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return { user, token };
  }

  /**
   * Sign in or register via Google ID token
   */
  static async googleAuth(idToken: string): Promise<{ user: IUserDoc; token: string }> {
    let payload;
    try {
      // If GOOGLE_CLIENT_ID is provided, verify against audience; otherwise verify integrity
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID || undefined,
      });
      payload = ticket.getPayload();
    } catch (err: unknown) {
      console.error('[Google OAuth Error]', err);
      throw ApiError.badRequest('Invalid or expired Google token. Please try again.');
    }

    if (!payload || !payload.email) {
      throw ApiError.badRequest('Google authentication failed: Email not provided.');
    }

    const { email, name, picture, sub: googleId } = payload;
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Link Google ID if not present
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
      }
      await user.save();
    } else {
      // Create new Google user
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        provider: 'google',
        googleId,
        avatar: picture || '',
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return { user, token };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<IUserDoc> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    return user;
  }

  /**
   * Update user custom columns
   */
  static async updateColumns(userId: string, columns: any[]): Promise<any[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    user.columns = columns;
    await user.save();
    return user.columns || [];
  }
}

