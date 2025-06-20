import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AuthForm from './sign-in'; // Adjust the path if needed

export default function SignInScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userType = params.userType === 'landlord' ? 'landlord' : 'tenant'; // default to tenant if not set

  return (
    <AuthForm
      userType={userType}
      onSuccess={() => {
        console.log('onSuccess in parent called, navigating to landlord-dashboard');
        router.replace('/landlord-dashboard');
      }}
    />
  );
}
