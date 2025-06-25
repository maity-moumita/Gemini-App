import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { user } = useUser();
  const [topic, setTopic] = useState('');
  const [tasks, setTasks] = useState([]);

  const generateTasks = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ topic }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setTasks(data.tasks);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <h1 className="text-3xl mb-4">Gemini Task Generator</h1>

      {user ? (
        <>
          <input
            className="input-field mb-4"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button className="btn-primary mb-6" onClick={generateTasks}>
            Generate Tasks
          </button>

          {tasks.map((task, index) => (
            <div key={index} className="card mb-2">{task}</div>
          ))}

          <Link href="/dashboard">
            <button className="btn-primary mt-6">Go to Dashboard</button>
          </Link>
        </>
      ) : (
        <p>Please sign in to generate tasks.</p>
      )}
    </div>
  );
}
