import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { registerSchema, loginSchema, googleAuthSchema } from '../validators/auth.validator';
import {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  reorderTasksSchema,
  queryTasksSchema,
} from '../validators/task.validator';
import { signToken, verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/apiError';

describe('Authentication Validators', () => {
  it('should accept valid registration payload', async () => {
    const valid = {
      body: {
        name: 'Alice Developer',
        email: 'alice@example.com',
        password: 'Password123!',
      },
    };
    const parsed = await registerSchema.parseAsync(valid);
    assert.equal(parsed.body.name, 'Alice Developer');
    assert.equal(parsed.body.email, 'alice@example.com');
  });

  it('should reject registration with invalid email', async () => {
    const invalid = {
      body: {
        name: 'Alice',
        email: 'not-an-email',
        password: 'Password123!',
      },
    };
    await assert.rejects(() => registerSchema.parseAsync(invalid));
  });

  it('should reject registration with short password (< 6 chars)', async () => {
    const invalid = {
      body: {
        name: 'Alice',
        email: 'alice@example.com',
        password: '123',
      },
    };
    await assert.rejects(() => registerSchema.parseAsync(invalid));
  });

  it('should accept valid login payload', async () => {
    const valid = {
      body: {
        email: 'user@test.com',
        password: 'secretPassword',
      },
    };
    const parsed = await loginSchema.parseAsync(valid);
    assert.equal(parsed.body.email, 'user@test.com');
  });

  it('should accept valid googleAuth payload', async () => {
    const valid = {
      body: {
        idToken: 'valid-google-oauth-token-with-sufficient-length',
      },
    };
    const parsed = await googleAuthSchema.parseAsync(valid);
    assert.equal(parsed.body.idToken, 'valid-google-oauth-token-with-sufficient-length');
  });
});

describe('Task Validators', () => {
  it('should accept valid createTask payload with defaults', async () => {
    const input = {
      body: {
        title: 'Complete assessment task',
      },
    };
    const parsed = await createTaskSchema.parseAsync(input);
    assert.equal(parsed.body.title, 'Complete assessment task');
    assert.equal(parsed.body.status, 'pending');
    assert.equal(parsed.body.priority, 'medium');
  });

  it('should reject createTask with empty title', async () => {
    const input = {
      body: {
        title: '   ',
      },
    };
    await assert.rejects(() => createTaskSchema.parseAsync(input));
  });

  it('should reject createTask with empty status', async () => {
    const input = {
      body: {
        title: 'Task Title',
        status: '   ',
      },
    };
    await assert.rejects(() => createTaskSchema.parseAsync(input));
  });

  it('should accept valid updateTask payload', async () => {
    const input = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: {
        title: 'Updated title',
        status: 'completed',
        priority: 'high',
      },
    };
    const parsed = await updateTaskSchema.parseAsync(input);
    assert.equal(parsed.body.title, 'Updated title');
    assert.equal(parsed.body.status, 'completed');
  });

  it('should reject updateTask with invalid mongo ObjectId param', async () => {
    const input = {
      params: { id: 'not-a-valid-id' },
      body: { title: 'Updated' },
    };
    await assert.rejects(() => updateTaskSchema.parseAsync(input));
  });

  it('should accept updateStatus payload', async () => {
    const input = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { status: 'in_progress', order: 2 },
    };
    const parsed = await updateStatusSchema.parseAsync(input);
    assert.equal(parsed.body.status, 'in_progress');
    assert.equal(parsed.body.order, 2);
  });

  it('should accept valid reorderTasks payload', async () => {
    const input = {
      body: {
        tasks: [
          { id: '507f1f77bcf86cd799439011', status: 'pending', order: 0 },
          { id: '507f1f77bcf86cd799439012', status: 'in_progress', order: 1 },
        ],
      },
    };
    const parsed = await reorderTasksSchema.parseAsync(input);
    assert.equal(parsed.body.tasks.length, 2);
  });

  it('should transform and validate queryTasks params', async () => {
    const input = {
      query: {
        page: '2',
        limit: '25',
        sortBy: 'dueDate',
        sortOrder: 'asc',
      },
    };
    const parsed = await queryTasksSchema.parseAsync(input);
    assert.equal(parsed.query.page, 2);
    assert.equal(parsed.query.limit, 25);
    assert.equal(parsed.query.sortBy, 'dueDate');
    assert.equal(parsed.query.sortOrder, 'asc');
  });
});

describe('JWT Utility', () => {
  it('should sign and verify token accurately', () => {
    const payload = { userId: '507f1f77bcf86cd799439011', email: 'test@domain.com' };
    const token = signToken(payload);
    assert.ok(typeof token === 'string');
    assert.ok(token.length > 20);

    const decoded = verifyToken(token);
    assert.equal(decoded.userId, payload.userId);
    assert.equal(decoded.email, payload.email);
  });
});

describe('ApiError Utility', () => {
  it('should construct appropriate error statuses', () => {
    const badReq = ApiError.badRequest('Invalid input');
    assert.equal(badReq.statusCode, 400);

    const unauth = ApiError.unauthorized();
    assert.equal(unauth.statusCode, 401);

    const notFound = ApiError.notFound('Resource missing');
    assert.equal(notFound.statusCode, 404);

    const conflict = ApiError.conflict('Already exists');
    assert.equal(conflict.statusCode, 409);
  });
});

