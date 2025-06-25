import { ClerkProvider } from '@clerk/nextjs';

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider publishableKey="pk_test_aG9wZWZ1bC1zcG9uZ2UtMTUuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
