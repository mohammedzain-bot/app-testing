import { Redirect } from 'expo-router';

// Root redirects directly to home (login bypassed per request)
export default function Index() {
  return <Redirect href="/home" />;
}
