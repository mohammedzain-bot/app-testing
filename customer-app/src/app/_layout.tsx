import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
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
