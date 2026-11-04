'use client';

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../services/apiClient';

interface GoogleButtonProps {
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ text = 'continue_with' }) => {
  const { googleLogin } = useAuth();
  const toast = useToast();

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error('Failed to retrieve Google credentials.');
      return;
    }

    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Successfully authenticated with Google!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleError = () => {
    toast.error('Google sign-in was cancelled or encountered an error.');
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        shape="rectangular"
        size="large"
        width="100%"
        text={text}
        theme="outline"
      />
    </div>
  );
};

