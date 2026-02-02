'use client';
import { useUser as useFirebaseUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Merchandiser } from '@/lib/types';
import type { User as FirebaseUser } from 'firebase/auth';
import { useMemo } from 'react';

export type UserProfile = {
  uid: string;
  email: string | null;
  profile: Merchandiser | null;
}

export function useUser() {
  const { user: authUser, isUserLoading: isAuthLoading, userError } = useFirebaseUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'merchandisers', authUser.uid);
  }, [firestore, authUser]);

  const { data: userProfileData, isLoading: isProfileLoading, error: profileError } = useDoc<Merchandiser>(userDocRef);

  const user = useMemo(() => authUser ? {
    ...authUser,
    profile: userProfileData,
  } : null, [authUser, userProfileData]);

  return {
    user,
    loading: isAuthLoading || isProfileLoading,
    error: userError || profileError,
  };
}
