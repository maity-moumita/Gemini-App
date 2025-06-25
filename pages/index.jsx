import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [tasks, setTasks] = useState([]);
  const { user } = useUser();

const generateTasks = async () => {
  if (!topic) return;

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });

  const data = await res.json();
  if (data?.tasks?.length) {
    setTasks(data.tasks);
  } else {
    alert("Failed to generate tasks. Check your API key or server logs.");
  }
};

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl mb-6">Gemini Task Generator</h1>

      {/* Show this if signed in */}
      <SignedIn>
        <input
          className="input-field mb-4"
          placeholder="Enter a topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="btn-primary mb-6" onClick={generateTasks}>
          Generate Tasks
        </button>

        {tasks.map((task, i) => (
          <div key={i} className="card mb-2">{task}</div>
        ))}

        <Link href="/dashboard">
          <button className="btn-primary mt-6">Go to Dashboard</button>
        </Link>
      </SignedIn>

      {/* Show this if signed out */}
      <SignedOut>
        <p className="mb-4">Please sign in to use the generator.</p>
        <SignInButton mode="modal">
          <button className="btn-primary">Sign In</button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
