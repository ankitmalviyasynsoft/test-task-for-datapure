import { RegisterForm } from '../../../components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account | Task Manager',
  description: 'Sign up for your free Task Manager account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}

