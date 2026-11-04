import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Task Manager API running in ${env.NODE_ENV} mode`);
      console.log(`📡 Listening on http://localhost:${env.PORT}`);
      console.log(`🩺 Health check: http://localhost:${env.PORT}/api/v1/health`);
      console.log(`=========================================`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      console.log(`\n[Server] ${signal} signal received: closing HTTP server...`);
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown if cleanup takes too long
      setTimeout(() => {
        console.error('[Server] Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      console.error('[Server] Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      console.error('[Server] Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('[Server] Startup failed:', error);
    process.exit(1);
  }
};

startServer();

