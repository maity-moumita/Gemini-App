import { SignedIn, SignedOut, SignIn, useUser, UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <h1 className="text-3xl mb-4">Your Task Dashboard</h1>

      <SignedIn>
        <div className="flex justify-between mb-4">
          <p>Welcome, {user?.firstName}!</p>
          <UserButton />
        </div>

        {/* Task Management UI (Fetch from DB) */}
      </SignedIn>

      <SignedOut>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </SignedOut>
    </div>
  );
}
