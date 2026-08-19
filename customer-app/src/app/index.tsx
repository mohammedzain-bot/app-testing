import { Redirect } from 'expo-router';

// Root redirects to login
export default function Index() {
  return <Redirect href="/login" />;
}
