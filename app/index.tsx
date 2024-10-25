import React, { useEffect, useState } from 'react'
import { Redirect } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function index() {
    // const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkOnboarding = async () => {
            const onboarding = await AsyncStorage.getItem('onboarding');
            if (!onboarding) {
                setIsOnboarding(false);
            }
            setLoading(false);
        }
        checkOnboarding();
    }
    , []);

    if (loading) {
        return null;
    }

  return (
    <Redirect href={isOnboarding ? '/(routes)/onboarding' : '/(routes)/home'} />
  )
}