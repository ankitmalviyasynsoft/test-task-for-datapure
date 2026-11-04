import { LoginForm } from '../../../components/auth/LoginForm';

export const metadata = {
  title: 'Sign In | Task Manager',
  description: 'Sign in to your Task Manager workspace',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

