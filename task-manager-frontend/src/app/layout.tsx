import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ThemeCustomizationProvider } from '../contexts/ThemeCustomizationContext';
import { ColumnProvider } from '../contexts/ColumnContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata: Metadata = {
  title: 'Task Manager | Modern Task & Workflow Management',
  description: 'A production-grade, secure, and intuitive Task Management platform with drag-and-drop workflow tracking.',
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <GoogleOAuthProvider clientId={googleClientId}>
          <ThemeCustomizationProvider>
            <ToastProvider>
              <AuthProvider>
                <ColumnProvider>{children}</ColumnProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeCustomizationProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

