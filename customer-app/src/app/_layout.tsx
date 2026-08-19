import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

const BACKEND = 'https://servenow-backend-16sw.onrender.com';

export default function RootLayout() {
  // Pre-warm the Render backend the moment the app opens.
  // This way, by the time the user fills in their email and
  // taps "Send OTP", the server is already awake and ready.
  useEffect(() => {
    fetch(BACKEND).catch(() => {});
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="search" />
        <Stack.Screen name="provider-profile" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="booking-confirmation" />
        <Stack.Screen name="my-bookings" />
        <Stack.Screen name="profile" />
      </Stack>
    </>
  );
}
