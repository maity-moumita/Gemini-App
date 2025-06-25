import { db } from '../../db/index';
import { tasks } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

 if (req.method === 'POST') {
  const { title } = req.body;
  console.log('Saving task:', title, 'User:', userId);

  const result = await db.insert(tasks).values({
    title,
    userId,
    completed: false,
  }).returning();

  console.log('Saved result:', result);

  return res.status(200).json({ task: result[0] });
}


  if (req.method === 'GET') {
    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
    return res.status(200).json({ tasks: userTasks });
  }

  if (req.method === 'PUT') {
    const { id, title, completed } = req.body;
    if (!id) return res.status(400).json({ error: "Task ID required" });

    await db.update(tasks).set({
      ...(title && { title }),
      ...(typeof completed === 'boolean' && { completed }),
    }).where(eq(tasks.id, id));

    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Task ID required" });

    await db.delete(tasks).where(eq(tasks.id, Number(id)));
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
