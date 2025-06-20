import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function RedirectLandlord() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/landlord-auth');
  }, []);

  return null;
}
