import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/task');
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
  };

  const saveTask = async () => {
    if (!newTask) return;
    await fetch('/api/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask, userId: user.id }),
    });
    setNewTask('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`/api/task?id=${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const toggleComplete = async (id, completed) => {
    await fetch(`/api/task?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
  };

  const saveEdit = async () => {
    await fetch(`/api/task?id=${editTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTaskTitle }),
    });
    setEditTaskId(null);
    setEditTaskTitle('');
    fetchTasks();
  };

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl mb-4">Task Dashboard</h1>
      <UserButton />

      <div className="mb-6">
        <input
          className="input-field mb-2"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn-primary ml-2" onClick={saveTask}>
          Add Task
        </button>
      </div>

      {tasks.map((task) => (
        <div key={task.id} className="card flex justify-between items-center mb-2 p-2">
          <div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id, task.completed)}
              className="mr-2"
            />
            {editTaskId === task.id ? (
              <input
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                className="input-field"
              />
            ) : (
              <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
            )}
          </div>
          <div className="flex gap-2">
            {editTaskId === task.id ? (
              <button className="btn-primary" onClick={saveEdit}>
                Save
              </button>
            ) : (
              <button className="btn-primary" onClick={() => startEdit(task)}>
                Edit
              </button>
            )}
            <button className="btn-primary" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
